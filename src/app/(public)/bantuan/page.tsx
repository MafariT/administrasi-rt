import { getAllPosts } from '@/lib/mdx';
import Link from 'next/link';

export default async function BantuanHubPage() {
  const posts = await getAllPosts();

  return (
    <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 shadow-lg">
      <div className="text-center border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-primary">Pusat Bantuan</h1>
        <p className="mt-2 text-gray-600">
          Temukan jawaban atas pertanyaan Anda mengenai layanan kami.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/bantuan/${post.slug}`}
            className="block p-6 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {post.meta.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
