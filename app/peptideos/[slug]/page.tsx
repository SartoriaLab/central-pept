import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPeptideBySlug, getPeptideSlugs, getPeptides, CATEGORY_LABELS } from '@/lib/peptides';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import { RegulatoryBadge, WadaBadge } from '@/components/peptide/StatusBadge';
import Breadcrumb from '@/components/ui/Breadcrumb';
import QuickCalcWidget from '@/components/peptide/QuickCalcWidget';
import ShareButtons from '@/components/ui/ShareButtons';
import InjectionSiteGuide from '@/components/peptide/InjectionSiteGuide';
import FAQ from '@/components/ui/FAQ';
import { buildPeptideFaq } from '@/lib/peptide-faqs';
import { getArticlesByPeptide } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';
import WhatsAppStickyBar from '@/components/affiliate/WhatsAppStickyBar';
import { PEPTIDE_COPY } from '@/lib/affiliates';

const SITE = process.env.SITE_URL || 'https://centralpeptideos.com.br';

type Params = { slug: string };

// Cor de acento por categoria (gradient hero)
const CATEGORY_GRADIENT: Record<string, string> = {
  'healing':     'from-green-500/20 to-green-500/0',
  'glp-1':       'from-blue-500/20 to-blue-500/0',
  'gh':          'from-violet-500/20 to-violet-500/0',
  'sexual':      'from-pink-500/20 to-pink-500/0',
  'cosmetic':    'from-amber-500/20 to-amber-500/0',
  'longevity':   'from-teal-500/20 to-teal-500/0',
  'weight-loss': 'from-orange-500/20 to-orange-500/0',
  'cognitive':   'from-indigo-500/20 to-indigo-500/0',
  'hormone':     'from-rose-500/20 to-rose-500/0',
};

export async function generateStaticParams(): Promise<Params[]> {
  return getPeptideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPeptideBySlug(slug);
  if (!p) return { title: 'Peptídeo não encontrado' };
  return {
    title: p.name,
    description: p.shortDescription,
    alternates: { canonical: `/peptideos/${slug}` },
    openGraph: {
      title: `${p.name} — Central Peptídeos`,
      description: p.shortDescription,
      url: `/peptideos/${slug}`,
      type: 'article',
    },
  };
}

