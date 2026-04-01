import Link from 'next/link'
import { PostMeta } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: PostMeta
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="py-5 border-b border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug mb-2">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center gap-3 mt-3">
                <time className="text-xs text-gray-400" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
                {post.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors text-lg shrink-0 mt-1">
              →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
