import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '关于我',
  description: '了解博主',
}

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 lg:py-16">
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
        <div className="flex items-start gap-5 mb-6">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
            ZGC
          </div>
          <div className="pt-2">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
              周广晨
            </h1>
            <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium">
              AI全栈工程师 · AI Agent工程师
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            你好！我是一名专注于 AI 全栈开发的工程师，对大语言模型应用、
            智能 Agent 系统、RAG 知识库等领域有深入研究与实践经验。
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            在这个博客中，我记录自己在 AI 应用开发中的技术探索、实战经验与深度思考。
            希望能够帮助更多开发者了解并应用 AI 技术。
          </p>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-5">
          专注领域
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'AI Agent 开发', desc: 'LangChain、LangGraph、Agent 系统设计' },
            { title: 'LLM 应用', desc: 'Prompt 工程、RAG 知识库构建' },
            { title: '全栈开发', desc: 'Python、Node.js、React' },
            { title: '向量数据库', desc: 'Pinecone、Milvus、Weaviate' },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium text-zinc-900 dark:text-white mb-1">{item.title}</h3>
              <p className="text-sm text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-5">
          技术栈
        </h2>
        <div className="flex flex-wrap gap-2">
          {['LLM', 'LangChain', 'LangGraph', 'RAG', 'Python', 'FastAPI', 'Node.js', 'React', 'Next.js', '向量数据库', 'Docker'].map((tech) => (
            <span key={tech} className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-sm text-zinc-700 dark:text-zinc-300">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          联系方式
        </h2>
        <a 
          href="https://github.com/creazyerzz" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          github.com/creazyerzz
        </a>
      </section>
    </div>
  )
}
