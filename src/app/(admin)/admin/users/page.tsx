import { createClient } from '@/lib/supabase/server'
import AdminWargaActions from '@/components/AdminWargaActions'

export const dynamic = 'force-dynamic';

// The page now accepts search parameters for filtering
export default async function UserManagementPage({ searchParams }: { searchParams: { status: string } }) {
  const supabase = createClient()

  const statusFilter = searchParams.status || 'terdaftar' // Default to showing 'terdaftar' users

  let query = supabase
    .from('warga')
    .select('id, full_name, nik, status, phone_number, nomor_kk')
    .order('created_at', { ascending: false });

  // Apply filter if it's not 'all'
  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  const { data: wargaList, error } = await query;
  if (error) console.error('Error fetching warga:', error)

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Warga</h1>
        {/* Add filtering UI here in the future */}
      </div>
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
            {wargaList?.map((warga) => (
              <tr key={warga.id}>
                <td className="td-style font-medium text-gray-900">{warga.full_name}</td>
                <td className="td-style text-gray-500">{warga.nik}</td>
                <td className="td-style">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    warga.status === 'terdaftar' ? 'bg-green-100 text-green-800' :
                    warga.status === 'pending_verification' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {warga.status}
                  </span>
                </td>
                <td className="td-style font-medium">
                  <AdminWargaActions warga={warga} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}