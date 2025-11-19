'use client';

import { useTransition } from 'react';
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
import { DownloadIcon } from 'lucide-react';
import { getRequestsByNik } from '@/app/(public)/surat/cek-status/actions';
import { Spinner } from './ui/spinner';

export function StatusCheckForm({
  onCheckSuccess,
}: {
  onCheckSuccess: (data: any) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof nikSchema>>({
    resolver: zodResolver(nikSchema),
    defaultValues: { nik: '' },
  });

  const onSubmit = (values: z.infer<typeof nikSchema>) => {
    startTransition(() => {
      toast.promise(getRequestsByNik(values.nik), {
        loading: 'Mencari data...',
        success: (result) => {
          if (!result.success) throw new Error(result.message);
          onCheckSuccess(result.data);
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
            {isPending ? <Spinner /> : 'Cek Status'}
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
              className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <p className="font-semibold text-gray-800">{req.letter_type}</p>
                <p className="text-sm text-gray-500">
                  Diajukan pada:{' '}
                  {format(new Date(req.created_at), 'd MMM yyyy, HH:mm', {
                    locale: id,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {req.status === 'selesai' && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-300">
                    Selesai
                  </Badge>
                )}

                {req.status === 'pending' && (
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-300">
                    Sedang Diproses
                  </Badge>
                )}

                {req.status === 'ditolak' && (
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-300 dark:text-black">
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
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
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
