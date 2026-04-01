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
    <article>
      {/* 返回按钮 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-500 mb-8 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        返回首页
      </Link>

      {/* 文章头部 */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.tags.length > 0 && (
            <>
              <span>·</span>
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
        {post.excerpt && (
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 leading-relaxed border-l-4 border-indigo-300 pl-4">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* 文章正文 */}
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 底部导航 */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← 查看所有文章
        </Link>
      </div>
    </article>
  )
}
