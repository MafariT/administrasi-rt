import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/base/SkeletonLoader';
import HistoryContent from './content';
import { columns } from '../columns';

export default async function AdminSuratPage() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Riwayat Surat</h1>
        <p className="mt-2 text-gray-600">Daftar surat yang telah selesai di proses</p>
      </div>
      <Suspense fallback={<DataTableSkeleton columnCount={columns.length} />}>
        <HistoryContent />
      </Suspense>
    </div>
  );
}
