import { ReactNode } from 'react'

export type ActionResult = {
  error: string | null
  success: string | null
}

export interface AuthFormProps {
  mode: 'login' | 'register'
}

export type WargaProfile = {
  id: number
  full_name: string | null
  nik: string | null
  nomor_kk: string | null
  phone_number: string | null
  status: string
  tempat_lahir?: string | null
  tanggal_lahir?: Date | null
  jenis_kelamin?: string | null
  pekerjaan?: string | null
  alamat_ktp?: string | null
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'md' | 'lg' | 'xl'
}

export type FormState = {
  success: boolean
  message: string
  errors?: {
    [key: string]: string[] | undefined
  }
}

export type ActivityItem = {
  id: number
  type: 'Pendaftaran Baru' | 'Warga Diverifikasi'
  fullName: string | null
  timestamp: string
}

export type Profile = {
  id: string
  full_name: string | null
}

export type SuratRequest = {
  id: number
  letter_type: string
  created_at: string
  form_data: { [key: string]: any }
  warga: {
    full_name: string | null
    nik: string | null
  } | null
}

export type SuratHistoryRequest = {
  id: number
  letter_type: string
  created_at: string
  unique_number: string
  status: string
  file_url: string
  form_data: { [key: string]: any }
  warga: {
    full_name: string | null
  } | null
}

export interface TableProps {
  statusFilter?: string
  searchQuery: string
  currentPage: number
  itemsPerPage: number
}

// ==========================================================
//                         /BANTUAN
// ==========================================================

export type PostMeta = {
  slug: string
  meta: { [key: string]: string }
}

export interface HelpSidebarProps {
  posts: PostMeta[]
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
