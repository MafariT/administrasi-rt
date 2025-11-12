'use client'
import { useState, useTransition } from 'react'
import { verifyWarga, rejectWarga } from '@/app/(admin)/admin/verifikasi/actions'
import VerificationDetailModal from './VerificationDetailModal'
import toast from 'react-hot-toast'

export default function AdminVerificationActions({
  userId,
}: {
  userId: string
}) {
  const [isPending, startTransition] = useTransition()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAction = (action: 'verify' | 'reject') => {
    const confirmationText =
      action === 'reject' ? 'Apakah Anda yakin ingin menolak pendaftaran ini?' : ''
    if (confirmationText && !window.confirm(confirmationText)) return

    startTransition(async () => {
      const result = action === 'verify' ? await verifyWarga(userId) : await rejectWarga(userId)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-blue-600 hover:text-blue-900 text-xs font-semibold"
        >
          Lihat Berkas
        </button>
        <button
          onClick={() => handleAction('verify')}
          disabled={isPending}
          className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
        >
          Verifikasi
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={isPending}
          className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
        >
          Tolak
        </button>
      </div>
      <VerificationDetailModal
        userId={userId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
