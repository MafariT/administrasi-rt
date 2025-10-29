import AdminUsersActions from '@/components/AdminUsersActions';
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic';

export default async function UserManagementPage() {
  const supabase = createClient()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, profile_status')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching profiles:', error)

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Warga</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Nama Lengkap</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {profiles?.map((profile) => (
              <tr key={profile.id}>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{profile.full_name}</td>
                <td className="py-4 px-4 text-sm text-gray-500">{profile.role}</td>
                <td className="py-4 px-4 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    profile.profile_status === 'verified' ? 'bg-green-100 text-green-800' :
                    profile.profile_status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.profile_status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm font-medium space-x-2">
                    <AdminUsersActions userId={profile.id} /> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}