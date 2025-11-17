'use client';

import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { DataTableFacetedFilter } from './DataTableFacetedFilter';
import { DataTableViewOptions } from './DataTableViewOptions';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumnId: string;
  filterColumnPlaceholder: string;
  statusFilter: boolean;
  statuses?: { value: string; label: string }[];
}

export function DataTableToolbar<TData>({
  table,
  filterColumnId,
  filterColumnPlaceholder,
  statusFilter,
  statuses = [
    { value: 'value_1', label: 'Label' },
    { value: 'value_2', label: 'Label' },
    { value: 'value_3', label: 'Label' },
  ],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const statusColumn = statusFilter ? table.getColumn('status') : null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={filterColumnPlaceholder}
          value={
            (table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn(filterColumnId)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {statusFilter && statusColumn && (
          <DataTableFacetedFilter
            column={statusColumn}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
