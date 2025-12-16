'use server'

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
})

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_URL 
    ? `https://${process.env.NEXT_PUBLIC_BASE_URL}` 
    : 'http://localhost:3000';
}

function getHtmlLayout(headerTitle: string, contentBody: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding: 40px 0;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td bgcolor="#0D9488" style="padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">${headerTitle}</h1>
                  <p style="color: #ccfbf1; margin: 5px 0 0 0; font-size: 14px;">RT 012 Puri Kemajuan</p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px; color: #374151; line-height: 1.6;">
                  ${contentBody}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td bgcolor="#f9fafb" style="padding: 20px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    Email ini dikirim secara otomatis oleh Sistem Administrasi RT Online.
                  </p>
                  <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} RT 012 Puri Kemajuan. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendSuratApprovedNotification(
  email: string,
  name: string,
  letterType: string
) {
  const checkStatusLink = `${getBaseUrl()}/cek-status`;

  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Halo <strong>${name}</strong>,</p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Kabar baik! Permintaan surat Anda untuk <strong>"${letterType}"</strong> telah <strong style="color: #059669;">DISETUJUI</strong> dan diterbitkan oleh Ketua RT.
    </p>
    
    <div style="margin: 30px 0; text-align: center;">
      <a href="${checkStatusLink}" style="background-color: #0D9488; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Download Surat PDF
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280;">
      Silakan klik tombol di atas atau buka menu "Cek Status" di website untuk mengunduh dokumen Anda.
    </p>
  `;

  try {
    await transporter.sendMail({
      from: `"Sistem RT Online" <${process.env.BREVO_SMTP_VERIFIED_EMAIL}>`,
      to: email,
      subject: 'Surat Anda Telah Terbit - Sistem RT Online',
      html: getHtmlLayout('Surat Resmi Terbit', content),
    });
  } catch (error) {
    console.error('Failed to send surat approved email:', error);
  }
}

export async function sendSuratRejectedNotification(
  email: string, 
  name: string, 
  letterType: string, 
  reason: string
) {
  const checkStatusLink = `${getBaseUrl()}/cek-status`;

  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Halo <strong>${name}</strong>,</p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Mohon maaf, permintaan surat Anda untuk <strong>"${letterType}"</strong> telah <strong style="color: #dc2626;">DITOLAK</strong>.
    </p>
    
    <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: bold;">Alasan Penolakan:</p>
      <p style="margin: 5px 0 0 0; color: #7f1d1d; font-style: italic;">"${reason}"</p>
    </div>

    <div style="margin: 30px 0; text-align: center;">
      <a href="${checkStatusLink}" style="background-color: #374151; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Cek Status Pengajuan
      </a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Sistem RT Online" <${process.env.BREVO_SMTP_VERIFIED_EMAIL}>`,
      to: email,
      subject: 'Permintaan Surat Ditolak - Sistem RT Online',
      html: getHtmlLayout('Status Pengajuan', content),
    });
  } catch (error) {
    console.error('Failed to send surat rejection email:', error);
  }
}

export async function sendRegistrationVerifiedNotification(email: string, name: string) {
  const suratLink = `${getBaseUrl()}/surat`;
  
  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Halo <strong>${name}</strong>,</p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Selamat! Data pendaftaran Anda telah <strong style="color: #059669;">DIVERIFIKASI</strong> oleh Ketua RT.
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Anda sekarang sudah terdaftar secara resmi di sistem digital kami dan dapat mulai mengajukan surat pengantar secara online.
    </p>

    <div style="margin: 30px 0; text-align: center;">
      <a href="${suratLink}" style="background-color: #0D9488; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Ajukan Surat Sekarang
      </a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Sistem RT Online" <${process.env.BREVO_SMTP_VERIFIED_EMAIL}>`,
      to: email,
      subject: 'Pendaftaran Berhasil - Sistem RT Online',
      html: getHtmlLayout('Selamat Datang!', content),
    });
  } catch (error) {
    console.error('Failed to send verified email:', error);
  }
}

export async function sendRegistrationRejectedNotification(
  email: string, 
  name: string, 
  reason: string
) {
  const daftarLink = `${getBaseUrl()}/daftar`;

  const content = `
    <p style="font-size: 16px; margin-bottom: 20px;">Halo <strong>${name}</strong>,</p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Mohon maaf, pendaftaran data warga Anda <strong style="color: #dc2626;">DITOLAK</strong> oleh Admin.
    </p>

    <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 25px 0;">
      <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: bold;">Alasan Penolakan:</p>
      <p style="margin: 5px 0 0 0; color: #7f1d1d; font-style: italic;">"${reason}"</p>
    </div>

    <p style="font-size: 16px; margin-bottom: 20px;">
      Silakan perbaiki data Anda sesuai alasan di atas dan lakukan pendaftaran ulang.
    </p>

    <div style="margin: 30px 0; text-align: center;">
      <a href="${daftarLink}" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Daftar Ulang
      </a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Sistem RT Online" <${process.env.BREVO_SMTP_VERIFIED_EMAIL}>`,
      to: email,
      subject: 'Pendaftaran Ditolak - Sistem RT Online',
      html: getHtmlLayout('Pemberitahuan Pendaftaran', content),
    });
  } catch (error) {
    console.error('Failed to send reg rejection email:', error);
  }
}