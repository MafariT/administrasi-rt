import { NextResponse } from 'next/server'
import { generateSuratKeteranganPDF } from '@/lib/pdf-generator'

// This is the GET handler for our API route
export async function GET(request: Request) {
  // IMPORTANT: Protect this route so it only runs in development
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 })
  }

  // 1. Create Mock Data that matches your WargaProfile type
  const tanggalLahir: Date = new Date('1990-01-15')
  const mockWarga = {
    id: 1,
    full_name: 'John Doe Perkasa',
    nik: '3201234567890001',
    nomor_kk: '3201234567890002',
    tempat_lahir: 'Jakarta',
    tanggal_lahir: tanggalLahir,
    jenis_kelamin: 'Laki-laki',
    agama: 'Islam',
    status_perkawinan: 'Kawin',
    pekerjaan: 'Karyawan Swasta',
    kewarganegaraan: 'WNI',
    alamat_ktp:
      'Jl. Pahlawan No. 123, RT 012/RW 003, Desa Mendalo Indah, Kec. Jambi Luar Kota, Kab. Muaro Jambi',
    alamat_domisili: 'Jl. Mawar Blok C1 No. 10',
    status_tempat_tinggal: 'Milik Sendiri',
    phone_number: '081234567890',
    email: 'johndoe@example.com',
    status: 'terdaftar',
    created_at: new Date().toISOString(),
    verified_at: new Date().toISOString(),
    ktp_file_url: '',
    kk_file_url: '',
  }

  const mockRequestData = {
    warga: mockWarga,
    uniqueNumber: '007/RT12/MI/VII/2025',
    keperluan: 'Pendaftaran Sekolah Anak',
    letterType: 'Surat Pengantar Domisili',
  }

  try {
    // 2. Generate the PDF buffer using your existing function
    const pdfBuffer = await generateSuratKeteranganPDF(mockRequestData)

    // 3. Create a response with the correct headers
    const response = new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        // This header tells the browser to display the file inline instead of downloading it
        'Content-Disposition': 'inline; filename="preview.pdf"',
      },
      status: 200,
    })

    return response
  } catch (error) {
    console.error('Failed to generate PDF preview:', error)
    return new NextResponse('Error generating PDF', { status: 500 })
  }
}
