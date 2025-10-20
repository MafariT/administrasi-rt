export type ActionResult = {
  error: string | null;
  success: string | null;
}

export interface AuthFormProps {
  mode: 'login' | 'register'
}

// ==========================================================
//                         /BANTUAN
// ==========================================================

export type PostMeta = {
  slug: string;
  meta: { [key: string]: unknown };
}

export interface HelpSidebarProps {
  posts: PostMeta[];
}

// export type SuratRequest = {
//   id: number;
//   requester_id: string;
//   letter_type: 'domisili' | 'usaha' | 'ktp' | 'kk';
//   status: 'pending' | 'approved' | 'rejected';
//   form_data: Record<string, unknown>;
//   unique_number?: string | null;
//   file_url?: string | null;
//   created_at: string;
// };

// export type Profile = {
//   id: string;
//   full_name?: string | null;
//   role: 'warga' | 'rt_admin';
//   created_at: string;
// };

