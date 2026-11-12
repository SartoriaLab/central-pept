import { getPeptides, CATEGORY_LABELS } from './peptides';
import { getArticles } from './articles';
import { getGlossary } from './glossary';
import { COMPARISONS } from './comparisons';
import { getBrands } from './brands';
import { getCategoryPages } from './categories';

export type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  type: 'peptide' | 'article' | 'tool' | 'page' | 'ebook';
  url: string;
  keywords: string;
};

// Build search index (static - runs at build time via getSearchIndex)
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
  const tools = [
    { slug: 'reconstituicao', title: 'Calculadora de Reconstituição', desc: 'Cálculo de unidades na seringa' },
    { slug: 'mistura', title: 'Calculadora de Mistura', desc: '2-4 peptídeos no mesmo frasco' },
    { slug: 'conversor', title: 'Conversor mg ↔ mcg ↔ UI', desc: 'Conversão entre unidades' },
    { slug: 'cronograma', title: 'Cronograma de Doses', desc: 'Agenda + export .ics' },
    { slug: 'titulacao', title: 'Subida de Dose — Ozempic e Mounjaro', desc: 'Escada de doses semaglutida / tirzepatida, com datas' },
    { slug: 'custo-glp1', title: 'Custo por Dose — Mounjaro, Ozempic e tirzepatida', desc: 'Custo por mg, por dose e por mês; preço' },
    { slug: 'tabela-doses-glp1', title: 'Tabela de Doses GLP-1 para imprimir', desc: 'Escada de titulação e unidades na seringa' },
  ];
  for (const t of tools) {
    items.push({
      id: `t-${t.slug}`,
      title: t.title,
      subtitle: t.desc,
      type: 'tool',
      url: `/ferramentas/${t.slug}`,
      keywords: [t.title, t.desc, t.slug].join(' ').toLowerCase(),
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
    { url: '/medicamentos', title: 'Mounjaro, Ozempic, Wegovy e Zepbound', desc: 'Diferenças entre as marcas' },
    { url: '/glossario', title: 'Glossário', desc: 'Termos técnicos explicados' },
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

// Simple fuzzy-ish search with score
export function searchIndex(items: SearchResult[], query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = items
    .map((item) => {
      let score = 0;
      const title = item.title.toLowerCase();
      for (const t of tokens) {
        if (title.startsWith(t)) score += 50;
        else if (title.includes(t)) score += 20;
        if (item.keywords.includes(t)) score += 5;
        // bonus por match exato
        if (title === t) score += 100;
      }
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);

  return scored;
}
