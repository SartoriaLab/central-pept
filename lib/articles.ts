import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

// Só servidor: lê content/blog/*.mdx do disco. Não importar em componente 'use client'.

export type Author = {
  name: string;
  credentials?: string;
  url?: string;
  image?: string;
};

export type FaqEntry = { q: string; a: string; link?: { label: string; href: string } };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;  // AAAA-MM-DD
  updatedAt?: string;
  readMinutes: number;
  tags: string[];
  relatedPeptides?: string[]; // slugs
  coverColor?: string; // classe tailwind para gradient
  draft?: boolean;     // mostra aviso de draft no hero
  author?: Author;
  reviewedBy?: Author;
  tldr?: string;       // resumo curto (aparece em destaque + melhora featured snippet)
  /** Fontes específicas do artigo. As referências das fichas dos peptídeos citados entram automaticamente. */
  references?: { title: string; url: string }[];
  /** Título e descrição para o Google, quando diferentes do título/resumo exibidos. */
  metaTitle?: string;
  metaDescription?: string;
  /** Perguntas frequentes exibidas no fim do artigo (com FAQPage em JSON-LD). */
  faq?: FaqEntry[];
};

// ─── Artigos em MDX (content/blog/<slug>.mdx) ────────────────────────────────

export const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

// YAML transforma 2026-11-12 em Date: volta para texto AAAA-MM-DD.
const day = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'data no formato AAAA-MM-DD'),
);
const author = z.object({
  name: z.string(),
  credentials: z.string().optional(),
  url: z.string().url().optional(),
  image: z.string().optional(),
});

export const frontmatterSchema = z
  .object({
    title: z.string().min(10),
    excerpt: z.string().min(30),
    tldr: z.string().optional(),
    publishedAt: day,
    updatedAt: day.optional(),
    readMinutes: z.number().int().positive(),
    tags: z.array(z.string()).min(1),
    relatedPeptides: z.array(z.string()).optional(),
    coverColor: z.string().optional(),
    draft: z.boolean().optional(),
    author: author.optional(),
    reviewedBy: author.optional(),
    references: z.array(z.object({ title: z.string(), url: z.string().url() })).optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    faq: z
      .array(z.object({ q: z.string(), a: z.string(), link: z.object({ label: z.string(), href: z.string() }).optional() }))
      .optional(),
  })
  .strict();

type MdxArticle = { meta: Article; body: string };

let mdxCache: Map<string, MdxArticle> | null = null;

function loadMdx(): Map<string, MdxArticle> {
  if (mdxCache) return mdxCache;
  const map = new Map<string, MdxArticle>();
  const files = fs.existsSync(BLOG_DIR) ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx')) : [];
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const parsed = frontmatterSchema.safeParse(data);
    if (!parsed.success) {
      // Falha o build com a mensagem do campo errado, em vez de publicar página quebrada.
      throw new Error(`content/blog/${file}: frontmatter inválido\n${z.prettifyError(parsed.error)}`);
    }
    map.set(slug, { meta: { slug, ...parsed.data }, body: content });
  }
  mdxCache = map;
  return map;
}

/** Corpo MDX do artigo (sem frontmatter), ou undefined se o artigo ainda for TSX. */
export function getArticleBody(slug: string): string | undefined {
  return loadMdx().get(slug)?.body;
}

export function getMdxArticleSlugs(): string[] {
  return Array.from(loadMdx().keys());
}

function allArticles(): Article[] {
  return Array.from(loadMdx().values(), (m) => m.meta);
}

export function getArticles(): Article[] {
  return allArticles().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles().find((a) => a.slug === slug);
}

export function getArticleSlugs(): string[] {
  return allArticles().map((a) => a.slug);
}

// Artigos que citam um peptídeo específico (para linkar ficha → guias)
export function getArticlesByPeptide(peptideSlug: string): Article[] {
  return getArticles().filter(
    (a) => !a.draft && (a.relatedPeptides?.includes(peptideSlug) ?? false)
  );
}

// Posts relacionados por tags/peptídeos em comum (bloco "Leia também")
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const tags = new Set(article.tags);
  const peps = new Set(article.relatedPeptides ?? []);
  return getArticles()
    .filter((a) => !a.draft && a.slug !== article.slug)
    .map((a) => {
      const tagOverlap = a.tags.filter((t) => tags.has(t)).length;
      const pepOverlap = (a.relatedPeptides ?? []).filter((p) => peps.has(p)).length;
      return { a, score: tagOverlap + pepOverlap * 2 };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.a);
}

const iso = (d: string): string => (d.includes('T') ? d : `${d}T00:00:00-03:00`);

// URL da imagem OG do artigo (gerada no build em /og/blog/<slug>). Relativa —
// resolvida por metadataBase.
export function articleOgImageUrl(article: Article): string {
  return `/og/blog/${article.slug}`;
}

// Bloco openGraph/twitter de artigo — para plugar em posts já existentes
// sem sobrescrever title/description curados manualmente.
export function articleOpenGraph(article: Article): Pick<Metadata, 'openGraph' | 'twitter'> {
  const img = articleOgImageUrl(article);
  return {
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: `/blog/${article.slug}`,
      publishedTime: iso(article.publishedAt),
      ...(article.updatedAt ? { modifiedTime: iso(article.updatedAt) } : {}),
      images: [{ url: img, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [img],
    },
  };
}

// Metadata completo a partir do artigo — usado pelos posts novos (Fase D).
export function buildArticleMetadata(article: Article): Metadata {
  return {
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    ...articleOpenGraph(article),
  };
}
