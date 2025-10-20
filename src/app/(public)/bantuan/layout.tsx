import HelpSidebar from '@/components/HelpSidebar'
import { getAllPosts } from '@/lib/mdx'

export default async function BantuanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const posts = await getAllPosts()

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex flex-col md:flex-row gap-8">
        <HelpSidebar posts={posts} />
        <div className="flex-grow">
          {children}
        </div>
      </div>
    </div>
  )
}