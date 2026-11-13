import type { Metadata } from 'next';
import { social } from '@/lib/og';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import { SITE_URL } from '@/lib/site';
import VialPlanner from '@/components/calculator/VialPlanner';
import { getPeptides } from '@/lib/peptides';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import ToolSchema from '@/components/ui/ToolSchema';

const PATH = '/ferramentas/duracao-frasco';

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Quanto tempo dura um frasco de peptídeo?',
    a: 'Divida os mg do frasco pela dose de cada aplicação para saber quantas doses cabem, e multiplique pelo intervalo entre aplicações. Um frasco de 5 mg com 250 mcg por dia rende 20 doses, ou 20 dias. Mas o frasco reconstituído costuma valer cerca de 28 dias na geladeira: se as doses passarem disso, o resto se perde.',
  },
  {
    q: 'Quantos frascos preciso para um ciclo?',
    a: 'Conte as aplicações do ciclo (duração em dias ÷ intervalo) e divida pelas doses que você realmente aproveita de cada frasco, arredondando para cima. A calculadora já considera a validade do frasco aberto, que costuma ser o que mais muda a conta em doses semanais.',
  },
  {
    q: 'Por que o frasco grande pode sair mais caro?',
    a: 'Se a dose é pequena e semanal, um frasco grande guarda mais doses do que você consegue usar antes de vencer. Exemplo: 20 mg com 2,5 mg por semana teria 8 doses, mas em 28 dias só 4 são aplicadas e metade vai fora. Um frasco menor, ou dois frascos menores em sequência, desperdiça menos.',
  },
  {
    q: 'A validade de 28 dias vale para todo peptídeo?',
    a: 'É a referência mais comum para frasco reconstituído com água bacteriostática e guardado entre 2 °C e 8 °C, mas não é regra para todos. Ajuste o campo "Validade aberto" conforme a bula ou a orientação de quem forneceu. Com água estéril sem conservante, o prazo costuma ser bem menor.',
  },
];

const RELATED_LINKS: RelatedLink[] = [
  { href: '/ferramentas/reconstituicao', label: 'Calculadora de reconstituição', desc: 'Quantas unidades puxar na seringa.' },
  { href: '/ferramentas/custo-glp1', label: 'Custo por dose de GLP-1', desc: 'Preço por mg, por aplicação e por mês.' },
  { href: '/ferramentas/cronograma', label: 'Cronograma de doses', desc: 'Calendário das aplicações em .ics.' },
  { href: '/blog/agua-bacteriostatica-guia', label: 'Água bacteriostática: guia', desc: 'Validade e armazenamento depois de reconstituir.' },
];

export const metadata: Metadata = {
  title: 'Quanto tempo dura o frasco e quantos frascos preciso',
  description:
    'Calcule quantos dias dura um frasco de peptídeo, quantos frascos o ciclo pede e quanto se perde pela validade de 28 dias depois de reconstituído.',
  ...social({
    kind: 'pagina', slug: 'duracao-frasco', path: PATH,
    title: 'Quanto tempo dura o frasco',
    description: 'Duração do frasco e frascos por ciclo.',
  }),
  alternates: { canonical: PATH },
};

export default function DuracaoFrascoPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <ToolSchema
        name="Calculadora de duração do frasco"
        description="Quantos dias dura um frasco de peptídeo e quantos frascos um ciclo pede, considerando a validade depois de reconstituído."
        path={PATH}
      />
      <div className="mb-4">
        <Breadcrumb items={[{ label: 'Ferramentas', href: '/ferramentas' }, { label: 'Duração do frasco' }]} siteUrl={SITE_URL} />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Quanto tempo dura o frasco?
        </h1>
        <p className="mt-2 text-ink-2 max-w-2xl text-base md:text-lg">
          Informe o frasco, a dose e o ritmo das aplicações: veja quantos dias ele dura, quantos frascos o
          ciclo pede e quanto se perde pela validade depois de reconstituído.
        </p>
      </header>

      <VialPlanner peptides={getPeptides()} />

      <RelatedLinks links={RELATED_LINKS} />

      <FAQ items={FAQ_ITEMS} />

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
