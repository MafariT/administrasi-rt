'use client'

import { HelpSidebarProps } from '@/lib/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function HelpSidebar({ posts }: HelpSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
      <h2 className="text-xl font-bold text-primary mb-4">Topik Bantuan</h2>
      <nav>
        <ul>
          {posts.map((post) => {
            const isActive = pathname === `/bantuan/${post.slug}`
            return (
              <li key={post.slug}>
                <Link 
                  href={`/bantuan/${post.slug}`}
                  className={`block py-2 px-3 rounded-md transition-colors text-sm ${
                    isActive 
                      ? 'bg-primary text-white font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {post.meta.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}