'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PaginationControlsProps {
  totalCount: number
  itemsPerPage: number
}

export default function PaginationControls({
  totalCount,
  itemsPerPage,
}: PaginationControlsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get('page')) || 1
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const hasPrevPage = currentPage > 1
  const hasNextPage = currentPage < totalPages

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        Menampilkan{' '}
        <span className="font-semibold">
          {(currentPage - 1) * itemsPerPage + 1}
        </span>
        -
        <span className="font-semibold">
          {Math.min(currentPage * itemsPerPage, totalCount)}
        </span>{' '}
        dari <span className="font-semibold">{totalCount}</span> hasil
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(createPageURL(currentPage - 1))}
          disabled={!hasPrevPage}
        >
          <ChevronLeftIcon className="h-4 w-4 mr-2" />
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(createPageURL(currentPage + 1))}
          disabled={!hasNextPage}
        >
          Selanjutnya
          <ChevronRightIcon className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
