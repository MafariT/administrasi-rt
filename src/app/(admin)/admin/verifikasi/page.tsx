import AdminHeader from '@/components/Admin/AdminHeader'
import AdminVerificationActions from '@/components/Admin/AdminVerificationActions'
import SearchControls from '@/components/base/SearchControls'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminVerificationPage({ searchParams }: {
  searchParams: Promise<{ search?: string }>
}) {
  const supabase = createClient();
  const params = await searchParams;

  const searchQuery = params?.search ?? '';

  let query = supabase
    .from('warga')
    .select('*')
    .eq('status', 'pending_verification')

  if (searchQuery) {
    query = query.ilike('full_name', `%${searchQuery}%`);
  }

  const { data: profiles, error } = await query;
  if (error) console.error('Error fetching warga:', error);


  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <AdminHeader
        title="Verifikasi Warga"
        description="Tinjau dan verifikasi data pendaftar baru."
      />

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
            {profiles && profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="td-style font-medium text-gray-900">{profile.full_name}</td>
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
                <td colSpan={5} className="py-4 px-4 text-center text-sm text-gray-500">
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
