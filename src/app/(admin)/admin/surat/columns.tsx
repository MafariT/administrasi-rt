'use client';

import { ColumnDef } from '@tanstack/react-table';
import AdminSuratActions from '@/components/Admin/AdminSuratActions';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { SuratRequest } from '@/lib/types';
import { DataTableColumnHeader } from '@/components/base/DataTableColumnHeader';

export const columns: ColumnDef<SuratRequest>[] = [
  {
    id: "warga",
    accessorFn: (row) => row.warga?.full_name, 
    header: ({ column }) => (<DataTableColumnHeader column={column} title="PEMOHON" />),
    cell: ({ row }) => {
      const warga = row.original.warga;
      return (
        <div>
          <div className="font-medium">{warga?.full_name || 'N/A'}</div>
          <div className="text-muted-foreground text-xs font-mono">{warga?.nik || 'N/A'}</div>
        </div>
      )
    },
    sortingFn: (rowA, rowB, columnId) => {
      const nameA = rowA.original.warga?.full_name || '';
      const nameB = rowB.original.warga?.full_name || '';
      return nameA.localeCompare(nameB);
    },
  },
  {
    accessorKey: 'letter_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="JENIS SURAT" />
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TANGGAL PENGAJUAN" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      return <div>{format(date, 'd MMM yyyy, HH:mm', { locale: id })}</div>;
    },
  },
  {
    id: 'actions',
    header: () => <div>AKSI</div>,
    cell: ({ row }) => {
      return (
        <div>
          <AdminSuratActions request={row.original} />
        </div>
      );
    },
  },
];
