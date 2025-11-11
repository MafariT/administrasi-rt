'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserGroupIcon, CheckBadgeIcon, HomeIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline'

const navigationGroups = [
  {
    title: 'Dashboard',
    items: [
      { name: 'Overview', href: '/admin', icon: HomeIcon },
    ]
  },
  {
    title: 'Manajemen Warga',
    items: [
      { name: 'Verifikasi Baru', href: '/admin/verifikasi', icon: CheckBadgeIcon },
      { name: 'Semua Warga', href: '/admin/users?status=all', icon: UserGroupIcon },
    ]
  },
  {
    title: 'Manajemen Surat',
    items: [
      { name: 'Permintaan Baru', href: '/admin/surat', icon: EnvelopeIcon },
      { name: 'Riwayat Surat', href: '/admin/surat/riwayat', icon: ClockIcon },
    ]
  }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
      <h2 className="text-xl font-bold text-primary mb-6">Admin Menu</h2>

      <nav className="space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                        ? 'bg-primary text-white shadow'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                      }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}