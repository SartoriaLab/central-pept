import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SiteChrome from '@/components/layout/SiteChrome';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Script roda antes do React hidratar para evitar flash de tema errado.
// Escolha salva no ThemeToggle vence; sem escolha, segue o tema do sistema.
const themeInitScript = `
try {
  var t = localStorage.getItem('peptidecalc:theme');
  if (t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`.trim();

const PLAUSIBLE = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
import { CONTACT_EMAIL, SITE_URL } from '@/lib/site';

// Schemas globais — aparecem em todas as páginas
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Central Peptídeos',
  alternateName: 'Central Peptídeos Brasil',
  url: SITE_URL,
  inLanguage: 'pt-BR',
  description: 'Central brasileira de informação sobre peptídeos: calculadoras, enciclopédia e guias.',
  // Faz o Google exibir uma caixa de busca nos resultados, apontando pra busca interna
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/peptideos?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Central Peptídeos',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 794,
    height: 255,
  },
  sameAs: [
    // adicionar perfis em redes sociais quando houver
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: CONTACT_EMAIL,
    availableLanguage: ['pt-BR'],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Central Peptídeos — Calculadoras e enciclopédia',
    template: '%s · Central Peptídeos',
  },
  description:
    'Central brasileira de informação sobre peptídeos: enciclopédia, calculadoras de reconstituição, mistura, conversão de unidades e guias.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Central Peptídeos',
    images: [{ url: '/og/pagina/home', width: 1200, height: 630, alt: 'Central Peptídeos' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og/pagina/home'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icone/32', type: 'image/png', sizes: '32x32' },
      { url: '/icone/192', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/icone/32',
    apple: { url: '/icone/180', sizes: '180x180', type: 'image/png' },
  },
  robots: { index: true, follow: true },
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0d9488' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* RSS/Atom discovery */}
        <link rel="alternate" type="application/rss+xml" title="Central Peptídeos — Blog" href="/feed.xml" />
        {/* Preload logo pra melhorar LCP */}
        <link rel="preload" as="image" href="/logo.webp" type="image/webp" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {PLAUSIBLE && (
          <Script
            src="https://plausible.io/js/script.js"
            data-domain={PLAUSIBLE}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-2 focus:bg-teal focus:text-white focus:rounded-md focus:shadow-lg focus:font-semibold focus:text-sm"
        >
          Pular para o conteúdo
        </a>
        {/* /embed/* roda em iframe de terceiros: sem cabeçalho nem rodapé */}
        <SiteChrome><Header /></SiteChrome>
        <main id="main" tabIndex={-1} className="flex-1 outline-none">{children}</main>
        <SiteChrome><Footer /></SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
