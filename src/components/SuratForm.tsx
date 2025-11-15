'use client';

import { useState, useTransition } from 'react';
import { submitSuratRequest, verifyNik } from '@/app/(public)/surat/actions';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Spinner } from './ui/spinner';

export const LETTER_TYPES = [
  'Kartu Keluarga (KK)',
  'Kartu Tanda Penduduk (KTP)',
  'Surat Keterangan Bersih Diri Catatan Kepolisian (SKBD/SKCK)',
  'Surat Keterangan Domisili',
  'Surat Keterangan Pindah',
  'Surat Keterangan Nikah',
  'Surat Keterangan Meninggal',
  'Surat Keterangan Usaha',
  'Surat Keterangan Kelahiran',
  'Surat Keterangan Tidak Mampu',
  'Surat Keterangan Kehilangan',
  'Lainnya...',
];

export function NikCheckForm({
  onNikVerified,
}: {
  onNikVerified: (data: any) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleNikCheck = async (formData: FormData) => {
    const nik = formData.get('nik') as string;

    startTransition(() => {
      toast.promise(verifyNik(nik), {
        loading: 'Memeriksa NIK...',
        success: (result) => {
          if (!result.success) throw new Error(result.message);
          onNikVerified(result.data);
          return result.message;
        },
        error: (error) => error.message,
      });
    });
  };

  return (
    <form action={handleNikCheck} className="space-y-4 max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="nik">Nomor Induk Kependudukan (NIK)</Label>
        <Input
          id="nik"
          name="nik"
          type="text"
          required
          pattern="\d{16}"
          placeholder="Masukkan 16 digit NIK Anda"
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Spinner /> : 'Cek NIK'}
      </Button>
    </form>
  );
}

export function SuratRequestForm({
  warga,
}: {
  warga: { id: number; full_name: string | null };
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedLetterType, setSelectedLetterType] = useState('');
  const handleSubmit = async (formData: FormData) => {
    if (formData.get('letter_type') === 'Lainnya...') {
      formData.set('letter_type', formData.get('custom_letter_type') || '');
    }

    startTransition(() => {
      toast.promise(submitSuratRequest(formData), {
        loading: 'Mengirim pengajuan...',
        success: (result) => {
          if (!result.success) throw new Error(result.message);
          return result.message;
        },
        error: (error) => error.message,
      });
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="warga_id" value={warga.id} />

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">NIK terverifikasi sebagai:</p>
        <p className="font-bold text-lg text-green-900">{warga.full_name}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="letter_type">Jenis Surat yang Diperlukan</Label>
        <Select
          name="letter_type"
          required
          onValueChange={setSelectedLetterType}
        >
          <SelectTrigger id="letter_type" className="w-full">
            <SelectValue placeholder="Pilih jenis surat..." />
          </SelectTrigger>
          <SelectContent>
            {LETTER_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedLetterType === 'Lainnya...' && (
        <div className="space-y-2 animate-in fade-in duration-300">
          <Label htmlFor="custom_letter_type">Sebutkan Keperluan Lainnya</Label>
          <Textarea
            id="custom_letter_type"
            name="custom_letter_type"
            required
            placeholder="Contoh: Surat Keterangan..."
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="keperluan">Tujuan Penggunaan Surat</Label>
        <Textarea
          id="keperluan"
          name="keperluan"
          required
          placeholder="Contoh: Untuk mengurus administrasi di kelurahan..."
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? <Spinner /> : 'Ajukan Surat'}
      </Button>
    </form>
  );
}
