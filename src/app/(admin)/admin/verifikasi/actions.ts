'use server';

import { sendRegistrationRejectedNotification, sendRegistrationVerifiedNotification } from '@/lib/helper/notifications';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getWargaDetails(userId: string) {
  const supabase = createClient();

  try {
    const { data: warga, error: wargaError } = await supabase
      .from('warga')
      .select('*')
      .eq('id', userId)
      .single();

    if (wargaError) throw wargaError;

    const { data: ktpUrlData, error: ktpUrlError } = await supabase.storage
      .from('berkas_pendukung')
      .createSignedUrl(warga.ktp_file_url, 300); //

    if (ktpUrlError) throw ktpUrlError;

    const { data: kkUrlData, error: kkUrlError } = await supabase.storage
      .from('berkas_pendukung')
      .createSignedUrl(warga.kk_file_url, 300);

    if (kkUrlError) throw kkUrlError;

    return {
      ...warga,
      ktp_signed_url: ktpUrlData.signedUrl,
      kk_signed_url: kkUrlData.signedUrl,
    };
  } catch (e) {
    const error = e as Error;
    console.error('Failed to fetch warga details:', error.message);
    return null;
  }
}

export async function verifyWarga(userId: string) {
  const supabase = createClient()

  try {
    const { data: warga } = await supabase
      .from('warga')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    const { error } = await supabase
      .from('warga')
      .update({ status: 'terdaftar', verified_at: new Date().toISOString() })
      .eq('id', userId)
    
    if (error) throw error

    await sendRegistrationVerifiedNotification(warga?.email, warga?.full_name);

    revalidatePath('/admin/verifikasi')
    return { success: true, message: 'Warga berhasil diverifikasi.' }
  } catch (e) {
    const error = e as Error
    return { success: false, message: `Gagal memverifikasi: ${error.message}` }
  }
}

export async function rejectWarga(userId: string, reason: string) {
  const supabase = createClient()
  
  try {
    const { data: warga } = await supabase
      .from('warga')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    const { error } = await supabase
      .from('warga')
      .update({ 
        status: 'ditolak',
        rejection_reason: reason 
      })
      .eq('id', userId)
      
    if (error) throw error

    await sendRegistrationRejectedNotification(warga?.email, warga?.full_name, reason);

    revalidatePath('/admin/verifikasi')
    return { success: true, message: 'Pendaftaran warga ditolak.' }
  } catch (e) {
    const error = e as Error
    return { success: false, message: `Gagal menolak: ${error.message}` }
  }
}
