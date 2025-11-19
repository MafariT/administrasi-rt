import TableOfContents from '@/components/TableOfContents';

export default function BantuanArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lg:grid lg:grid-cols-[1fr_256px] lg:gap-6">
      <main className="min-w-0">{children}</main>

      <div className="relative">
        <TableOfContents />
      </div>
    </div>
  );
}
