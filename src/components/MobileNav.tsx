'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Bars3Icon } from '@heroicons/react/24/outline'

const navLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Daftar Sebagai Warga', href: '/daftar' },
  { name: 'Ajukan Surat', href: '/surat' },
  { name: 'Pusat Bantuan', href: '/bantuan' },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="default">
          <Bars3Icon className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-sidebar p-4">
        <SheetHeader>
          <SheetTitle className="text-left text-white font-bold">Menu Navigasi</SheetTitle>
        </SheetHeader>
        <nav className="mt-8 flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-lg font-medium text-white rounded-md hover:bg-accent"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}