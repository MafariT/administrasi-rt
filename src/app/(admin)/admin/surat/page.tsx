import { Suspense } from 'react';
import { columns } from './columns';
import { DataTableSkeleton } from '@/components/base/SkeletonLoader';
import SuratRequestContent from './content';

export default async function AdminSuratPage() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">TITLE</h1>
        <p className="mt-2 text-gray-600">DESC</p>
      </div>
      <Suspense fallback={<DataTableSkeleton columnCount={columns.length} />}>
        <SuratRequestContent />
      </Suspense>
    </div>
  );
}
