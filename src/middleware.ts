import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const redirectRules = {
  protected: ['/dashboard', '/surat'], // requires auth
  auth: ['/login', '/register'],       // should NOT be visible when logged in
  defaultRedirect: '/dashboard',
  loginRedirect: '/login',
  profileCompletion: '/profile',
  admin: '/admin',
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

  const isProtected = redirectRules.protected.some(p => pathname.startsWith(p))
  const isAuthPage = redirectRules.auth.includes(pathname)
  const isAdminPage = pathname.startsWith(redirectRules.admin)
  const isProfilePage = pathname.startsWith(redirectRules.profileCompletion)

  // Not logged in -> block protected and admin routes
  if (!user && (isProtected || isAdminPage)) {
    return redirectTo(redirectRules.loginRedirect)
  }

  if (user) {
    const role = user.user_metadata?.role ?? 'user'

    // Logged in -> block auth
    if (isAuthPage) {
      return redirectTo(redirectRules.defaultRedirect)
    }

    if (role !== 'admin') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('profile_status')
        .eq('id', user.id)
        .single()

      const verified = profile?.profile_status === 'verified'

      if (!verified && isProtected && !isProfilePage)
        return redirectTo(redirectRules.profileCompletion)

      // if (verified && isProfilePage)
      //   return redirectTo(redirectRules.defaultRedirect)

      if (isAdminPage)
        return redirectTo(redirectRules.defaultRedirect)
    }

    // Admin user -> force to stay on /admin/*
    if (role === 'admin' && !isAdminPage) {
      return redirectTo(redirectRules.admin)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/surat/:path*',
    '/login',
    '/register',
    '/profile/:path*',
    '/admin/:path*',
  ],
}
