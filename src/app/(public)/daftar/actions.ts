'use server'

import { createClient } from '@/lib/supabase/server'
import { FormState } from '@/lib/types'
import { wargaSchema } from '@/lib/validations'

export async function registerWarga(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient()
  
  const validatedFields = wargaSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Harap periksa kembali data yang Anda masukkan.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  
  const { ktp_file, kk_file, ...wargaData } = validatedFields.data;

  try {
    const ktpFilePath = `ktp/${wargaData.nik}-${ktp_file.name}`.replace(/\s/g, '_');
    const { data: ktpUploadData, error: ktpUploadError } = await supabase.storage
      .from('berkas_pendukung')
      .upload(ktpFilePath, ktp_file)

    if (ktpUploadError) {
      throw new Error(`Gagal mengunggah file KTP: ${ktpUploadError.message}`)
    }

    const kkFilePath = `kk/${wargaData.nomor_kk}-${kk_file.name}`.replace(/\s/g, '_');
    const { data: kkUploadData, error: kkUploadError } = await supabase.storage
      .from('berkas_pendukung')
      .upload(kkFilePath, kk_file)

    if (kkUploadError) {
      await supabase.storage.from('berkas_pendukung').remove([ktpFilePath]);
      throw new Error(`Gagal mengunggah file KK: ${kkUploadError.message}`)
    }

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
        await supabase.storage.from('berkas_pendukung').remove([ktpFilePath, kkFilePath]);
        return { success: false, message: 'NIK ini sudah terdaftar di sistem.' }
      }
      throw new Error(insertError.message)
    }

    return { success: true, message: 'Pendaftaran berhasil! Data Anda akan segera diverifikasi oleh Admin.' }

  } catch (e) {
    const error = e as Error
    return { success: false, message: `Terjadi kesalahan pada server: ${error.message}` }
  }
}