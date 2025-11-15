'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function verifyNik(nik: string) {
  'use server';
  if (!nik || nik.length !== 16) {
    return {
      success: false,
      message: 'NIK tidak valid. Harap masukkan 16 digit NIK.',
      data: null,
    };
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('warga')
      .select('id, full_name, nik, status')
      .eq('nik', nik)
      .single();

    if (error || !data) {
      return {
        success: false,
        message:
          'NIK tidak ditemukan di sistem. Silakan lakukan pendaftaran terlebih dahulu.',
        data: null,
      };
    }

    if (data.status !== 'terdaftar') {
      let message = 'Data Anda belum terverifikasi oleh Admin.';
      if (data.status === 'pending_verification') {
        message =
          'Data Anda sedang menunggu verifikasi oleh Admin. Harap tunggu.';
      } else if (data.status === 'ditolak') {
        message =
          'Pendaftaran Anda sebelumnya ditolak. Harap hubungi Ketua RT.';
      }
      return { success: false, message, data: null };
    }

    return {
      success: true,
      message: 'NIK berhasil diverifikasi.',
      data,
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

export async function submitSuratRequest(formData: FormData) {
  'use server';
  const supabase = createClient();

  const wargaId = formData.get('warga_id') as string;
  const letterType = formData.get('letter_type') as string;
  const keperluan = formData.get('keperluan') as string;

  if (!wargaId || !letterType || !keperluan) {
    return {
      success: false,
      message: 'Data tidak lengkap.',
    };
  }

  const { error } = await supabase.from('surat_requests').insert({
    warga_id: parseInt(wargaId),
    letter_type: letterType,
    form_data: { keperluan },
    status: 'pending',
  });

  if (error) {
    return {
      success: false,
      message: `Gagal mengajukan surat: ${error.message}`,
    };
  }

  revalidatePath('/admin/surat');
  return {
    success: true,
    message: 'Pengajuan surat berhasil dikirim!',
  };
}
