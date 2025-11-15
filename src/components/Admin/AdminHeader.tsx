'use client'

import { useState } from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { useSession } from '@/hooks/useSession'
import LogoutButton from '../LogoutButton'
import AdminProfileModal from './AdminProfileModal'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

interface AdminHeaderProps {
  toggleSidebar: () => void
}

export default function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const { user, profile } = useSession()

  return (
    <>
      <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-30">
        <nav className="mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            </Button>
            <span className="text-xl font-bold hidden sm:block">
              Dashboard Admin
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="">
                  <span>{profile?.full_name}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">Akun Saya</p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setIsProfileModalOpen(true)}>
                  Profil Saya
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="p-0"
                >
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>

      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={profile ? { id: profile.id, full_name: profile.full_name } : null}
      />
    </>
  )
}
