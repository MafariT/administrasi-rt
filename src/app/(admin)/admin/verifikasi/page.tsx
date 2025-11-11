'use client'

import UserVerificationPageContent from '@/components/Admin/UserVerificationPageContent'
import { Suspense } from 'react'

export default function UserManagementPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>
      <UserVerificationPageContent />
    </Suspense>
  )
}