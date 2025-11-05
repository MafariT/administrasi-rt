import Link from 'next/link'
import Image from 'next/image'
import Dropdown from './base/Dropdown'
import { FaFacebook, FaWhatsapp } from 'react-icons/fa'
import { DropdownItem } from '@/lib/types'

export default function PublicNavbar() {
  const layananLinks: DropdownItem[] = [
    { name: 'Daftar Sebagai Warga', href: '/daftar' },
    { name: 'Ajukan Surat', href: '/surat' },
  ]

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6">
        {/* Top Tier */}
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-14 w-14">
              <Image src="/img/logo.svg" alt="Logo RT" fill style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <div className="text-xl font-bold leading-tight">Sistem Pengajuan Surat Pengantar</div>
              <div className="text-sm text-gray-200">RT 012 Puri Kemajuan</div>
            </div>
          </Link>
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm">Hubungi kami</span>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300"><FaFacebook size={22} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300"><FaWhatsapp size={22} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Tier (Sub-Navigation) */}
        <div className="flex justify-center items-center space-x-8 py-2 border-t border-white/20">
          <Link href="/" className="text-sm font-medium text-white hover:text-gray-200 transition-colors">
            Beranda
          </Link>

          <Dropdown title="Layanan" items={layananLinks} />

          <Link href="/bantuan" className="text-sm font-medium text-white hover:text-gray-200 transition-colors">
            Pusat Bantuan
          </Link>
        </div>
      </div>
    </header>
  )
}