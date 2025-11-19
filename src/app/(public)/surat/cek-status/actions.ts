'use server';

import { createClient } from '@/lib/supabase/server';

export async function getRequestsByNik(nik: string) {
  if (!nik || nik.length !== 16) {
    return { success: false, message: 'NIK tidak valid.', data: null };
  }

  const supabase = createClient();

  try {
    const { data: warga, error: wargaError } = await supabase
      .from('warga')
      .select('id, full_name')
      .eq('nik', nik)
      .eq('status', 'terdaftar')
      .single();

    if (wargaError || !warga) {
      return {
        success: false,
        message: 'NIK tidak terdaftar atau belum diverifikasi.',
        data: null,
      };
    }

    const { data: requests, error: requestsError } = await supabase
      .from('surat_requests')
      .select('*')
      .eq('warga_id', warga.id)
      .order('created_at', { ascending: false });

    if (requestsError) throw requestsError;

    const requestsWithUrls = await Promise.all(
      requests.map(async (req) => {
        if (req.status === 'selesai' && req.file_url) {
          const { data: urlData, error: urlError } = await supabase.storage
            .from('surat_arsip')
            .createSignedUrl(req.file_url, 300);

          if (!urlError) {
            return { ...req, download_url: urlData.signedUrl };
          }
        }
        return { ...req, download_url: null };
      })
    );

    return {
      success: true,
      message: 'Data berhasil ditemukan.',
      data: {
        warga: warga,
        requests: requestsWithUrls,
      },
    };
  } catch (e) {
    const error = e as Error;
    return {
      success: false,
      message: `Terjadi kesalahan: ${error.message}`,
      data: null,
    };
  }
}
