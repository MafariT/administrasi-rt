'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function FilterControls() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) params.set('search', term)
    else params.delete('search')
    router.replace(`${pathname}?${params.toString()}`)
  }, 300)

  const handleFilter = (status: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('status', status)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const currentStatus = searchParams.get('status') || 'all'
  const currentSearch = searchParams.get('search') ?? ''

  const filterOptions = [
    { name: 'Semua', value: 'all' },
    { name: 'Terdaftar', value: 'terdaftar' },
    { name: 'Pending', value: 'pending_verification' },
    { name: 'Ditolak', value: 'ditolak' },
  ]

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Cari nama warga..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={currentSearch}
        className="input-field w-full sm:w-1/3"
      />

      <div className="flex items-center space-x-2 p-1 bg-gray-100 rounded-lg">
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleFilter(opt.value)}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
              currentStatus === opt.value
                ? 'bg-white text-primary shadow'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  )
}
