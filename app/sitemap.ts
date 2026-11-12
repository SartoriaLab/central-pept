import type { MetadataRoute } from 'next';
import { getPeptides } from '@/lib/peptides';
import { getArticles } from '@/lib/articles';
import { getComparisonSlugs } from '@/lib/comparisons';
import { getGlossarySlugs } from '@/lib/glossary';
import { CONTENT_UPDATED_AT } from '@/lib/site';
import { getBrandSlugs } from '@/lib/brands';
import { getCategoryPageSlugs } from '@/lib/categories';
import { getVialPages, vialPath } from '@/lib/vials';

export const dynamic = 'force-static';

const SITE = process.env.SITE_URL || 'https://centralpeptideos.com.br';

function url(path: string): string {
  return `${SITE}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Datas reais, não a hora do build: <lastmod> só é útil se refletir mudança de conteúdo.
  const day = (d: string) => new Date(d.includes('T') ? d : `${d}T12:00:00-03:00`);
  const now = day(CONTENT_UPDATED_AT);
  const latest = (...dates: (string | undefined)[]) =>
    day(dates.filter((d): d is string => !!d).sort().pop() ?? CONTENT_UPDATED_AT);
  const peptides = getPeptides();

  const staticPaths: Array<{ path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }> = [
    { path: '/',                            priority: 1.0, changeFrequency: 'weekly' },
    { path: '/ferramentas/reconstituicao',  priority: 0.95, changeFrequency: 'monthly' },
    { path: '/peptideos',                   priority: 0.9, changeFrequency: 'weekly' },
    { path: '/ferramentas',                 priority: 0.85, changeFrequency: 'monthly' },
    { path: '/ferramentas/mistura',         priority: 0.8, changeFrequency: 'monthly' },
    { path: '/ferramentas/conversor',       priority: 0.8, changeFrequency: 'monthly' },
    { path: '/ferramentas/cronograma',      priority: 0.8, changeFrequency: 'monthly' },
    { path: '/ferramentas/titulacao',       priority: 0.85, changeFrequency: 'monthly' },
    { path: '/ferramentas/custo-glp1',      priority: 0.85, changeFrequency: 'monthly' },
    { path: '/ferramentas/tabela-doses-glp1', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/medicamentos',                priority: 0.85, changeFrequency: 'monthly' },
    { path: '/comparar',                    priority: 0.85, changeFrequency: 'weekly' },
    { path: '/blog',                        priority: 0.85, changeFrequency: 'weekly' },
    { path: '/glossario',                   priority: 0.7, changeFrequency: 'monthly' },
    { path: '/metodologia',                 priority: 0.6, changeFrequency: 'monthly' },
    { path: '/sobre',                       priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contato',                     priority: 0.4, changeFrequency: 'monthly' },
    { path: '/privacidade',                 priority: 0.3, changeFrequency: 'monthly' },
    { path: '/termos',                      priority: 0.3, changeFrequency: 'monthly' },
  ];

  // Só artigos publicados (exclui rascunhos), alinhado com o feed
  const publishedArticles = getArticles().filter((a) => !a.draft);

  // Tag archives do blog
  const allTags = Array.from(new Set(publishedArticles.flatMap((a) => a.tags)));
  const slugify = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');

  return [
    ...staticPaths.map((p) => ({
      url: url(p.path),
      lastModified: now,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...peptides.map((p) => ({
      url: url(`/peptideos/${p.slug}`),
      lastModified: latest(p.lastReviewed, CONTENT_UPDATED_AT),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    // Calculadora de reconstituição por peptídeo
    ...peptides.map(({ slug }) => ({
      url: url(`/ferramentas/reconstituicao/${slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    // Tabela por frasco (peptídeo × mg)
    ...getVialPages().map(({ peptide, mg }) => ({
      url: url(vialPath(peptide, mg)),
      lastModified: latest(peptide.lastReviewed, CONTENT_UPDATED_AT),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // Marcas comerciais (Mounjaro, Ozempic...)
    ...getBrandSlugs().map((slug) => ({
      url: url(`/medicamentos/${slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    // Peptídeos por objetivo
    ...getCategoryPageSlugs().map((slug) => ({
      url: url(`/peptideos/categoria/${slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...getGlossarySlugs().map((slug) => ({
      url: url(`/glossario/${slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...publishedArticles.map((a) => ({
      url: url(`/blog/${a.slug}`),
      lastModified: latest(a.updatedAt ?? a.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...allTags.map((t) => ({
      url: url(`/blog/tag/${slugify(t)}`),
      // Arquivo de tag muda quando entra ou é atualizado um artigo com a tag
      lastModified: latest(...publishedArticles.filter((a) => a.tags.includes(t)).map((a) => a.updatedAt ?? a.publishedAt)),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...getComparisonSlugs().map((slug) => ({
      url: url(`/comparar/${slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ];
}
