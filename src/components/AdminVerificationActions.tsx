'use client'

import { useState, useTransition, useEffect } from 'react'
import { getWargaDetails, verifyWarga, rejectWarga } from '@/app/(admin)/admin/verifikasi/actions'

type WargaDetails = Awaited<ReturnType<typeof getWargaDetails>>

// --- Main component for the buttons in the table row ---
export default function AdminVerificationActions({ userId }: { userId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleVerify = () => {
    startTransition(async () => {
      await verifyWarga(userId)
    })
  }

  const handleReject = () => {
    if (window.confirm('Apakah Anda yakin ingin menolak pendaftaran ini?')) {
      startTransition(async () => {
        await rejectWarga(userId)
      })
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:text-blue-900 text-xs font-semibold">
          Lihat Berkas
        </button>
        <button onClick={handleVerify} disabled={isPending} className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-xs disabled:bg-gray-400">
          {isPending ? '...' : 'Verifikasi'}
        </button>
        <button onClick={handleReject} disabled={isPending} className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-xs disabled:bg-gray-400">
          {isPending ? '...' : 'Tolak'}
        </button>
      </div>
      {isModalOpen && <VerificationModal userId={userId} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}


// --- The Modal Component ---
function VerificationModal({ userId, onClose }: { userId: string, onClose: () => void }) {
  const [details, setDetails] = useState<WargaDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const data = await getWargaDetails(userId)
      setDetails(data)
      setIsLoading(false)
    }
    fetchData()
  }, [userId])

  const DetailItem = ({ label, value }: { label: string, value: string | undefined | null }) => (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-800">{value || '-'}</p>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 border-b pb-4">Detail Pendaftar</h2>
        {isLoading && <p>Loading data...</p>}
        {!isLoading && !details && <p>Gagal memuat data.</p>}
        {details && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <DetailItem label="Nama Lengkap" value={details.full_name} />
              <DetailItem label="NIK" value={details.nik} />
              <DetailItem label="Nomor KK" value={details.nomor_kk} />
              <DetailItem label="Tempat Lahir" value={details.tempat_lahir} />
              <DetailItem label="Tanggal Lahir" value={details.tanggal_lahir ? new Date(details.tanggal_lahir).toLocaleDateString('id-ID') : '-'} />
              <DetailItem label="Jenis Kelamin" value={details.jenis_kelamin} />
              <DetailItem label="Agama" value={details.agama} />
              <DetailItem label="Status Perkawinan" value={details.status_perkawinan} />
              <DetailItem label="Pekerjaan" value={details.pekerjaan} />
              <DetailItem label="Kewarganegaraan" value={details.kewarganegaraan} />
              <DetailItem label="Status Tinggal" value={details.status_tempat_tinggal} />
              <DetailItem label="No. WhatsApp" value={details.phone_number} />
              <div className="col-span-full"><DetailItem label="Alamat KTP" value={details.alamat_ktp} /></div>
              <div className="col-span-full"><DetailItem label="Alamat Domisili" value={details.alamat_domisili} /></div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Berkas Pendukung</h3>
              <div className="flex space-x-4">
                <a href={details.ktp_signed_url} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Lihat KTP</a>
                <a href={details.kk_signed_url} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Lihat KK</a>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-6">
              <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-md">Tutup</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}