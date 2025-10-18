import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-gray-700">
              <h1 className="text-3xl font-bold text-primary mb-4">
                Hai, ada yang bisa kami bantu?
              </h1>
              <p className="mb-4">
                Layanan kami mencakup Pengajuan Surat Pengantar untuk berbagai
                keperluan masyarakat RT 012 Puri Kemajuan.
              </p>
              <p className="mb-8">
                Silahkan masuk untuk mengajukan surat atau daftar sebagai masyarakat.
              </p>
              <div className="flex items-center space-x-6">
                <Link
                  href="/login"
                  className="px-6 py-2 border border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="flex items-center font-semibold text-primary hover:text-primary-dark transition-colors uppercase text-sm tracking-wider"
                >
                  Daftarkan Akunmu
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative w-full max-w-lg h-64 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/img/hero-image.jpg"
                  alt="Hero Image"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </section>

          {/* Sorotan (Highlights) Section */}
          <section className="mt-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-10">Sorotan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Cara Menggunakan */}
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src="/img/sorotan-image.jpg"
                    alt="Sorotan Image"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2">
                    Bagaimana cara menggunakan layanan?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Membantu anda dalam mengajukan surat melalui sistem kami.
                  </p>
                </div>
              </div>

              {/* Card 2: Cek Status */}
              <div className="bg-white p-6 rounded-lg flex flex-col justify-center">
                <h3 className="text-xl font-bold text-primary mb-2">
                  Cek Status Pengajuan Anda
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Setelah anda mengajukan surat pengantar, perangkat RT perlu memverifikasi pengajuan anda. Lihat status pegajuan anda dalam satu tempat.
                </p>
                <a href="#" className="flex items-center font-semibold text-primary hover:text-primary-dark transition-colors text-sm">
                  Cek status
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </a>
              </div>

              {/* Card 3: Berbagai Keperluan */}
              <div className="bg-white p-6 rounded-lg flex flex-col justify-center">
                <h3 className="text-xl font-bold text-primary mb-2">
                  Sistem Pengajuan Surat Pengantar melayani berbagai keperluan
                </h3>
                <p className="text-gray-600 text-sm">
                  Lihat apa yang bisa dilakukan dan sesuaikan dengan keperluan anda.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}