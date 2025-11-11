'use client'

import UserManagementPageContent from '@/components/Admin/UserManagementPageContent'
import { Suspense } from 'react'

export default function UserManagementPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
      <UserManagementPageContent />
    </Suspense>
  )
}