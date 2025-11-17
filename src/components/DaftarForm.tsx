'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerWarga } from '@/app/(public)/daftar/actions';
import { wargaSchema } from '@/lib/validations';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Spinner } from './ui/spinner';

function FormSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="pt-8 pb-4 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}

export default function DaftarForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof wargaSchema>>({
    resolver: zodResolver(wargaSchema),
    defaultValues: {
      full_name: '',
      nik: '',
      nomor_kk: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      jenis_kelamin: undefined,
      agama: undefined,
      status_perkawinan: undefined,
      pekerjaan: '',
      kewarganegaraan: 'WNI',
      alamat_ktp: '',
      alamat_domisili: '',
      status_tempat_tinggal: undefined,
      phone_number: '',
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof wargaSchema>) {
    startTransition(async () => {
      const result = await registerWarga(values);
      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message);
        if (result.errors) {
          result.errors.forEach((error) => {
            form.setError(error.path as keyof z.infer<typeof wargaSchema>, {
              type: 'server',
              message: error.message,
            });
          });
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* --- Bagian A --- */}
        <FormSection
          title="Data Identitas Pemohon"
          description="Sesuai KTP & KK"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nik"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIK *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nomor_kk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor KK *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tempat_lahir"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempat Lahir *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tanggal_lahir"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Lahir *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jenis_kelamin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agama *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Islam">Islam</SelectItem>
                    <SelectItem value="Kristen">Kristen</SelectItem>
                    <SelectItem value="Katolik">Katolik</SelectItem>
                    <SelectItem value="Hindu">Hindu</SelectItem>
                    <SelectItem value="Buddha">Buddha</SelectItem>
                    <SelectItem value="Khonghucu">Khonghucu</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status_perkawinan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Perkawinan *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Belum Kawin">Belum Kawin</SelectItem>
                    <SelectItem value="Kawin">Kawin</SelectItem>
                    <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                    <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pekerjaan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pekerjaan *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kewarganegaraan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kewarganegaraan *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="alamat_ktp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat (Sesuai KTP) *</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Bagian B --- */}
        <FormSection
          title="Data Domisili & Kontak"
          description="Data faktual untuk keperluan verifikasi dan notifikasi"
        />
        <FormField
          control={form.control}
          name="alamat_domisili"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Domisili Saat Ini (di RT ini) *</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status_tempat_tinggal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Tempat Tinggal *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Milik Sendiri">Milik Sendiri</SelectItem>
                    <SelectItem value="Kontrak/Sewa">Kontrak/Sewa</SelectItem>
                    <SelectItem value="Kost">Kost</SelectItem>
                    <SelectItem value="Menumpang">Menumpang</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor WhatsApp Aktif *</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- Bagian C --- */}
        <FormSection
          title="Berkas Pendukung"
          description="Unggah foto atau scan KTP dan KK Anda (Maksimal 5MB)"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ktp_file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Upload Foto/Scan KTP *</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kk_file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Upload Foto/Scan KK *</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-6">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? <Spinner /> : 'Kirim Pendaftaran'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
