import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRightIcon,
  UserPlusIcon,
  DocumentCheckIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const processSteps = [
    {
      name: '1. Pendaftaran Data',
      description:
        'Isi formulir pendaftaran dengan data sesuai KTP & KK Anda. Unggah berkas yang diperlukan',
      icon: UserPlusIcon,
    },
    {
      name: '2. Verifikasi oleh RT',
      description:
        'Ketua RT akan memeriksa data dan berkas yang Anda kirimkan untuk memastikan keabsahannya',
      icon: DocumentCheckIcon,
    },
    {
      name: '3. Pengajuan Surat',
      description:
        'Setelah data Anda terverifikasi, Anda dapat langsung mengajukan berbagai jenis surat pengantar',
      icon: EnvelopeIcon,
    },
  ];

  const services = [
    {
      name: 'Surat Pengantar Domisili',
      description: 'Untuk keperluan administrasi kependudukan',
      image: '/img/service-1.jpeg',
    },
    {
      name: 'Surat Keterangan Usaha',
      description: 'Sebagai bukti legalitas usaha di tingkat RT',
      image: '/img/service-2.jpeg',
    },
    {
      name: 'Surat Pengantar Lainnya',
      description: 'Untuk pengurusan KTP, KK, dan kebutuhan lainnya',
      image: '/img/service-3.jpeg',
    },
  ];

  return (
    <div className="bg-transparent text-gray-800 min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent blur-3xl" />

        <div className="relative container mx-auto px-6 py-24 sm:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              Urusan Surat Pengantar RT, <br />
              <span className="text-primary">Kini di Ujung Jari Anda</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Layanan digital untuk pendaftaran warga dan pengajuan surat
              pengantar di lingkungan RT 012 Puri Kemajuan secara mandiri,
              cepat, dan transparan. Sekarang, warga cukup daftar secara online
              dan memantau prosesnya langsung dari rumah
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

          <div className="flex justify-center md:justify-end relative hidden md:flex">
            <div className="flex justify-center">
              <Image
                src="/img/hero-illustration.svg"
                alt="Ilustrasi layanan digital"
                width={500}
                height={300}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="rounded-3xl mx-4 md:mx-12 mt-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            Cara Kerja Layanan
          </h2>
          <p className="mt-3 text-gray-600">Hanya dalam 3 langkah mudah</p>
        </div>

        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {processSteps.map((step) => (
              <div
                key={step.name}
                className="p-8 bg-white/80 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-center h-16 w-16 mx-auto bg-primary/10 rounded-full mb-6">
                  <step.icon
                    className="h-8 w-8 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {step.name}
                </h3>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Layanan yang Tersedia
            </h2>
            <p className="mt-3 text-gray-600">
              Ajukan surat sesuai kebutuhan Anda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={service.image}
                    alt={`Ilustrasi untuk ${service.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
