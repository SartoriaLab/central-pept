import Link from 'next/link';
import type { Metadata } from 'next';
import { getPeptides } from '@/lib/peptides';
import { getArticles } from '@/lib/articles';
import NewsletterSignup from '@/components/ui/NewsletterSignup';
import ToolIcon, { toolColor } from '@/components/ui/ToolIcon';

export const metadata: Metadata = {
  title: {
    absolute: 'Peptídeos: Calculadoras, Enciclopédia e Guias | Central Peptídeos',
  },
  description:
    'Calculadoras de reconstituição, subida de dose e custo de GLP-1, comparativos e enciclopédia de 21 peptídeos com doses e referências. Grátis, sem cadastro e sem propaganda.',
  alternates: { canonical: '/' },
};

const TOOLS = [
  {
    slug: 'reconstituicao',
    title: 'Reconstituição',
    desc: 'Quantas unidades puxar na seringa, em tempo real.',
  },
  {
    slug: 'mistura',
    title: 'Mistura',
    desc: 'Combine peptídeos num mesmo frasco e veja a dose de cada um.',
  },
  {
    slug: 'conversor',
    title: 'Conversor',
    desc: 'mg ↔ mcg ↔ UI por peptídeo, com multiplicador de dose.',
  },
  {
    slug: 'titulacao',
    title: 'Subida de Dose GLP-1',
    desc: 'Escalonamento semana a semana para Ozempic, Wegovy, Mounjaro e Zepbound.',
  },
  {
    slug: 'cronograma',
    title: 'Cronograma',
    desc: 'Monte o calendário de doses e exporte .ics pro Google Calendar.',
  },
  {
    slug: 'custo-glp1',
    title: 'Custo de GLP-1',
    desc: 'Quanto sai por dose, por mês e por mg em cada apresentação.',
  },
];

const STEPS = [
  {
    n: '1',
    title: 'Escolha o peptídeo',
    desc: 'Busque na lista de 21 peptídeos ou adicione um personalizado.',
  },
  {
    n: '2',
    title: 'Informe mg e dose',
    desc: 'Quantos mg tem no frasco e qual dose você quer aplicar.',
  },
  {
    n: '3',
    title: 'Veja na seringa',
    desc: 'O resultado aparece em tempo real, com alertas de segurança.',
  },
];

