// Banco de temas: cada post do blog, ficha de peptídeo e comparativo vira um Topic.
// O `source` é o único material que a IA recebe; números fora dele são barrados.
import { getArticleBody, getArticles } from '@/lib/articles';
import { COMPARISONS } from '@/lib/comparisons';
import { CATEGORY_LABELS, REGULATORY_LABELS, getPeptideBySlug, getPeptides, type Peptide } from '@/lib/peptides';
import { NO_EBOOK_PEPTIDES } from '@/lib/ebooks';
import type { Topic } from './types';

/** Fora do Instagram: sem oferta e com risco alto de moderação. */
const EXCLUDED = new Set(NO_EBOOK_PEPTIDES);

/** Posts de compra e preço: a Meta pune conteúdo que facilita venda de medicamento. */
const COMMERCE_POST = /comprar|preco/;

/** MDX → texto: tira componentes e marcação de link, mantém o conteúdo. */
export function mdxToText(body: string): string {
  return body
    .replace(/<Guia\s*\/>/g, '')
    .replace(/<\/?[A-Z][^>]*>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function peptideFacts(p: Peptide): string {
  const lines = [
    `Peptídeo: ${p.name}`,
    p.category && p.category in CATEGORY_LABELS ? `Categoria: ${CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS]}` : '',
    `Resumo: ${p.shortDescription}`,
    `Dose típica: ${p.typicalDose} ${p.doseUnit}, ${p.frequency}`,
    p.doseRange ? `Faixa de dose: ${p.doseRange}` : '',
    p.halfLife ? `Meia-vida: ${p.halfLife}` : '',
    p.commonAmounts.length ? `Frascos comuns: ${p.commonAmounts.map((a) => `${a} mg`).join(', ')}` : '',
    p.regulatoryStatus ? `Status regulatório: ${REGULATORY_LABELS[p.regulatoryStatus].label}` : '',
    p.wadaProhibited ? 'Proibido pela WADA no esporte.' : '',
    p.longDescription ? `Descrição: ${p.longDescription}` : '',
    p.mechanism ? `Mecanismo: ${p.mechanism}` : '',
    p.sideEffects?.length ? `Efeitos colaterais: ${p.sideEffects.join('; ')}` : '',
    p.contraindications?.length ? `Contraindicações: ${p.contraindications.join('; ')}` : '',
  ];
  return lines.filter(Boolean).join('\n');
}

function categoryOf(slugs: string[]): string {
  const p = slugs.map((s) => getPeptideBySlug(s)).find(Boolean);
  return (p?.category as string | undefined) || 'geral';
}

export function buildTopics(): Topic[] {
  const topics: Topic[] = [];

  for (const a of getArticles()) {
    if (a.draft || COMMERCE_POST.test(a.slug)) continue;
    const peptides = a.relatedPeptides ?? [];
    if (peptides.some((s) => EXCLUDED.has(s))) continue;
    const body = mdxToText(getArticleBody(a.slug) ?? '');
    const faq = (a.faq ?? []).map((f) => `P: ${f.q}\nR: ${f.a}`).join('\n');
    const facts = peptides.map((s) => getPeptideBySlug(s)).filter((p): p is Peptide => !!p).map(peptideFacts);
    topics.push({
      id: `post:${a.slug}`,
      kind: 'post',
      slug: a.slug,
      title: a.title,
      category: categoryOf(peptides),
      peptides,
      url: `/blog/${a.slug}`,
      source: [`Título: ${a.title}`, a.tldr ? `Resumo: ${a.tldr}` : '', body, faq, ...facts].filter(Boolean).join('\n\n'),
    });
  }

  for (const p of getPeptides()) {
    if (EXCLUDED.has(p.slug)) continue;
    topics.push({
      id: `peptide:${p.slug}`,
      kind: 'peptide',
      slug: p.slug,
      title: p.name,
      category: (p.category as string | undefined) || 'geral',
      peptides: [p.slug],
      url: `/peptideos/${p.slug}`,
      source: peptideFacts(p),
    });
  }

  for (const c of COMPARISONS) {
    if (c.peptideSlugs.some((s) => EXCLUDED.has(s))) continue;
    const facts = c.peptideSlugs.map((s) => getPeptideBySlug(s)).filter((p): p is Peptide => !!p);
    if (facts.length < 2) continue;
    topics.push({
      id: `comparison:${c.slug}`,
      kind: 'comparison',
      slug: c.slug,
      title: c.title,
      category: categoryOf(c.peptideSlugs),
      peptides: c.peptideSlugs,
      url: `/comparar/${c.slug}`,
      source: [`Comparação: ${c.title}`, ...facts.map(peptideFacts)].join('\n\n'),
    });
  }

  return topics;
}
