import Link from 'next/link';

export type FAQItem = {
  q: string;
  a: string;
  /** Link interno opcional exibido abaixo da resposta (não entra no JSON-LD). */
  link?: { label: string; href: string };
};

export default function FAQ({
  items,
  title = 'Perguntas frequentes',
}: {
  items: FAQItem[];
  title?: string;
}) {
  // JSON-LD FAQPage para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <section className="mt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <details
            key={i}
            className="card p-4 group open:shadow-lg transition-shadow"
          >
            <summary className="list-none flex items-start justify-between gap-3 cursor-pointer font-semibold text-ink">
              <span>{item.q}</span>
              <svg
                viewBox="0 0 20 20"
                width={18}
                height={18}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="mt-0.5 flex-shrink-0 text-ink-3 transition-transform group-open:rotate-180"
              >
                <path d="m5 8 5 5 5-5" />
              </svg>
            </summary>
            <p className="mt-3 text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">
              {item.a}
            </p>
            {item.link && (
              <Link href={item.link.href} className="inline-block mt-2 text-sm font-semibold text-teal-700 hover:underline">
                {item.link.label} →
              </Link>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
