'use server';

import { sendSuratApprovedNotification, sendSuratRejectedNotification } from '@/lib/helper/notifications';
import { generateSuratKeteranganPDF } from '@/lib/pdf-generator';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveSuratRequest(requestId: string) {
  const supabase = createClient();

  try {
    const { data: request, error: requestError } = await supabase
      .from('surat_requests')
      .select('*, warga:warga_id(*)')
      .eq('id', requestId)
      .single();

    if (requestError || !request || !request.warga) {
      throw new Error('Permintaan surat atau data warga tidak ditemukan.');
    }

    const now = new Date();
    const uniqueNumber = `${String(request.id).padStart(3, '0')}/RT12/MI/${now.getMonth() + 1}/${now.getFullYear()}`;

    const pdfBuffer = await generateSuratKeteranganPDF({
      warga: request.warga,
      uniqueNumber: uniqueNumber,
      keperluan: request.form_data.keperluan || 'Tidak disebutkan',
      letterType: request.letter_type,
    });

    const filePath = `surat_${request.warga.nik}_${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('surat_arsip')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
      });

    if (uploadError) {
      throw new Error(`Gagal mengunggah PDF: ${uploadError.message}`);
    }

    const { error: updateError } = await supabase
      .from('surat_requests')
      .update({
        status: 'selesai',
        unique_number: uniqueNumber,
        file_url: uploadData.path,
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    await sendSuratApprovedNotification(
      request.warga.email,
      request.warga.full_name,
      request.letter_type,
      pdfBuffer
    );

    revalidatePath('/admin/surat');
    return {
      success: true,
      message: 'Surat berhasil dibuat dan disimpan.',
    };
  } catch (e) {
    const error = e as Error;
    return {
      success: false,
      message: `Gagal menyetujui: ${error.message}`,
    };
  }
}

export async function rejectSuratRequest(requestId: string, reason: string) {
  const supabase = createClient()

  try {
    const { data: request } = await supabase
      .from('surat_requests')
      .select('*, warga:warga_id(*)')
      .eq('id', requestId)
      .single();

    const { error } = await supabase
      .from('surat_requests')
      .update({ 
        status: 'ditolak',
        rejection_reason: reason 
      })
      .eq('id', requestId)
      
    if (error) throw error

    await sendSuratRejectedNotification(
      request.warga.email, 
      request.warga.full_name, 
      request.letter_type, 
      reason
    );

    revalidatePath('/admin/surat')
    return { success: true, message: 'Permintaan surat ditolak.' }
  } catch (e) {
    const error = e as Error
    return { success: false, message: `Gagal menolak: ${error.message}` }
  }
}

export async function getSuratDownloadUrl(filePath: string) {
  if (!filePath) {
    return {
      success: false,
      message: 'File path not provided.',
    };
  }
  const supabase = createClient();

  try {
    const { data, error } = await supabase.storage
      .from('surat_arsip')
      .createSignedUrl(filePath, 300);

    if (error) throw error;

    return { success: true, url: data.signedUrl };
  } catch (e) {
    const error = e as Error;
    return {
      success: false,
      message: `Gagal membuat URL: ${error.message}`,
    };
  }
}
