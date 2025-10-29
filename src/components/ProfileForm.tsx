'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function ProfileForm({ user }: { user: User }) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('')
  const [nik, setNik] = useState('')
  const [nomorKk, setNomorKk] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, nik, nomor_kk, phone_number`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setFullName(data.full_name || '')
        setNik(data.nik || '')
        setNomorKk(data.nomor_kk || '')
        setPhoneNumber(data.phone_number || '')
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName,
        nik,
        nomor_kk: nomorKk,
        phone_number: phoneNumber,
        profile_status: 'submitted',
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profil berhasil disimpan! Menunggu verifikasi dari Admin.')
      router.refresh()
    } catch (error) {
      alert('Error updating data...')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="text-center border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lengkapi Profil Anda</h1>
        <p className="mt-2 text-gray-600">
          Data Anda diperlukan untuk proses pembuatan surat pengantar.
        </p>
      </div>
      <form onSubmit={updateProfile} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Alamat Email</label>
          <input type="text" value={user.email} disabled className="w-full px-4 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="fullName" className="text-sm font-medium text-gray-600">Nama Lengkap (Sesuai KTP)</label>
          <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="nik" className="text-sm font-medium text-gray-600">Nomor Induk Kependudukan (NIK)</label>
          <input id="nik" type="text" value={nik} onChange={(e) => setNik(e.target.value)} required className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="nomorKk" className="text-sm font-medium text-gray-600">Nomor Kartu Keluarga (KK)</label>
          <input id="nomorKk" type="text" value={nomorKk} onChange={(e) => setNomorKk(e.target.value)} required className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-600">Nomor Telepon / WhatsApp</label>
          <input id="phoneNumber" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <button type="submit" disabled={loading} className="w-full px-4 py-3 font-bold text-white bg-primary rounded-lg hover:bg-primary-dark disabled:bg-gray-400">
            {loading ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </div>
      </form>
    </div>
  )
}