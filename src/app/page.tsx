import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, UserPlusIcon, DocumentCheckIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import PublicNavbar from '@/components/PublicNavbar'

export default function HomePage() {
  const processSteps = [
    {
      name: '1. Pendaftaran Data',
      description: 'Isi formulir pendaftaran dengan data sesuai KTP & KK Anda. Unggah berkas yang diperlukan.',
      icon: UserPlusIcon,
    },
    {
      name: '2. Verifikasi oleh RT',
      description: 'Ketua RT akan memeriksa data dan berkas yang Anda kirimkan untuk memastikan keabsahannya.',
      icon: DocumentCheckIcon,
    },
    {
      name: '3. Pengajuan Surat',
      description: 'Setelah data Anda terverifikasi, Anda dapat langsung mengajukan berbagai jenis surat pengantar.',
      icon: EnvelopeIcon,
    },
  ]

  const services = [
    { name: 'Surat Pengantar Domisili', description: 'Untuk keperluan administrasi kependudukan.' },
    { name: 'Surat Keterangan Usaha', description: 'Sebagai bukti legalitas usaha di tingkat RT.' },
    { name: 'Surat Pengantar Lainnya', description: 'Untuk pengurusan KTP, KK, dan kebutuhan lainnya.' },
  ]

  return (
    <main className="bg-gradient-to-b from-primary/5 via-white to-white text-gray-800 min-h-screen">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent blur-3xl" />

        <div className="relative container mx-auto px-6 py-24 sm:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Urusan Surat Pengantar RT,
              <br />
              <span className="text-primary">Kini di Ujung Jari Anda.</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Layanan digital untuk pendaftaran warga dan pengajuan surat pengantar di lingkungan RT 012 Puri Kemajuan secara mandiri, cepat, dan transparan.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/daftar"
                className="flex items-center justify-center px-8 py-3 font-semibold text-white bg-primary rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Daftar Sebagai Warga
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/surat"
                className="font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                Sudah Terdaftar? Ajukan Surat →
              </Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end relative">
            <div className="relative w-full max-w-lg h-72 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-primary/10">
              <Image
                src="/img/hero-image.png"
                alt="Hero Image"
                fill
                style={{ objectFit: 'cover' }}
                className="scale-105 hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50/80 backdrop-blur-sm rounded-3xl mx-4 md:mx-12 mt-8 shadow-sm">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Cara Kerja Layanan</h2>
          <p className="mt-3 text-gray-600">Hanya dalam 3 langkah mudah.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 md:px-12">
          {processSteps.map((step) => (
            <div
              key={step.name}
              className="p-8 bg-white/80 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-center h-16 w-16 mx-auto bg-primary/10 rounded-full mb-6">
                <step.icon className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{step.name}</h3>
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Layanan yang Tersedia</h2>
          <p className="mt-3 text-gray-600">Ajukan surat sesuai kebutuhan Anda.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service) => (
            <div
              key={service.name}
              className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary-dark">
                {service.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
