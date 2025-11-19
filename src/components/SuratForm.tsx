'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { nikSchema, suratRequestSchema } from '@/lib/validations';
import { verifyNik, submitSuratRequest } from '@/app/(public)/surat/actions';
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
import { CheckCircleIcon } from '@heroicons/react/24/outline';

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

  const form = useForm<z.infer<typeof nikSchema>>({
    resolver: zodResolver(nikSchema),
    defaultValues: { nik: '' },
  });

  const onSubmit = (values: z.infer<typeof nikSchema>) => {
    startTransition(() => {
      toast.promise(verifyNik(values), {
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
    <div className="text-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-8 space-y-4 text-left"
        >
          <FormField
            control={form.control}
            name="nik"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Induk Kependudukan (NIK)</FormLabel>
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
            {isPending ? <Spinner /> : 'Cek NIK'}
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
                    <Textarea
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
