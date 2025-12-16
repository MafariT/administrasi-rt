import { DataTable } from '@/components/base/DataTable';
import { createClient } from '@/lib/supabase/server';
import { SuratRequest } from '@/lib/types';
import { columns } from './columns';

export default async function HistoryContent() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('surat_requests')
    .select(`*, warga:warga_id(full_name)`)
    .neq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching history:', error);
  return (
    <DataTable
      columns={columns}
      data={data as unknown as SuratRequest[]}
      filterColumnId="warga"
      filterColumnPlaceholder="Cari nama pemohon..."
      statusFilter={true}
      statuses={[
        { value: 'selesai', label: 'Selesai' },
        { value: 'ditolak', label: 'Ditolak' },
      ]}
    />
  );
}
