'use client'

import { createClient } from "@/lib/supabase/client"
import { type User } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { type Profile } from "@/lib/types"

export function useSession() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false)
    }

    getSessionAndProfile()
  }, [supabase])

  return { user, profile, loading }
}