'use client'

import { useState, useTransition } from 'react'
import { verifyWarga, rejectWarga } from '@/app/(admin)/admin/verifikasi/actions'
import VerificationDetailModal from './VerificationDetailModal'
import RejectionModal from './RejectionModal'
import { toast } from 'sonner'

export default function AdminVerificationActions({ userId }: { userId: string }) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleVerify = () => {
    startTransition(() => {
      toast.promise(verifyWarga(userId), {
        loading: 'Memverifikasi pendaftaran...',
        success: (result) => {
          if (!result.success) throw new Error(result.message);
          return result.message;
        },
        error: (error) => error.message,
      });
    });
  };

  const rejectWargaAction = (reason: string) => rejectWarga(userId, reason);

  return (
    <>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsDetailModalOpen(true)}
          disabled={isPending}
          className="text-blue-600 hover:text-blue-900 text-xs font-semibold disabled:text-gray-400"
        >
          Lihat Berkas
        </button>
        <button
          onClick={handleVerify}
          disabled={isPending}
          className="text-green-800 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
        >
          Verifikasi
        </button>
        <button
          onClick={() => setIsRejectModalOpen(true)}
          disabled={isPending}
          className="text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
        >
          Tolak
        </button>
      </div>

      <VerificationDetailModal
        userId={userId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
      <RejectionModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        action={rejectWargaAction}
      />
    </>
  );
}