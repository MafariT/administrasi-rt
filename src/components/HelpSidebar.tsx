'use client';

import { HelpSidebarProps } from '@/lib/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HelpSidebar({ posts }: HelpSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 flex-shrink-0 bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-md sticky top-24 h-fit">
      <h2 className="text-lg font-bold text-primary mb-4">Topik Bantuan</h2>
      <nav>
        <ul className="space-y-1">
          {posts.map((post) => {
            const isActive = pathname === `/bantuan/${post.slug}`;
            return (
              <li key={post.slug}>
                <Link
                  href={`/bantuan/${post.slug}`}
                  className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {post.meta.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
