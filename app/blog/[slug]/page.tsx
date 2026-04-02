import { getPostData, getAllPostSlugs } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostData(params.slug)
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.date,
      },
    }
  } catch {
    return { title: '文章未找到' }
  }
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs
}

export default async function BlogPost({ params }: Props) {
  let post
  try {
    post = await getPostData(params.slug)
  } catch {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* 返回链接 */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-12"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        返回博客
      </Link>

      {/* 文章头部 */}
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4 leading-snug">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <time className="font-mono" dateTime={post.date}>
            {formatDate(post.date)}
          </time>
          
          {post.tags.length > 0 && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        
        {post.excerpt && (
          <p className="mt-5 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* 文章正文 */}
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 底部 */}
      <footer className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回博客
        </Link>
      </footer>
    </article>
  )
}
