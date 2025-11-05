'use client'

import { useState, useEffect } from 'react'
import { getWargaDetails } from '@/app/(admin)/admin/verifikasi/actions'
import Modal from '../base/Modal'

type WargaDetails = Awaited<ReturnType<typeof getWargaDetails>>

const DetailItem = ({ label, value }: { label: string, value: string }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-base text-gray-900">{value || '-'}</p>
  </div>
)

export default function VerificationDetailModal({ userId, isOpen, onClose }: { userId: string, isOpen: boolean, onClose: () => void }) {
  const [details, setDetails] = useState<WargaDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      async function fetchData() {
        setIsLoading(true)
        const data = await getWargaDetails(userId)
        setDetails(data)
        setIsLoading(false)
      }
      fetchData()
    }
  }, [userId, isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Verifikasi Pendaftar" size="xl">
      {isLoading && <p className="py-8 text-center">Loading data...</p>}
      {!isLoading && !details && <p className="py-8 text-center text-red-500">Gagal memuat data.</p>}
      {details && (
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
            <DetailItem label="Nama Lengkap" value={details.full_name} />
            <DetailItem label="NIK" value={details.nik} />
            <DetailItem label="Nomor KK" value={details.nomor_kk} />
            <DetailItem label="Tempat Lahir" value={details.tempat_lahir} />
            <DetailItem label="Tanggal Lahir" value={details.tanggal_lahir ? new Date(details.tanggal_lahir).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric'}) : '-'} />
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
          
          <div className="border-t pt-4">
            <h3 className="text-base font-semibold text-gray-700 mb-2">Berkas Pendukung</h3>
            <div className="flex space-x-4">
              <a href={details.ktp_signed_url} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">Lihat KTP</a>
              <a href={details.kk_signed_url} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">Lihat KK</a>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}