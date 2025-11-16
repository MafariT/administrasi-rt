import { DataTable } from '@/components/base/DataTable';
import { createClient } from '@/lib/supabase/server';
import { SuratRequest } from '@/lib/types';
import { columns } from './columns';

export default async function SuratRequestContent() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('surat_requests')
    .select(
      `id, letter_type, created_at, form_data, warga:warga_id (full_name, nik)`
    )
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) console.error('Error fetching surat requests:', error);
  return (
    <DataTable
      columns={columns}
      data={data as unknown as SuratRequest[]}
      filterColumnId="letter_type"
      filterColumnPlaceholder="Cari jenis surat..."
      statusFilter={false}
    />
  );
}
