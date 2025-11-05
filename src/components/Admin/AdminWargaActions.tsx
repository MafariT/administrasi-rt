'use client'
import { useState, useTransition } from 'react'
import { deleteWarga } from '@/app/(admin)/admin/users/actions'
import EditWargaModal from './EditWargaModal'
import toast from 'react-hot-toast'
import { WargaProfile } from '@/lib/types'

export default function AdminWargaActions({ warga }: { warga: WargaProfile }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data warga ini? Tindakan ini akan menghapus data dan berkas terkait secara permanen.')) {
      startTransition(async () => {
        const result = await deleteWarga(warga.id.toString())
        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(`Error: ${result.message}`)
        }
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
      <EditWargaModal warga={warga} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}