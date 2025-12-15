import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
    ? `https://${process.env.NEXT_PUBLIC_BASE_URL}` 
    : 'http://localhost:3000';

  const routes = [
    '',
    '/daftar',
    '/surat',
    '/cek-status',
    '/bantuan',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const posts = await getAllPosts()
  const helpRoutes = posts.map((post) => ({
    url: `${baseUrl}/bantuan/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...helpRoutes]
}