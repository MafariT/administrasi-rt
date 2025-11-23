import { getAllPosts } from '@/lib/mdx';
import Link from 'next/link';

import {
  DocumentTextIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  DocumentTextIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
};

export default async function BantuanHubPage() {
  const posts = await getAllPosts();

  return (
    <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-300">
      <div className="text-center border-b border-gray-200 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-primary">Pusat Bantuan</h1>
        <p className="mt-2 text-gray-600">
          Temukan jawaban atas pertanyaan Anda mengenai layanan kami.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const IconComponent =
            iconMap[post.meta.icon] || QuestionMarkCircleIcon;

          return (
            <Link
              key={post.slug}
              href={`/bantuan/${post.slug}`}
              className="group block p-6 text-center bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-primary"
            >
              <div className="flex justify-center items-center mb-4">
                <IconComponent className="h-12 w-12 text-primary group-hover:text-primary-dark" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary">
                {post.meta.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
