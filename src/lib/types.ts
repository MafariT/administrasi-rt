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

export type FormState = {
  success: boolean;
  message: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
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