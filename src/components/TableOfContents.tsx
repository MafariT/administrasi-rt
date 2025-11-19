'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { slugify } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return setHeadings([]);

    const headingNodes = article.querySelectorAll('h2, h3');
    const newHeadings: Heading[] = [];
    headingNodes.forEach((node) => {
      const text = node.textContent;
      if (text) {
        const id = slugify(text);
        node.id = id;
        newHeadings.push({
          id,
          text,
          level: Number(node.tagName.substring(1)),
        });
      }
    });
    setHeadings(newHeadings);
  }, [pathname]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 h-fit">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-md">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Pada Halaman Ini
        </h3>
        <ul className="space-y-2 border-l border-gray-200">
          {headings.map((heading) => (
            <li key={heading.id}>
              <Link
                href={`#${heading.id}`}
                className={`block text-xs transition-colors hover:text-primary border-l-2 border-transparent -ml-px ${
                  heading.level === 3
                    ? 'pl-6 text-gray-500'
                    : 'pl-4 font-medium text-gray-600'
                }`}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
