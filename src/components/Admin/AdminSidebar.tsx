'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UserGroupIcon,
  CheckBadgeIcon,
  HomeIcon,
  EnvelopeIcon,
  XMarkIcon,
  ClockIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navigationGroups = [
  {
    title: 'Dashboard',
    items: [{ name: 'Overview', href: '/admin', icon: HomeIcon }],
  },
  {
    title: 'Manajemen Warga',
    items: [
      {
        name: 'Verifikasi Baru',
        href: '/admin/verifikasi',
        icon: CheckBadgeIcon,
      },
      {
        name: 'Semua Warga',
        href: '/admin/users',
        icon: UserGroupIcon,
      },
    ],
  },
  {
    title: 'Manajemen Surat',
    items: [
      {
        name: 'Permintaan Baru',
        href: '/admin/surat',
        icon: EnvelopeIcon,
      },
      {
        name: 'Riwayat Surat',
        href: '/admin/surat/riwayat',
        icon: ClockIcon,
      },
    ],
  },
  {
    title: 'Sistem',
    items: [
      { name: 'Pengaturan', href: '/admin/pengaturan', icon: Cog6ToothIcon },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-bold text-primary">Admin Menu</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1 rounded-full hover:bg-gray-100"
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      <nav className="p-4 space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-3 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary text-white shadow'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
