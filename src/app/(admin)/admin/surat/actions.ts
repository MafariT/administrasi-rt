'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveSuratRequest(requestId: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('surat_requests')
      .update({ status: 'selesai' })
      .eq('id', requestId)

    if (error) throw error
    revalidatePath('/admin/surat')
    return { success: true, message: 'Permintaan surat berhasil disetujui.' }
  } catch (e) {
    const error = e as Error
    return { success: false, message: `Gagal menyetujui: ${error.message}` }
  }
}

export async function rejectSuratRequest(requestId: string) {
  const supabase = createClient()
  try {
    const { error } = await supabase
      .from('surat_requests')
      .update({ status: 'ditolak' })
      .eq('id', requestId)

    if (error) throw error
    revalidatePath('/admin/surat')
    return { success: true, message: 'Permintaan surat ditolak.' }
  } catch (e) {
    const error = e as Error
    return { success: false, message: `Gagal menolak: ${error.message}` }
  }
}
