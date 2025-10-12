import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Selamat Datang di Administrasi RT Online
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Solusi digital untuk pengajuan surat pengantar RT Anda.
        </p>
        <div className="mt-8">
          <Link
            href="/login"
            className="px-8 py-3 font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Masuk / Daftar
          </Link>
        </div>
      </div>
    </main>
  )
}