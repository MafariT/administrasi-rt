'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AdminHeader from '@/components/Admin/AdminHeader'
import AdminVerificationActions from '@/components/Admin/AdminVerificationActions'
import SearchControls from '@/components/base/SearchControls'
import { SkeletonRow } from '@/components/base/SkeletonLoader'
import { WargaProfile } from '@/lib/types'

export default function UserVerificationPageContent() {
  const [profiles, setProfiles] = useState<WargaProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const supabase = createClient()

  const fetchWarga = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const searchQuery = searchParams.get('search')
    let query = supabase.from('warga').select('*').eq('status', 'pending_verification')

    if (searchQuery) query = query.ilike('full_name', `%${searchQuery}%`)

    const { data, error } = await query
    if (error) {
      console.error('Error fetching warga:', error)
      setError('Gagal memuat data.')
    } else {
      setProfiles(data || [])
    }
    setIsLoading(false)
  }, [searchParams, supabase])

  useEffect(() => {
    fetchWarga()
  }, [fetchWarga])

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <AdminHeader title="Verifikasi Warga" description="Tinjau dan verifikasi data pendaftar baru." />
      <div className="mb-6">
        <SearchControls />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="th-style">Nama Lengkap</th>
              <th className="th-style">NIK</th>
              <th className="th-style">Nomor KK</th>
              <th className="th-style">Telepon</th>
              <th className="th-style">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
            ) : error ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="td-style font-medium text-gray-900">{profile.full_name}</td>
                  <td className="td-style text-gray-500">{profile.nik}</td>
                  <td className="td-style text-gray-500">{profile.nomor_kk}</td>
                  <td className="td-style text-gray-500">{profile.phone_number}</td>
                  <td className="td-style font-medium space-x-2">
                    <AdminVerificationActions
                      userId={profile.id.toString()}
                      onActionComplete={fetchWarga}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                  Tidak ada profil baru yang perlu diverifikasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
