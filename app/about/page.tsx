import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于我',
  description: '了解博主',
}

export default function About() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">关于我</h1>

      <div className="flex items-center gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-3xl text-white font-bold select-none">
          博
        </div>
        <div>
          <h2 className="text-xl font-semibold">博主</h2>
          <p className="text-gray-500 dark:text-gray-400">软件工程师 · 写作者</p>
        </div>
      </div>

      <div className="prose dark:prose-invert">
        <p>
          你好！我是这个博客的作者。我热爱技术、写作和开源。
        </p>
        <p>
          这个博客是我记录思考、分享经验的地方。主要涵盖：
        </p>
        <ul>
          <li>前端开发（React、Next.js、TypeScript）</li>
          <li>后端与系统设计</li>
          <li>开源工具与效率提升</li>
          <li>技术之外的思考</li>
        </ul>

        <h2>联系我</h2>
        <ul>
          <li>
            GitHub:{' '}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              @your-username
            </a>
          </li>
          <li>
            邮箱:{' '}
            <a href="mailto:your@email.com">your@email.com</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
