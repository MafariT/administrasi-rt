'use client';

import { ColumnDef } from '@tanstack/react-table';
import { WargaProfile } from '@/lib/types';

import { Badge } from '@/components/ui/badge';
import AdminWargaActions from '@/components/Admin/AdminWargaActions';
import { DataTableColumnHeader } from '@/components/base/DataTableColumnHeader';

export const columns: ColumnDef<WargaProfile>[] = [
  {
    accessorKey: 'full_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NAMA LENGKAP" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('full_name')}</div>;
    },
  },

  {
    accessorKey: 'nik',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIK" />
    ),
    cell: ({ row }) => <div className="font-mono">{row.getValue('nik')}</div>,
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="STATUS" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      return (
        <>
          {status === 'terdaftar' && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-300">
              Terdaftar
            </Badge>
          )}

          {status === 'pending_verification' && (
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-300 dark:text-black">
              Pending
            </Badge>
          )}

          {status === 'ditolak' && (
            <Badge className="bg-red-100 text-red-800 dark:bg-red-300 dark:text-black">
              Ditolak
            </Badge>
          )}
        </>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: 'actions',
    header: () => <div>AKSI</div>,
    cell: ({ row }) => {
      const warga = row.original as WargaProfile;
      return (
        <div className="text-right">
          <AdminWargaActions warga={warga} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
