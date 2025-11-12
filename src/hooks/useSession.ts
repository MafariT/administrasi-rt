'use client'

import { createClient } from "@/lib/supabase/client"
import { type User } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

export function useSession() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()
  }, [supabase.auth])

  return { user, loading }
}