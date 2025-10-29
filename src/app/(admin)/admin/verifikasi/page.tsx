import AdminVerificationActions from '@/components/AdminVerificationActions';
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = createClient()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, nik, nomor_kk, phone_number')
    .eq('profile_status', 'submitted')

  if (error) {
    console.error('Error fetching profiles:', error)
  }
  
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Verifikasi profil pengguna baru
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor KK</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {profiles && profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{profile.full_name}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{profile.nik}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{profile.nomor_kk}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{profile.phone_number}</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <AdminVerificationActions userId={profile.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-sm text-gray-500">Tidak ada profil baru yang perlu diverifikasi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}