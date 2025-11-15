import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { SuratRequest, TableProps } from '@/lib/types';
import AdminSuratActions from '../AdminSuratActions';

export default async function SuratRequestTable({
  searchQuery,
  currentPage,
  itemsPerPage,
}: TableProps) {
  const supabase = createClient();

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let query = supabase
    .from('surat_requests')
    .select(
      `id, letter_type, created_at, form_data, warga:warga_id (full_name, nik)`
    )
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .range(from, to);

  if (searchQuery) {
    query = query.ilike('letter_type', `%${searchQuery}%`);
  }

  const { data, error } = await query;
  const requests = data as SuratRequest[] | null;

  if (error) {
    return (
      <tr>
        <td colSpan={4} className="py-8 text-center text-red-500">
          Gagal memuat data.
        </td>
      </tr>
    );
  }

  return (
    <>
      {requests && requests.length > 0 ? (
        requests.map((request) => (
          <tr key={request.id} className="hover:bg-gray-50">
            <td className="td-style">
              <div className="font-medium text-gray-900">
                {request.warga?.full_name || 'N/A'}
              </div>
              <div className="text-gray-500 text-xs font-mono">
                {request.warga?.nik || 'N/A'}
              </div>
            </td>
            <td className="td-style text-gray-700">{request.letter_type}</td>
            <td className="td-style text-gray-500 text-sm">
              {format(new Date(request.created_at), 'd MMM yyyy, HH:mm', {
                locale: id,
              })}
            </td>
            <td className="td-style font-medium">
              <AdminSuratActions request={request as SuratRequest} />
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
            Tidak ada permintaan surat baru.
          </td>
        </tr>
      )}
    </>
  );
}
