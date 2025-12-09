'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { nikSchema } from '@/lib/validations';
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
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { DownloadIcon, ArrowLeftIcon } from 'lucide-react';
import { getRequestsByNik } from '@/app/(public)/surat/cek-status/actions';
import { requestOtp, verifyOtp } from '@/lib/helper/otp';
import { Spinner } from './ui/spinner';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

export function StatusCheckForm({
  onCheckSuccess,
}: {
  onCheckSuccess: (data: any) => void;
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

      toast.promise(getRequestsByNik(currentNik), {
        loading: 'Mengambil data...',
        success: (result) => {
          if (!result.success) throw new Error(result.message);
          onCheckSuccess(result.data);
          return result.message;
        },
        error: (error) => error.message,
      });
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
            {isPending ? <Spinner /> : 'Cek Status'}
          </Button>
        </form>

        <button
          onClick={() => setStep('nik')}
          className="mt-6 text-sm text-gray-500 hover:text-primary flex items-center justify-center mx-auto"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Ganti NIK
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

export function StatusResult({
  resultData,
  onReset,
}: {
  resultData: any;
  onReset: () => void;
}) {
  const { warga, requests } = resultData;

  return (
    <div>
      <div className="mb-8">
        {warga.status === 'ditolak' && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-left">
            <div className="flex items-start space-x-3">
              <ExclamationCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800">
                  Pendaftaran Ditolak
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  <strong>Alasan:</strong>{' '}
                  {warga.rejection_reason || 'Tidak ada alasan yang diberikan.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">NIK terverifikasi sebagai:</p>
          <p className="font-bold text-lg text-green-900">{warga.full_name}</p>
        </div>
      </div>

      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req: any) => (
            <div
              key={req.id}
              className="p-4 border rounded-lg flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    {req.letter_type}
                  </p>
                  <p className="text-sm text-gray-500">
                    Diajukan pada:{' '}
                    {format(new Date(req.created_at), 'd MMM yyyy, HH:mm', {
                      locale: id,
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  {req.status === 'selesai' && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      Selesai
                    </Badge>
                  )}

                  {req.status === 'pending' && (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                      Sedang Diproses
                    </Badge>
                  )}

                  {req.status === 'ditolak' && (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                      Ditolak
                    </Badge>
                  )}

                  {req.status === 'selesai' && req.download_url && (
                    <Button asChild size="sm">
                      <a href={req.download_url} target="_blank">
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Unduh PDF
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {req.status === 'ditolak' && req.rejection_reason && (
                <div className="p-3 bg-red-50 border-l-4 border-red-400 text-sm text-red-700 flex items-start">
                  <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Alasan Penolakan: </strong> {req.rejection_reason}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">
          Belum ada riwayat pengajuan surat untuk NIK ini.
        </p>
      )}

      <div className="text-center mt-8">
        <Button variant="outline" onClick={onReset}>
          Cek NIK Lain
        </Button>
      </div>
    </div>
  );
}
