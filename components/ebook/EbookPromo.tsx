import EbookCTA from './EbookCTA';
import { getEbooks, type Ebook } from '@/lib/ebooks';

type Props = {
  /** Slugs de peptídeos da página — o ebook entra se cobrir algum deles. */
  peptideSlugs?: string[];
  /** Tags/temas da página (ex.: 'glp-1', 'pele'). */
  tags?: string[];
  /** Identificador do local, para medir qual página converte. */
  source: string;
  className?: string;
};

/** Primeiro ebook próprio relacionado ao assunto da página, ou undefined se nenhum servir. */
export function pickEbook(peptideSlugs: string[] = [], tags: string[] = []): Ebook | undefined {
  const ebooks = getEbooks();
  // O primeiro peptídeo da página tem prioridade: é o assunto principal dela.
  for (const slug of peptideSlugs) {
    const match = ebooks.find((e) => e.relatedPeptides?.includes(slug));
    if (match) return match;
  }
  return ebooks.find((e) => e.relatedTags?.some((t) => tags.includes(t)));
}

/**
 * Chamada discreta para o ebook próprio relacionado ao tema da página.
 * Não renderiza nada quando não há ebook sobre o assunto — sem anúncio genérico.
 */
export default function EbookPromo({ peptideSlugs, tags, source, className = '' }: Props) {
  const ebook = pickEbook(peptideSlugs, tags);
  if (!ebook) return null;
  return (
    <aside className={`no-print ${className}`} aria-label="Material complementar">
      <EbookCTA ebook={ebook} variant="inline" source={source} />
    </aside>
  );
}
