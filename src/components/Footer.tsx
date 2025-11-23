import Link from 'next/link';
import Image from 'next/image';
import {
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 text-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/img/logo-white.svg"
                  alt="Logo RT"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">
                RT 012 Digital
              </span>
            </div>
            <p className="leading-relaxed text-gray-400">
              Platform digital resmi Rukun Tetangga 012 Puri Kemajuan untuk
              mempermudah pelayanan administrasi dan informasi bagi seluruh
              warga
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Tautan Cepat
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/daftar"
                  className="hover:text-primary transition-colors"
                >
                  Daftar Warga
                </Link>
              </li>
              <li>
                <Link
                  href="/surat"
                  className="hover:text-primary transition-colors"
                >
                  Ajukan Surat
                </Link>
              </li>
              <li>
                <Link
                  href="/cek-status"
                  className="hover:text-primary transition-colors"
                >
                  Cek Status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Bantuan</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/bantuan"
                  className="hover:text-primary transition-colors"
                >
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link
                  href="/bantuan/cara-menggunakan"
                  className="hover:text-primary transition-colors"
                >
                  Panduan Penggunaan
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Hubungi Kami
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="mt-1 text-primary shrink-0" />
                <span>Alamat</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary shrink-0" />
                <span>rt12@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {currentYear} RT 012 Puri Kemajuan</p>
          <div className="flex space-x-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
