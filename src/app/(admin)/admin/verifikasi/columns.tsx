'use client';

import { ColumnDef } from '@tanstack/react-table';
import { WargaProfile } from '@/lib/types';
import AdminVerificationActions from '@/components/Admin/AdminVerificationActions';
import { DataTableColumnHeader } from '@/components/base/DataTableColumnHeader';

export const columns: ColumnDef<WargaProfile>[] = [
  {
    accessorKey: 'full_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Lengkap" />
    ),
  },
  {
    accessorKey: 'nik',
    header: 'NIK',
  },
  {
    accessorKey: 'nomor_kk',
    header: 'Nomor KK',
  },
  {
    accessorKey: 'phone_number',
    header: 'Telepon',
  },
  {
    id: 'actions',
    header: () => <div>Aksi</div>,
    cell: ({ row }) => {
      const warga = row.original as WargaProfile;
      return (
        <div>
          <AdminVerificationActions userId={warga.id.toString()} />
        </div>
      );
    },
  },
];
