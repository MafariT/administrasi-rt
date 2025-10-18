import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { FaFacebook, FaWhatsapp } from 'react-icons/fa'
import LogoutButton from './LogoutButton'

export default async function Navbar() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12">
            <Image
              src="/img/logo.svg"
              alt="Logo RT"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold leading-tight">
              Sistem Pengajuan Surat Pengantar
            </div>
            <div className="text-xs sm:text-sm text-gray-200">RT 012 Puri Kemajuan</div>
          </div>
        </Link>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {session ? (
            // Logged-in View
            <>
              <span className="text-gray-200 hidden sm:block text-sm">
                {session.user.email}
              </span>
              <LogoutButton />
            </>
          ) : (
            // Logged-out View
            <>
              <div className="hidden md:flex items-center space-x-4">
                 <span className="text-sm">Hubungi kami</span>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                    <FaFacebook size={22} />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                    <FaWhatsapp size={22} />
                  </a>
              </div>
              <Link
                href="/login"
                className="px-5 py-2 font-semibold text-primary bg-white rounded-md hover:bg-gray-200 transition-colors text-sm"
              >
                Masuk
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}