export default async function PeptidePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const p = getPeptideBySlug(slug);
  if (!p) notFound();

  const related = p.category
    ? getPeptides().filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3)
    : [];

  const guides = getArticlesByPeptide(p.slug);

  const faq = buildPeptideFaq(p);
  const isApprovedDrug = p.regulatoryStatus === 'fda-approved' || p.regulatoryStatus === 'discontinued';
  const substanceJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': isApprovedDrug ? 'Drug' : 'MedicalSubstance',
    name: p.name,
    alternateName: p.slug,
    description: p.shortDescription,
    ...(p.longDescription && { disambiguatingDescription: p.longDescription.split('\n')[0] }),
    ...(p.mechanism && { mechanismOfAction: p.mechanism.split('\n')[0] }),
    ...(p.doseRange && { dosageForm: p.doseRange }),
    ...(p.contraindications && p.contraindications.length > 0 && { contraindication: p.contraindications }),
    ...(p.sideEffects && p.sideEffects.length > 0 && { seriousAdverseOutcome: p.sideEffects }),
    ...(p.references && p.references.length > 0 && {
      citation: p.references.map((r) => ({ '@type': 'CreativeWork', name: r.title, url: r.url })),
    }),
    ...(p.lastReviewed && { dateModified: p.lastReviewed }),
    ...(p.regulatoryStatus === 'fda-approved' && { legalStatus: 'FDA approved' }),
  };

  // MedicalWebPage — envelope semântico para a página inteira
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: p.name,
    description: p.shortDescription,
    url: `/peptideos/${p.slug}`,
    inLanguage: 'pt-BR',
    mainContentOfPage: { '@type': 'WebPageElement', cssSelector: 'main' },
    about: { '@type': 'MedicalSubstance', name: p.name },
    lastReviewed: p.lastReviewed,
    audience: { '@type': 'MedicalAudience', audienceType: 'patient' },
  };

  const gradientClass = (p.category && CATEGORY_GRADIENT[p.category]) || 'from-teal-500/20 to-teal-500/0';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(substanceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      {/* ═══ HERO ═══ */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${gradientClass}`}>
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-10 md:pt-12 md:pb-14">
          <div className="mb-5">
            <Breadcrumb items={[
              { label: 'Peptídeos', href: '/peptideos' },
              { label: p.name },
            ]} siteUrl={SITE} />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {p.category && typeof p.category === 'string' && (p.category in CATEGORY_LABELS) && (
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface/70 backdrop-blur text-ink-2 border border-border">
                {CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS]}
              </span>
            )}
            {p.regulatoryStatus && <RegulatoryBadge status={p.regulatoryStatus} />}
            {p.wadaProhibited && <WadaBadge />}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-[1.1]">
            {p.name}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-ink-2 leading-relaxed max-w-2xl">
            {p.shortDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/ferramentas/reconstituicao?peptide=${p.slug}`}
              className="btn-teal"
            >
              Calcular dose
              <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M10 4l6 6-6 6"/></svg>
            </Link>
            {(p.lastReviewed || p.reviewedBy) && (
              <p className="text-xs text-ink-3">
                {p.lastReviewed && <>Revisado em {p.lastReviewed}</>}
                {p.lastReviewed && p.reviewedBy && ' · '}
                {p.reviewedBy && (
                  <>
                    por{' '}
                    {p.reviewedBy.url ? (
                      <a href={p.reviewedBy.url} target="_blank" rel="noreferrer noopener" className="text-teal-700 hover:underline">
                        {p.reviewedBy.name}
                      </a>
                    ) : (
                      <span className="font-semibold">{p.reviewedBy.name}</span>
                    )}
                    {p.reviewedBy.credentials && `, ${p.reviewedBy.credentials}`}
                  </>
                )}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ═══ CONTEÚDO ═══ */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <QuickCalcWidget peptide={p} />

        <section className="mt-6 mb-2">
          <AffiliateBox
            productId="fornecedor_oficial"
            slot={`peptide-${p.slug}`}
            peptide={p.slug}
          />
        </section>


        {/* Info cards — grid de 4 com ícones */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <InfoCard
            label="Dose típica"
            value={`${p.typicalDose} ${p.doseUnit}`}
            icon={
              <path d="M12 2v4M4.93 4.93l2.83 2.83M2 12h4M4.93 19.07l2.83-2.83M12 18v4M19.07 19.07l-2.83-2.83M22 12h-4M19.07 4.93l-2.83 2.83" />
            }
          />
          <InfoCard
            label="Frequência"
            value={p.frequency}
            small
            icon={<path d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />}
          />
          {p.halfLife ? (
            <InfoCard
              label="Meia-vida"
              value={p.halfLife}
              small
              icon={<path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-9 9zm9-9v9l6 3" />}
            />
          ) : (
            <InfoCard
              label="Frascos comuns"
              value={p.commonAmounts.length > 0 ? p.commonAmounts.map(a => `${a} mg`).join(', ') : '—'}
              small
              icon={<path d="M9 2h6M10 2v4M14 2v4M9 6h6l2 5v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9z" />}
            />
          )}
          {p.doseRange ? (
            <InfoCard
              label="Faixa"
              value={p.doseRange}
              small
              icon={<path d="M2 12h20M6 8l-4 4 4 4M18 8l4 4-4 4" />}
            />
          ) : p.halfLife && p.commonAmounts.length > 0 ? (
            <InfoCard
              label="Frascos comuns"
              value={p.commonAmounts.map(a => `${a} mg`).join(', ')}
              small
              icon={<path d="M9 2h6M10 2v4M14 2v4M9 6h6l2 5v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9z" />}
            />
          ) : (
            <InfoCard
              label="Categoria"
              value={p.category && (p.category in CATEGORY_LABELS) ? CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS] : '—'}
              small
              icon={<path d="M4 7h16M4 12h16M4 17h10" />}
            />
          )}
        </section>

        {p.longDescription && (
          <DetailSection
            title="Sobre o peptídeo"
            icon={<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />}
          >
            <div className="text-ink-2 leading-relaxed whitespace-pre-wrap">
              {p.longDescription}
            </div>
          </DetailSection>
        )}

        {p.mechanism && (
          <DetailSection
            title="Mecanismo de ação"
            icon={<path d="M9 3h6l2 3h3v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6h3zM9 11v6M12 8v9M15 11v6" />}
          >
            <div className="text-ink-2 leading-relaxed whitespace-pre-wrap">{p.mechanism}</div>
          </DetailSection>
        )}

        {p.sideEffects && p.sideEffects.length > 0 && (
          <DetailSection
            title="Efeitos colaterais documentados"
            icon={<path d="M12 9v4M12 17h.01M10.3 3.9 2.5 17.5A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />}
            iconTone="warn"
          >
            <ul className="space-y-2 text-ink-2">
              {p.sideEffects.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-amber-500" aria-hidden />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </DetailSection>
        )}

        {p.contraindications && p.contraindications.length > 0 && (
          <DetailSection
            title="Contraindicações"
            icon={<path d="M4.93 4.93l14.14 14.14M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />}
            iconTone="danger"
          >
            <ul className="space-y-2 text-ink-2">
              {p.contraindications.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-red-500" aria-hidden />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </DetailSection>
        )}

        {p.references && p.references.length > 0 && (
          <DetailSection
            title="Referências"
            icon={<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM20 17v3M6.5 17H20" />}
          >
            <ol className="space-y-3 text-sm">
              {p.references.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-50 text-teal-700 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-ink-2 hover:text-teal-700 hover:underline leading-relaxed"
                  >
                    {r.title}
                    <span className="inline-block ml-1 text-ink-3">↗</span>
                  </a>
                </li>
              ))}
            </ol>
          </DetailSection>
        )}

        {!p.longDescription && !p.mechanism && (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 mb-8">
            <strong>Ficha em construção.</strong> Mecanismo de ação, efeitos documentados,
            contraindicações e referências serão adicionados em breve.
          </div>
        )}

        <div className="mt-8">
          <InjectionSiteGuide />
        </div>

        <FAQ items={faq} title={`Perguntas frequentes sobre ${p.name}`} />

        {p.slug in PEPTIDE_COPY && (
          <WhatsAppStickyBar
            productId="fornecedor_oficial"
            slot={`sticky-peptide-${p.slug}`}
            peptide={p.slug}
          />
        )}

        <div className="mt-10 pt-6 border-t border-border">
          <ShareButtons title={`${p.name} — Central Peptídeos`} url={`/peptideos/${p.slug}`} />
        </div>

        {guides.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Guias sobre {p.name}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {guides.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="card-hover p-4 block group"
                >
                  <h3 className="font-semibold text-sm leading-snug text-ink group-hover:text-teal-700 transition-colors">
                    {a.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-ink-2 line-clamp-2 leading-relaxed">{a.excerpt}</p>
                  <div className="mt-2 text-xs text-ink-3">{a.readMinutes} min de leitura</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Peptídeos relacionados</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/peptideos/${r.slug}`}
                  className="card-hover p-4 block"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-tight">{r.name}</h3>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 whitespace-nowrap flex-shrink-0">
                      {r.typicalDose} {r.doseUnit}
                    </span>
                  </div>
                  {r.regulatoryStatus && (
                    <div className="mt-2">
                      <RegulatoryBadge status={r.regulatoryStatus} size="sm" />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        <MedicalDisclaimer variant="prominent" />
      </div>
    </>
  );
}

function InfoCard({ label, value, icon, small }: { label: string; value: string; icon: React.ReactNode; small?: boolean }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-1.5 text-ink-3">
        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {icon}
        </svg>
        <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className={`font-bold text-ink tabular-nums ${small ? 'text-sm' : 'text-lg'}`}>{value}</div>
    </div>
  );
}

function DetailSection({
  title,
  icon,
  children,
  iconTone = 'default',
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  iconTone?: 'default' | 'warn' | 'danger';
}) {
  const toneClass =
    iconTone === 'warn'
      ? 'bg-amber-50 text-amber-700'
      : iconTone === 'danger'
      ? 'bg-red-50 text-red-700'
      : 'bg-teal-50 text-teal-700';

  return (
    <section className="mb-6">
      <h2 className="flex items-center gap-3 mb-4">
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${toneClass}`}>
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {icon}
          </svg>
        </span>
        <span className="text-xl font-bold text-ink">{title}</span>
      </h2>
      <div className="pl-12">{children}</div>
    </section>
  );
}
