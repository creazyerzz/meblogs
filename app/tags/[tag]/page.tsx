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
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link 
        href="/" 
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-12"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回博客
      </Link>

      <header className="mb-12">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
          <span className="text-indigo-600 dark:text-indigo-400">#</span>
          {tag}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {posts.length} 篇文章
        </p>
      </header>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-zinc-500">暂无文章</p>
        </div>
      )}
    </div>
  )
}
