import PDFDocument from 'pdfkit';
import { WargaProfile } from './types';
import path from 'path';

interface SuratData {
  warga: WargaProfile;
  uniqueNumber: string;
  keperluan: string;
  letterType: string;
}

export function generateSuratKeteranganPDF(data: SuratData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const logoPath = path.join(process.cwd(), 'public/img/logo-pdf.png');
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 72, right: 72 },
    });

    const buffers: any[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
    doc.on('error', reject);

    // --- PDF CONTENT ---

    // Header
    doc.image(logoPath, 72, 50, {
      width: 60,
    });
    doc.y = 60;
    doc
      .font('Helvetica-Bold')
      .fontSize(18)
      .text('RUKUN TETANGGA 12', { align: 'center' });
    doc.fontSize(16).text('PEMERINTAH DESA MENDALO INDAH', {
      align: 'center',
    });
    doc.text('KECAMATAN JAMBI LUAR KOTA', {
      align: 'center',
    });
    doc.moveDown(1);

    // Line separator
    doc
      .strokeColor('#000000')
      .lineWidth(1)
      .moveTo(72, doc.y)
      .lineTo(523, doc.y)
      .stroke();
    doc.moveDown(1);

    // Title
    doc.font('Helvetica-Bold').fontSize(12).text('SURAT KETERANGAN', {
      align: 'center',
      underline: true,
    });
    doc.font('Helvetica').fontSize(11).text(`Nomor: ${data.uniqueNumber}`, {
      align: 'center',
    });
    doc.moveDown(1);

    doc.text(
      'Ketua Rukun Tetangga (RT) 12 Pemerintah Desa Mendalo Indah Kecamatan Jambi Luar Kota Kabupaten Muaro Jambi dengan ini menerangkan bahwa:',
      { lineGap: 5 }
    );
    doc.moveDown(1);

    // Resident Data
    const startX = 72 + 36;
    const labelX = startX;
    const colonX = startX + 120;
    const valueX = startX + 130;
    let currentY = doc.y;

    doc.text('Nama Lengkap', labelX, currentY);
    doc.text(':', colonX, currentY);
    doc.text(data.warga.full_name || '', valueX, currentY);
    currentY += 20;

    doc.text('Tempat/Tgl Lahir', labelX, currentY);
    doc.text(':', colonX, currentY);
    doc.text(
      `${data.warga.tempat_lahir}, ${new Date(data.warga.tanggal_lahir || '').toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      valueX,
      currentY
    );
    currentY += 20;

    doc.text('Jenis Kelamin', labelX, currentY);
    doc.text(':', colonX, currentY);
    doc.text(data.warga.jenis_kelamin || '', valueX, currentY);
    currentY += 20;

    doc.text('Pekerjaan', labelX, currentY);
    doc.text(':', colonX, currentY);
    doc.text(data.warga.pekerjaan || '', valueX, currentY);
    currentY += 20;

    doc.text('Alamat', labelX, currentY);
    doc.text(':', colonX, currentY);
    doc.text(data.warga.alamat_ktp || '', valueX, currentY, {
      width: 523 - valueX,
    });
    doc.y = currentY + 40;
    doc.moveDown(2);

    doc.x = 72;
    // Main Body
    doc.text(
      `Nama tersebut diatas adalah yang terdaftar dalam Buku Induk Penduduk Pemerintah Desa Mendalo Indah Kecamatan Jambi Luar Kota Kabupaten Muaro Jambi, dengan ini kami berikan Surat Pengantar sebagai bahan perlengkapan untuk mengurus:`,
      { lineGap: 5 }
    );
    doc.moveDown(1);
    doc.font('Helvetica-Bold').text(data.letterType, {
      indent: 36,
      underline: true,
    });
    doc.moveDown(2);

    // Closing
    doc
      .font('Helvetica')
      .text(
        'Demikianlah surat pengantar ini kami berikan untuk dapat dipergunakan sebagaimana mestinya.',
        { lineGap: 5 }
      );
    doc.moveDown(3);

    // Signature Block
    const signatureX = 350;
    doc.text(
      `Mendalo Indah, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      signatureX
    );
    doc.text('Ketua RT. 12', signatureX);
    doc.moveDown(6);
    doc.font('Helvetica-Bold').text('PAK RT', signatureX, doc.y, {
      underline: true,
    });

    // --- END PDF CONTENT ---
    doc.end();
  });
}
