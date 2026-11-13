import { getPeptides, CATEGORY_LABELS } from './peptides';
import { getArticles } from './articles';
import { getGlossary } from './glossary';
import { COMPARISONS } from './comparisons';
import { getBrands } from './brands';
import { getCategoryPages } from './categories';
import { TOOLS } from './tools';
import { SYRINGES } from './syringes';

import type { SearchResult } from './search';

export type { SearchResult };

// Índice da busca global. Só servidor: servido como JSON estático em /busca.json
// (app/busca.json/route.ts) e baixado pelo GlobalSearch quando a busca abre.
export function buildSearchIndex(): SearchResult[] {
  const items: SearchResult[] = [];

  // Peptídeos
  for (const p of getPeptides()) {
    items.push({
      id: `p-${p.slug}`,
      title: p.name,
      subtitle: p.shortDescription,
      type: 'peptide',
      url: `/peptideos/${p.slug}`,
      keywords: [
        p.name,
        p.slug,
        p.shortDescription,
        p.category && p.category in CATEGORY_LABELS ? CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS] : '',
        p.category || '',
      ].join(' ').toLowerCase(),
    });
  }

  // Artigos
  for (const a of getArticles()) {
    items.push({
      id: `a-${a.slug}`,
      title: a.title,
      subtitle: a.excerpt,
      type: 'article',
      url: `/blog/${a.slug}`,
      keywords: [a.title, a.excerpt, ...a.tags].join(' ').toLowerCase(),
    });
  }

  // Ferramentas
  for (const t of TOOLS) {
    items.push({
      id: `t-${t.slug}`,
      title: t.title,
      subtitle: t.shortDesc,
      type: 'tool',
      url: `/ferramentas/${t.slug}`,
      keywords: [t.title, t.shortTitle, t.shortDesc, t.slug].join(' ').toLowerCase(),
    });
  }

  // Calculadora por peptídeo
  for (const p of getPeptides()) {
    items.push({
      id: `tc-${p.slug}`,
      title: `Calculadora de ${p.name}`,
      subtitle: 'Unidades na seringa por dose',
      type: 'tool',
      url: `/ferramentas/reconstituicao/${p.slug}`,
      keywords: ['calculadora', 'reconstituição', 'unidades', 'seringa', 'dose', p.name, p.slug].join(' ').toLowerCase(),
    });
  }

  // Comparativos
  for (const c of COMPARISONS) {
    items.push({
      id: `c-${c.slug}`,
      title: c.title,
      subtitle: 'Comparativo lado a lado',
      type: 'page',
      url: `/comparar/${c.slug}`,
      keywords: [c.title, c.slug, 'comparar', 'diferença', 'versus'].join(' ').toLowerCase(),
    });
  }

  // Marcas comerciais
  for (const b of getBrands()) {
    items.push({
      id: `m-${b.slug}`,
      title: `${b.name} (${b.activeIngredient.toLowerCase()})`,
      subtitle: b.summary,
      type: 'page',
      url: `/medicamentos/${b.slug}`,
      keywords: [b.name, b.activeIngredient, b.manufacturer, 'marca', 'medicamento', 'caneta', 'dose'].join(' ').toLowerCase(),
    });
  }

  // Peptídeos por objetivo
  for (const c of getCategoryPages()) {
    items.push({
      id: `cat-${c.slug}`,
      title: c.title,
      subtitle: c.summary,
      type: 'page',
      url: `/peptideos/categoria/${c.slug}`,
      keywords: [c.title, c.label, c.slug, 'categoria', 'objetivo', 'lista'].join(' ').toLowerCase(),
    });
  }

  // Glossário
  for (const t of getGlossary()) {
    items.push({
      id: `g-${t.slug}`,
      title: t.term,
      subtitle: t.definition,
      type: 'page',
      url: `/glossario/${t.slug}`,
      keywords: [t.term, t.slug, 'glossário', 'o que é'].join(' ').toLowerCase(),
    });
  }

  // Páginas
  const pages = [
    { url: '/comparar', title: 'Comparador de peptídeos', desc: 'Até 4 peptídeos lado a lado' },
    { url: '/medicamentos', title: 'Mounjaro, Ozempic, Wegovy, Saxenda e outras marcas', desc: 'Diferenças entre as marcas de GLP-1' },
    { url: '/glossario', title: 'Glossário', desc: 'Termos técnicos explicados' },
    { url: '/seringas', title: 'Como ler a seringa de insulina', desc: 'Unidades, ml e mg; seringas de 30, 50 e 100 U' },
    ...SYRINGES.map((s) => ({ url: `/seringas/${s.slug}`, title: `Seringa de insulina de ${s.label}`, desc: `Cada traço vale ${s.tick} U; tabela de mg por marca` })),
    { url: '/blog', title: 'Blog', desc: 'Artigos e guias' },
    { url: '/sobre', title: 'Sobre', desc: 'Metodologia editorial' },
    { url: '/contato', title: 'Contato', desc: 'Correções e sugestões' },
  ];
  for (const pg of pages) {
    items.push({
      id: `pg-${pg.url}`,
      title: pg.title,
      subtitle: pg.desc,
      type: 'page',
      url: pg.url,
      keywords: [pg.title, pg.desc].join(' ').toLowerCase(),
    });
  }

  return items;
}
