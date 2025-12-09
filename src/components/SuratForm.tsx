'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { nikSchema, suratRequestSchema } from '@/lib/validations';
import { verifyNik, submitSuratRequest } from '@/app/(public)/surat/actions';
import { requestOtp, verifyOtp } from '@/lib/helper/otp';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Spinner } from './ui/spinner';
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

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
  const [step, setStep] = useState<'nik' | 'otp'>('nik');
  const [currentNik, setCurrentNik] = useState('');

  const nikForm = useForm<z.infer<typeof nikSchema>>({
    resolver: zodResolver(nikSchema),
    defaultValues: { nik: '' },
  });

  const onRequestOtp = (values: z.infer<typeof nikSchema>) => {
    startTransition(async () => {
      const result = await requestOtp(values.nik);
      if (result.success) {
        toast.success(result.message);
        setCurrentNik(values.nik);
        setStep('otp');
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleVerifyOtp = async (formData: FormData) => {
    const code = formData.get('otp') as string;
    if (!code || code.length < 6) {
      toast.error('Masukkan kode OTP 6 digit.');
      return;
    }

    startTransition(async () => {
      const otpResult = await verifyOtp(currentNik, code);
      if (!otpResult.success) {
        toast.error(otpResult.message);
        return;
      }

      const verifyResult = await verifyNik({ nik: currentNik });

      if (verifyResult.success) {
        toast.success('Identitas terverifikasi.');
        onNikVerified(verifyResult.data);
      } else {
        toast.error(verifyResult.message);
      }
    });
  };

  if (step === 'otp') {
    return (
      <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
        <p className="text-gray-600 text-sm mb-6">
          Kami telah mengirimkan kode verifikasi ke email yang terdaftar untuk
          NIK <strong>{currentNik}</strong>
        </p>
        <form action={handleVerifyOtp} className="space-y-4 max-w-xs mx-auto">
          <div className="space-y-2 flex flex-col items-center">
            <InputOTP
              maxLength={6}
              name="otp"
              pattern={REGEXP_ONLY_DIGITS}
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-xs text-muted-foreground">
              Masukkan 6 digit kode yang Anda terima
            </p>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 text-base"
          >
            {isPending ? <Spinner /> : 'Verifikasi OTP'}
          </Button>
        </form>

        <button
          onClick={() => setStep('nik')}
          className="mt-6 text-sm text-gray-500 hover:text-primary flex items-center justify-center mx-auto"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Ganti NIK / Kirim Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Form {...nikForm}>
        <form
          onSubmit={nikForm.handleSubmit(onRequestOtp)}
          className="mt-8 space-y-4 text-left"
        >
          <FormField
            control={nikForm.control}
            name="nik"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary font-semibold">
                  Nomor Induk Kependudukan (NIK)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Masukkan 16 digit NIK Anda"
                    className="py-6"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-6 text-base"
          >
            {isPending ? <Spinner /> : 'Kirim Kode OTP'}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export function SuratRequestForm({
  warga,
  onSubmissionSuccess,
}: {
  warga: { id: number; full_name: string | null };
  onSubmissionSuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof suratRequestSchema>>({
    resolver: zodResolver(suratRequestSchema),
    defaultValues: {
      warga_id: warga.id,
      letter_type: '',
      custom_letter_type: '',
      keperluan: '',
    },
  });

  const letterType = form.watch('letter_type');

  const onSubmit = (values: z.infer<typeof suratRequestSchema>) => {
    startTransition(() => {
      toast.promise(submitSuratRequest(values), {
        loading: 'Mengirim pengajuan...',
        success: (result) => {
          if (!result.success) throw new Error(result.message);
          onSubmissionSuccess();
          return result.message;
        },
        error: (error) => error.message,
      });
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">NIK terverifikasi sebagai:</p>
            <p className="font-bold text-lg text-green-900">
              {warga.full_name}
            </p>
          </div>

          <FormField
            control={form.control}
            name="letter_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Surat yang Diperlukan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih jenis surat..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LETTER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {letterType === 'Lainnya...' && (
            <FormField
              control={form.control}
              name="custom_letter_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sebutkan Keperluan Lainnya</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Contoh: Surat Keterangan..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="keperluan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Jelaskan Keperluan Anda (Tujuan Penggunaan Surat)
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Contoh: Untuk mengurus administrasi di kelurahan..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Spinner /> : 'Ajukan Surat'}
          </Button>
        </form>
      </Form>
    </>
  );
}

export function SubmissionSuccess() {
  return (
    <div className="text-center py-8">
      <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
      <h2 className="mt-4 text-2xl font-bold text-gray-800">
        Pengajuan Berhasil Dikirim!
      </h2>
      <p className="mt-2 text-gray-600">
        Ketua RT akan segera memproses permintaan Anda
      </p>
    </div>
  );
}
