import Link from 'next/link'
import Image from 'next/image'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import ListItem from "@/components/ui/ListItem"
import { FaFacebook, FaWhatsapp } from 'react-icons/fa'
import MobileNav from './MobileNav'

export default function Navbar() {
  const layananComponents: { title: string; href: string; description: string }[] = [
    {
      title: "Daftar Sebagai Warga",
      href: "/daftar",
      description: "Lakukan pendaftaran data diri Anda untuk verifikasi oleh Ketua RT.",
    },
    {
      title: "Ajukan Surat Pengantar",
      href: "/surat",
      description: "Ajukan berbagai jenis surat pengantar setelah data Anda terverifikasi.",
    },
  ]

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative h-14 w-14">
              <Image src="/img/logo.svg" alt="Logo RT" fill style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <div className="text-xl font-bold leading-tight">Sistem Pengajuan Surat Pengantar</div>
              <div className="text-sm text-gray-200">RT 012 Puri Kemajuan</div>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm">Hubungi kami</span>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300"><FaFacebook size={22} /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300"><FaWhatsapp size={22} /></a>
            </div>
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>

        <div className="flex justify-center items-center py-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuLink asChild>
                  <Link href="/">Beranda</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger>Layanan</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-4">
                    {layananComponents.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuLink asChild>
                  <Link href="/bantuan">Pusat Bantuan</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
}