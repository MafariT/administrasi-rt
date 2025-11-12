import { Suspense } from 'react';
import { SkeletonStatCard, SkeletonChart } from '@/components/base/SkeletonLoader';
import { RegistrationChart, StatCards } from '@/lib/helper/AdminHelper';
import AdminHeader from '@/components/Admin/AdminHeader';

export default function AdminOverviewPage() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg space-y-8">
      <AdminHeader
        title="Admin Overview"
        description="Ringkasan status sistem saat ini."
      />

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

      <Suspense fallback={<SkeletonChart />}>
        <RegistrationChart />
      </Suspense>
    </div>
  );
}