import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function SkeletonRow() {
  return (
    <tr className="w-full">
      <td className="td-style">
        <Skeleton className="h-5 w-3/4" />
      </td>
      <td className="td-style">
        <Skeleton className="h-5 w-1/2" />
      </td>
      <td className="td-style">
        <Skeleton className="h-6 w-24 rounded-full" />
      </td>
      <td className="td-style">
        <div className="flex space-x-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
      </td>
    </tr>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-10 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg bg-white">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <Skeleton className="h-80 w-full rounded-lg" />
    </div>
  );
}

export function SkeletonActivityItem() {
  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg bg-white h-full">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    </div>
  );
}

export function DataTableSkeleton({ columnCount }: { columnCount: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-5 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columnCount }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[150px]" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}
