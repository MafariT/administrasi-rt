import ProfileForm from '@/components/ProfileForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CompleteProfilePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <ProfileForm user={user} />
}