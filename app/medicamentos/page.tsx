import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import { getBrands } from '@/lib/brands';
import { SITE_URL } from '@/lib/site';

const PATH = '/medicamentos';

export const metadata: Metadata = {
  title: 'Mounjaro, Ozempic, Wegovy e Zepbound: diferenças, doses e princípio ativo',
  description:
    'Qual o princípio ativo de cada marca, para que serve, as doses da bula e a diferença entre Mounjaro e Zepbound, Ozempic e Wegovy.',
  alternates: { canonical: PATH },
  openGraph: {
    title: 'Mounjaro, Ozempic, Wegovy e Zepbound — guia das marcas',
    description: 'Princípio ativo, indicação, doses e diferenças entre as quatro marcas.',
    url: PATH,
  },
};

export default function MedicamentosPage() {
  const brands = getBrands();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Marcas de agonistas GLP-1',
    itemListElement: brands.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      url: `${SITE_URL}/medicamentos/${b.slug}`,
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-4">
        <Breadcrumb items={[{ label: 'Medicamentos' }]} siteUrl={SITE_URL} />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Mounjaro, Ozempic, Wegovy e Zepbound: <span className="text-teal-700">o que muda entre as marcas</span>
        </h1>
        <p className="mt-3 text-ink-2 max-w-3xl text-base md:text-lg leading-relaxed">
          São quatro nomes comerciais para duas moléculas. Mounjaro e Zepbound são tirzepatida, da Eli
          Lilly; Ozempic e Wegovy são semaglutida, da Novo Nordisk. O que separa cada par é a indicação
          registrada em bula e a dose máxima.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {brands.map((b) => (
          <Link key={b.slug} href={`/medicamentos/${b.slug}`} className="card-hover p-5 block group">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
              {b.activeIngredient} · {b.manufacturer}
            </span>
            <h2 className="mt-1 text-xl font-extrabold text-ink group-hover:text-teal-700 transition-colors">{b.name}</h2>
            <p className="mt-2 text-sm text-ink-2 leading-relaxed">{b.summary}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12" aria-labelledby="comparativo">
        <h2 id="comparativo" className="text-2xl font-bold mb-4">Comparativo rápido</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink-3 border-b border-border">
                <th scope="col" className="p-3 font-bold">Marca</th>
                <th scope="col" className="p-3 font-bold">Princípio ativo</th>
                <th scope="col" className="p-3 font-bold">Indicação principal (bula FDA)</th>
                <th scope="col" className="p-3 font-bold">Manutenção</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.slug} className="border-b border-border last:border-0 align-top">
                  <th scope="row" className="p-3 text-left font-semibold">
                    <Link href={`/medicamentos/${b.slug}`} className="text-teal-700 hover:underline">{b.name}</Link>
                  </th>
                  <td className="p-3">
                    <Link href={`/peptideos/${b.peptideSlug}`} className="hover:text-teal-700 hover:underline">{b.activeIngredient}</Link>
                  </td>
                  <td className="p-3 text-ink-2">{b.indications[0]}</td>
                  <td className="p-3 text-ink-2">{b.maintenance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-ink-2">
          Para comparar as moléculas em detalhe, veja{' '}
          <Link href="/comparar/semaglutida-vs-tirzepatida" className="font-semibold text-teal-700 hover:underline">
            Semaglutida vs Tirzepatida
          </Link>
          . Para montar o calendário de subida de dose, use a{' '}
          <Link href="/ferramentas/titulacao" className="font-semibold text-teal-700 hover:underline">
            calculadora de titulação
          </Link>
          .
        </p>
      </section>

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
