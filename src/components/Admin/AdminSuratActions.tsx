'use client';

import { useState, useTransition } from 'react';
import {
  approveSuratRequest,
  rejectSuratRequest,
} from '@/app/(admin)/admin/surat/actions';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SuratRequest } from '@/lib/types';

export default function SuratActions({ request }: { request: SuratRequest }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: 'approve' | 'reject') => {
    startTransition(() => {
      const actionPromise =
        action === 'approve'
          ? approveSuratRequest(request.id.toString())
          : rejectSuratRequest(request.id.toString());

      toast.promise(actionPromise, {
        loading: 'Memproses permintaan...',
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
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-blue-600 hover:text-blue-900 text-xs font-semibold disabled:text-gray-400"
        >
          Detail
        </button>
        <button
          onClick={() => handleAction('approve')}
          disabled={isPending}
          className="text-green-800 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
        >
          Setujui
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={isPending}
          className="text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-xs disabled:bg-gray-400"
        >
          Tolak
        </button>
      </div>
      <SuratDetailModal
        request={request}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

function SuratDetailModal({
  request,
  isOpen,
  onClose,
}: {
  request: SuratRequest;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Permintaan Surat</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Nama Pemohon</p>
            <p className="font-semibold">{request.warga?.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">NIK</p>
            <p className="font-mono">{request.warga?.nik}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Jenis Surat</p>
            <p className="font-semibold">{request.letter_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Keperluan</p>
            <p>{request.form_data.keperluan || '-'}</p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
