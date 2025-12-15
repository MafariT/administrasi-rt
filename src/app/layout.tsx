import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/global.css';
import Footer from '@/components/Footer';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
  ? `https://${process.env.NEXT_PUBLIC_BASE_URL}` 
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Sistem Administrasi RT 012 Puri Kemajuan',
    template: '%s | RT 012 Puri Kemajuan',
  },
  description: 'Layanan digital untuk pendaftaran warga dan pengajuan surat pengantar secara mandiri, cepat, dan transparan.',
  openGraph: {
    title: 'Sistem Administrasi RT 012 Puri Kemajuan',
    description: 'Urus surat pengantar RT kini lebih mudah dan cepat secara online.',
    url: baseUrl,
    siteName: 'RT 012 Online',
    locale: 'id_ID',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}
      >
        <NextTopLoader color="#61f8f1ff" showSpinner={false} shadow={false} />
        <Toaster richColors position="top-center" duration={7000} />

        <main className="flex-grow">
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
        <Footer />
      </body>
    </html>
  );
}
