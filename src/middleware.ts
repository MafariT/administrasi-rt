import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const redirectRules = {
  protected: ['/admin', '/dashboard', '/surat'], // requires auth
  auth: ['/login', '/register'],     // should NOT be visible when logged in
  defaultRedirect: '/dashboard',
  loginRedirect: '/login',
  profileCompletion: '/profile',
  admin: ['/admin']
}

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll().map(({ name, value }) => ({ name, value })),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    return NextResponse.redirect(url)
  }

  // Not logged in -> block protected routes
  if (!user && redirectRules.protected.some(p => pathname.startsWith(p)))
    return redirectTo(redirectRules.loginRedirect)

  if (user) {
    // Logged in -> block auth routes
    if (redirectRules.auth.includes(pathname))
      return redirectTo(redirectRules.defaultRedirect)

    const { data: profile } = await supabase
      .from('profiles')
      .select('profile_status')
      .single()

    const verified = profile?.profile_status === 'verified'
    const onProfilePage = pathname.startsWith(redirectRules.profileCompletion)
    const onProtectedPage = redirectRules.protected.some(p => pathname.startsWith(p))
    const onAdminPage = redirectRules.admin.some(p => pathname.startsWith(p))

    if (!verified && onProtectedPage && !onProfilePage)
      return redirectTo(redirectRules.profileCompletion)

    if (verified && onProfilePage)
      return redirectTo(redirectRules.defaultRedirect)

    if (user.user_metadata.role !== "admin" && onAdminPage) {
      return redirectTo(redirectRules.defaultRedirect)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/surat/:path*', '/login', '/register', '/admin/:path*'],
}
