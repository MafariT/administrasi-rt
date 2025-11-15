import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import AdminHistoryActions from '../AdminHistoryActions'
import { SuratHistoryRequest, TableProps } from '@/lib/types'

export default async function HistoryTable({
  statusFilter,
  searchQuery,
  currentPage,
  itemsPerPage,
}: TableProps) {
  const supabase = createClient()

  const from = (currentPage - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  let query = supabase
    .from('surat_requests')
    .select(
      `id, letter_type, status, unique_number, file_url, warga:warga_id(full_name)`,
    )
    .neq('status', 'pending')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (statusFilter !== 'all') query = query.eq('status', statusFilter)
  if (searchQuery) query = query.ilike('unique_number', `%${searchQuery}%`)

  const { data, error } = await query
  const requests = data as SuratHistoryRequest[] | null
  if (error) {
    return (
      <tr>
        <td colSpan={4} className="py-8 text-center text-red-500">
          Gagal memuat data.
        </td>
      </tr>
    )
  }
  return (
    <>
      {requests && requests.length > 0 ? (
        requests.map((req) => (
          <tr key={req.id} className="hover:bg-gray-50">
            <td className="td-style font-medium text-gray-900">
              {req.warga?.full_name ?? 'N/A'}
            </td>
            <td className="td-style text-gray-700">{req.letter_type}</td>
            <td className="td-style text-gray-500 font-mono text-xs">
              {req.unique_number}
            </td>
            <td className="td-style">
              {req.status === 'selesai' && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-300">
                  Selesai
                </Badge>
              )}

              {req.status === 'ditolak' && (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-300 dark:text-black">
                  Ditolak
                </Badge>
              )}
            </td>
            <td className="td-style">
              <AdminHistoryActions
                status={req.status}
                filePath={req.file_url}
              />
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
            Tidak ada data riwayat yang cocok.
          </td>
        </tr>
      )}
    </>
  )
}
