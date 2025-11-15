import { Suspense } from 'react'
import { SkeletonRow } from '@/components/base/SkeletonLoader'
import { SuratRequestTable } from '@/lib/helper/AdminHelper'

export default async function AdminSuratPage() {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg">
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="th-style">Pemohon</th>
              <th className="th-style">Jenis Surat</th>
              <th className="th-style">Tanggal Pengajuan</th>
              <th className="th-style">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <Suspense
              fallback={
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              }
            >
              <SuratRequestTable />
            </Suspense>
          </tbody>
        </table>
      </div>
    </div>
  )
}
