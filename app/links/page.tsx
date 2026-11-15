import type { Metadata } from 'next';
import Link from 'next/link';
import EbookCover from '@/components/ebook/EbookCover';
import { IndexLink } from '@/components/ebook/LandingTrack';
import { coverLabel, formatPrice, getActiveEbooks, getEbookById, kitFullPrice, type Ebook } from '@/lib/ebooks';
import { bioUrl } from '@/lib/promocao/utm';
import { INSTAGRAM_HANDLE, INSTAGRAM_NAME, INSTAGRAM_URL, SITE_NAME } from '@/lib/site';

// Página da bio do Instagram (@dosecerta_br). Fora do Google: só faz sentido para quem
// vem do perfil. Os guias saem de getActiveEbooks (só os com checkout); sem nenhum ativo
// a página continua no ar com as ferramentas, porque a bio sempre aponta para cá.

export const metadata: Metadata = {
  title: `${INSTAGRAM_NAME}: guias e calculadoras`,
  description: 'Guias em PDF, calculadoras grátis e artigos sobre peptídeos e GLP-1.',
  alternates: { canonical: '/links' },
  robots: { index: false, follow: true },
};

const PAGINA = '/links';

const FREE = [
  { href: '/ferramentas/reconstituicao', title: 'Calculadora de reconstituição', desc: 'Quantas unidades puxar na seringa' },
  { href: '/ferramentas/titulacao', title: 'Titulação de GLP-1', desc: 'Semana a semana da tirzepatida e da semaglutida' },
  { href: '/ferramentas', title: 'Todas as calculadoras', desc: 'Custo, frascos, diário de aplicações e mais' },
  { href: '/blog', title: 'Artigos', desc: 'Dose, efeitos, armazenamento e comparativos' },
];

export default function LinksPage() {
  const active = getActiveEbooks();
  const kit = active.find((e) => e.kind === 'kit');
  const guides = active.filter((e) => e.kind !== 'kit');
  const included = (kit?.includes ?? []).map((id) => getEbookById(id)).filter((x): x is Ebook => !!x);
  const kitSum = kit ? kitFullPrice(kit) : 0;

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <header className="text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center text-2xl font-extrabold">
          DC
        </div>
        <h1 className="mt-3 text-2xl font-extrabold text-ink">{INSTAGRAM_NAME}</h1>
        <p className="text-sm text-ink-2">
          Peptídeos sem achismo · um projeto {SITE_NAME}
        </p>
        <a href={INSTAGRAM_URL} className="mt-1 inline-block text-sm font-semibold text-teal-700">
          @{INSTAGRAM_HANDLE}
        </a>
      </header>

      {kit && (
        <IndexLink
          ebookId={kit.id}
          href={bioUrl(`/ebooks/${kit.slug}`)}
          posicao="bio"
          pagina={PAGINA}
          className="mt-6 card-hover border-teal p-4 flex gap-4 items-center"
        >
          <EbookCover title={kit.title} cover={kit.cover} size="xs" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-teal-700">
              Pacote · {included.length} guias
            </span>
            <span className="block font-bold text-ink leading-snug">{kit.title}</span>
            <span className="mt-1 block text-sm text-ink-2">
              <strong className="text-ink tabular-nums">{formatPrice(kit.price)}</strong>
              {kitSum > kit.price && (
                <span className="tabular-nums"> · avulsos somam {formatPrice(kitSum)}</span>
              )}
            </span>
          </span>
        </IndexLink>
      )}

      {guides.length > 0 && (
        <section className="mt-6" aria-labelledby="guias">
          <h2 id="guias" className="text-xs font-bold uppercase tracking-widest text-ink-3">
            Em PDF
          </h2>
          <div className="mt-2 grid gap-2">
            {guides.map((e) => (
              <IndexLink
                key={e.id}
                ebookId={e.id}
                href={bioUrl(`/ebooks/${e.slug}`)}
                posicao="bio"
                pagina={PAGINA}
                className="card-hover p-3 flex gap-3 items-center"
              >
                <EbookCover title={e.title} cover={e.cover} size="xs" label={coverLabel(e)} />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink leading-snug">{e.title}</span>
                  <span className="block text-sm text-ink-2 tabular-nums">{formatPrice(e.price)}</span>
                </span>
              </IndexLink>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6" aria-labelledby="gratis">
        <h2 id="gratis" className="text-xs font-bold uppercase tracking-widest text-ink-3">
          Grátis
        </h2>
        <div className="mt-2 grid gap-2">
          {FREE.map((f) => (
            <Link key={f.href} href={bioUrl(f.href)} className="card-hover p-3 block">
              <span className="block font-semibold text-ink">{f.title}</span>
              <span className="block text-sm text-ink-2">{f.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-ink-3 leading-relaxed">
        Conteúdo educativo. Não vendemos peptídeos e nada aqui substitui orientação médica.
      </p>
    </div>
  );
}
