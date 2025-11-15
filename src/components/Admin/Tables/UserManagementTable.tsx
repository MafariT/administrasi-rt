import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import AdminWargaActions from '../AdminWargaActions';
import { TableProps } from '@/lib/types';

export default async function UserManagementTable({
  statusFilter,
  searchQuery,
  currentPage,
  itemsPerPage,
}: TableProps) {
  const supabase = createClient();

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let query = supabase
    .from('warga')
    .select('id, full_name, nik, status, phone_number, nomor_kk')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (statusFilter !== 'all') query = query.eq('status', statusFilter);
  if (searchQuery) query = query.ilike('full_name', `%${searchQuery}%`);

  const { data: wargaList, error } = await query;

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
      {wargaList && wargaList.length > 0 ? (
        wargaList.map((warga) => (
          <tr key={warga.id} className="hover:bg-gray-50">
            <td className="td-style font-medium text-gray-900">
              {warga.full_name}
            </td>
            <td className="td-style text-gray-500 font-mono">{warga.nik}</td>
            <td className="td-style">
              {warga.status === 'terdaftar' && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-300">
                  Terdaftar
                </Badge>
              )}

              {warga.status === 'pending_verification' && (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-300 dark:text-black">
                  Pending
                </Badge>
              )}

              {warga.status === 'ditolak' && (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-300 dark:text-black">
                  Ditolak
                </Badge>
              )}
            </td>
            <td className="td-style font-medium">
              <AdminWargaActions warga={warga} />
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
            Tidak ada data warga yang cocok.
          </td>
        </tr>
      )}
    </>
  );
}
