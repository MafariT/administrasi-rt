'use server';

import nodemailer from 'nodemailer';
import { supabase } from '../supabase/admin';

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function requestOtp(nik: string) {
  const { data: warga, error } = await supabase
    .from('warga')
    .select('email, full_name, status')
    .eq('nik', nik)
    .single();

  if (warga?.status !== 'terdaftar') {
    let message = 'Data Anda belum terverifikasi oleh Admin.';
    if (warga?.status === 'pending_verification') {
      message =
        'Data Anda sedang menunggu verifikasi oleh Admin. Harap tunggu.';
    } else if (warga?.status === 'ditolak') {
      message = 'Pendaftaran Anda sebelumnya ditolak. Harap hubungi Ketua RT.';
    }
    return { success: false, message, data: null };
  }

  if (error || !warga)
    return { success: false, message: 'NIK tidak ditemukan.' };
  if (!warga.email)
    return {
      success: false,
      message: 'Data warga ini tidak memiliki email terdaftar. Hubungi Admin.',
    };

  const code = generateCode();
  await supabase.from('otp_codes').delete().eq('nik', nik);

  const { error: otpError } = await supabase.from('otp_codes').insert({
    nik,
    code,
  });

  if (otpError) return { success: false, message: otpError.message };

  try {
    const emailSubject = `Kode Verifikasi Masuk - ${code}`;
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kode Verifikasi OTP</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        
        <!-- Main Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="padding: 40px 0;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                
                <!-- Header (Green Brand Color) -->
                <tr>
                  <td bgcolor="#0D9488" style="padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">
                      Sistem Administrasi RT
                    </h1>
                    <p style="color: #ccfbf1; margin: 5px 0 0 0; font-size: 14px;">
                      RT 012 Puri Kemajuan
                    </p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.5;">
                      Halo <strong>${warga.full_name}</strong>,
                    </p>
                    <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.5;">
                      Kami menerima permintaan untuk memverifikasi identitas Anda. Gunakan kode di bawah ini untuk melanjutkan proses di aplikasi Sistem RT Online.
                    </p>

                    <!-- OTP Code Box -->
                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 20px; text-align: center; margin: 30px 0;">
                      <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0f766e; display: block;">
                        ${code}
                      </span>
                    </div>

                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; text-align: center;">
                      Kode ini akan kadaluarsa dalam <strong>5 menit</strong>.
                    </p>
                    <p style="margin: 0; color: #ef4444; font-size: 13px; text-align: center; font-weight: bold;">
                      JANGAN berikan kode ini kepada siapa pun.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td bgcolor="#f9fafb" style="padding: 20px 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      Email ini dikirim secara otomatis. Mohon jangan membalas email ini.
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
    await transporter.sendMail({
      from: `"Sistem RT Online" <${process.env.BREVO_SMTP_VERIFIED_EMAIL}>`,
      to: warga.email,
      subject: emailSubject,
      text: `Halo ${warga.full_name},\n\nKode verifikasi Anda adalah: ${code}\n\nKode ini berlaku selama 5 menit.`,
      html: htmlTemplate,
    });
    const hiddenEmail = warga.email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
    return {
      success: true,
      message: `OTP telah dikirim ke email ${hiddenEmail}`,
    };
  } catch (emailError) {
    console.error(emailError);
    return {
      success: false,
      message: 'Gagal mengirim email. Coba lagi nanti.',
    };
  }
}

export async function verifyOtp(nik: string, code: string) {
  const { data, error } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('nik', nik)
    .eq('code', code)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) {
    return { success: false, message: 'Kode OTP salah atau kadaluarsa.' };
  }

  await supabase.from('otp_codes').delete().eq('id', data.id);

  return { success: true, message: 'Verifikasi berhasil.' };
}
