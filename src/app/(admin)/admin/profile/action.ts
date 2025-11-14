'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function updateAdminProfile(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'User not authenticated.' };

  const fullName = formData.get('full_name') as string;
  if (!fullName || fullName.length < 3) {
    return { success: false, message: 'Nama lengkap tidak valid.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (error) return { success: false, message: error.message };
  
  revalidatePath('/admin');
  return { success: true, message: 'Nama berhasil diperbarui.' };
}


const passwordSchema = z.object({
  password: z.string().min(6, "Password minimal 6 karakter."),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Password tidak cocok.",
  path: ["confirmPassword"],
});

export async function updateAdminPassword(formData: FormData) {
  const supabase = createClient()

  const validatedFields = passwordSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.message };
  }

  const { password } = validatedFields.data;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { success: false, message: error.message };

  return { success: true, message: 'Password berhasil diperbarui.' };
}