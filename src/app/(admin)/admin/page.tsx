import { Suspense } from 'react';
import { SkeletonStatCard, SkeletonChart } from '@/components/base/SkeletonLoader';
import { UserGroupIcon } from '@heroicons/react/24/outline'; // Example icon
import { RegistrationChart, StatCards } from '@/lib/helper/AdminHelper';

export default function AdminOverviewPage() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg space-y-8">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Overview</h1>
        <p className="mt-2 text-gray-600">Admin Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={
          <>
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </>
        }>
          <StatCards />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg h-full">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Aktivitas Terbaru</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <UserGroupIcon className="h-5 w-5 text-yellow-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Pendaftar baru menunggu verifikasi</p>
                  <p className="text-xs text-gray-500">John Doe</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <UserGroupIcon className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Warga baru diverifikasi</p>
                  <p className="text-xs text-gray-500">Jane Smith</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Suspense fallback={<SkeletonChart />}>
            <RegistrationChart />
          </Suspense>
        </div>


      </div>
    </div>
  );
}