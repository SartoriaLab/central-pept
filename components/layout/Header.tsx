import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import GlobalSearch from './GlobalSearch';
import MobileMenu from './MobileMenu';
import NavLinks from './NavLinks';

const NAV = [
  { href: '/peptideos', label: 'Peptídeos' },
  { href: '/ferramentas', label: 'Ferramentas' },
  { href: '/comparar', label: 'Comparar' },
  { href: '/blog', label: 'Blog' },
];

// No celular não há barra de links: o menu leva também às seções que no desktop
// ficam só no rodapé.
const MOBILE_NAV = [
  ...NAV,
  { href: '/medicamentos', label: 'Medicamentos' },
  { href: '/glossario', label: 'Glossário' },
  { href: '/sobre', label: 'Sobre' },
];

export default function Header() {
  return (
    <header
      role="banner"
      className="bg-surface border-b border-border sticky top-0 z-40 no-print supports-[backdrop-filter]:bg-surface/85 supports-[backdrop-filter]:backdrop-blur-md"
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
            className="h-10 md:h-14 w-auto dark:[filter:brightness(1.45)_saturate(1.1)] transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        {/* Navegação: links só a partir de lg (em 768 px a linha inteira não cabe) */}
        <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-1 ml-auto">
          <NavLinks items={NAV} />
          <span className="w-px h-6 bg-border mx-2" aria-hidden />
        </nav>

        {/* Busca, tema, CTA e menu: uma instância só de cada */}
        <div className="flex items-center gap-1">
          <GlobalSearch />
          <ThemeToggle />
          <Link
            href="/ferramentas/reconstituicao"
            className="hidden md:inline-flex ml-1 items-center gap-1.5 px-4 h-11 rounded bg-teal-700 text-white dark:text-bg font-bold text-sm hover:brightness-110 transition shadow-sm"
          >
            Calcular
            <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 10h12M10 4l6 6-6 6" /></svg>
          </Link>
          <MobileMenu items={MOBILE_NAV} />
        </div>
      </div>
    </header>
  );
}
