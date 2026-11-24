// Monta a entrada de lib/ebooks.ts a partir de docs/ebooks/<slug>/catalogo.json (série "Os Segredos").
//
//   node scripts/ebook-catalog.mjs <slug> <id> <peptideo> [checkoutEnv] [checkoutUrl] [kiwifyProductId]
//
// Imprime o objeto em TypeScript para colar em EBOOKS. Cover, bumps e places seguem o padrão da série
// (bump T1, um peptídeo); ajuste à mão se precisar (categories, posts).

import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const [slug, id, peptide, env, url, productId] = process.argv.slice(2);
if (!slug || !id || !peptide) {
  console.error('uso: node scripts/ebook-catalog.mjs <slug> <id> <peptideo> [checkoutEnv] [checkoutUrl] [kiwifyProductId]');
  process.exit(1);
}
const ROOT = resolve(import.meta.dirname, '..');
const c = JSON.parse(readFileSync(join(ROOT, 'docs', 'ebooks', slug, 'catalogo.json'), 'utf8'));
const hasSample = existsSync(join(ROOT, 'public', 'ebooks', slug, 'amostra-1.webp'));

const COVERS = [
  'from-violet-600 via-indigo-700 to-slate-800',
  'from-cyan-600 via-sky-700 to-slate-800',
  'from-fuchsia-600 via-purple-700 to-slate-800',
  'from-amber-500 via-orange-600 to-rose-800',
  'from-lime-600 via-emerald-700 to-slate-800',
  'from-blue-600 via-indigo-700 to-violet-900',
];
const cover = COVERS[[...slug].reduce((a, ch) => a + ch.charCodeAt(0), 0) % COVERS.length];

const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const arr = (xs, ind) => `[\n${xs.map((x) => `${ind}  ${q(x)},`).join('\n')}\n${ind}]`;
const I = '    ';
const lines = [
  '  {',
  `${I}id: ${q(id)},`,
  `${I}slug: ${q(slug)},`,
  `${I}kind: 'individual',`,
  `${I}title: ${q(c.title)},`,
  ...(c.formerTitles?.length ? [`${I}formerTitles: ${arr(c.formerTitles, I)},`] : []),
  `${I}altTitle: ${q(c.altTitle)},`,
  `${I}subtitle: ${q(c.subtitle)},`,
  `${I}hook: ${q(c.hook)},`,
  `${I}line: ${q(c.line)},`,
  `${I}price: ${c.price ?? 29.9},`,
  `${I}pages: ${c.pages},`,
  `${I}forWho: ${arr(c.forWho, I)},`,
  `${I}notFor: ${arr(c.notFor, I)},`,
  `${I}pains: [\n${c.pains.map((p) => `${I}  { erro: ${q(p.erro)}, custo: ${q(p.custo)} },`).join('\n')}\n${I}],`,
  `${I}reveals: ${arr(c.reveals, I)},`,
  `${I}anchor: ${q(c.anchor)},`,
  `${I}revised: ${q(c.revised ?? 'novembro de 2026')},`,
  `${I}toc: ${arr(c.toc, I)},`,
  `${I}tocNotes: ${arr(c.tocNotes, I)},`,
  `${I}bonuses: ${arr(c.bonuses, I)},`,
  ...(hasSample ? [`${I}sample: [${q(`/ebooks/${slug}/amostra-1.webp`)}, ${q(`/ebooks/${slug}/amostra-2.webp`)}],`] : []),
  `${I}sources: ${arr(c.sources, I)},`,
  `${I}faq: [\n${c.faq.map((f) => `${I}  { q: ${q(f.q)}, a: ${q(f.a)} },`).join('\n')}\n${I}],`,
  `${I}bumps: ['T1'],`,
  `${I}cover: ${q(cover)},`,
  `${I}checkoutEnv: ${q(env ?? `KIWIFY_CHECKOUT_${peptide.replace(/[^a-z0-9]/gi, '').toUpperCase()}`)},`,
  ...(url ? [`${I}checkoutDefault: ${q(url)},`] : []),
  ...(productId ? [`${I}kiwifyProductId: ${q(productId)},`] : []),
  `${I}places: { peptides: [${q(peptide)}] },`,
  '  },',
];
console.log(lines.join('\n'));
