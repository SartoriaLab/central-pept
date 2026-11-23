// Guia do slide final e da última fala. Mesma regra de oferta do site (ebookFor*), limitada
// aos guias com checkout em produção (lidos de /busca.json, que só lista os ativos).
import {
  ebookForComparison,
  ebookForPeptide,
  ebookForPost,
  formatPrice,
  getEbookById,
  getEbookBySlug,
  getEbooks,
  type Ebook,
} from '@/lib/ebooks';
import { SITE_URL } from '@/lib/site';
import type { Cta, Topic } from './types';

/** A tabela personalizada é oferta da calculadora, não "guia". */
const isGuide = (e: Ebook) => e.kind !== 'tabela';

function preferred(topic: Topic): Ebook | undefined {
  if (topic.kind === 'post') return ebookForPost(topic.slug, topic.peptides);
  if (topic.kind === 'comparison') return ebookForComparison(topic.peptides);
  return ebookForPeptide(topic.slug);
}

/**
 * Guia pago citado no post (slide final, fala e linha 📘). Desligado em 23/11/2026: um Reels foi
 * sinalizado e a conta saiu das recomendações; a regra do Instagram tira de recomendação post que
 * vende produto com alegação de saúde. Sem guia, o post chama para as calculadoras grátis.
 */
export const GUIDE_IN_POSTS = false;

export function ctaFor(topic: Topic, activeSlugs: Set<string>): Cta | null {
  return GUIDE_IN_POSTS ? guideFor(topic, activeSlugs) : null;
}

/** Guia que o post citaria (mesma regra do site), com a chave ligada ou não. */
export function guideFor(topic: Topic, activeSlugs: Set<string>): Cta | null {
  const active = getEbooks().filter((e) => activeSlugs.has(e.slug) && isGuide(e));
  if (active.length === 0) return null;
  const isActive = (e?: Ebook): e is Ebook => !!e && active.some((a) => a.id === e.id);

  const first = preferred(topic);
  const kit = getEbookById('KIT');
  const chosen = isActive(first) ? first : isActive(kit) ? kit : active[0];
  const others = active.filter((e) => e.id !== chosen.id && e.kind !== 'kit').length;

  return {
    id: chosen.id,
    slug: chosen.slug,
    title: chosen.title,
    priceLabel: formatPrice(chosen.price),
    cover: chosen.cover,
    others,
  };
}

/** Slugs dos guias ativos no site em produção. */
export async function fetchActiveEbookSlugs(fetchFn: typeof fetch = fetch): Promise<Set<string>> {
  const res = await fetchFn(`${SITE_URL}/busca.json`);
  if (!res.ok) throw new Error(`busca.json respondeu ${res.status}`);
  const items = (await res.json()) as { id: string }[];
  const slugs = items
    .filter((i) => i.id.startsWith('e-'))
    .map((i) => i.id.slice(2))
    .filter((s) => getEbookBySlug(s));
  return new Set(slugs);
}
