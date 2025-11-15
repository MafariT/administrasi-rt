'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { nikSchema, suratRequestSchema } from '@/lib/validations';
import z from 'zod';

export async function verifyNik(values: z.infer<typeof nikSchema>) {
  const validatedFields = nikSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: 'Data NIK tidak valid.', data: null };
  }
  const { nik } = validatedFields.data;

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

export async function submitSuratRequest(
  values: z.infer<typeof suratRequestSchema>
) {
  'use server';
  const supabase = createClient();

  const validatedFields = suratRequestSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: 'Data pengajuan tidak valid.' };
  }

  let { warga_id, letter_type, custom_letter_type, keperluan } =
    validatedFields.data;

  if (letter_type === 'Lainnya...' && custom_letter_type) {
    letter_type = custom_letter_type;
  }

  const { error } = await supabase.from('surat_requests').insert({
    warga_id: warga_id,
    letter_type: letter_type,
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
