import type { Metadata } from 'next';
import { social } from '@/lib/og';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import MissedDoseCalculator from '@/components/calculator/MissedDoseCalculator';
import { ebookForPeptide, offerFor } from '@/lib/ebooks';
import { MISSED_MEDS } from '@/lib/missed-dose';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import ToolSchema from '@/components/ui/ToolSchema';
import { SITE_URL } from '@/lib/site';
import EmbedSnippet from '@/components/ui/EmbedSnippet';

const PATH = '/ferramentas/dose-esquecida';

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Esqueci o Ozempic. Até quando posso aplicar?',
    a: 'Pela bula, até 5 dias depois da data prevista: aplique assim que lembrar e faça a próxima dose no dia de sempre. Passados mais de 5 dias, pule a dose esquecida e aplique só a próxima, no dia habitual. O Wegovy segue a mesma regra na bula brasileira.',
  },
  {
    q: 'E o Mounjaro, qual é o prazo?',
    a: 'Quatro dias (96 horas) depois do horário previsto. Dentro do prazo, aplique assim que possível e volte ao dia habitual na semana seguinte. Depois dele, pule a dose e espere o dia de sempre. O Zepbound, que também é tirzepatida, traz a mesma regra.',
  },
  {
    q: 'Posso aplicar duas doses para compensar a que esqueci?',
    a: 'Não. As bulas do Ozempic, do Wegovy, do Mounjaro e do Rybelsus orientam a não fazer dose extra nem aumentar a dose para compensar. Dose dobrada aumenta o risco de náusea, vômito e diarreia.',
  },
  {
    q: 'Fiquei duas semanas ou mais sem aplicar. O que a ferramenta mostra?',
    a: 'Que é hora de falar com o médico. A bula do Wegovy manda procurar o médico quando mais de uma dose é esquecida, para avaliar se a subida de dose precisa recomeçar; as do Ozempic e do Mounjaro não trazem regra para esse caso. Depois de uma pausa, voltar direto na dose alta costuma trazer náusea e vômito mais fortes.',
    link: { label: 'Calendário de subida de dose', href: '/ferramentas/titulacao' },
  },
  {
    q: 'Vale para tirzepatida ou semaglutida em frasco?',
    a: 'Não oficialmente. Produto manipulado ou em frasco liofilizado não tem bula própria aprovada, então não existe regra oficial de dose esquecida para ele. Os prazos da ferramenta são os das canetas e comprimidos registrados; no frasco, a orientação deve vir de quem prescreveu.',
  },
  {
    q: 'A ferramenta guarda a data que eu informei?',
    a: 'Não. A conta é feita no seu aparelho e nada é enviado. A data só aparece no endereço da página se você usar o botão de copiar o link ou enviar pelo WhatsApp.',
  },
];

const RELATED_LINKS: RelatedLink[] = [
  { href: '/blog/dose-esquecida-semaglutida-tirzepatida', label: 'Dose esquecida: o que cada bula diz', desc: 'O texto das bulas brasileiras e americanas, marca por marca.' },
  { href: '/ferramentas/diario', label: 'Diário de aplicações', desc: 'Anote cada dose e veja quando foi a última.' },
  { href: '/ferramentas/titulacao', label: 'Subida de dose GLP-1', desc: 'Calendário semana a semana com datas.' },
  { href: '/blog/nausea-tirzepatida-como-lidar', label: 'Náusea na tirzepatida', desc: 'Como aliviar e quando procurar o médico.' },
];

export const metadata: Metadata = {
  title: 'Esqueci a dose do Ozempic ou Mounjaro: o que fazer agora',
  description:
    'Informe o dia em que a dose deveria ter sido aplicada e veja o que a bula manda: aplicar agora ou pular, o prazo exato e a data da próxima dose. Ozempic, Wegovy, Mounjaro e Rybelsus.',
  ...social({
    kind: 'pagina', slug: 'dose-esquecida', path: PATH,
    title: 'Esqueci a dose: aplico agora ou pulo?',
    description: 'O prazo da bula e a data da próxima dose de Ozempic, Wegovy, Mounjaro, Zepbound e Rybelsus.',
  }),
  alternates: { canonical: PATH },
};

export default function DoseEsquecidaPage() {
  // Oferta muda com o medicamento escolhido; página de caneta: sem guia próprio, cai no kit.
  const offers = Object.fromEntries(
    Array.from(new Set(MISSED_MEDS.map((m) => m.peptideSlug))).map((slug) => [slug, offerFor(ebookForPeptide(slug), { pen: true })]),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <ToolSchema
        name="Dose esquecida de GLP-1 (Ozempic, Wegovy, Mounjaro, Rybelsus)"
        description="Mostra o que a bula manda fazer com a dose esquecida de semaglutida ou tirzepatida: aplicar agora ou pular, o prazo e a data da próxima dose."
        path={PATH}
      />
      <div className="mb-4 no-print">
        <Breadcrumb items={[{ label: 'Ferramentas', href: '/ferramentas' }, { label: 'Dose esquecida' }]} siteUrl={SITE_URL} />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Esqueci a dose — <span className="text-teal-700">aplico agora ou pulo?</span>
        </h1>
        <p className="mt-2 text-ink-2 max-w-2xl text-base md:text-lg">
          Escolha o medicamento e o dia em que a dose deveria ter sido aplicada. A resposta segue o prazo
          da bula de cada marca e já mostra a data da próxima dose.
        </p>
      </header>

      <MissedDoseCalculator offers={offers} />

      <section className="mt-10 max-w-3xl no-print" aria-labelledby="regras">
        <h2 id="regras" className="text-xl md:text-2xl font-bold mb-3">A regra de cada bula</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ink-3 border-b border-border">
                <th scope="col" className="p-3 font-bold">Medicamento</th>
                <th scope="col" className="p-3 font-bold">Prazo para aplicar</th>
                <th scope="col" className="p-3 font-bold">Passou do prazo</th>
              </tr>
            </thead>
            <tbody>
              {MISSED_MEDS.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 align-top">
                  <th scope="row" className="p-3 text-left font-semibold">
                    {m.label} <span className="block text-xs font-normal text-ink-3">{m.active}</span>
                  </th>
                  <td className="p-3">{m.kind === 'daily' ? 'Não recupera' : m.windowText}</td>
                  <td className="p-3">
                    {m.kind === 'daily' ? 'Só um comprimido na manhã seguinte, em jejum' : 'Pule e siga no dia de sempre'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-2 leading-relaxed">
          Em todas elas vale o mesmo: não faça dose extra e não aumente a dose para compensar. Se você usa
          insulina ou sulfonilureia, esqueceu mais de uma dose ou tem cirurgia marcada, fale com o médico
          antes de decidir.
        </p>
      </section>

      <EmbedSnippet
        embedUrl={`${SITE_URL}/embed/dose-esquecida`}
        creditUrl={`${SITE_URL}${PATH}`}
        creditLabel="Dose esquecida de Ozempic e Mounjaro"
        title="Esqueci a dose do Ozempic, Wegovy ou Mounjaro: o que fazer"
        tool="dose-esquecida"
        height={820}
      />

      <RelatedLinks links={RELATED_LINKS} />

      <FAQ items={FAQ_ITEMS} />

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
