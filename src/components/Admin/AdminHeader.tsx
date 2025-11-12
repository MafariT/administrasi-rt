import { Bars3Icon } from '@heroicons/react/24/outline'
import LogoutButton from '../LogoutButton';

interface AdminNavbarProps {
  toggleSidebar: () => void;
  userEmail: string | undefined;
}

export default function AdminHeader({ toggleSidebar, userEmail }: AdminNavbarProps) {
  return (
    <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-30">
      <nav className="mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100">
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          </button>
          <span className="text-xl font-bold hidden sm:block">Dashboard Admin</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 hidden sm:block text-sm">{userEmail}</span>
          <LogoutButton />
        </div>
      </nav>
    </header>
  )
}