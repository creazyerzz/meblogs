import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    template: '%s | 我的博客',
    default: '我的博客',
  },
  description: '分享技术、思考与生活',
  authors: [{ name: '博主' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '我的博客',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
