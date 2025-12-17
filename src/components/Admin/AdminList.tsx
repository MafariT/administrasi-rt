'use client';

import { useState, useTransition } from 'react';
import { deleteAdmin } from '@/app/(admin)/admin/pengaturan/actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import AddAdminModal from './AddAdminModal';

type AdminProfile = {
  id: string;
  full_name: string | null;
};

export default function AdminList({
  admins,
  currentUserId,
}: {
  admins: AdminProfile[];
  currentUserId: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (adminId: string) => {
    if (!confirm('Yakin ingin menghapus admin ini?')) return;

    startTransition(async () => {
      const result = await deleteAdmin(adminId);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Daftar Admin</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Tambah Admin
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nama
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {admin.full_name}
                  {admin.id === currentUserId && (
                    <span className="ml-2 text-xs text-gray-500">(Anda)</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {admin.id !== currentUserId && (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleDelete(admin.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
