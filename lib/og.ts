import type { Metadata } from 'next';

// Imagens de compartilhamento geradas no build em /og/<kind>/<slug>
// (ver app/og/[kind]/[slug]/route.tsx).
export type OgKind = 'blog' | 'comparar' | 'calculadora' | 'medicamentos' | 'categoria' | 'glossario' | 'pagina';

/** Páginas fixas com imagem própria: chave → título e rótulo exibidos no cartão. */
export const OG_PAGES: Record<string, { title: string; eyebrow: string }> = {
  home: { title: 'Peptídeos, cálculo sem erro.', eyebrow: 'Gratuito · sem cadastro' },
  ferramentas: { title: 'Calculadoras de peptídeos: reconstituição, dose e custo', eyebrow: 'Ferramentas' },
  reconstituicao: { title: 'Calculadora de reconstituição: quantas unidades puxar na seringa', eyebrow: 'Calculadora' },
  mistura: { title: 'Calculadora de mistura de peptídeos na mesma seringa', eyebrow: 'Calculadora' },
  conversor: { title: 'Conversor mg, mcg e UI para peptídeos', eyebrow: 'Calculadora' },
  cronograma: { title: 'Cronograma de doses de peptídeos', eyebrow: 'Calculadora' },
  titulacao: { title: 'Subida de dose: Ozempic, Wegovy e Mounjaro semana a semana', eyebrow: 'Calculadora' },
  'custo-glp1': { title: 'Custo por dose e por mês: Mounjaro, Ozempic e tirzepatida', eyebrow: 'Calculadora' },
  'tabela-doses-glp1': { title: 'Tabela de doses de Mounjaro, Ozempic e Wegovy para imprimir', eyebrow: 'Tabela' },
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
