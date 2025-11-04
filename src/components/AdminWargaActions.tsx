'use client'

import { useState, useTransition } from 'react'
import { deleteWarga, updateWargaProfile } from '@/app/(admin)/admin/users/actions'
import { WargaProfile } from '@/lib/types'

// --- Main component for the action buttons ---
export default function WargaActions({ warga }: { warga: WargaProfile }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data warga ini? Tindakan ini akan menghapus data dan berkas terkait secara permanen.')) {
      startTransition(async () => {
        const result = await deleteWarga(warga.id.toString())
        if (!result.success) alert(`Error: ${result.message}`)
      })
    }
  }

  return (
    <>
      <div className="flex space-x-2">
        <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:text-blue-900 text-xs">Edit</button>
        <button onClick={handleDelete} disabled={isPending} className="text-red-600 hover:text-red-900 text-xs disabled:text-gray-400">
          {isPending ? '...' : 'Hapus'}
        </button>
      </div>
      {isModalOpen && <EditWargaModal warga={warga} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

// --- Edit Modal Component ---
function EditWargaModal({ warga, onClose }: { warga: WargaProfile; onClose: () => void }) {

  const handleUpdate = async (formData: FormData) => {
    const result = await updateWargaProfile(formData)
    if (result.success) {
      alert(result.message)
      onClose()
    } else {
      alert(`Error: ${result.message}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Data Warga</h2>
        <form action={handleUpdate} className="space-y-4">
          <input type="hidden" name="id" value={warga.id} />
          <div><label>Nama Lengkap</label><input name="full_name" defaultValue={warga.full_name ?? ''} className="w-full border p-2 rounded" /></div>
          <div><label>NIK</label><input name="nik" defaultValue={warga.nik ?? ''} className="w-full border p-2 rounded" /></div>
          <div><label>Nomor KK</label><input name="nomor_kk" defaultValue={warga.nomor_kk ?? ''} className="w-full border p-2 rounded" /></div>
          <div><label>Telepon</label><input name="phone_number" defaultValue={warga.phone_number ?? ''} className="w-full border p-2 rounded" /></div>
          <div>
            <label>Status</label>
            <select name="status" defaultValue={warga.status} className="w-full border p-2 rounded">
              <option value="pending_verification">pending_verification</option>
              <option value="terdaftar">terdaftar</option>
              <option value="ditolak">ditolak</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Batal</button>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  )
}