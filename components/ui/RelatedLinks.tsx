import Link from 'next/link';

export type RelatedLink = { href: string; label: string; desc?: string };

// Bloco de links contextuais curados — usado nas ferramentas para
// distribuir link equity para peptídeos e guias relacionados.
export default function RelatedLinks({
  title = 'Conteúdo relacionado',
  links,
}: {
  title?: string;
  links: RelatedLink[];
}) {
  if (links.length === 0) return null;
  return (
    <section className="mt-10" aria-label={title}>
      <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="card-hover p-4 block group">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-ink group-hover:text-teal-700 transition-colors">
                {l.label}
              </span>
              <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-ink-3 group-hover:text-teal-700 flex-shrink-0">
                <path d="M5 10h10M10 5l5 5-5 5" />
              </svg>
            </div>
            {l.desc && <p className="mt-1 text-sm text-ink-2 leading-snug">{l.desc}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}
