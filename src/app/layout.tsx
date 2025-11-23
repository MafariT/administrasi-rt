import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/global.css';
import Footer from '@/components/Footer';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Administrasi RT Online',
  description: 'Sistem administrasi surat pengantar RT',
};

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
