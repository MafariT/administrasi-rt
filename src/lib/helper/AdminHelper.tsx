import AdminVerificationActions from '@/components/Admin/AdminVerificationActions';
import AdminWargaActions from '@/components/Admin/AdminWargaActions';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  ClockIcon,
  CheckCircleIcon,
  InboxIcon,
  UserPlusIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { format, subDays, startOfDay, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { SupabaseClient } from '@supabase/supabase-js';
import { WeeklyChart } from '@/components/Admin/Charts/RegistrationChart';
import { Badge } from '@/components/ui/badge';
import { ActivityItem, SuratRequest } from '../types';
import SuratActions from '@/components/Admin/AdminSuratActions';
import HistoryActions from '@/components/Admin/AdminHistoryActions';

interface TableProps {
  statusFilter: string;
  searchQuery: string;
}

const iconMap = {
  'Pendaftaran Baru': UserPlusIcon,
  'Warga Diverifikasi': CheckBadgeIcon,
};

const colorMap = {
  'Pendaftaran Baru': 'bg-yellow-100 text-yellow-700',
  'Warga Diverifikasi': 'bg-green-100 text-green-700',
};

export async function StatCards() {
  const supabase = createClient();

  const [pendingVerificationCount, terdaftarCount, pendingSuratCount] =
    await Promise.all([
      supabase
        .from('warga')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending_verification'),
      supabase
        .from('warga')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'terdaftar'),
      supabase
        .from('surat_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
    ]);

  const stats = [
    {
      title: 'Menunggu Verifikasi',
      value: pendingVerificationCount.count ?? 0,
      icon: ClockIcon,
      href: '/admin/verifikasi',
    },
    {
      title: 'Warga Terdaftar',
      value: terdaftarCount.count ?? 0,
      icon: CheckCircleIcon,
      href: '/admin/users',
    },
    {
      title: 'Surat Baru',
      value: pendingSuratCount.count ?? 0,
      icon: InboxIcon,
      href: '#',
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </>
  );
}

export async function RegistrationChart() {
  const supabase = createClient();

  const chartData = await getWeeklyRegistrationData(supabase as SupabaseClient);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Pendaftar Baru (7 Hari Terakhir)
      </h2>
      <WeeklyChart data={chartData} />
    </div>
  );
}

export async function RecentActivity() {
  const supabase = createClient();
  const activities = await getRecentActivity(supabase);

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500">
        Belum ada aktivitas terbaru.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 h-full">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Aktivitas Terbaru
      </h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          const colors = colorMap[activity.type];
          return (
            <div
              key={`${activity.id}-${index}`}
              className="flex items-center space-x-3"
            >
              <div className={`p-2 rounded-full ${colors}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {activity.type === 'Pendaftaran Baru'
                    ? 'Pendaftar baru:'
                    : 'Warga diverifikasi:'}
                  <span className="font-semibold"> {activity.fullName}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                    locale: id,
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

async function getRecentActivity(
  supabase: SupabaseClient
): Promise<ActivityItem[]> {
  try {
    const { data: newRegistrations, error: regError } = await supabase
      .from('warga')
      .select('id, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (regError) throw regError;

    const { data: newVerifications, error: verError } = await supabase
      .from('warga')
      .select('id, full_name, verified_at')
      .not('verified_at', 'is', null) // Only get rows where verified_at is not null
      .order('verified_at', { ascending: false })
      .limit(5);

    if (verError) throw verError;

    const formattedRegistrations: ActivityItem[] = newRegistrations.map(
      (item) => ({
        id: item.id,
        type: 'Pendaftaran Baru',
        fullName: item.full_name,
        timestamp: item.created_at,
      })
    );

    const formattedVerifications: ActivityItem[] = newVerifications.map(
      (item) => ({
        id: item.id,
        type: 'Warga Diverifikasi',
        fullName: item.full_name,
        timestamp: item.verified_at!,
      })
    );

    const combinedActivities = [
      ...formattedRegistrations,
      ...formattedVerifications,
    ];

    combinedActivities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return combinedActivities.slice(0, 5);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

async function getWeeklyRegistrationData(supabase: SupabaseClient) {
  const today = startOfDay(new Date());
  const days = Array.from({ length: 7 })
    .map((_, i) => subDays(today, i))
    .reverse();

  const promises = days.map((day) =>
    supabase
      .from('warga')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', day.toISOString())
      .lt(
        'created_at',
        new Date(day.getTime() + 24 * 60 * 60 * 1000).toISOString()
      )
  );

  const results = await Promise.all(promises);

  return days.map((day, i) => ({
    name: format(day, 'EEE'),
    pendaftar: results[i].count ?? 0,
  }));
}

function StatCard({
  title,
  value,
  icon: Icon,
  href,
}: {
  title: string;
  value: number;
  icon: any;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block bg-white p-6 rounded-2xl border border-gray-200 hover:border-primary hover:bg-gray-50 transition-all"
    >
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
  );
}
