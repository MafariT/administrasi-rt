'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { FaFacebook, FaWhatsapp } from 'react-icons/fa';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import ListItem from '@/components/ui/ListItem';

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const layananComponents = [
    {
      title: 'Daftar Sebagai Warga',
      href: '/daftar',
    },
    {
      title: 'Ajukan Surat Pengantar',
      href: '/surat',
    },
    {
      title: 'Cek Status Surat',
      href: '/surat/cek-status',
    },
  ];

  const mobileNavLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Daftar Sebagai Warga', href: '/daftar' },
    { name: 'Ajukan Surat Pengantar', href: '/surat' },
    { name: 'Cek Status Surat', href: '/surat/cek-status' },
    { name: 'Pusat Bantuan', href: '/bantuan' },
  ];

  return (
    <header className="bg-primary text-white sticky top-0 z-50 relative">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3 z-20">
            <div className="relative h-14 w-14">
              <Image
                src="/img/logo.svg"
                alt="Logo RT"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div>
              <div className="text-xl font-bold leading-tight">
                Sistem Pengajuan Surat Pengantar
              </div>
              <div className="text-sm text-gray-200">RT 012 Puri Kemajuan</div>
            </div>
          </Link>

          <div className="hidden md:flex justify-center items-center">
            <NavigationMenu delayDuration={0}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/">Beranda</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Layanan</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-4">
                      {layananComponents.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        ></ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/bantuan">Pusat Bantuan</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">Hubungi kami</span>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
              <FaFacebook size={22} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
              <FaWhatsapp size={22} />
            </a>
          </div>

          <div className="md:hidden z-20">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-md hover:bg-white/10"
            >
              {isExpanded ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div
          aria-hidden={!isExpanded}
          className={`md:hidden absolute left-0 right-0 top-full bg-primary transition-all duration-300 ease-in-out overflow-hidden
          ${isExpanded ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-2 opacity-0 pointer-events-none'}`}
          style={{
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          }}
        >
          <nav className="flex flex-col space-y-2 px-4 py-4">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsExpanded(false)}
                className="block px-4 py-2 rounded hover:bg-white/10"
              >
                {link.name}
              </Link>
            ))}

            <div className="flex space-x-6 mt-3 px-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <FaFacebook size={22} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300"
              >
                <FaWhatsapp size={22} />
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
