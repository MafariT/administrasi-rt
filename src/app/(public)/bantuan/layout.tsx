import HelpSidebar from '@/components/HelpSidebar';
import { getAllPosts } from '@/lib/mdx';

export default async function BantuanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto">
      <div className="md:grid md:grid-cols-[256px_1fr] md:gap-6">
        <div>
          <HelpSidebar posts={posts} />
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
