import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll().map(({ name, value }) => ({ name, value }))
        },
        async setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            (await cookieStore).set(name, value, options)
          }
        },
      },
    }
  )
}
