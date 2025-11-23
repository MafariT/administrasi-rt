'use client';

import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { DropdownProps } from '@/lib/types';

export default function Dropdown({ title, items }: DropdownProps) {
  return (
    <div className="relative inline-block text-left group">
      <button className="flex items-center space-x-1 text-sm font-medium text-white hover:text-gray-200 outline-none focus:outline-none">
        <span>{title}</span>
        <ChevronDownIcon className="h-4 w-4 group-hover:rotate-180 transition-transform" />
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 pt-2 w-48 origin-top-right bg-transparent z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
        <div className="bg-primary ring-0">
          <div className="py-1">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