export default function HomePage() {
  const peptides = getPeptides();
  const fdaApproved = peptides.filter((p) => p.regulatoryStatus === 'fda-approved').length;
  const articles = getArticles();
  const recentPosts = articles.slice(0, 3);
  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-gradient-mesh">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-16 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Texto */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-teal-100 text-teal-700 text-xs font-semibold uppercase tracking-wider shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                Gratuito · Sem cadastro
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink leading-[1.05]">
                Peptídeos,<br />
                <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                  cálculo sem erro.
                </span>
              </h1>
              <p className="mt-5 text-lg md:text-xl text-ink-2 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Calculadora de reconstituição em tempo real, enciclopédia com
                {' '}<strong className="text-ink">{peptides.length} peptídeos</strong>{' '}
                catalogados e status regulatório claro. Tudo aberto, em português.
              </p>
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                <Link href="/ferramentas/reconstituicao" className="btn-teal">
                  Abrir calculadora
                  <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 10h12M10 4l6 6-6 6" /></svg>
                </Link>
                <Link href="/peptideos" className="btn-outline">
                  Ver enciclopédia
                </Link>
              </div>
            </div>

            {/* Preview visual da seringa */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-6 bg-gradient-teal opacity-10 blur-3xl rounded-full" aria-hidden />
              <div className="relative card p-6 shadow-xl">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-2">Exemplo em tempo real</div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-extrabold tracking-tight text-teal tabular-nums">10</span>
                  <span className="text-lg font-semibold text-ink-3">U</span>
                  <span className="text-sm text-ink-3 ml-1">= 0,10 ml</span>
                </div>
                {/* Seringa ilustrativa */}
                <svg viewBox="0 0 320 60" className="w-full h-auto" aria-hidden>
                  <rect x="10" y="18" width="280" height="24" rx="4" fill="var(--surface)" stroke="var(--border-2)" strokeWidth="1.5" />
                  <rect x="10" y="18" width="28" height="24" fill="var(--teal-50)" stroke="var(--teal)" strokeWidth="1.5" rx="4" />
                  <line x1="40" y1="12" x2="40" y2="48" stroke="var(--teal)" strokeWidth="2.5" />
                  <g stroke="var(--border-2)" strokeWidth="1">
                    {[70, 100, 130, 160, 190, 220, 250, 280].map((x) => (
                      <line key={x} x1={x} y1="18" x2={x} y2="22" />
                    ))}
                  </g>
                  <circle cx="300" cy="30" r="4" fill="var(--border-2)" />
                  <text x="40" y="58" fontSize="10" fill="var(--teal)" fontWeight="bold" textAnchor="middle">10 U</text>
                </svg>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-bg">
                    <div className="text-xs font-bold uppercase tracking-wider text-ink-3">Concentração</div>
                    <div className="font-bold tabular-nums">2,5 mg/ml</div>
                  </div>
                  <div className="p-3 rounded-lg bg-bg">
                    <div className="text-xs font-bold uppercase tracking-wider text-ink-3">Doses/frasco</div>
                    <div className="font-bold tabular-nums">20</div>
                  </div>
                </div>
                <div className="mt-3 p-2.5 rounded-lg bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2">
                  <span>✓</span>Faixa ideal (10–50 U). Fácil de medir.
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <Stat n={peptides.length} label="Peptídeos catalogados" />
            <Stat n={fdaApproved} label="Aprovados pela FDA" />
            <Stat n={articles.length} label="Guias e artigos" />
            <Stat n={TOOLS.length} label="Calculadoras ativas" />
          </div>
        </div>
      </section>

      {/* ═══ TRUST SIGNALS ═══ */}
      <section className="bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TrustItem
              icon={<path d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />}
              title="Fontes primárias"
              desc="FDA, PubMed, WADA, ANVISA"
            />
            <TrustItem
              icon={<path d="M20 7 9 18l-5-5" />}
              title="Sempre gratuito"
              desc="Sem cadastro, sem pop-up"
            />
            <TrustItem
              icon={<>
                <rect x={3} y={5} width={18} height={14} rx={2} />
                <path d="M3 10h18M8 15h2" />
              </>}
              title="Sem rastreamento"
              desc="Só analytics anônimo"
            />
            <TrustItem
              icon={<>
                <circle cx={12} cy={12} r={9} />
                <path d="M12 7v5l3 3" />
              </>}
              title="Sempre atualizado"
              desc="Datas de revisão visíveis"
            />
          </div>
        </div>
      </section>

      {/* ═══ FERRAMENTAS ═══ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ferramentas</h2>
          <p className="text-ink-2 mt-2 max-w-xl mx-auto">
            Cálculo preciso, resultado em tempo real. Sem login, sem propaganda.
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={`/ferramentas/${t.slug}`}
              className="group relative card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity -translate-y-1/2 translate-x-1/2 ${
                  toolColor(t.slug) === 'orange' ? 'bg-orange-400' : 'bg-teal'
                }`}
                aria-hidden
              />
              <div className="relative">
                <ToolIcon slug={t.slug} className="mb-4" />
                <h3 className="text-lg font-bold text-ink leading-tight">{t.title}</h3>
                <p className="text-sm text-ink-2 mt-2 leading-relaxed">{t.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 group-hover:gap-2 transition-all">
                  Abrir
                  <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 10h10M10 5l5 5-5 5" /></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ COMO FUNCIONA ═══ */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Em 3 passos</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">Como funciona</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 relative">
            {/* Linha conectora (só desktop) */}
            <div className="hidden md:block absolute top-7 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-teal-100 via-teal to-teal-100" aria-hidden />
            {STEPS.map((s) => (
              <div key={s.n} className="relative text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-teal text-white text-xl font-extrabold flex items-center justify-center shadow-glow relative z-10">
                  {s.n}
                </div>
                <h3 className="mt-4 font-bold text-ink text-lg">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-2 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ENCICLOPÉDIA PREVIEW ═══ */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Enciclopédia</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
              {peptides.length} peptídeos, com fontes
            </h2>
            <p className="text-ink-2 mt-2 max-w-2xl">
              Cada ficha traz mecanismo, dose, efeitos e referências primárias
              (FDA, PubMed, WADA). Status regulatório claro — você sabe se é
              aprovado, experimental ou proibido em esporte.
            </p>
          </div>
          <Link href="/peptideos" className="btn-outline">
            Ver todos
            <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 10h10M10 5l5 5-5 5" /></svg>
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {peptides.slice(0, 6).map((p) => (
            <Link
              key={p.slug}
              href={`/peptideos/${p.slug}`}
              className="card-hover p-4 block"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold leading-tight text-ink">{p.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 whitespace-nowrap flex-shrink-0">
                  {p.typicalDose} {p.doseUnit}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-2 leading-relaxed line-clamp-2">
                {p.shortDescription}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ DO BLOG ═══ */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Do blog</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
                Guias e comparativos
              </h2>
              <p className="text-ink-2 mt-2 max-w-2xl">
                Reconstituição, titulação, efeitos e comparativos — explicados com
                fontes primárias, em português.
              </p>
            </div>
            <Link href="/blog" className="btn-outline">
              Ver o blog
              <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 10h10M10 5l5 5-5 5" /></svg>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {recentPosts.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group card-hover block overflow-hidden"
              >
                <div className={`h-28 bg-gradient-to-br ${a.coverColor || 'from-teal-500/20 to-teal-500/0'} relative`}>
                  <div className="absolute inset-0 bg-dots opacity-30" aria-hidden />
                </div>
                <div className="p-5">
                  <h3 className="font-bold leading-tight text-ink group-hover:text-teal-700 transition-colors line-clamp-2">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-2 line-clamp-2 leading-relaxed">{a.excerpt}</p>
                  <div className="mt-3 text-xs text-ink-3">{a.readMinutes} min de leitura</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <NewsletterSignup />
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="bg-gradient-teal">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Pronto pra começar?
          </h2>
          <p className="mt-3 text-white/90 text-lg max-w-xl mx-auto">
            A calculadora está a um clique. Sem cadastro, sem upsell, sem script de
            tracking — é só abrir e usar.
          </p>
          <Link
            href="/ferramentas/reconstituicao"
            className="mt-8 inline-flex items-center gap-2 px-6 h-12 rounded bg-white keep-white text-teal-700 font-bold text-base hover:bg-teal-50 transition-colors shadow-xl"
          >
            Abrir calculadora
            <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 10h12M10 4l6 6-6 6" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: number | string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink tabular-nums">{n}</div>
      <div className="text-xs md:text-sm text-ink-3 mt-1 leading-tight">{label}</div>
    </div>
  );
}

function TrustItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 h-10 flex-shrink-0 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {icon}
        </svg>
      </span>
      <div className="min-w-0">
        <div className="font-bold text-sm text-ink leading-tight">{title}</div>
        <div className="text-xs text-ink-3 mt-0.5 leading-tight">{desc}</div>
      </div>
    </div>
  );
}
