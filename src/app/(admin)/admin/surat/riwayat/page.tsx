import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import HistoryFilterControls from '@/components/base/HistoryFilterControls'
import PaginationControls from '@/components/base/PaginationControls'
import { SkeletonRow } from '@/components/base/SkeletonLoader'
import HistoryTable from '@/components/Admin/Tables/HistoryTable'

export const dynamic = 'force-dynamic'
const ITEMS_PER_PAGE = 10

export default async function SuratHistoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; search?: string; page?: string }>
}) {
  const params = await searchParams
  const statusFilter = params?.status || 'all'
  const searchQuery = params?.search || ''
  const currentPage = Number(params?.page) || 1

  const supabase = createClient()
  let countQuery = supabase
    .from('surat_requests')
    .select('id', { count: 'exact', head: true })
    .neq('status', 'pending')
  if (statusFilter !== 'all') countQuery = countQuery.eq('status', statusFilter)
  if (searchQuery)
    countQuery = countQuery.ilike('letter_type', `%${searchQuery}%`)
  const { count } = await countQuery

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Riwayat Surat</h1>
        <p className="mt-2 text-gray-600">....</p>
      </div>
      <HistoryFilterControls />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="th-style">Pemohon</th>
              <th className="th-style">Jenis Surat</th>
              <th className="th-style">Nomor Surat</th>
              <th className="th-style">Status Final</th>
              <th className="th-style">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <Suspense
              key={statusFilter + searchQuery + currentPage}
              fallback={
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              }
            >
              <HistoryTable
                statusFilter={statusFilter}
                searchQuery={searchQuery}
                currentPage={currentPage}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </Suspense>
          </tbody>
        </table>
      </div>
      <PaginationControls
        totalCount={count ?? 0}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  )
}
