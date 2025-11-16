import { Suspense } from 'react';
import UserManagementContent from './content';
import { columns } from './columns';
import { DataTableSkeleton } from '@/components/base/SkeletonLoader';

export default function UserManagementPage() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Warga</h1>
        <p className="mt-2 text-gray-600">
          Lihat, cari, dan kelola data warga yang terdaftar di sistem
        </p>
      </div>
      <Suspense fallback={<DataTableSkeleton columnCount={columns.length} />}>
        <UserManagementContent />
      </Suspense>
    </div>
  );
}
