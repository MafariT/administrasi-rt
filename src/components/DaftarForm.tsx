'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useEffect, useRef } from 'react'
import { registerWarga } from '@/app/(public)/daftar/actions'

const initialState = {
  success: false,
  message: '',
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

export default function DaftarForm() {
  const [state, formAction] = useActionState(registerWarga, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.message) {
      alert(state.message);
      if (state.success) {
        formRef.current?.reset();
      }
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* --- Bagian A --- */}
      <FormSection title="Bagian A: Data Identitas Pemohon" description="Sesuai KTP & KK. Data ini akan digunakan untuk mengisi surat secara otomatis." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label htmlFor="full_name">Nama Lengkap *</label><input id="full_name" name="full_name" type="text" required className="input-field" /></div>
        <div><label htmlFor="nik">NIK *</label><input id="nik" name="nik" type="text" required pattern="\d{16}" title="NIK harus 16 digit" className="input-field" /></div>
        <div><label htmlFor="nomor_kk">Nomor KK *</label><input id="nomor_kk" name="nomor_kk" type="text" required pattern="\d{16}" title="KK harus 16 digit" className="input-field" /></div>
        <div><label htmlFor="tempat_lahir">Tempat Lahir *</label><input id="tempat_lahir" name="tempat_lahir" type="text" required className="input-field" /></div>
        <div><label htmlFor="tanggal_lahir">Tanggal Lahir *</label><input id="tanggal_lahir" name="tanggal_lahir" type="date" required className="input-field" /></div>
        <div><label htmlFor="jenis_kelamin">Jenis Kelamin *</label><select id="jenis_kelamin" name="jenis_kelamin" required className="input-field"><option value="">Pilih...</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div>
        <div><label htmlFor="agama">Agama *</label><select id="agama" name="agama" required className="input-field"><option value="">Pilih...</option><option>Islam</option><option>Kristen</option><option>Katolik</option><option>Hindu</option><option>Buddha</option><option>Khonghucu</option></select></div>
        <div><label htmlFor="status_perkawinan">Status Perkawinan *</label><select id="status_perkawinan" name="status_perkawinan" required className="input-field"><option value="">Pilih...</option><option>Belum Kawin</option><option>Kawin</option><option>Cerai Hidup</option><option>Cerai Mati</option></select></div>
        <div><label htmlFor="pekerjaan">Pekerjaan *</label><input id="pekerjaan" name="pekerjaan" type="text" required className="input-field" /></div>
        <div><label htmlFor="kewarganegaraan">Kewarganegaraan *</label><input id="kewarganegaraan" name="kewarganegaraan" type="text" required defaultValue="WNI" className="input-field" /></div>
      </div>
      <div><label htmlFor="alamat_ktp">Alamat (Sesuai KTP) *</label><textarea id="alamat_ktp" name="alamat_ktp" required rows={3} className="input-field"></textarea></div>

      {/* --- Bagian B --- */}
      <FormSection title="Bagian B: Data Domisili & Kontak" description="Data faktual untuk keperluan verifikasi dan notifikasi." />
      <div><label htmlFor="alamat_domisili">Alamat Domisili Saat Ini (di RT ini) *</label><textarea id="alamat_domisili" name="alamat_domisili" required rows={3} className="input-field"></textarea></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label htmlFor="status_tempat_tinggal">Status Tempat Tinggal *</label><select id="status_tempat_tinggal" name="status_tempat_tinggal" required className="input-field"><option value="">Pilih...</option><option>Milik Sendiri</option><option>Kontrak/Sewa</option><option>Kost</option><option>Menumpang</option></select></div>
        <div><label htmlFor="phone_number">Nomor WhatsApp Aktif *</label><input id="phone_number" name="phone_number" type="tel" required className="input-field" /></div>
      </div>
       <div><label htmlFor="email">Email (Opsional)</label><input id="email" name="email" type="email" className="input-field" /></div>

      {/* --- Bagian C --- */}
      <FormSection title="Bagian C: Berkas Pendukung" description="Unggah foto atau scan KTP dan KK Anda untuk verifikasi." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label htmlFor="ktp_file">Upload Foto/Scan KTP *</label><input id="ktp_file" name="ktp_file" type="file" required accept="image/*,.pdf" className="file-input" /></div>
          <div><label htmlFor="kk_file">Upload Foto/Scan KK *</label><input id="kk_file" name="kk_file" type="file" required accept="image/*,.pdf" className="file-input" /></div>
      </div>

      <div className="pt-6">
        <SubmitButton />
      </div>
    </form>
  )
}