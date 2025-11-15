import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary text-gray">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm">
        <div className="flex space-x-6 mb-4 sm:mb-0">
          <Link
            href="/bantuan"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Pusat Bantuan
          </Link>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Ketentuan Media
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Ketentuan Copyright
          </a>
        </div>
        <div className="text-center sm:text-right">
          &copy; {new Date().getFullYear()} RT 012 Puri Kemajuan.
        </div>
      </div>
    </footer>
  );
}
