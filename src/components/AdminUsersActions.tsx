'use client'

import { useState, useTransition, useEffect } from 'react'
import { deleteUser, getUserProfile, updateUserProfile } from '@/app/(admin)/admin/users/actions'

type UserProfile = Awaited<ReturnType<typeof getUserProfile>>

export default function UserActions({ userId }: { userId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat diurungkan.')) {
      startTransition(async () => {
        const result = await deleteUser(userId)
        if (!result.success) {
          alert(`Error: ${result.message}`)
        }
      })
    }
  }

  return (
    <>
      <div className="flex space-x-2">
        <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:text-blue-900 text-xs">
          Edit
        </button>
        <button onClick={handleDelete} disabled={isPending} className="text-red-600 hover:text-red-900 text-xs disabled:text-gray-400">
          {isPending ? '...' : 'Hapus'}
        </button>
      </div>
      {isModalOpen && <EditUserModal userId={userId} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}


function EditUserModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUserProfile(userId)
        setUser(userData)
      } catch (e) {
        setError('Failed to fetch user data.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [userId])

  const handleUpdate = async (formData: FormData) => {
    const result = await updateUserProfile(formData)
    if (result.success) {
      alert('Profil berhasil diperbarui.')
      onClose()
    } else {
      setError(result.message || 'Gagal memperbarui profil.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Pengguna</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {user && (
          <form action={handleUpdate} className="space-y-4">
            <input type="hidden" name="id" value={user.id} />
            <div>
              <label>Nama Lengkap</label>
              <input name="full_name" defaultValue={user.full_name ?? ''} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label>NIK</label>
              <input name="nik" defaultValue={user.nik ?? ''} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label>Nomor KK</label>
              <input name="nomor_kk" defaultValue={user.nomor_kk ?? ''} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label>Telepon</label>
              <input name="phone_number" defaultValue={user.phone_number ?? ''} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label>Status Profil</label>
              <select name="profile_status" defaultValue={user.profile_status} className="w-full border p-2 rounded">
                <option value="pending">pending</option>
                <option value="submitted">submitted</option>
                <option value="verified">verified</option>
                <option value="rejected">rejected</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Batal</button>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Simpan Perubahan</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}