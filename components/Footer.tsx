export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 mt-16">
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
        <span>© {year} 我的博客 · 保留所有权利</span>
        <span>
          Built with{' '}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition-colors"
          >
            Next.js
          </a>
          {' & '}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition-colors"
          >
            Tailwind CSS
          </a>
        </span>
      </div>
    </footer>
  )
}
