import type { Metadata } from 'next';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import GlpCostCalculator from '@/components/calculator/GlpCostCalculator';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import ToolSchema from '@/components/ui/ToolSchema';
import { SITE_URL } from '@/lib/site';

const PATH = '/ferramentas/custo-glp1';

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Como calcular o custo por dose de tirzepatida ou semaglutida?',
    a: 'Divida o preço pago pelo total de miligramas da embalagem para achar o custo por mg e multiplique pela dose semanal. Exemplo: frasco de 10 mg por R$ 800 = R$ 80 por mg; dose de 2,5 mg = R$ 200 por aplicação. A calculadora faz essa conta e projeta o custo mensal e anual.',
  },
  {
    q: 'Por que o custo mensal sobe tanto quando a dose aumenta?',
    a: 'Em frasco, você paga por miligrama: dobrar a dose dobra o custo. Uma dose de 10 mg consome quatro vezes mais produto que uma de 2,5 mg. Em caneta a lógica é diferente — o preço costuma ser por caixa, igual para qualquer dose, então as doses altas saem proporcionalmente mais baratas.',
  },
  {
    q: 'O que é o descarte após 28 dias e por que ele encarece a dose?',
    a: 'Depois de reconstituído com água bacteriostática, o frasco costuma ser usado em até 28 dias. Se a embalagem rende mais de 4 doses semanais, o que sobra depois desse prazo é perdido — e o custo real de cada dose aproveitada sobe. Por isso, em dose baixa, um frasco menor pode sair mais barato que um grande.',
    link: { label: 'Guia da água bacteriostática', href: '/blog/agua-bacteriostatica-guia' },
  },
  {
    q: 'Como informar uma caneta em vez de frasco?',
    a: 'Use o total de miligramas da caneta: número de doses × mg por dose. Uma caneta com 4 doses de 5 mg tem 20 mg no total. Desmarque a opção de descarte, já que a caneta não é reconstituída.',
  },
  {
    q: 'A calculadora mostra o preço real do Mounjaro ou do Ozempic?',
    a: 'Não. Ela não traz tabela de preços: o cálculo é feito a partir do valor que você informar. Para faixas de preço praticadas no Brasil, veja o guia de preços da tirzepatida.',
    link: { label: 'Quanto custa a tirzepatida no Brasil', href: '/blog/tirzepatida-preco-quanto-custa' },
  },
  {
    q: 'O custo calculado inclui tudo?',
    a: 'Não. Ficam de fora seringas, água bacteriostática, consulta médica, exames e frete refrigerado. Considere também que a dose muda ao longo da titulação — a tabela de custo por dose mostra o valor em cada etapa.',
  },
];

const RELATED_LINKS: RelatedLink[] = [
  { href: '/blog/tirzepatida-preco-quanto-custa', label: 'Tirzepatida: quanto custa no Brasil', desc: 'Preço por caneta, por frasco e por mês em cada dose.' },
  { href: '/ferramentas/titulacao', label: 'Subida de dose GLP-1', desc: 'Calendário semana a semana com datas.' },
  { href: '/ferramentas/tabela-doses-glp1', label: 'Tabela de doses para imprimir', desc: 'Escada de doses e unidades na seringa.' },
  { href: '/ferramentas/reconstituicao/tirzepatida', label: 'Calculadora de tirzepatida', desc: 'Unidades na seringa para cada frasco.' },
];

export const metadata: Metadata = {
  title: 'Calculadora de Custo: Mounjaro, Ozempic e tirzepatida por dose e por mês',
  description:
    'Descubra quanto custa cada dose de tirzepatida, semaglutida ou retatrutida: custo por mg, por aplicação, por mês e por ano, com a perda do frasco após 28 dias.',
  openGraph: {
    title: 'Calculadora de Custo GLP-1 — por dose e por mês',
    description: 'Custo por mg, por aplicação, por mês e por ano a partir do preço que você pagou.',
    url: PATH,
  },
  alternates: { canonical: PATH },
};

export default function CustoGlp1Page() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <ToolSchema
        name="Calculadora de Custo GLP-1 (tirzepatida, semaglutida, retatrutida)"
        description="Calcula custo por mg, por dose, por mês e por ano de agonistas GLP-1 a partir do preço pago, considerando o descarte do frasco reconstituído."
        path={PATH}
      />
      <div className="mb-4">
        <Breadcrumb items={[{ label: 'Ferramentas', href: '/ferramentas' }, { label: 'Custo GLP-1' }]} siteUrl={SITE_URL} />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Custo por dose — <span className="text-teal-700">Mounjaro, Ozempic e tirzepatida</span>
        </h1>
        <p className="mt-2 text-ink-2 max-w-2xl text-base md:text-lg">
          Informe quanto pagou e quantos mg vieram na embalagem. A calculadora mostra o custo
          de cada aplicação, do mês e do ano — e quanto se perde quando o frasco vence antes de acabar.
        </p>
      </div>

      <GlpCostCalculator />

      <section className="mt-12 max-w-3xl" aria-labelledby="como-funciona">
        <h2 id="como-funciona" className="text-xl font-bold mb-3">Como a conta é feita</h2>
        <ol className="space-y-2 text-ink-2 list-decimal pl-5 leading-relaxed">
          <li><strong>Custo por mg</strong> = preço pago ÷ mg totais da embalagem.</li>
          <li><strong>Custo por dose</strong> = custo por mg × dose semanal em mg.</li>
          <li><strong>Custo por mês</strong> = custo por dose × 4,33 semanas (52 ÷ 12).</li>
          <li>
            <strong>Com descarte</strong>: se a embalagem rende mais de 4 doses, só 4 são aproveitadas
            em 28 dias — o custo por dose passa a ser preço ÷ 4.
          </li>
        </ol>
      </section>


      <RelatedLinks links={RELATED_LINKS} />

      <FAQ items={FAQ_ITEMS} />

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
