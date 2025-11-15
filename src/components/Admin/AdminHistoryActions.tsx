'use client';

import { getSuratDownloadUrl } from '@/app/(admin)/admin/surat/actions';
import { toast } from 'sonner';

interface HistoryActionsProps {
  status: string;
  filePath: string | null;
}

export default function HistoryActions({
  status,
  filePath,
}: HistoryActionsProps) {
  const handleDownload = async () => {
    if (!filePath) {
      toast.error('File tidak ditemukan untuk permintaan ini.');
      return;
    }

    const promise = () => getSuratDownloadUrl(filePath);

    toast.promise(promise, {
      loading: 'Membuat link unduhan...',
      success: (result) => {
        if (!result.success || !result.url) throw new Error(result.message);
        window.open(result.url, '_blank');
        return 'Link unduhan berhasil dibuat!';
      },
      error: (error) => error.message,
    });
  };

  return (
    <>
      {status === 'selesai' && filePath && (
        <button
          className='text-blue-600 hover:text-blue-900 text-xs font-semibold disabled:text-gray-400"'
          onClick={handleDownload}
        >
          Unduh Surat
        </button>
      )}
    </>
  );
}
