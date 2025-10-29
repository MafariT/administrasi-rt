'use client'

import { useState, useEffect, useRef } from 'react'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

export default function UserMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-white hover:text-gray-200 transition-colors"
      >
        <UserCircleIcon className="h-8 w-8" />
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm text-gray-500">Masuk sebagai</p>
            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
          </div>
          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Profil Saya
          </Link>
          <div className="border-t border-gray-100 my-1"></div>
          <div className="px-4 py-2">
             <LogoutButton />
          </div>
        </div>
      )}
    </div>
  )
}