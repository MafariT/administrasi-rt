'use client'

import { useState, useTransition } from 'react'
import { verifyWarga, rejectWarga } from '@/app/(admin)/admin/verifikasi/actions'
import VerificationDetailModal from './VerificationDetailModal'
import { toast } from 'sonner'

export default function AdminVerificationActions({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAction = (action: 'verify' | 'reject') => {
    const isRejecting = action === 'reject';
    if (isRejecting && !window.confirm('Apakah Anda yakin ingin menolak pendaftaran ini?')) {
      return;
    }

    startTransition(() => {
      const actionPromise = isRejecting ? rejectWarga(userId) : verifyWarga(userId);

      toast.promise(actionPromise, {
        loading: 'Memproses permintaan...',
        success: (result) => {
          if (result.success) {
            return result.message;
          } else {
            throw new Error(result.message);
          }
        },
        error: (error) => {
          return error.message;
        },
      });
    });
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isPending}
          className="text-blue-600 hover:text-blue-900 text-xs font-semibold disabled:text-gray-400"
        >
          Lihat Berkas
        </button>
        <button
          onClick={() => handleAction('verify')}
          disabled={isPending}
          className="text-green-800 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
        >
          Verifikasi
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={isPending}
          className="text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
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