import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'

const rootDirectory = path.join(process.cwd(), 'src', 'content', 'bantuan')

export const getPostBySlug = async (slug: string) => {
  const realSlug = slug.replace(/\.mdx$/, '')
  const filePath = path.join(rootDirectory, `${realSlug}.mdx`)
  
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })
  const { data, content } = matter(fileContent)
  const { content: mdxContent } = await compileMDX({
    source: content,
    options: { parseFrontmatter: false },
  })

  return { content: mdxContent, meta: data }
}

export const getAllPosts = async () => {
  const files = fs.readdirSync(rootDirectory)

  const posts = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(rootDirectory, file)
      const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })
      const { data } = matter(fileContent) // only need the frontmatter 

      return {
        slug: file.replace(/\.mdx$/, ''),
        meta: data,
      }
    })
  )

  return posts
}