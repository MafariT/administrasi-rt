'use client';

import { NikCheckForm, SuratRequestForm } from '@/components/SuratForm';
import { useState } from 'react';

export default function SuratPage() {
  const [verifiedWarga, setVerifiedWarga] = useState<any | null>(null);

  return (
    <div className="container mx-auto py-16 px-6">
      <div className="w-full max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 shadow-lg">
        <div className="text-center border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            {verifiedWarga
              ? 'Formulir Pengajuan Surat'
              : 'Verifikasi Identitas Anda'}
          </h1>
          <p className="mt-2 text-gray-600">
            {verifiedWarga
              ? 'Lengkapi formulir di bawah ini untuk mengajukan surat.'
              : 'Silakan masukkan NIK Anda untuk memulai proses pengajuan surat.'}
          </p>
        </div>

        {verifiedWarga ? (
          <SuratRequestForm warga={verifiedWarga} />
        ) : (
          <NikCheckForm onNikVerified={setVerifiedWarga} />
        )}
      </div>
    </div>
  );
}
