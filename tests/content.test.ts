// Integridade do conteúdo: roda em `npm test` e no CI. Quebra quando um slug citado
// não existe, quando um post MDX não compila ou quando um link interno aponta para o nada.
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { getArticleBody, getArticles, getMdxArticleSlugs } from '@/lib/articles';
import { getPeptides, CATEGORY_LABELS } from '@/lib/peptides';
import { COMPARISONS } from '@/lib/comparisons';
import { getBrands } from '@/lib/brands';
import { TITRATION_SCHEMES } from '@/lib/titration';
import { getCategoryPages } from '@/lib/categories';
import { SYRINGES } from '@/lib/syringes';
import { dosePath, getDosePages } from '@/lib/dose-pages';
import { getVialPages, vialPath } from '@/lib/vials';
import { getGlossary } from '@/lib/glossary';

const peptideSlugs = new Set(getPeptides().map((p) => p.slug));
const articleSlugs = new Set(getArticles().map((a) => a.slug));

function dupes(list: string[]): string[] {
  return list.filter((s, i) => list.indexOf(s) !== i);
}

describe('slugs únicos', () => {
  it.each([
    ['peptídeos', getPeptides().map((p) => p.slug)],
    ['artigos', getArticles().map((a) => a.slug)],
    ['comparativos', COMPARISONS.map((c) => c.slug)],
    ['marcas', getBrands().map((b) => b.slug)],
    ['glossário', getGlossary().map((g) => g.slug)],
    ['categorias', getCategoryPages().map((c) => c.slug)],
    ['titulação', TITRATION_SCHEMES.map((t) => t.id)],
  ])('%s', (_name, slugs) => {
    expect(dupes(slugs)).toEqual([]);
  });
});

describe('referências entre arquivos de conteúdo', () => {
  it('peptídeos: categoria conhecida, dose positiva e frascos', () => {
    for (const p of getPeptides()) {
      if (p.category) expect(Object.keys(CATEGORY_LABELS), p.slug).toContain(p.category);
      expect(p.typicalDose, p.slug).toBeGreaterThan(0);
      expect(p.commonAmounts.length, p.slug).toBeGreaterThan(0);
      for (const r of p.references ?? []) expect(r.url, p.slug).toMatch(/^https?:\/\//);
    }
  });

  it('artigos citam peptídeos que existem', () => {
    for (const a of getArticles()) {
      for (const s of a.relatedPeptides ?? []) expect(peptideSlugs.has(s), `${a.slug} → ${s}`).toBe(true);
    }
  });

  it('comparativos citam peptídeos e posts que existem', () => {
    for (const c of COMPARISONS) {
      for (const s of c.peptideSlugs) expect(peptideSlugs.has(s), `${c.slug} → ${s}`).toBe(true);
      if (c.relatedPost) expect(articleSlugs.has(c.relatedPost), `${c.slug} → ${c.relatedPost}`).toBe(true);
    }
  });

  it('marcas apontam para peptídeo, titulação, marca irmã e posts que existem', () => {
    const brands = new Set(getBrands().map((b) => b.slug));
    const schemes = new Set(TITRATION_SCHEMES.map((t) => t.id));
    for (const b of getBrands()) {
      expect(peptideSlugs.has(b.peptideSlug), `${b.slug} → ${b.peptideSlug}`).toBe(true);
      expect(schemes.has(b.titrationSchemeId), `${b.slug} → ${b.titrationSchemeId}`).toBe(true);
      expect(brands.has(b.sibling.slug), `${b.slug} → ${b.sibling.slug}`).toBe(true);
      for (const s of b.articles) expect(articleSlugs.has(s), `${b.slug} → ${s}`).toBe(true);
    }
  });

  it('titulação aponta para peptídeo que existe', () => {
    for (const t of TITRATION_SCHEMES) expect(peptideSlugs.has(t.peptideSlug), t.id).toBe(true);
  });

  it('glossário: termos relacionados existem', () => {
    const terms = new Set(getGlossary().map((g) => g.slug));
    for (const g of getGlossary()) {
      for (const r of g.related ?? []) expect(terms.has(r), `${g.slug} → ${r}`).toBe(true);
    }
  });
});

// ─── Posts MDX ───────────────────────────────────────────────────────────────

/** Rotas que existem no build: páginas fixas de app/ + todas as dinâmicas a partir dos dados. */
function knownPaths(): Set<string> {
  const paths = new Set<string>(['/']);
  const appDir = path.join(process.cwd(), 'app');
  const walk = (dir: string, route: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      if (e.name.startsWith('[') || e.name.startsWith('(') || e.name.startsWith('_')) continue;
      const r = `${route}/${e.name}`;
      const sub = path.join(dir, e.name);
      if (fs.existsSync(path.join(sub, 'page.tsx')) || fs.existsSync(path.join(sub, 'route.ts'))) paths.add(r);
      walk(sub, r);
    }
  };
  walk(appDir, '');
  for (const p of getPeptides()) {
    paths.add(`/peptideos/${p.slug}`);
    paths.add(`/ferramentas/reconstituicao/${p.slug}`);
  }
  for (const a of getArticles()) paths.add(`/blog/${a.slug}`);
  for (const c of COMPARISONS) paths.add(`/comparar/${c.slug}`);
  for (const b of getBrands()) paths.add(`/medicamentos/${b.slug}`);
  for (const g of getGlossary()) paths.add(`/glossario/${g.slug}`);
  for (const c of getCategoryPages()) paths.add(`/peptideos/categoria/${c.slug}`);
  for (const s of SYRINGES) paths.add(`/seringas/${s.slug}`);
  for (const { peptide, dose } of getDosePages()) paths.add(dosePath(peptide.slug, dose));
  for (const { peptide, mg } of getVialPages()) paths.add(vialPath(peptide, mg));
  return paths;
}

describe('posts MDX', () => {
  const slugs = getMdxArticleSlugs();
  const routes = knownPaths();

  it.each(slugs)('%s compila e só usa componentes conhecidos', async (slug) => {
    const body = getArticleBody(slug)!;
    // Mesmo pipeline da página (remark-gfm). Expressões {…} são bloqueadas no site.
    await compile(body, { remarkPlugins: [remarkGfm] });
    expect(body, 'expressão JavaScript {…} não é permitida no MDX').not.toMatch(/\{[^}]*\}/);
    const tags = Array.from(body.matchAll(/<([A-Z][A-Za-z]*)/g), (m) => m[1]);
    for (const t of tags) expect(['Callout', 'Link'], `<${t}> em ${slug}`).toContain(t);
  });

  it.each(slugs)('%s: links internos existem', (slug) => {
    const body = getArticleBody(slug)!;
    const links = [
      ...Array.from(body.matchAll(/\]\((\/[^)\s]*)\)/g), (m) => m[1]),
      ...Array.from(body.matchAll(/href="(\/[^"]*)"/g), (m) => m[1]),
    ];
    for (const l of links) {
      const clean = l.split(/[?#]/)[0].replace(/\/$/, '') || '/';
      expect(routes.has(clean), `${slug} → ${l}`).toBe(true);
    }
  });
});
