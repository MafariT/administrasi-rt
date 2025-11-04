'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateWargaProfile(formData: FormData) {
  const supabase = createClient()
  
  const wargaData = {
    full_name: formData.get('full_name') as string,
    nik: formData.get('nik') as string,
    nomor_kk: formData.get('nomor_kk') as string,
    phone_number: formData.get('phone_number') as string,
    status: formData.get('status') as string,
  }
  const wargaId = formData.get('id') as string

  const { error } = await supabase
    .from('warga')
    .update(wargaData)
    .eq('id', wargaId)

  if (error) return { success: false, message: error.message }
  
  revalidatePath('/admin/users')
  return { success: true, message: 'Data warga berhasil diperbarui.' }
}

export async function deleteWarga(wargaId: string) {
  const supabase = createClient()

  const { data: warga, error: fetchError } = await supabase
    .from('warga')
    .select('ktp_file_url, kk_file_url')
    .eq('id', wargaId)
    .single()
  
  if (fetchError || !warga) {
    return { success: false, message: 'Gagal menemukan data warga.' }
  }

  const filesToDelete = [warga.ktp_file_url, warga.kk_file_url].filter(Boolean) as string[]
  if (filesToDelete.length > 0) {
    const { error: storageError } = await supabase.storage
      .from('berkas_pendukung')
      .remove(filesToDelete)
    if (storageError) console.error("Error deleting files, but proceeding:", storageError.message)
  }

  const { error: deleteError } = await supabase
    .from('warga')
    .delete()
    .eq('id', wargaId)

  if (deleteError) return { success: false, message: deleteError.message }

  revalidatePath('/admin/users')
  return { success: true, message: 'Data warga berhasil dihapus.' }
}