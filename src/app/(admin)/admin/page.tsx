import { Suspense } from 'react'
import {
  SkeletonStatCard,
  SkeletonChart,
  SkeletonActivityItem,
} from '@/components/base/SkeletonLoader'
import {
  RecentActivity,
  RegistrationChart,
  StatCards,
} from '@/lib/helper/AdminHelper'

export default function AdminOverviewPage() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg space-y-8">
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Overview</h1>
        <p className="mt-2 text-gray-600">Admin Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense
          fallback={
            <>
              <SkeletonStatCard />
              <SkeletonStatCard />
              <SkeletonStatCard />
            </>
          }
        >
          <StatCards />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<SkeletonActivityItem />}>
            <RecentActivity />
          </Suspense>
        </div>

        <div className="lg:col-span-1">
          <Suspense fallback={<SkeletonChart />}>
            <RegistrationChart />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
