import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/global.css'
import Footer from '@/components/base/Footer'
import { Toaster } from 'react-hot-toast'
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Administrasi RT Online',
  description: 'Sistem administrasi surat pengantar RT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <NextTopLoader
          color="#ffffff"
          showSpinner={false}
          shadow={false}
        />
        <Toaster position="top-center" reverseOrder={false} />
        <div className="flex flex-col min-h-screen">
          {/* Page content */}
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}