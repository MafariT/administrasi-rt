'use server'

import { generateSuratKeteranganPDF } from '@/lib/pdf-generator'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveSuratRequest(requestId: string) {
  const supabase = createClient()

  try {
    // 1. Fetch the request AND the related warga data
    const { data: request, error: requestError } = await supabase
      .from('surat_requests')
      .select('*, warga:warga_id(*)')
      .eq('id', requestId)
      .single()

    if (requestError || !request || !request.warga) {
      throw new Error('Permintaan surat atau data warga tidak ditemukan.')
    }

    // 2. Generate a unique number (example format)
    const now = new Date()
    const uniqueNumber = `${String(request.id).padStart(3, '0')}/RT12/MI/${now.getMonth() + 1}/${now.getFullYear()}`

    // 3. Generate the PDF buffer
    const pdfBuffer = await generateSuratKeteranganPDF({
      warga: request.warga,
      uniqueNumber: uniqueNumber,
      keperluan: request.form_data.keperluan || 'Tidak disebutkan',
      letterType: request.letter_type,
    })

    // 4. Upload the PDF to Supabase Storage
    const filePath = `surat_${request.warga.nik}_${Date.now()}.pdf`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('surat_arsip')
      .upload(filePath, pdfBuffer, { contentType: 'application/pdf' })

    if (uploadError) {
      throw new Error(`Gagal mengunggah PDF: ${uploadError.message}`)
    }

    // 5. Update the request in the database
    const { error: updateError } = await supabase
      .from('surat_requests')
      .update({
        status: 'selesai',
        unique_number: uniqueNumber,
        file_url: uploadData.path, // Save the path
      })
      .eq('id', requestId)

    if (updateError) throw updateError

    revalidatePath('/admin/surat')
    return { success: true, message: 'Surat berhasil dibuat dan disimpan.' }
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

export async function getSuratDownloadUrl(filePath: string) {
  if (!filePath) {
    return { success: false, message: 'File path not provided.' }
  }
  const supabase = createClient()

  try {
    const { data, error } = await supabase.storage
      .from('surat_arsip')
      .createSignedUrl(filePath, 300)

    if (error) throw error

    return { success: true, url: data.signedUrl }
  } catch (e) {
    const error = e as Error
    return { success: false, message: `Gagal membuat URL: ${error.message}` }
  }
}
