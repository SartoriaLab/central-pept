import Link from 'next/link';
import type { Article } from '@/lib/articles';

// Data no fuso de Brasília: 'AAAA-MM-DD' puro seria lido como UTC (dia anterior no Brasil).
const fmtDate = (d: string) =>
  new Date(d.includes('T') ? d : `${d}T12:00:00-03:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  });

/** Card de artigo das listagens do blog (índice e páginas de tag). */
export default function ArticleCard({ article: a }: { article: Article }) {
  return (
    <Link href={`/blog/${a.slug}`} className="group card-hover flex flex-col h-full p-5">
      {a.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {a.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <h2 className="font-bold text-lg leading-snug text-ink group-hover:text-teal-700 transition-colors line-clamp-3">
        {a.title}
      </h2>
      <p className="mt-2 text-sm text-ink-2 line-clamp-3 leading-relaxed">{a.excerpt}</p>
      <div className="mt-auto pt-4 flex items-center justify-between gap-2 text-xs text-ink-3">
        <span className="flex items-center gap-2">
          <time dateTime={a.publishedAt}>{fmtDate(a.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{a.readMinutes} min de leitura</span>
        </span>
        <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity">
          <path d="M5 10h10M10 5l5 5-5 5" />
        </svg>
      </div>
    </Link>
  );
}
