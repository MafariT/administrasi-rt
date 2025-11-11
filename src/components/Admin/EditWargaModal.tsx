'use client'

import { updateWargaProfile } from '@/app/(admin)/admin/users/actions'
import toast from 'react-hot-toast'
import Modal from '../base/Modal'
import { WargaProfile } from '@/lib/types'

export default function EditWargaModal({
  warga,
  isOpen,
  onClose,
  onActionComplete,
}: {
  warga: WargaProfile
  isOpen: boolean
  onClose: () => void
  onActionComplete: () => void
}) {
  const handleUpdate = async (formData: FormData) => {
    const result = await updateWargaProfile(formData)
    if (result.success) {
      toast.success(result.message || 'Data berhasil diperbarui.')
      onActionComplete()
    } else {
      toast.error(result.message || 'Gagal memperbarui data.')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Data Warga" size="lg">
      <form action={handleUpdate} className="space-y-4 pt-4">
        <input type="hidden" name="id" value={warga.id} />

        <div>
          <label className="text-sm font-medium">Nama Lengkap</label>
          <input
            name="full_name"
            defaultValue={warga.full_name ?? ''}
            className="input-field"
          />
        </div>

        <div>
          <label className="text-sm font-medium">NIK</label>
          <input
            name="nik"
            defaultValue={warga.nik ?? ''}
            className="input-field"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Nomor KK</label>
          <input
            name="nomor_kk"
            defaultValue={warga.nomor_kk ?? ''}
            className="input-field"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Telepon</label>
          <input
            name="phone_number"
            defaultValue={warga.phone_number ?? ''}
            className="input-field"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            name="status"
            defaultValue={warga.status}
            className="input-field"
          >
            <option value="pending_verification">pending_verification</option>
            <option value="terdaftar">terdaftar</option>
            <option value="ditolak">ditolak</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary-dark"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </Modal>
  )
}
