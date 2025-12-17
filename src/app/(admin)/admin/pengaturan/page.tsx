import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import AdminHeader from '@/components/Admin/AdminHeader';
import AdminList from '@/components/Admin/AdminList';

export default async function SettingsPage() {
  const supabase = createClient();

  const { data: admins } = await supabase.from('profiles').select('*');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Pengaturan</h1>
        <p className="mt-2 text-gray-600">
          Kelola akun admin dan pengaturan sistem lainnya
        </p>
      </div>

      <div className="mt-8 max-w-3xl">
        <AdminList admins={admins || []} currentUserId={user?.id || ''} />
      </div>
    </div>
  );
}
