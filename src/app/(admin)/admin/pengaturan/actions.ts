'use server';

import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';

const addAdminSchema = z.object({
  email: z.string().email('Email tidak valid'),
  fullName: z.string().min(3, 'Nama minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export async function createAdmin(formData: FormData) {
  const cookieStore = cookies();
  const supabaseAuth = createServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) return { success: false, message: 'Unauthorized' };

  const rawData = Object.fromEntries(formData.entries());
  const validated = addAdminSchema.safeParse(rawData);

  if (!validated.success) {
    return { success: false, message: validated.error.message };
  }

  const { email, fullName, password } = validated.data;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/pengaturan');
  return { success: true, message: 'Admin baru berhasil ditambahkan.' };
}

export async function deleteAdmin(userId: string) {
  const supabaseAuth = createServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) return { success: false, message: 'Unauthorized' };

  if (user.id === userId) {
    return {
      success: false,
      message: 'Anda tidak dapat menghapus akun sendiri.',
    };
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) return { success: false, message: error.message };

  revalidatePath('/admin/pengaturan');
  return { success: true, message: 'Admin berhasil dihapus.' };
}
