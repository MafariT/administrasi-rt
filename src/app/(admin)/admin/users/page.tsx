'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AdminHeader from '@/components/Admin/AdminHeader'
import FilterControls from '@/components/base/FilterControls'
import AdminWargaActions from '@/components/Admin/AdminWargaActions'
import { WargaProfile } from '@/lib/types'
import { SkeletonRow } from '@/components/base/SkeletonLoader'

export default function UserManagementPage() {
  const [wargaList, setWargaList] = useState<WargaProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const supabase = createClient()

  const fetchWarga = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const statusFilter = searchParams.get('status') || 'terdaftar'
    const searchQuery = searchParams.get('search')

    let query = supabase
      .from('warga')
      .select('id, full_name, nik, status, phone_number, nomor_kk')
      .order('created_at', { ascending: false })

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }
    if (searchQuery) {
      query = query.ilike('full_name', `%${searchQuery}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching warga:', error)
      setError('Gagal memuat data warga.')
    } else {
      setWargaList(data || [])
    }

    setIsLoading(false)
  }, [searchParams, supabase])

  useEffect(() => {
    fetchWarga()
  }, [fetchWarga])

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <AdminHeader
        title="Manajemen Warga"
        description="Lihat, cari, dan kelola data warga yang terdaftar di sistem."
      />
      <FilterControls />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="th-style">Nama Lengkap</th>
              <th className="th-style">NIK</th>
              <th className="th-style">Status</th>
              <th className="th-style">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : error ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-red-500">{error}</td>
              </tr>
            ) : wargaList.length > 0 ? (
              wargaList.map((warga) => (
                <tr key={warga.id} className="hover:bg-gray-50">
                  <td className="td-style font-medium text-gray-900">{warga.full_name}</td>
                  <td className="td-style text-gray-500 font-mono">{warga.nik}</td>
                  <td className="td-style">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        warga.status === 'terdaftar'
                          ? 'bg-green-100 text-green-800'
                          : warga.status === 'pending_verification'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {warga.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="td-style font-medium">
                    <AdminWargaActions
                      warga={warga}
                      onActionComplete={fetchWarga}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                  Tidak ada data warga yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
