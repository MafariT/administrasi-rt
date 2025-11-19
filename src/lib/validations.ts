import { z } from 'zod';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export const wargaSchema = z.object({
  full_name: z.string().min(3, { message: 'Nama lengkap harus diisi.' }),
  nik: z
    .string()
    .length(16, {
      message: 'NIK harus terdiri dari 16 digit angka.',
    })
    .regex(/^\d+$/, 'NIK hanya boleh berisi angka.'),
  nomor_kk: z
    .string()
    .length(16, {
      message: 'Nomor KK harus terdiri dari 16 digit angka.',
    })
    .regex(/^\d+$/, 'Nomor KK hanya boleh berisi angka.'),
  tempat_lahir: z.string().min(1, { message: 'Tempat lahir harus diisi.' }),
  tanggal_lahir: z.string().refine(
    (date) => {
      const parsedDate = Date.parse(date);
      return !isNaN(parsedDate) && new Date(parsedDate) <= new Date();
    },
    {
      message: 'Tanggal lahir tidak valid.',
    }
  ),

  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan'], {
    message: 'Harap pilih jenis kelamin.',
  }),
  agama: z.string().min(1, { message: 'Agama harus dipilih.' }),
  status_perkawinan: z.string().min(1, {
    message: 'Status perkawinan harus dipilih.',
  }),
  pekerjaan: z.string().min(1, { message: 'Pekerjaan harus diisi.' }),
  kewarganegaraan: z
    .string()
    .min(1, { message: 'Kewarganegaraan harus diisi.' }),
  alamat_ktp: z.string().min(10, { message: 'Alamat KTP harus diisi.' }),
  alamat_domisili: z
    .string()
    .min(10, { message: 'Alamat domisili harus diisi.' }),
  status_tempat_tinggal: z.string().min(1, {
    message: 'Status tempat tinggal harus dipilih.',
  }),
  phone_number: z.string().min(10, { message: 'Nomor WhatsApp tidak valid.' }),
  email: z.email({ message: 'Format email tidak valid.' }).min(3),
  ktp_file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Ukuran file maksimal adalah 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Format file tidak valid. Hanya .jpg, .png, .webp, dan .pdf.'
    ),
  kk_file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Ukuran file maksimal adalah 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Format file tidak valid. Hanya .jpg, .png, .webp, dan .pdf.'
    ),
});

export const updateWargaSchema = z.object({
  id: z.string(),
  full_name: z.string().min(3, { message: 'Nama lengkap harus diisi.' }),
  nik: z.string().length(16, {
    message: 'NIK harus terdiri dari 16 digit.',
  }),
  nomor_kk: z.string().length(16, {
    message: 'Nomor KK harus terdiri dari 16 digit.',
  }),
  tempat_lahir: z.string().min(1, { message: 'Tempat lahir harus diisi.' }),
  tanggal_lahir: z.string().refine(
    (date) => {
      const parsedDate = Date.parse(date);
      return !isNaN(parsedDate) && new Date(parsedDate) <= new Date();
    },
    {
      message: 'Tanggal lahir tidak valid.',
    }
  ),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan'], {
    message: 'Harap pilih jenis kelamin.',
  }),
  agama: z.string().min(1, { message: 'Agama harus dipilih.' }),
  status_perkawinan: z.string().min(1, {
    message: 'Status perkawinan harus dipilih.',
  }),
  pekerjaan: z.string().min(1, { message: 'Pekerjaan harus diisi.' }),
  kewarganegaraan: z
    .string()
    .min(1, { message: 'Kewarganegaraan harus diisi.' }),
  alamat_ktp: z.string().min(10, { message: 'Alamat KTP harus diisi.' }),
  alamat_domisili: z
    .string()
    .min(10, { message: 'Alamat domisili harus diisi.' }),
  status_tempat_tinggal: z.string().min(1, {
    message: 'Status tempat tinggal harus dipilih.',
  }),
  phone_number: z.string().min(10, { message: 'Nomor WhatsApp tidak valid.' }),
  email: z
    .string()
    .email({ message: 'Format email tidak valid.' })
    .optional()
    .or(z.literal('')),
  status: z.enum(['pending_verification', 'terdaftar', 'ditolak']),
});

export const nikSchema = z.object({
  nik: z
    .string()
    .length(16, { message: 'NIK harus terdiri dari 16 digit.' })
    .regex(/^\d+$/, 'NIK hanya boleh berisi angka.'),
});

export const suratRequestSchema = z
  .object({
    warga_id: z.number(),
    letter_type: z.string().min(1, { message: 'Harap pilih jenis surat.' }),
    custom_letter_type: z.string().optional(),
    keperluan: z.string().min(10, {
      message:
        'Harap jelaskan keperluan Anda secara singkat (minimal 10 karakter).',
    }),
  })
  .refine(
    (data) => {
      if (data.letter_type === 'Lainnya...') {
        return data.custom_letter_type && data.custom_letter_type.length > 0;
      }
      return true;
    },
    {
      message: 'Harap sebutkan keperluan lainnya.',
      path: ['custom_letter_type'],
    }
  );
