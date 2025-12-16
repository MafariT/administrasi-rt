'use client';

import { useState, useTransition } from 'react';
import { deleteWarga } from '@/app/(admin)/admin/users/actions';
import EditWargaModal from './EditWargaModal';
import { WargaProfile } from '@/lib/types';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AdminWargaActions({ warga }: { warga: WargaProfile }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      toast.promise(deleteWarga(warga.id.toString()), {
        loading: 'Memproses penghapusan...',
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
          className="text-blue-600 hover:text-blue-900 text-xs font-medium"
        >
          Edit
        </button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={isPending}
              className="text-red-600 hover:text-red-900 text-xs font-medium disabled:text-gray-400"
            >
              {isPending ? '...' : 'Hapus'}
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini akan mengubah status warga menjadi{' '}
                <strong>Non-Aktif</strong> jika memiliki riwayat surat, atau{' '}
                <strong>menghapus permanen</strong> jika tidak ada riwayat.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white border-none"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <EditWargaModal
        warga={warga}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
