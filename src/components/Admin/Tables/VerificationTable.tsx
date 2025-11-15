import { createClient } from '@/lib/supabase/server'
import AdminVerificationActions from '../AdminVerificationActions'
import { TableProps } from '@/lib/types'

export default async function VerificationTable({
  searchQuery,
  currentPage,
  itemsPerPage,
}: TableProps) {
  const supabase = createClient()

  const from = (currentPage - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  let query = supabase
    .from('warga')
    .select('id, full_name, nik, nomor_kk, phone_number')
    .eq('status', 'pending_verification')
    .order('created_at', { ascending: true })
    .range(from, to)

  if (searchQuery) query = query.ilike('full_name', `%${searchQuery}%`)

  const { data: profiles, error } = await query
  if (error) {
    console.error('Error fetching warga:', error)
    return (
      <tr>
        <td colSpan={5} className="py-8 text-center text-red-500">
          Gagal memuat data.
        </td>
      </tr>
    )
  }

  return (
    <>
      {profiles && profiles.length > 0 ? (
        profiles.map((profile) => (
          <tr key={profile.id} className="hover:bg-gray-50">
            <td className="td-style font-medium text-gray-900">
              {profile.full_name}
            </td>
            <td className="td-style text-gray-500">{profile.nik}</td>
            <td className="td-style text-gray-500">{profile.nomor_kk}</td>
            <td className="td-style text-gray-500">{profile.phone_number}</td>
            <td className="td-style font-medium space-x-2">
              <AdminVerificationActions userId={profile.id.toString()} />
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
    </>
  )
}
