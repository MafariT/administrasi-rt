export type ActionResult = {
  error: string | null;
  success: string | null;
}

export type AuthFormProps = {
  mode: 'login' | 'register'
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

