'use client'

import { useTransition } from 'react'
import { verifyNik, submitSuratRequest } from '@/app/(public)/surat/actions'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export function NikCheckForm({
  onNikVerified,
}: {
  onNikVerified: (data: any) => void
}) {
  const [isPending, startTransition] = useTransition()

  const handleNikCheck = async (formData: FormData) => {
    const nik = formData.get('nik') as string

    startTransition(() => {
      toast.promise(verifyNik(nik), {
        loading: 'Memeriksa NIK...',
        success: (result) => {
          if (!result.success) throw new Error(result.message)
          onNikVerified(result.data)
          return result.message
        },
        error: (error) => error.message,
      })
    })
  }

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
        {isPending ? 'Memeriksa...' : 'Cek NIK'}
      </Button>
    </form>
  )
}

export function SuratRequestForm({
  warga,
}: {
  warga: { id: number; full_name: string | null }
}) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(() => {
      toast.promise(submitSuratRequest(formData), {
        loading: 'Mengirim pengajuan...',
        success: (result) => {
          if (!result.success) throw new Error(result.message)
          return result.message
        },
        error: (error) => error.message,
      })
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="warga_id" value={warga.id} />

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">NIK terverifikasi sebagai:</p>
        <p className="font-bold text-lg text-green-900">{warga.full_name}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="letter_type">Jenis Surat yang Diperlukan</Label>
        <Select name="letter_type" required>
          <SelectTrigger id="letter_type">
            <SelectValue placeholder="Pilih jenis surat..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Surat Pengantar Domisili">
              Surat Pengantar Domisili
            </SelectItem>
            <SelectItem value="Surat Keterangan Usaha">
              Surat Keterangan Usaha
            </SelectItem>
            <SelectItem value="Surat Pengantar Lainnya">
              Surat Pengantar Lainnya
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keperluan">Jelaskan Keperluan Anda</Label>
        <Textarea
          id="keperluan"
          name="keperluan"
          required
          placeholder="Contoh: Untuk mengurus administrasi di kelurahan..."
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Mengirim...' : 'Ajukan Surat'}
      </Button>
    </form>
  )
}
