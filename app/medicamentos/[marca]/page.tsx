import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import InfoCard from '@/components/ui/InfoCard';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import FAQ from '@/components/ui/FAQ';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import { getBrand, getBrandSlugs, getBrands } from '@/lib/brands';
import { getPeptideBySlug } from '@/lib/peptides';
import { TITRATION_SCHEMES } from '@/lib/titration';
import { getArticleBySlug } from '@/lib/articles';
import { getComparisonsByPeptide } from '@/lib/comparisons';
import { CONTENT_UPDATED_AT, SITE_URL } from '@/lib/site';

type Params = { marca: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getBrandSlugs().map((marca) => ({ marca }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { marca } = await params;
  const b = getBrand(marca);
  if (!b) return { title: 'Medicamento não encontrado', robots: { index: false, follow: true } };
  const title = `${b.name} (${b.activeIngredient.toLowerCase()}): o que é, doses e para que serve`;
  const description = b.summary.length > 158 ? `${b.summary.slice(0, 155).trimEnd()}…` : b.summary;
  return {
    title,
    description,
    alternates: { canonical: `/medicamentos/${b.slug}` },
    openGraph: { title, description, url: `/medicamentos/${b.slug}`, type: 'article' },
  };
}

const num = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

export default async function BrandPage({ params }: { params: Promise<Params> }) {
  const { marca } = await params;
  const b = getBrand(marca);
  if (!b) notFound();

  const peptide = getPeptideBySlug(b.peptideSlug);
  const scheme = TITRATION_SCHEMES.find((s) => s.id === b.titrationSchemeId);
  const sibling = getBrand(b.sibling.slug);
  const others = getBrands().filter((x) => x.slug !== b.slug);
  const articles = b.articles
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is NonNullable<typeof a> => !!a && !a.draft);
  const comparisons = getComparisonsByPeptide(b.peptideSlug).slice(0, 4);
  const ingredient = b.activeIngredient.toLowerCase();

  const tools: RelatedLink[] = [
    { href: '/ferramentas/titulacao', label: 'Calendário de subida de dose', desc: `Datas de cada degrau do ${b.name}, semana a semana.` },
    { href: '/ferramentas/tabela-doses-glp1', label: 'Tabela de doses para imprimir', desc: 'Escada de doses e registro de aplicações.' },
    { href: '/ferramentas/custo-glp1', label: 'Custo por dose e por mês', desc: 'Quanto sai cada aplicação a partir do preço pago.' },
    { href: `/ferramentas/reconstituicao/${b.peptideSlug}`, label: `Calculadora de ${ingredient} em frasco`, desc: 'Unidades na seringa — só para frasco liofilizado, não para caneta.' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Drug',
    name: b.name,
    nonProprietaryName: b.activeIngredient,
    activeIngredient: b.activeIngredient,
    drugClass: b.drugClass,
    description: b.summary,
    url: `${SITE_URL}/medicamentos/${b.slug}`,
    manufacturer: { '@type': 'Organization', name: b.manufacturer },
    administrationRoute: 'Subcutânea',
    prescriptionStatus: 'https://schema.org/PrescriptionOnly',
    dosageForm: b.presentation,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <div className="mb-4">
            <Breadcrumb items={[{ label: 'Medicamentos', href: '/medicamentos' }, { label: b.name }]} siteUrl={SITE_URL} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
            {b.activeIngredient} · {b.manufacturer}
          </span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {b.name}: <span className="text-teal-700">o que é, doses e para que serve</span>
          </h1>
          <p className="mt-4 text-lg text-ink-2 leading-relaxed max-w-3xl">{b.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/ferramentas/titulacao" className="btn-teal">Ver calendário de doses</Link>
            <Link
              href={`/peptideos/${b.peptideSlug}`}
              className="inline-flex items-center px-4 h-11 rounded border border-border bg-surface font-semibold text-sm text-ink-2 hover:border-teal hover:text-teal-700 transition-colors"
            >
              Ficha da {ingredient}
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <section aria-label="Dados rápidos" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <InfoCard
            label="Aplicação"
            value="1× por semana"
            icon={<path d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />}
          />
          <InfoCard
            label="Meia-vida"
            value={peptide?.halfLife ?? '—'}
            icon={<path d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />}
          />
          {scheme && (
            <InfoCard
              label="Dose inicial"
              value={`${num(scheme.steps[0].dose)} mg`}
              icon={<path d="M5 12h14M12 5v14" />}
            />
          )}
          {scheme && (
            <InfoCard
              label="Dose máxima"
              value={`${num(scheme.steps[scheme.steps.length - 1].dose)} mg`}
              icon={<path d="M3 17l6-6 4 4 8-8M14 7h7v7" />}
            />
          )}
        </section>

        <section aria-labelledby="resumo" className="card overflow-x-auto">
          <h2 id="resumo" className="sr-only">Resumo do {b.name}</h2>
          <table className="w-full text-sm">
            <tbody>
              {[
                ['Princípio ativo', b.activeIngredient],
                ['Fabricante', b.manufacturer],
                ['Classe', b.drugClass],
                ['Aplicação', 'Subcutânea, uma vez por semana'],
                ['Dose de manutenção', b.maintenance],
                ['Apresentação', b.presentation],
                ['Meia-vida', peptide?.halfLife ?? '—'],
                ['Primeira aprovação FDA', String(b.fdaApprovalYear)],
              ].map(([label, value]) => (
                <tr key={label} className="border-b border-border last:border-0">
                  <th scope="row" className="p-3 text-left text-xs font-bold uppercase tracking-wider text-ink-3 w-2/5 align-top">
                    {label}
                  </th>
                  <td className="p-3 text-ink">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="prose-article mt-10">
          <h2>O que é {b.name}</h2>
          {b.about.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          <h2>Para que serve</h2>
          <p>Indicações registradas na bula aprovada pela FDA:</p>
          <ul>
            {b.indications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>{b.brazil}</p>
        </div>

        {scheme && (
          <section className="mt-10" aria-labelledby="doses">
            <h2 id="doses" className="text-xl md:text-2xl font-bold mb-2">Doses do {b.name}: a escada de titulação</h2>
            <p className="text-ink-2 mb-4">
              A dose sobe aos poucos para o corpo se adaptar e os efeitos gastrointestinais ficarem
              menores. Cada degrau dura pelo menos 4 semanas; o médico pode manter uma dose por mais
              tempo ou parar em um degrau intermediário.
            </p>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-ink-3 border-b border-border">
                    <th scope="col" className="p-3 font-bold">Semanas</th>
                    <th scope="col" className="p-3 font-bold">Dose semanal</th>
                    <th scope="col" className="p-3 font-bold">Etapa</th>
                  </tr>
                </thead>
                <tbody>
                  {scheme.steps.map((step, i) => {
                    const next = scheme.steps[i + 1];
                    const last = i === scheme.steps.length - 1;
                    return (
                      <tr key={step.week} className="border-b border-border last:border-0">
                        <td className="p-3 tabular-nums">
                          {next ? `${step.week} a ${next.week - 1}` : `${step.week} em diante`}
                        </td>
                        <td className="p-3 font-semibold tabular-nums">
                          <div className="flex items-center gap-3">
                            <span className="w-16 shrink-0">{num(step.dose)} mg</span>
                            <span className="hidden sm:block h-2 flex-1 max-w-[220px] rounded-full bg-teal-50" aria-hidden>
                              <span
                                className={`block h-2 rounded-full ${last ? 'bg-teal-700' : 'bg-teal'}`}
                                style={{ width: `${(step.dose / scheme.steps[scheme.steps.length - 1].dose) * 100}%` }}
                              />
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-ink-2">
                          {i === 0 ? 'Dose inicial' : last ? 'Dose máxima' : 'Subida'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-ink-3">
              Esquema da bula FDA. Dose de manutenção: {b.maintenance}.{' '}
              <Link href="/ferramentas/titulacao" className="font-semibold text-teal-700 hover:underline">
                Gerar o calendário com datas
              </Link>
            </p>
          </section>
        )}

        {sibling && (
          <section className="mt-10" aria-labelledby="diferenca">
            <h2 id="diferenca" className="text-xl md:text-2xl font-bold mb-2">
              {b.name} e {sibling.name}: qual a diferença
            </h2>
            <p className="text-ink-2 leading-relaxed">{b.sibling.difference}</p>
            <div className="card overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-ink-3 border-b border-border">
                    <th scope="col" className="p-3 font-bold" />
                    <th scope="col" className="p-3 font-bold">{b.name}</th>
                    <th scope="col" className="p-3 font-bold">
                      <Link href={`/medicamentos/${sibling.slug}`} className="text-teal-700 hover:underline">{sibling.name}</Link>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Princípio ativo', b.activeIngredient, sibling.activeIngredient],
                    ['Indicação principal', b.indications[0], sibling.indications[0]],
                    ['Manutenção', b.maintenance, sibling.maintenance],
                    ['Aprovação FDA', String(b.fdaApprovalYear), String(sibling.fdaApprovalYear)],
                  ].map(([label, mine, theirs]) => (
                    <tr key={label} className="border-b border-border last:border-0 align-top">
                      <th scope="row" className="p-3 text-left text-xs font-bold uppercase tracking-wider text-ink-3">{label}</th>
                      <td className="p-3">{mine}</td>
                      <td className="p-3">{theirs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mt-10" aria-labelledby="estudos">
          <h2 id="estudos" className="text-xl md:text-2xl font-bold mb-4">O que os estudos mostram</h2>
          <div className="grid gap-3">
            {b.evidence.map((e) => (
              <div key={e.trial} className="card p-4">
                <h3 className="font-bold text-ink">{e.trial}</h3>
                <p className="mt-1 text-sm text-ink-2 leading-relaxed">{e.result}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-ink-3">
            Médias de ensaios clínicos, com dieta e atividade física associadas. O resultado individual varia.
          </p>
        </section>

        {peptide && (peptide.sideEffects?.length || peptide.contraindications?.length) ? (
          <section className="mt-10 grid gap-4 md:grid-cols-2" aria-label="Segurança">
            {peptide.sideEffects && peptide.sideEffects.length > 0 && (
              <div className="card p-5">
                <h2 className="text-lg font-bold mb-3">Efeitos colaterais</h2>
                <ul className="space-y-2 text-sm text-ink-2 list-disc pl-5 leading-relaxed">
                  {peptide.sideEffects.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            )}
            {peptide.contraindications && peptide.contraindications.length > 0 && (
              <div className="card p-5">
                <h2 className="text-lg font-bold mb-3">Contraindicações</h2>
                <ul className="space-y-2 text-sm text-ink-2 list-disc pl-5 leading-relaxed">
                  {peptide.contraindications.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            )}
          </section>
        ) : null}


        <RelatedLinks links={tools} title={`Ferramentas para quem usa ${b.name}`} />

        {articles.length > 0 && (
          <section className="mt-10" aria-labelledby="guias">
            <h2 id="guias" className="text-xl md:text-2xl font-bold mb-4">Guias sobre {b.name} e {ingredient}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {articles.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="card-hover p-4 block group">
                  <span className="font-semibold text-ink group-hover:text-teal-700 transition-colors leading-snug">{a.title}</span>
                  <p className="mt-1 text-sm text-ink-2 leading-snug line-clamp-2">{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {comparisons.length > 0 && (
          <section className="mt-10" aria-labelledby="comparar">
            <h2 id="comparar" className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">
              Compare a {ingredient} com outros
            </h2>
            <div className="flex flex-wrap gap-2">
              {comparisons.map((c) => (
                <Link
                  key={c.slug}
                  href={`/comparar/${c.slug}`}
                  className="chip-lg"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <FAQ items={b.faq} />

        <section className="mt-10" aria-labelledby="outras-marcas">
          <h2 id="outras-marcas" className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Outras marcas</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/medicamentos/${o.slug}`}
                className="chip-lg"
              >
                {o.name} ({o.activeIngredient.toLowerCase()})
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="referencias">
          <h2 id="referencias" className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Referências</h2>
          <ol className="space-y-1.5 text-sm text-ink-2 list-decimal pl-5">
            {b.references.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noreferrer noopener" className="hover:text-teal-700 hover:underline">
                  {r.title}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-ink-3 leading-relaxed">
            Conteúdo revisado em {new Date(`${CONTENT_UPDATED_AT}T12:00:00-03:00`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' })}.
            {' '}{b.name} é marca registrada de {b.manufacturer}. A Central Peptídeos é independente e não
            tem vínculo com o fabricante.
          </p>
        </section>

        <MedicalDisclaimer variant="prominent" />
      </div>
    </>
  );
}
