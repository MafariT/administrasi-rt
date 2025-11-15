'use server';

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
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from('warga')
      .update({
        status: 'terdaftar',
        verified_at: new Date().toISOString(),
      })
      .eq('id', userId);
    if (error) throw error;
    revalidatePath('/admin/verifikasi');
    return {
      success: true,
      message: 'Warga berhasil diverifikasi.',
    };
  } catch (e) {
    const error = e as Error;
    return {
      success: false,
      message: `Gagal memverifikasi: ${error.message}`,
    };
  }
}

export async function rejectWarga(userId: string) {
  const supabase = createClient();
  try {
    const { error } = await supabase
      .from('warga')
      .update({ status: 'ditolak' })
      .eq('id', userId);
    if (error) throw error;
    revalidatePath('/admin/verifikasi');
    return {
      success: true,
      message: 'Pendaftaran warga ditolak.',
    };
  } catch (e) {
    const error = e as Error;
    return {
      success: false,
      message: `Gagal menolak: ${error.message}`,
    };
  }
}
