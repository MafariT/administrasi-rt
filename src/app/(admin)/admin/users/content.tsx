import { createClient } from '@/lib/supabase/server';
import { columns } from './columns';
import { DataTable } from '@/components/base/DataTable';

export default async function UserManagementContent() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('warga')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching data for table:', error.message);
    return (
      <div className="text-red-500 text-center py-8">Gagal memuat data.</div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumnId="full_name"
      filterColumnPlaceholder="Cari nama warga..."
      statusFilter={true}
      statuses={[
        { value: 'terdaftar', label: 'Terdaftar' },
        { value: 'pending_verification', label: 'Pending' },
        { value: 'ditolak', label: 'Ditolak' },
      ]}
    />
  );
}
