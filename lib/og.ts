import type { Metadata } from 'next';
import { TOOLS } from './tools';

// Imagens de compartilhamento geradas no build em /og/<kind>/<slug>
// (ver app/og/[kind]/[slug]/route.tsx).
export type OgKind = 'blog' | 'comparar' | 'calculadora' | 'medicamentos' | 'categoria' | 'glossario' | 'pagina';

/** Páginas fixas com imagem própria: chave → título e rótulo exibidos no cartão. */
export const OG_PAGES: Record<string, { title: string; eyebrow: string }> = {
  home: { title: 'Peptídeos, cálculo sem erro.', eyebrow: 'Gratuito · sem cadastro' },
  ferramentas: { title: 'Calculadoras de peptídeos: reconstituição, dose e custo', eyebrow: 'Ferramentas' },
  ...Object.fromEntries(TOOLS.map((t) => [t.slug, t.og])),
  peptideos: { title: 'Enciclopédia de peptídeos: dose, efeitos e status regulatório', eyebrow: 'Enciclopédia' },
  comparar: { title: 'Comparador de peptídeos lado a lado', eyebrow: 'Comparativo' },
  blog: { title: 'Guias de dose, reconstituição e GLP-1', eyebrow: 'Blog' },
  glossario: { title: 'Glossário de peptídeos: termos técnicos explicados', eyebrow: 'Glossário' },
  medicamentos: { title: 'Mounjaro, Ozempic, Wegovy e Zepbound: diferenças e doses', eyebrow: 'Medicamentos' },
};

export function ogImageUrl(kind: OgKind, slug: string): string {
  return `/og/${kind}/${slug}`;
}

/** Só a imagem: título e descrição do cartão vêm do `title`/`description` da página. */
export function socialImage(kind: OgKind, slug: string, path: string, alt = 'Central Peptídeos'): Pick<Metadata, 'openGraph' | 'twitter'> {
  const img = ogImageUrl(kind, slug);
  return {
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Central Peptídeos',
      url: path,
      images: [{ url: img, width: 1200, height: 630, alt }],
    },
    twitter: { card: 'summary_large_image', images: [img] },
  };
}

/**
 * Bloco openGraph + twitter completo. Definir `openGraph` numa página substitui
 * o do layout inteiro (inclusive a imagem), então sempre passamos tudo aqui.
 */
export function social(opts: {
  kind: OgKind;
  slug: string;
  path: string;
  title: string;
  description: string;
  type?: 'website' | 'article';
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  const img = ogImageUrl(opts.kind, opts.slug);
  return {
    openGraph: {
      type: opts.type ?? 'website',
      locale: 'pt_BR',
      siteName: 'Central Peptídeos',
      title: opts.title,
      description: opts.description,
      url: opts.path,
      images: [{ url: img, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [img],
    },
  };
}
