import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ClockIcon, CheckCircleIcon, InboxIcon } from '@heroicons/react/24/outline'
import { format, subDays, startOfDay } from 'date-fns'
import WeeklyChart from '@/components/Admin/Charts/WeeklyChart';

function StatCard({ title, value, icon: Icon, href }: { title: string, value: number, icon: any, href: string }) {
  return (
    <Link href={href} className="group block bg-white p-6 rounded-2xl border border-gray-200 hover:border-primary hover:bg-gray-50 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 rounded-lg group-hover:bg-primary">
          <Icon className="h-6 w-6 text-gray-600 group-hover:text-white" />
        </div>
      </div>
    </Link>
  )
}

async function getWeeklyRegistrationData(supabase: any) {
  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 }).map((_, i) => subDays(today, i)).reverse();

  const promises = days.map(day =>
    supabase
      .from('warga')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', day.toISOString())
      .lt('created_at', new Date(day.getTime() + 24 * 60 * 60 * 1000).toISOString())
  );

  const results = await Promise.all(promises);

  return days.map((day, i) => ({
    name: format(day, 'EEE'),
    pendaftar: results[i].count ?? 0,
  }));
}

export default async function AdminOverviewPage() {
  const supabase = createClient()

  const [
    pendingVerificationCount,
    terdaftarCount,
    pendingSuratCount,
    chartData,
  ] = await Promise.all([
    supabase.from('warga').select('id', { count: 'exact', head: true }).eq('status', 'pending_verification'),
    supabase.from('warga').select('id', { count: 'exact', head: true }).eq('status', 'terdaftar'),
    supabase.from('surat_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    getWeeklyRegistrationData(supabase)
  ]);

  const stats = [
    { title: 'Menunggu Verifikasi', value: pendingVerificationCount.count ?? 0, icon: ClockIcon, href: '/admin/verifikasi' },
    { title: 'Warga Terdaftar', value: terdaftarCount.count ?? 0, icon: CheckCircleIcon, href: '/admin/users' },
    { title: 'Surat Baru', value: pendingSuratCount.count ?? 0, icon: InboxIcon, href: '#' },
  ]

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Overview</h1>
          <p className="mt-2 text-gray-600">Ringkasan status sistem saat ini.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map(stat => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Pendaftar Baru (7 Hari Terakhir)</h2>
          <WeeklyChart data={chartData} />
        </div>
      </div>
    </div>
  )
}