'use client';

import Stepper from '@/components/base/Stepper';
import {
  NikCheckForm,
  SubmissionSuccess,
  SuratRequestForm,
} from '@/components/SuratForm';
import { useState } from 'react';

const steps = ['Verifikasi NIK', 'Isi Formulir Surat', 'Selesai'];

export default function SuratPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [verifiedWarga, setVerifiedWarga] = useState<any | null>(null);

  const handleNikVerified = (wargaData: any) => {
    setVerifiedWarga(wargaData);
    setCurrentStep(2);
  };

  const handleSubmissionSuccess = () => {
    setCurrentStep(3);
  };

  return (
    <div className="container mx-auto">
      <div className="w-full mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 shadow-lg">
        <div className="text-center border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            Buat Surat Pengantar Baru
          </h1>
          <p className="mt-2 text-gray-600">
            Silahkan buat surat pengantar baru sesuai dengan kebutuhan anda dan
            ikuti setiap langkahnya dengan benar
          </p>
        </div>
        <div className="mb-12">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        <div className="b">
          {currentStep === 1 && (
            <NikCheckForm onNikVerified={handleNikVerified} />
          )}

          {currentStep === 2 && verifiedWarga && (
            <SuratRequestForm
              warga={verifiedWarga}
              onSubmissionSuccess={handleSubmissionSuccess}
            />
          )}

          {currentStep === 3 && <SubmissionSuccess />}
        </div>
      </div>
    </div>
  );
}
