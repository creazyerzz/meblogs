import { getSortedPostsData } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import { getAllTags } from '@/lib/posts'
import Link from 'next/link'

export default function Home() {
  const posts = getSortedPostsData()
  const tags = getAllTags()

  return (
    <div>
      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          👋 你好，我是博主
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
          这里记录我的技术思考、开发实践与生活感悟。欢迎订阅与交流。
        </p>
      </section>

      <div className="flex gap-8">
        {/* 文章列表 */}
        <section className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span>最新文章</span>
            <span className="text-sm font-normal text-gray-400">({posts.length})</span>
          </h2>
          <div className="space-y-6">
            {posts.length === 0 ? (
              <p className="text-gray-400">还没有文章，快去写第一篇吧！</p>
            ) : (
              posts.map((post) => <PostCard key={post.slug} post={post} />)
            )}
          </div>
        </section>

        {/* 侧边栏：标签云 */}
        <aside className="w-48 shrink-0 hidden md:block">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            标签
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
