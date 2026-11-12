import Link from 'next/link';
import { getGlossary } from '@/lib/glossary';

// Texto corrido com a primeira ocorrência de cada termo do glossário virando link.
// Componente de servidor: nada disso vai para o JavaScript do navegador.

type Matcher = { slug: string; re: RegExp };

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// "GH (hormônio do crescimento)" → "GH"; siglas casam só em maiúsculas.
const MATCHERS: Matcher[] = getGlossary().map((t) => {
  const label = t.term.replace(/\s*\(.*\)\s*$/, '').trim();
  const acronym = label === label.toUpperCase();
  return {
    slug: t.slug,
    re: new RegExp(`(?<![\\p{L}\\p{N}-])${escape(label)}(?![\\p{L}\\p{N}-])`, acronym ? 'u' : 'iu'),
  };
});

export default function GlossaryText({
  text,
  exclude,
  max = 6,
}: {
  text: string;
  /** Slug do termo da própria página, para não linkar para si mesma. */
  exclude?: string;
  max?: number;
}) {
  const out: React.ReactNode[] = [];
  const used = new Set<string>(exclude ? [exclude] : []);
  let rest = text;
  let links = 0;

  while (rest && links < max) {
    let best: { slug: string; index: number; length: number } | null = null;
    for (const m of MATCHERS) {
      if (used.has(m.slug)) continue;
      const hit = m.re.exec(rest);
      if (!hit) continue;
      if (!best || hit.index < best.index || (hit.index === best.index && hit[0].length > best.length)) {
        best = { slug: m.slug, index: hit.index, length: hit[0].length };
      }
    }
    if (!best) break;
    if (best.index > 0) out.push(rest.slice(0, best.index));
    out.push(
      <Link
        key={`${best.slug}-${links}`}
        href={`/glossario/${best.slug}`}
        className="underline decoration-dotted decoration-teal underline-offset-4 hover:text-teal-700"
      >
        {rest.slice(best.index, best.index + best.length)}
      </Link>,
    );
    used.add(best.slug);
    links += 1;
    rest = rest.slice(best.index + best.length);
  }
  if (rest) out.push(rest);
  return <>{out}</>;
}
