import Link from 'next/link'
import LogoutButton from './LogoutButton'
import { createClient } from '@/lib/supabase/server'

export default async function Navbar() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-gray-800 hover:text-blue-600">
          RT Online
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 hidden sm:block">{user?.email}</span>
          <LogoutButton />
        </div>
      </nav>
    </header>
  )
}