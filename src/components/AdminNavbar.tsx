import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'
import Image from 'next/image'

export default async function AdminNavbar() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="relative h-14 w-14">
            <Image src="/img/logo.svg" alt="Logo RT" fill style={{ objectFit: 'contain' }} />
          </div>
          <span className="text-xl font-bold">Sistem Pengajuan Surat Pengantar</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-white hidden sm:block text-sm">{user?.email}</span>
          <LogoutButton />
        </div>
      </nav>
    </header>
  )
}