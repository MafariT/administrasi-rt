import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import UserMenu from './UserMenu'
import { FaFacebook, FaWhatsapp } from 'react-icons/fa'

export default async function Navbar() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const publicNavLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/tentang' },
    { name: 'Pusat Bantuan', href: '/bantuan' },
    { name: 'Kontak Kami', href: '/kontak' },
  ]
  
  const userNavLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Buat Surat', href: '/surat' },
    { name: 'Riwayat Surat', href: '/surat/riwayat' },
    { name: 'Pusat Bantuan', href: '/bantuan' },
  ]

  const navLinks = user ? userNavLinks : publicNavLinks;

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-3">
            <div className="relative h-12 w-12">
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
            {user ? (
              <UserMenu user={user} />
            ) : (
              <Link href="/login" className="px-6 py-2 font-semibold text-primary bg-white rounded-full hover:bg-gray-200 transition-colors text-sm">
                Masuk
              </Link>
            )}
          </div>
        </div>

        {/* SUB-NAVIGATION */}
        <div className="flex justify-center items-center space-x-8 py-2">
          {navLinks.map(link => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-white hover:text-gray-200 transition-colors">
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}