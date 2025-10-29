'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function getUserProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, nik, nomor_kk, phone_number, role, profile_status')
    .eq('id', userId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateUserProfile(formData: FormData) {
  const supabase = createClient()
  
  const userData = {
    full_name: formData.get('full_name') as string,
    nik: formData.get('nik') as string,
    nomor_kk: formData.get('nomor_kk') as string,
    phone_number: formData.get('phone_number') as string,
    // role: formData.get('role') as string,
    profile_status: formData.get('profile_status') as string,
  }
  const userId = formData.get('id') as string

  const { error } = await supabase
    .from('profiles')
    .update(userData)
    .eq('id', userId)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true, message: 'User updated successfully.' }
}

export async function deleteUser(userId: string) {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
  
  if (authError) {
    console.error('Error deleting auth user:', authError)
    return { success: false, message: authError.message }
  }

  revalidatePath('/admin/users')
  return { success: true, message: 'User deleted successfully.' }
}