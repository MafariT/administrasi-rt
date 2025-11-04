import AdminVerificationActions from '@/components/AdminVerificationActions';
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers' // We need to import cookies

export const dynamic = 'force-dynamic';

export default async function AdminVerificationPage() { // Renamed for clarity
  const supabase = createClient() // Pass cookieStore to the client

  // --- UPDATE THE SELECT STATEMENT ---
  const { data: profiles, error } = await supabase
    .from('warga')
    .select('*') 
    .eq('status', 'pending_verification')

  if (error) {
    console.error('Error fetching profiles:', error)
  }
  
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Verifikasi Warga Baru</h1>
        <p className="mt-2 text-gray-600">
          Tinjau dan verifikasi data pendaftar baru.
        </p>
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
                    {/* The userId is now a number (bigint), so we convert it to string */}
                    <AdminVerificationActions userId={profile.id.toString()} />
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