'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserGroupIcon, CheckBadgeIcon, HomeIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Overview', href: '/admin', icon: HomeIcon },
  { name: 'Verifikasi Warga', href: '/admin/verifikasi', icon: CheckBadgeIcon },
  { name: 'Manajemen Warga', href: '/admin/users', icon: UserGroupIcon },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
      <h2 className="text-xl font-bold text-primary mb-6">Admin Menu</h2>
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}