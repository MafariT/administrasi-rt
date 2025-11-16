import { createClient } from '@/lib/supabase/server';
import { columns } from './columns';
import { DataTable } from '@/components/base/DataTable';

export default async function VerificationContent({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const supabase = createClient();

  let query = supabase
    .from('warga')
    .select('*')
    .eq('status', 'pending_verification')
    .order('created_at', { ascending: true });

  if (searchQuery) {
    query = query.ilike('full_name', `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching verification data:', error.message);
    return (
      <div className="text-red-500 text-center py-8">
        Gagal memuat data verifikasi.
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumnId="full_name"
      filterColumnPlaceholder="Cari nama pendaftar..."
      statusFilter={false}
    />
  );
}
