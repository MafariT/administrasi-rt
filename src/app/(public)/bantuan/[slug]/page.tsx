import { getPostBySlug } from '@/lib/mdx'

export default async function BantuanArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { content, meta } = await getPostBySlug(slug)

  return (
    <article className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 shadow-lg">
      <div className="text-center border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-primary">
          {meta.title}
        </h1>
        {meta.date && (
          <p className="text-gray-500 mt-2 text-sm">
            Dipublikasikan pada: {new Date(meta.date).toLocaleDateString('id-ID', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        )}
      </div>
      <div className="prose lg:prose-lg max-w-none">
        {content}
      </div>
    </article>
  )
}
