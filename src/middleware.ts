import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './lib/supabase/server'

const redirectRules = {
  protected: ['/admin'], 
  auth: ['/login', '/register'],       // should NOT be visible when logged in
  defaultRedirect: '/admin',
}

export async function middleware(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    return NextResponse.redirect(url)
  }

  const isProtected = redirectRules.protected.some(p => pathname.startsWith(p))
  const isAuthPage = redirectRules.auth.includes(pathname)

  if (!user && (isProtected)) {
    return redirectTo('/')
  }

  if (user && isAuthPage) {
    return redirectTo(redirectRules.defaultRedirect)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/admin/:path*',
  ],
}
