'use client';

import { ColumnDef } from '@tanstack/react-table';
import AdminHistoryActions from '@/components/Admin/AdminHistoryActions';
import { Badge } from '@/components/ui/badge';
import { SuratRequest } from '@/lib/types';
import { DataTableColumnHeader } from '@/components/base/DataTableColumnHeader';

export const columns: ColumnDef<SuratRequest>[] = [
  {
    accessorKey: 'warga',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PEMOHON" />
    ),
    cell: ({ row }) => <div>{row.original.warga?.full_name || 'N/A'}</div>,
    sortingFn: (rowA, rowB) => {
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
    accessorKey: 'unique_number',
    header: 'NOMOR SURAT',
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue('unique_number')}</div>
    ),
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
          {status === 'selesai' && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-300">
              Selesai
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
      const request = row.original;
      return (
        <div>
          <AdminHistoryActions
            status={request.status}
            filePath={request.file_url}
          />
        </div>
      );
    },
  },
];
