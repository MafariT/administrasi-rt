import Link from 'next/link'

export default function HomePageHeader() {
  return (
    <header className="absolute top-0 left-0 w-full z-10 bg-transparent">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-800">
          Administrasi RT
        </div>
        <div>
          <Link
            href="/login"
            className="px-5 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Masuk
          </Link>
        </div>
      </nav>
    </header>
  )
}