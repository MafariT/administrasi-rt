import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function StatusBanner() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('profile_status')
    .single()

  let bannerContent = null
  if (profile && profile.profile_status !== 'verified') {
    switch (profile.profile_status) {
      // case 'pending':
      case 'submitted':
        bannerContent = (
          <div className="bg-amber-100 border-t border-b border-amber-200">
            <div className="container mx-auto px-6 py-3 text-center text-sm">
              <span className="bg-amber-400 text-white font-bold text-xs py-1 px-3 rounded-full mr-3">Penting</span>
              <span className="text-amber-800">
                Akun anda belum terverifikasi, silakan ikuti{' '}
                <Link href="/bantuan/" className="font-semibold underline hover:text-amber-900">
                  prosedur verifikasi
                </Link>
              </span>
            </div>
          </div>
        )
        break
      default:
        bannerContent = null
    }
  }

  return bannerContent
}