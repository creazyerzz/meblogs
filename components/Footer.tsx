import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            © 2026 周广晨
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/creazyerzz" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
              博客
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
