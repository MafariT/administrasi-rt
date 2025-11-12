import { Suspense } from 'react';
import AdminHeader from '@/components/Admin/AdminHeader';
import FilterControls from '@/components/base/FilterControls';
import { SkeletonRow } from '@/components/base/SkeletonLoader';
import { UserManagementTable } from '@/lib/helper/AdminHelper';

export const dynamic = 'force-dynamic';

export default async function UserManagementPage({ searchParams }: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params?.status ?? 'all';
  const searchQuery = params?.search ?? '';

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <AdminHeader
        title="Manajemen Warga"
        description="Lihat, cari, dan kelola data warga yang terdaftar di sistem."
      />
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
            <Suspense fallback={Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}>
              <UserManagementTable
                statusFilter={statusFilter}
                searchQuery={searchQuery}
              />
            </Suspense>
          </tbody>
        </table>
      </div>
    </div>
  );
}
