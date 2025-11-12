import { Suspense } from 'react';
import AdminHeader from '@/components/Admin/AdminHeader';
import SearchControls from '@/components/base/SearchControls';
import { SkeletonRow } from '@/components/base/SkeletonLoader';
import { VerificationTable } from '@/lib/helper/AdminHelper';

export const dynamic = 'force-dynamic';

export default async function AdminVerificationPage({ searchParams }: {
  searchParams?: Promise<{ search?: string }>
}) {
  const params = await searchParams;
  const searchQuery = params?.search || '';

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <AdminHeader
        title="Verifikasi Warga"
        description="Tinjau dan verifikasi data pendaftar baru."
      />

      <div className="mb-6">
        <SearchControls />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="th-style">Nama Lengkap</th>
              <th className="th-style">NIK</th>
              <th className="th-style">Nomor KK</th>
              <th className="th-style">Telepon</th>
              <th className="th-style">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <Suspense fallback={Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}>
              <VerificationTable searchQuery={searchQuery} />
            </Suspense>
          </tbody>
        </table>
      </div>
    </div>
  );
}