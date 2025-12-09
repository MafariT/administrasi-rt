'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';

function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: async () => (await cookieStore).getAll(),
      },
    }
  );
}

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
  const supabase = createClient();

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
    await transporter.sendMail({
      from: '"Sistem RT Online" <ahmadfadlan432@gmail.com>',
      to: warga.email,
      subject: 'Kode Verifikasi (OTP) - RT Online',
      text: `Halo ${warga.full_name},\n\nKode verifikasi Anda adalah: ${code}\n\nKode ini berlaku selama 5 menit. Jangan berikan kepada siapapun.`,
      html: `<p>Halo <strong>${warga.full_name}</strong>,</p><p>Kode verifikasi Anda adalah:</p><h2>${code}</h2><p>Kode ini berlaku selama 5 menit.</p>`,
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
  const supabase = createClient();

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
