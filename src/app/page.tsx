import HomePageHeader from '@/components/HomePageHeader'
import HomePageFooter from '@/components/Footer'
import { DocumentTextIcon, ClockIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  const services = [
    {
      name: 'Surat Pengantar Domisili',
      description: 'Untuk keperluan administrasi kependudukan atau lainnya.',
      icon: DocumentTextIcon,
    },
    {
      name: 'Surat Keterangan Usaha',
      description: 'Sebagai bukti legalitas usaha Anda di tingkat RT.',
      icon: CheckCircleIcon,
    },
    {
      name: 'Pengajuan Lainnya',
      description: 'Untuk pengurusan KTP, KK, dan kebutuhan administrasi lainnya.',
      icon: ClockIcon,
    },
  ]

  const processSteps = [
    { name: '1. Daftar & Masuk', description: 'Buat akun atau masuk dengan akun yang sudah terdaftar.' },
    { name: '2. Isi Formulir', description: 'Pilih jenis surat dan isi data yang diperlukan secara online.' },
    { name: '3. Tunggu Persetujuan', description: 'Ketua RT akan meninjau pengajuan Anda secara digital.' },
    { name: '4. Unduh Surat', description: 'Setelah disetujui, surat Anda akan tersedia dalam format PDF.' },
  ]

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <HomePageHeader />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-24 sm:py-32">
          {/* Main Title Section */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Sistem Layanan Administrasi RT Digital
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Platform online untuk mempermudah warga dalam proses pengajuan surat pengantar dari Ketua RT.
            </p>
          </div>

          {/* Services Section */}
          <section id="services" className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-800">Layanan yang Tersedia</h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.name} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex items-center">
                    <service.icon className="h-8 w-8 text-blue-600" aria-hidden="true" />
                    <h3 className="ml-4 text-xl font-semibold text-gray-900">{service.name}</h3>
                  </div>
                  <p className="mt-4 text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-800">Cara Kerja</h2>
            <div className="relative mt-10">
              {/* The connecting line - hidden on mobile */}
              <div className="hidden md:block absolute top-5 left-0 w-full h-0.5 bg-gray-300" aria-hidden="true" />
              <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                {processSteps.map((step) => (
                  <div key={step.name} className="text-center p-4">
                     <div className="flex items-center justify-center h-12 w-12 mx-auto bg-blue-600 text-white font-bold rounded-full border-4 border-white shadow-md z-10 relative">
                      {step.name.split('.')[0]}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-800">{step.name.split('.')[1].trim()}</h3>
                    <p className="mt-1 text-gray-500">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>

      <HomePageFooter />
    </div>
  )
}