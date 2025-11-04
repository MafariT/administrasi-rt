import DaftarForm from '@/components/DaftarForm'

export default function DaftarPage() {
  return (
    <div className="container mx-auto py-16 px-6">
      <div className="w-full mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 shadow-lg">
        <div className="text-center border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            Pendaftaran Warga Baru
          </h1>
          <p className="mt-2 text-gray-600">
            Daftarkan diri Anda untuk dapat menggunakan layanan surat pengantar online.
          </p>
        </div>
        <DaftarForm />
      </div>
    </div>
  )
}