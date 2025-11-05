import { ReactNode } from "react";

export type ActionResult = {
  error: string | null;
  success: string | null;
}

export interface AuthFormProps {
  mode: 'login' | 'register'
}

export type WargaProfile = {
  id: number;
  full_name: string | null;
  nik: string | null;
  nomor_kk: string | null;
  phone_number: string | null;
  status: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

// ==========================================================
//                         /BANTUAN
// ==========================================================

export type PostMeta = {
  slug: string;
  meta: { [key: string]: string };
}

export interface HelpSidebarProps {
  posts: PostMeta[];
}

// ==========================================================
//                         DROPDOWN
// ==========================================================


export type DropdownItem = {
  name: string
  href: string
}

export interface DropdownProps {
  title: string
  items: DropdownItem[]
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

