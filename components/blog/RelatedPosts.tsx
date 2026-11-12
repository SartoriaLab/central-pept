import Link from 'next/link';
import type { Article } from '@/lib/articles';

// Bloco "Leia também" — posts relacionados no rodapé de cada artigo.
export default function RelatedPosts({ posts }: { posts: Article[] }) {
  if (posts.length === 0) return null;
  return (
    <section className="mt-10 pt-8 border-t border-border not-prose" aria-label="Artigos relacionados">
      <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-4">Leia também</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {posts.map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            className="card-hover p-4 block group"
          >
            <h3 className="font-bold text-sm leading-snug text-ink group-hover:text-teal-700 transition-colors line-clamp-3">
              {a.title}
            </h3>
            <p className="mt-2 text-xs text-ink-2 line-clamp-2 leading-relaxed">{a.excerpt}</p>
            <div className="mt-2 text-xs text-ink-3">{a.readMinutes} min de leitura</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
