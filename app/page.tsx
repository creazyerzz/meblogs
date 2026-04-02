import { getSortedPostsData } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import { getAllTags } from '@/lib/posts'
import Link from 'next/link'

export default function Home() {
  const posts = getSortedPostsData()
  const tags = getAllTags()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 lg:py-16">
      {/* Header - 简历风格 */}
      <header className="mb-12 lg:mb-16">
        {/* 主信息区 */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
              周广晨
            </h1>
            <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium">
              AI全栈工程师 · AI Agent工程师
            </p>
          </div>
          
          {/* 头像 */}
          <div className="hidden sm:block">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xl lg:text-2xl font-bold shadow-lg">
              ZGC
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <a 
            href="https://github.com/creazyerzz" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <span className="text-zinc-500">北京</span>
        </div>

        {/* 个人简介 */}
        <div className="space-y-3">
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            专注于 AI 全栈开发与 Agent 系统构建。对大语言模型应用、
            智能对话系统、RAG 知识库等领域有深入研究与实践经验。
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            热衷于将 AI 技术落地到实际业务场景，帮助企业提升效率与创新能力。
          </p>
        </div>

        {/* 技能标签 */}
        <div className="mt-6 flex flex-wrap gap-2">
          {['LLM', 'LangChain', 'LangGraph', 'RAG', 'Python', 'Node.js', 'React', '向量数据库'].map((skill) => (
            <span 
              key={skill}
              className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-sm text-zinc-700 dark:text-zinc-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </header>

      {/* 文章列表 */}
      <main>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
            技术博客
          </h2>
          <span className="text-sm text-zinc-400">{posts.length} 篇文章</span>
        </div>

        <div className="space-y-0">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-zinc-500">暂无文章</p>
          </div>
        )}
      </main>

      {/* 标签 */}
      {tags.length > 0 && (
        <section className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            标签
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-500 text-center">
          © 2026 周广晨 · AI全栈工程师
        </p>
      </footer>
    </div>
  )
}
