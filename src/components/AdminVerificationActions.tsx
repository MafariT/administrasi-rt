'use client'

import { useTransition } from 'react'
import { verifyUserProfile } from '@/app/(admin)/admin/verifikasi/actions'

export default function VerificationActions({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleVerify = () => {
    startTransition(async () => {
      const result = await verifyUserProfile(userId)
      if (!result.success) {
        alert(result.message)
      }
    })
  }
  
  return (
    <div className="flex space-x-2">
      <button 
        onClick={handleVerify} 
        disabled={isPending}
        className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
      >
        {isPending ? '...' : 'Verifikasi'}
      </button>
      <button 
        // TODO: Add handler for rejecting later
        disabled={isPending}
        className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
      >
        Tolak
      </button>
    </div>
  )
}