'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function verifyUserProfile(userId: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ profile_status: 'verified' })
      .eq('id', userId)

    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }

    revalidatePath('/admin')

    return { success: true, message: 'User verified successfully.' }
  } catch (e) {
    const error = e as Error
    console.error('Failed to verify user:', error.message)
    return { success: false, message: `Failed to verify user: ${error.message}` }
  }
}

export async function rejectUserProfile(userId: string) {
  // TODO
}