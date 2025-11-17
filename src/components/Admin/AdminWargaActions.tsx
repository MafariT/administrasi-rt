'use client';

import { useState, useTransition } from 'react';
import { deleteWarga } from '@/app/(admin)/admin/users/actions';
import EditWargaModal from './EditWargaModal';
import { WargaProfile } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminWargaActions({ warga }: { warga: WargaProfile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      !window.confirm(
        'Apakah Anda yakin ingin menghapus data warga ini? Tindakan ini akan menghapus data dan berkas terkait secara permanen.'
      )
    ) {
      return;
    }

    startTransition(() => {
      toast.promise(deleteWarga(warga.id.toString()), {
        loading: 'Menghapus data warga...',
        success: (result) => {
          if (!result.success) throw new Error(result.message);
          return result.message;
        },
        error: (error) => error.message,
      });
    });
  };

  return (
    <>
      <div className="flex space-x-2">
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isPending}
          className="text-blue-600 hover:text-blue-900 text-xs disabled:text-gray-400"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-red-600 hover:text-red-900 text-xs disabled:text-gray-400"
        >
          Hapus
        </button>
      </div>

      <EditWargaModal
        warga={warga}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
