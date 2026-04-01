import { getPostsByTag, getAllTags } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: { tag: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `#${decodeURIComponent(params.tag)} 标签下的文章`,
  }
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({ tag }))
}

export default function TagPage({ params }: Props) {
  const tag = decodeURIComponent(params.tag)
  const posts = getPostsByTag(tag)

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-500 mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        返回首页
      </Link>

      <h1 className="text-2xl font-bold mb-8">
        <span className="text-indigo-500">#</span>
        {tag}
        <span className="ml-2 text-base font-normal text-gray-400">
          ({posts.length} 篇)
        </span>
      </h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
