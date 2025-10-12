import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const redirectRules = {
  protected: ['/dashboard', '/surat'],  // requires auth
  public: ['/login'],                   // should NOT be visible when logged in
  defaultRedirect: '/dashboard',        // where to send logged in users
  loginRedirect: '/login',              // where to send guests
}

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(({ name, value }) => ({ name, value }))
        }
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    return NextResponse.redirect(url)
  }

  // unauthenticated user visiting protected route
  if (!session && redirectRules.protected.some(p => pathname.startsWith(p)))
    return redirectTo(redirectRules.loginRedirect)

  // authenticated user visiting public route
  if (session && redirectRules.public.includes(pathname))
    return redirectTo(redirectRules.defaultRedirect)

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/surat/:path*', '/login'],
}
