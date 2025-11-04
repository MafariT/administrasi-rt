'use server'

import { createClient } from '@/lib/supabase/server'

type FormState = {
  success: boolean;
  message: string;
}

export async function registerWarga(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient()
  
  const wargaData = {
    full_name: formData.get('full_name') as string,
    nik: formData.get('nik') as string,
    nomor_kk: formData.get('nomor_kk') as string,
    tempat_lahir: formData.get('tempat_lahir') as string,
    tanggal_lahir: formData.get('tanggal_lahir') as string,
    jenis_kelamin: formData.get('jenis_kelamin') as string,
    agama: formData.get('agama') as string,
    status_perkawinan: formData.get('status_perkawinan') as string,
    pekerjaan: formData.get('pekerjaan') as string,
    kewarganegaraan: formData.get('kewarganegaraan') as string,
    alamat_ktp: formData.get('alamat_ktp') as string,
    alamat_domisili: formData.get('alamat_domisili') as string,
    status_tempat_tinggal: formData.get('status_tempat_tinggal') as string,
    phone_number: formData.get('phone_number') as string,
    email: formData.get('email') as string,
  }

  const ktpFile = formData.get('ktp_file') as File
  const kkFile = formData.get('kk_file') as File

  if (!wargaData.nik || !wargaData.nomor_kk || !wargaData.full_name || !ktpFile || !kkFile) {
    return { success: false, message: 'Harap isi semua kolom wajib dan unggah berkas yang diperlukan.' }
  }

  try {
    // --- FILE UPLOAD LOGIC ---
    const ktpFilePath = `ktp/${wargaData.nik}-${ktpFile.name}`
    const { data: ktpUploadData, error: ktpUploadError } = await supabase.storage
      .from('berkas_pendukung')
      .upload(ktpFilePath, ktpFile)
    if (ktpUploadError) throw new Error(`Gagal mengunggah KTP: ${ktpUploadError.message}`)

    const kkFilePath = `kk/${wargaData.nomor_kk}-${kkFile.name}`
    const { data: kkUploadData, error: kkUploadError } = await supabase.storage
      .from('berkas_pendukung')
      .upload(kkFilePath, kkFile)
    if (kkUploadError) throw new Error(`Gagal mengunggah KK: ${kkUploadError.message}`)

    // --- DATABASE INSERT LOGIC ---
    const { error: insertError } = await supabase
      .from('warga')
      .insert({
        ...wargaData,
        ktp_file_url: ktpUploadData.path,
        kk_file_url: kkUploadData.path,
        status: 'pending_verification',
      })

    if (insertError) {
      if (insertError.code === '23505') {
        return { success: false, message: 'NIK ini sudah terdaftar di sistem.' }
      }
      throw new Error(insertError.message)
    }

    return { success: true, message: 'Pendaftaran berhasil! Data Anda akan segera diverifikasi oleh Admin.' }

  } catch (e) {
    const error = e as Error
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}