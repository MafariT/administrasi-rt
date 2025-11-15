import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import FilterControls from '@/components/base/FilterControls';
import PaginationControls from '@/components/base/PaginationControls';
import { SkeletonRow } from '@/components/base/SkeletonLoader';
import UserManagementTable from '@/components/Admin/Tables/UserManagementTable';

export const dynamic = 'force-dynamic';
const ITEMS_PER_PAGE = 10;

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams?: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const statusFilter = params?.status || 'all';
  const searchQuery = params?.search || '';
  const currentPage = Number(params?.page) || 1;

  const supabase = createClient();
  let countQuery = supabase
    .from('warga')
    .select('id', { count: 'exact', head: true });
  if (statusFilter !== 'all')
    countQuery = countQuery.eq('status', statusFilter);
  if (searchQuery)
    countQuery = countQuery.ilike('full_name', `%${searchQuery}%`);
  const { count } = await countQuery;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Warga</h1>
        <p className="mt-2 text-gray-600">
          Lihat, cari, dan kelola data warga yang terdaftar di sistem.
        </p>
      </div>
      <FilterControls />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="th-style">Nama Lengkap</th>
              <th className="th-style">NIK</th>
              <th className="th-style">Status</th>
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
              <UserManagementTable
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
  );
}
