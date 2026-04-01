import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '关于我',
  description: '了解博主',
}

const skills = [
  { category: '后端开发', items: ['Java', 'Spring Boot', '微服务', '分布式系统'] },
  { category: '架构设计', items: ['系统设计', '领域驱动设计', '设计模式', '架构重构'] },
  { category: '数据库', items: ['MySQL', 'Redis', 'MongoDB', 'Elasticsearch'] },
  { category: 'DevOps', items: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'] },
]

const stats = [
  { label: '博客文章', value: '20+' },
  { label: '技术标签', value: '15+' },
  { label: '开源项目', value: '5+' },
]

const links = [
  { 
    name: 'GitHub', 
    url: 'https://github.com/creazyerzz',
    icon: '🎯'
  },
]

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 mb-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl font-bold text-white shadow-xl border-4 border-white/30">
            ZGC
          </div>
          <div className="text-center md:text-left text-white">
            <h1 className="text-3xl font-bold mb-2">周广琛</h1>
            <p className="text-lg text-white/90 mb-3">Java 后端工程师 · 架构设计爱好者</p>
            <div className="flex items-center gap-2 justify-center md:justify-start text-white/80">
              <span>📍</span>
              <span>中国北京</span>
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* 关于我 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-2xl">👨‍💻</span>
          关于我
        </h2>
        <div className="prose dark:prose-invert max-w-none space-y-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            你好！我是一名专注于 Java 后端开发的工程师，对分布式系统、高并发架构设计有着浓厚的兴趣。
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            在这个博客中，我分享自己在工作中的技术实践、踩坑经历以及对技术的深度思考。
            希望能够通过文字记录成长，同时帮助到有需要的同行。
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            当前专注于：
          </p>
          <ul className="list-none space-y-2">
            {[
              '🖥️ Java 后端开发与性能优化',
              '🏗️ 分布式系统设计与实现',
              '🤖 AI 应用开发（LangChain/LangGraph）',
              '📝 技术博客与知识沉淀',
              '⚡ 算法与数据结构'
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 技术栈 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-2xl">🛠️</span>
          技术栈
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <div key={skill.category} className="space-y-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                {skill.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 联系方式 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-2xl">📬</span>
          联系方式
        </h2>
        <div className="space-y-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <span className="text-3xl">{link.icon}</span>
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {link.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {link.url}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 博客导航 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold mb-3">想看更多技术文章？</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          欢迎浏览我的博客，探索更多技术内容
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/30"
        >
          <span>🚀</span>
          <span>访问博客首页</span>
        </Link>
      </div>
    </div>
  )
}
