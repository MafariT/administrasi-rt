import { createClient } from '@/lib/supabase/server'
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="mt-4 text-gray-600">
        Selamat datang kembali, <span className="font-semibold">{user?.email}</span>!
      </p>
      <div className="mt-6 border-t pt-6 grid gap-4 sm:grid-cols-2">
         <Link 
            href="/surat" 
            className="block p-6 text-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <h2 className="text-xl font-bold">Buat Surat Baru</h2>
            <p className="mt-1">Ajukan surat pengantar secara online.</p>
          </Link>
          <Link 
            href="/surat/riwayat" 
            className="block p-6 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <h2 className="text-xl font-bold">Riwayat Surat</h2>
            <p className="mt-1">Lihat status pengajuan surat Anda.</p>
          </Link>
      </div>
    </div>
  )
}