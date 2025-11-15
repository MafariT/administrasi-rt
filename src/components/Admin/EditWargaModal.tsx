'use client'

import { useState, useEffect } from 'react'
import { getWargaDetailsForEdit, updateWargaProfile } from '@/app/(admin)/admin/users/actions'
import { WargaProfile } from '@/lib/types'
import { toast } from 'sonner'
import { useFormStatus } from 'react-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '../ui/spinner'

type WargaDetails = Awaited<ReturnType<typeof getWargaDetailsForEdit>>

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner /> : 'Simpan Perubahan'}
    </Button>
  )
}

export default function EditWargaModal({ warga, isOpen, onClose }: { warga: WargaProfile; isOpen: boolean; onClose: () => void }) {
  const [details, setDetails] = useState<WargaDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      async function fetchDetails() {
        setIsLoading(true);
        const data = await getWargaDetailsForEdit(warga.id.toString());
        setDetails(data);
        setIsLoading(false);
      }
      fetchDetails();
    }
  }, [isOpen, warga.id]);

  const handleUpdate = async (formData: FormData) => {
    const promise = () => updateWargaProfile(formData);

    toast.promise(promise, {
      loading: 'Memperbarui data warga...',
      success: (result) => {
        if (!result.success) {
          throw new Error(result.message);
        }
        onClose();
        return result.message;
      },
      error: (error) => error.message
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Data Warga: {details?.full_name || warga.full_name}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner className="size-8" />
          </div>
        ) : !details ? (
          <p className="text-red-500">Gagal memuat detail data.</p>
        ) : (
          <form action={handleUpdate} className="space-y-4 pt-4">
            <input type="hidden" name="id" value={details.id} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nama Lengkap</Label><Input name="full_name" defaultValue={details.full_name ?? ''} /></div>
              <div className="space-y-2"><Label>NIK</Label><Input name="nik" defaultValue={details.nik ?? ''} /></div>
              <div className="space-y-2"><Label>Nomor KK</Label><Input name="nomor_kk" defaultValue={details.nomor_kk ?? ''} /></div>
              <div className="space-y-2"><Label>Tempat Lahir</Label><Input name="tempat_lahir" defaultValue={details.tempat_lahir ?? ''} /></div>
              <div className="space-y-2"><Label>Tanggal Lahir</Label><Input type="date" name="tanggal_lahir" defaultValue={details.tanggal_lahir ?? ''} /></div>
              <div className="space-y-2"><Label>Pekerjaan</Label><Input name="pekerjaan" defaultValue={details.pekerjaan ?? ''} /></div>
              <div className="space-y-2"><Label>Kewarganegaraan</Label><Input name="kewarganegaraan" defaultValue={details.kewarganegaraan ?? 'WNI'} /></div>
              <div className="space-y-2"><Label>Telepon</Label><Input name="phone_number" defaultValue={details.phone_number ?? ''} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" name="email" defaultValue={details.email ?? ''} /></div>
              <div className="space-y-2"><Label>Jenis Kelamin</Label><Select name="jenis_kelamin" defaultValue={details.jenis_kelamin ?? ''}><SelectTrigger className='w-full'><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Laki-laki">Laki-laki</SelectItem><SelectItem value="Perempuan">Perempuan</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Agama</Label><Select name="agama" defaultValue={details.agama ?? ''}><SelectTrigger className='w-full'><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Islam">Islam</SelectItem><SelectItem value="Kristen">Kristen</SelectItem><SelectItem value="Katolik">Katolik</SelectItem><SelectItem value="Hindu">Hindu</SelectItem><SelectItem value="Buddha">Buddha</SelectItem><SelectItem value="Khonghucu">Khonghucu</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Status Perkawinan</Label><Select name="status_perkawinan" defaultValue={details.status_perkawinan ?? ''}><SelectTrigger className='w-full'><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Belum Kawin">Belum Kawin</SelectItem><SelectItem value="Kawin">Kawin</SelectItem><SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem><SelectItem value="Cerai Mati">Cerai Mati</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Status Tempat Tinggal</Label><Select name="status_tempat_tinggal" defaultValue={details.status_tempat_tinggal ?? ''}><SelectTrigger className='w-full'><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Milik Sendiri">Milik Sendiri</SelectItem><SelectItem value="Kontrak/Sewa">Kontrak/Sewa</SelectItem><SelectItem value="Kost">Kost</SelectItem><SelectItem value="Menumpang">Menumpang</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Status Profil</Label><Select name="status" defaultValue={details.status}><SelectTrigger className='w-full'><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pending_verification">Pending</SelectItem><SelectItem value="terdaftar">Terdaftar</SelectItem><SelectItem value="ditolak">Ditolak</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Alamat KTP</Label><Textarea name="alamat_ktp" defaultValue={details.alamat_ktp ?? ''} /></div>
            <div className="space-y-2"><Label>Alamat Domisili</Label><Textarea name="alamat_domisili" defaultValue={details.alamat_domisili ?? ''} /></div>

            <DialogFooter className="pt-6">
              <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
              <SubmitButton />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}