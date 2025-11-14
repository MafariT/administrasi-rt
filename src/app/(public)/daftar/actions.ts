'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { wargaSchema } from '@/lib/validations'
import { z } from 'zod'

type FormState = {
  success: boolean;
  message: string;
  errors?: { path: string; message: string }[];
}

export async function registerWarga(values: z.infer<typeof wargaSchema>): Promise<FormState> {
  const supabase = createClient()
  
  const validatedFields = wargaSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: "Invalid data received." };
  }
  
  const { ktp_file, kk_file, ...wargaData } = validatedFields.data;

  try {
    const ktpFilePath = `ktp/${wargaData.nik}-${ktp_file.name}`
    const { data: ktpUploadData, error: ktpUploadError } = await supabase.storage
      .from('berkas_pendukung')
      .upload(ktpFilePath, ktp_file)
    if (ktpUploadError) throw new Error(`Gagal mengunggah KTP: ${ktpUploadError.message}`)

    const kkFilePath = `kk/${wargaData.nomor_kk}-${kk_file.name}`
    const { data: kkUploadData, error: kkUploadError } = await supabase.storage
      .from('berkas_pendukung')
      .upload(kkFilePath, kk_file)
    if (kkUploadError) throw new Error(`Gagal mengunggah KK: ${kkUploadError.message}`)

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
        return { success: false, message: 'NIK sudah terdaftar.', errors: [{ path: 'nik', message: 'NIK ini sudah ada di sistem.' }] }
      }
      throw new Error(insertError.message)
    }

    revalidatePath('/admin/verifikasi')
    return { success: true, message: 'Pendaftaran berhasil! Data Anda akan segera diverifikasi.' }

  } catch (e) {
    const error = e as Error
    return { success: false, message: `Terjadi kesalahan: ${error.message}` }
  }
}