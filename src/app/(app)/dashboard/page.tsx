import { createClient } from '@/lib/supabase/server'
import Link from 'next/link';
import { DocumentPlusIcon, ClockIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const actions = [
    {
      title: 'Buat Surat Baru',
      description: 'Ajukan surat pengantar secara online.',
      href: '/surat',
      icon: DocumentPlusIcon,
    },
    {
      title: 'Riwayat Pengajuan',
      description: 'Lihat status dan riwayat surat Anda.',
      href: '/surat/riwayat',
      icon: ClockIcon,
    }
  ]

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      
      {/* Card Header */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Selamat datang kembali, <span className="font-semibold text-primary">{user?.email}</span>!
        </p>
      </div>

      {/* Card Body - Main Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Menu Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Link 
              key={action.title}
              href={action.href} 
              className="group flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all"
            >
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 rounded-lg group-hover:bg-primary">
                <action.icon className="h-6 w-6 text-gray-600 group-hover:text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}