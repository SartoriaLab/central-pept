import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import Syringe from '@/components/calculator/Syringe';
import { SYRINGES } from '@/lib/syringes';
import { social } from '@/lib/og';
import { SITE_URL } from '@/lib/site';

const title = 'Como ler seringa de insulina: unidades, ml e tamanhos';
const description =
  'Guia da seringa de insulina U-100: quanto vale cada traço, como converter unidades em ml e em mg, qual tamanho escolher (30, 50 ou 100 U) e os erros mais comuns.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/seringas' },
  ...social({ kind: 'pagina', slug: 'seringas', path: '/seringas', title, description }),
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Quantos ml tem 1 unidade da seringa de insulina?',
    a: 'Na seringa U-100, 1 unidade = 0,01 ml. Logo, 10 unidades = 0,1 ml, 50 unidades = 0,5 ml e 100 unidades = 1 ml. Isso vale para qualquer tamanho de seringa U-100: o que muda é só a capacidade.',
  },
  {
    q: '"Unidade" da seringa é o mesmo que UI?',
    a: 'Não. A unidade marcada na seringa é uma medida de volume (0,01 ml). UI (unidade internacional) é uma medida de atividade biológica de alguns hormônios. Para peptídeos dosados em mg ou mcg, a conversão depende da concentração do frasco: unidades = dose (mg) ÷ concentração (mg/ml) × 100.',
    link: { label: 'Calculadora de reconstituição', href: '/ferramentas/reconstituicao' },
  },
  {
    q: 'Qual seringa escolher: 30, 50 ou 100 unidades?',
    a: 'A menor que comporte a dose com folga. Seringas menores têm a escala mais espaçada e são mais fáceis de ler: para 8 unidades, a de 30 U é bem mais precisa que a de 100 U, que em muitos modelos só marca de 2 em 2 unidades.',
  },
  {
    q: 'Posso usar seringa U-40?',
    a: 'Não com cálculos feitos para U-100. Na seringa U-40, 40 unidades = 1 ml: puxar "20 unidades" nela dá 0,5 ml, duas vezes e meia o volume de 20 unidades numa U-100. Confira sempre "U-100" na embalagem.',
  },
  {
    q: 'Por onde ler o êmbolo?',
    a: 'Pela borda de borracha do êmbolo do lado da agulha (a borda de cima, com a agulha para cima). Alinhe essa borda ao traço da dose, com a seringa na altura dos olhos e sem bolhas de ar.',
  },
];

export default function SeringasPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Como ler a seringa de insulina U-100',
    description,
    inLanguage: 'pt-BR',
    url: `${SITE_URL}/seringas`,
    step: [
      { '@type': 'HowToStep', name: 'Confira a escala', text: 'Verifique na embalagem que a seringa é U-100: 100 unidades = 1 ml.' },
      { '@type': 'HowToStep', name: 'Descubra quanto vale cada traço', text: 'Nas seringas de 30 e 50 U cada traço vale 1 unidade; em muitas de 100 U, 2 unidades.' },
      { '@type': 'HowToStep', name: 'Converta a dose', text: 'Unidades = dose em mg ÷ concentração em mg/ml × 100.' },
      { '@type': 'HowToStep', name: 'Leia pela borda do êmbolo', text: 'Alinhe a borda de borracha do lado da agulha ao traço da dose, sem bolhas.' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <div className="mb-4">
            <Breadcrumb items={[{ label: 'Ferramentas', href: '/ferramentas' }, { label: 'Seringas' }]} siteUrl={SITE_URL} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Guia</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">Como ler a seringa de insulina</h1>
          <p className="mt-4 text-lg text-ink-2 leading-relaxed max-w-3xl">
            Na seringa U-100, <strong className="text-ink">1 unidade = 0,01 ml</strong>. A unidade é volume, não dose:
            quantos mg ela carrega depende da concentração do frasco.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <section aria-labelledby="tamanhos">
          <h2 id="tamanhos" className="text-xl md:text-2xl font-bold mb-4">Os três tamanhos</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {SYRINGES.map((s) => (
              <Link key={s.slug} href={`/seringas/${s.slug}`} className="card-hover p-5 block group">
                <span className="text-lg font-bold text-ink group-hover:text-teal-700 transition-colors">{s.label}</span>
                <p className="mt-1 text-sm text-ink-2">
                  Cada traço: {s.tick} {s.tick === 1 ? 'unidade' : 'unidades'} ({(s.tick / 100).toLocaleString('pt-BR')} ml)
                </p>
                <p className="mt-2 text-sm text-ink-3 leading-snug">Melhor para {s.bestFor}.</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="exemplo">
          <h2 id="exemplo" className="text-xl md:text-2xl font-bold mb-2">Exemplo: 25 unidades</h2>
          <p className="text-ink-2 mb-4 max-w-3xl">
            25 unidades são 0,25 ml. Na seringa de 50 U, é o meio da escala; na de 100 U, um quarto.
          </p>
          <div className="card p-4 space-y-2">
            <Syringe units={25} maxUnits={50} />
            <Syringe units={25} maxUnits={100} />
          </div>
        </section>

        <section className="mt-10 prose-article" aria-labelledby="converter">
          <h2 id="converter">Unidades, ml e mg</h2>
          <p>
            A conta que liga a dose à seringa é sempre a mesma:{' '}
            <strong>unidades = dose (mg) ÷ concentração (mg/ml) × 100</strong>. A concentração vem da reconstituição: um
            frasco de 10 mg com 2 ml de água fica com 5 mg/ml, e uma dose de 2,5 mg ocupa 2,5 ÷ 5 × 100 = 50 unidades.
          </p>
          <p>
            Se a dose estiver em mcg, divida por 1.000 antes (250 mcg = 0,25 mg). A{' '}
            <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link> faz essa conta para qualquer
            frasco e mostra a seringa marcada.
          </p>

          <h2>Como ler, passo a passo</h2>
          <ol>
            <li>Confira &quot;U-100&quot; na embalagem. Seringa U-40 tem outra escala.</li>
            <li>Veja quanto vale o menor traço: 1 unidade nas seringas de 30 e 50 U; 2 unidades em muitas de 100 U.</li>
            <li>Puxe um pouco além da dose, bata de leve para subir as bolhas e empurre até o traço certo.</li>
            <li>Leia pela borda de borracha do êmbolo do lado da agulha, com a seringa na altura dos olhos.</li>
          </ol>

          <h2>Erros comuns</h2>
          <ul>
            <li>
              <strong>Confundir unidade com UI ou com mg.</strong> &quot;10 unidades&quot; só diz o volume (0,1 ml).
            </li>
            <li>
              <strong>Usar seringa U-40.</strong> Ainda vendida para insulinas veterinárias: o mesmo número de
              unidades é 2,5 vezes mais volume.
            </li>
            <li>
              <strong>Seringa grande para dose pequena.</strong> 6 unidades numa seringa de 100 U marcada de 2 em 2 é
              difícil de acertar.
            </li>
            <li>
              <strong>Ignorar bolhas.</strong> Uma bolha ocupa espaço que deveria ser líquido e diminui a dose.
            </li>
          </ul>
          <p>
            Termos relacionados: <Link href="/glossario">glossário</Link>. Preparo do frasco:{' '}
            <Link href="/blog/agua-bacteriostatica-guia">guia da água bacteriostática</Link>.
          </p>
        </section>

        <FAQ items={FAQ_ITEMS} />
        <MedicalDisclaimer variant="prominent" />
      </div>
    </>
  );
}
