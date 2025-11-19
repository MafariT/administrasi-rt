'use client';

import { useState } from 'react';
import { StatusCheckForm, StatusResult } from '@/components/StatusCheck';

export default function CekStatusPage() {
  const [resultData, setResultData] = useState<any | null>(null);

  return (
    <div className="container mx-auto">
      <div className="w-full mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 shadow-lg">
        <div className="text-center border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            Cek Status Pengajuan
          </h1>
          <p className="mt-2 text-gray-600">
            Masukkan NIK Anda untuk melihat riwayat dan status pengajuan surat.
          </p>
        </div>
        {resultData ? (
          <StatusResult
            resultData={resultData}
            onReset={() => setResultData(null)}
          />
        ) : (
          <StatusCheckForm onCheckSuccess={setResultData} />
        )}
      </div>
    </div>
  );
}
