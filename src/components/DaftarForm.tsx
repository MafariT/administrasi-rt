'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useEffect, useRef } from 'react'
import { registerWarga } from '@/app/(public)/daftar/actions'
import toast from 'react-hot-toast'

const initialState = {
  success: false,
  message: '',
  errors: {}
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-3 font-bold text-white bg-primary rounded-lg hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? 'Mengirim Data...' : 'Kirim Pendaftaran'}
    </button>
  )
}

function FormSection({ title, description }: { title: string; description: string }) {
  return (
    <div className="pt-6 pb-2 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  )
}

function FormError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null
  return <p className="text-sm text-red-500 mt-1">{errors[0]}</p>
}

export default function DaftarForm() {
  const [state, formAction] = useActionState(registerWarga, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
        formRef.current?.reset()
      } else {
        if (!state.errors || Object.keys(state.errors).length === 0) {
          toast.error(state.message)
        }
      }
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">

      {/* --- Bagian A: Data Identitas Pemohon --- */}
      <FormSection title="Data Identitas Pemohon" description="Sesuai KTP & KK." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div><label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Nama Lengkap *</label><input id="full_name" name="full_name" type="text" className="input-field" /><FormError errors={state.errors?.full_name} /></div>
        <div><label htmlFor="nik" className="block text-sm font-medium text-gray-700">NIK *</label><input id="nik" name="nik" type="text" pattern="\d{16}" title="NIK harus 16 digit" className="input-field" /><FormError errors={state.errors?.nik} /></div>
        <div><label htmlFor="nomor_kk" className="block text-sm font-medium text-gray-700">Nomor KK *</label><input id="nomor_kk" name="nomor_kk" type="text" pattern="\d{16}" title="KK harus 16 digit" className="input-field" /><FormError errors={state.errors?.nomor_kk} /></div>
        <div><label htmlFor="tempat_lahir" className="block text-sm font-medium text-gray-700">Tempat Lahir *</label><input id="tempat_lahir" name="tempat_lahir" type="text" className="input-field" /><FormError errors={state.errors?.tempat_lahir} /></div>
        <div><label htmlFor="tanggal_lahir" className="block text-sm font-medium text-gray-700">Tanggal Lahir *</label><input id="tanggal_lahir" name="tanggal_lahir" type="date" className="input-field" /><FormError errors={state.errors?.tanggal_lahir} /></div>
        <div><label htmlFor="jenis_kelamin" className="block text-sm font-medium text-gray-700">Jenis Kelamin *</label><select id="jenis_kelamin" name="jenis_kelamin" className="input-field"><option value="">Pilih...</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select><FormError errors={state.errors?.jenis_kelamin} /></div>
        <div><label htmlFor="agama" className="block text-sm font-medium text-gray-700">Agama *</label><select id="agama" name="agama" className="input-field"><option value="">Pilih...</option><option>Islam</option><option>Kristen</option><option>Katolik</option><option>Hindu</option><option>Buddha</option><option>Khonghucu</option></select><FormError errors={state.errors?.agama} /></div>
        <div><label htmlFor="status_perkawinan" className="block text-sm font-medium text-gray-700">Status Perkawinan *</label><select id="status_perkawinan" name="status_perkawinan" className="input-field"><option value="">Pilih...</option><option>Belum Kawin</option><option>Kawin</option><option>Cerai Hidup</option><option>Cerai Mati</option></select><FormError errors={state.errors?.status_perkawinan} /></div>
        <div><label htmlFor="pekerjaan" className="block text-sm font-medium text-gray-700">Pekerjaan *</label><input id="pekerjaan" name="pekerjaan" type="text" className="input-field" /><FormError errors={state.errors?.pekerjaan} /></div>
        <div><label htmlFor="kewarganegaraan" className="block text-sm font-medium text-gray-700">Kewarganegaraan *</label><input id="kewarganegaraan" name="kewarganegaraan" type="text" defaultValue="WNI" className="input-field" /><FormError errors={state.errors?.kewarganegaraan} /></div>
      </div>
      <div><label htmlFor="alamat_ktp" className="block text-sm font-medium text-gray-700">Alamat (Sesuai KTP) *</label><textarea id="alamat_ktp" name="alamat_ktp" rows={3} className="input-field"></textarea><FormError errors={state.errors?.alamat_ktp} /></div>

      {/* --- Bagian B: Data Domisili & Kontak --- */}
      <FormSection title="Data Domisili & Kontak" description="Data faktual untuk keperluan verifikasi dan notifikasi." />
      <div><label htmlFor="alamat_domisili" className="block text-sm font-medium text-gray-700">Alamat Domisili Saat Ini (di RT ini) *</label><textarea id="alamat_domisili" name="alamat_domisili" rows={3} className="input-field"></textarea><FormError errors={state.errors?.alamat_domisili} /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div><label htmlFor="status_tempat_tinggal" className="block text-sm font-medium text-gray-700">Status Tempat Tinggal *</label><select id="status_tempat_tinggal" name="status_tempat_tinggal" className="input-field"><option value="">Pilih...</option><option>Milik Sendiri</option><option>Kontrak/Sewa</option><option>Kost</option><option>Menumpang</option></select><FormError errors={state.errors?.status_tempat_tinggal} /></div>
        <div><label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Nomor WhatsApp Aktif *</label><input id="phone_number" name="phone_number" type="tel" className="input-field" /><FormError errors={state.errors?.phone_number} /></div>
      </div>
      <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Opsional)</label><input id="email" name="email" type="email" className="input-field" /><FormError errors={state.errors?.email} /></div>

      {/* --- Bagian C: Berkas Pendukung --- */}
      <FormSection title="Berkas Pendukung" description="Unggah foto atau scan KTP dan KK Anda untuk verifikasi (Maks. 5MB)." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label htmlFor="ktp_file" className="block text-sm font-medium text-gray-700">Upload Foto/Scan KTP *</label><input id="ktp_file" name="ktp_file" type="file" accept="image/*,.pdf" className="file-input" /><FormError errors={state.errors?.ktp_file} /></div>
        <div><label htmlFor="kk_file" className="block text-sm font-medium text-gray-700">Upload Foto/Scan KK *</label><input id="kk_file" name="kk_file" type="file" accept="image/*,.pdf" className="file-input" /><FormError errors={state.errors?.kk_file} /></div>
      </div>

      {state.message && !state.success && Object.keys(state.errors || {}).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <p className='font-bold'>{state.message}</p>
          <p>Silakan perbaiki kolom yang ditandai merah di atas.</p>
        </div>
      )}

      <div className="pt-6">
        <SubmitButton />
      </div>
    </form>
  )
}