import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import GlobalSearch from './GlobalSearch';

const NAV = [
  { href: '/peptideos', label: 'Peptídeos' },
  { href: '/ferramentas', label: 'Ferramentas' },
  { href: '/comparar', label: 'Comparar' },
  { href: '/blog', label: 'Blog' },
];

export default function Header() {
  return (
    <header
      role="banner"
      className="bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-40 no-print supports-[backdrop-filter]:bg-surface/70"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center group shrink-0" aria-label="Central Peptídeos — página inicial">
          <Image
            src="/logo.webp"
            alt="Central Peptídeos"
            width={400}
            height={128}
            priority
            unoptimized
            sizes="(max-width: 768px) 140px, 200px"
            className="h-10 md:h-14 w-auto dark:bg-white keep-white dark:rounded-md dark:p-1 transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3.5 py-2 text-sm font-medium text-ink-2 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <span className="w-px h-6 bg-border mx-2" aria-hidden />
          <GlobalSearch />
          <ThemeToggle />
          <Link
            href="/ferramentas/reconstituicao"
            className="ml-1 inline-flex items-center gap-1.5 px-4 h-9 rounded bg-teal text-white font-bold text-sm hover:bg-teal-700 transition-colors shadow-sm"
          >
            Calcular
            <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 10h12M10 4l6 6-6 6" /></svg>
          </Link>
        </nav>

        {/* Mobile: theme + menu */}
        <div className="md:hidden flex items-center gap-1">
          <GlobalSearch />
          <ThemeToggle />
          <details className="relative group">
            <summary className="list-none w-10 h-10 flex items-center justify-center rounded-md cursor-pointer text-ink-2 hover:bg-teal-50 hover:text-teal-700" aria-label="Menu">
              <svg viewBox="0 0 20 20" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden className="group-open:hidden">
                <path d="M3 6h14M3 10h14M3 14h14" />
              </svg>
              <svg viewBox="0 0 20 20" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden className="hidden group-open:block">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </summary>
            <div className="absolute right-0 top-full mt-2 w-60 bg-surface border border-border rounded-xl shadow-xl p-1.5 animate-slide-up">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-ink rounded-lg hover:bg-teal-50 hover:text-teal-700"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-1 border-t border-border" />
              <Link
                href="/ferramentas/reconstituicao"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-bold text-white bg-teal hover:bg-teal-700 rounded-lg"
              >
                Abrir calculadora
                <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 10h12M10 4l6 6-6 6" /></svg>
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
