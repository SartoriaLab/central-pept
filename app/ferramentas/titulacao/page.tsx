import type { Metadata } from 'next';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import { SITE_URL } from '@/lib/site';
import TitrationCalculator from '@/components/calculator/TitrationCalculator';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import ToolSchema from '@/components/ui/ToolSchema';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'O que é titulação (subida de dose) e por que fazer?',
    a: 'Titulação é aumentar a dose gradualmente ao longo de semanas, em vez de começar na dose alvo. Com GLP-1 (semaglutida, tirzepatida) isso reduz muito os efeitos gastrointestinais — náusea, vômito, diarreia — dando tempo para o corpo se adaptar. Pular a titulação é a principal causa de efeitos colaterais severos.',
  },
  {
    q: 'Quanto tempo fico em cada dose antes de subir?',
    a: 'O padrão de bula é 4 semanas por etapa. Semaglutida: 0,25 → 0,5 → 1,0 → 1,7 → 2,4 mg. Tirzepatida: 2,5 → 5 → 7,5 → 10 → 12,5 → 15 mg. Se os efeitos colaterais estiverem fortes, é seguro permanecer mais tempo numa etapa antes de avançar.',
  },
  {
    q: 'Posso pular etapas para emagrecer mais rápido?',
    a: 'Não é recomendado. Subir rápido demais não acelera a perda de peso de forma sustentável e aumenta muito o risco de náusea intensa, vômito e desidratação. A perda de peso responde à exposição ao longo do tempo, não a saltos de dose.',
  },
  {
    q: 'O que faço se os efeitos colaterais forem fortes numa etapa?',
    a: 'Não suba a dose: repita a etapa atual por mais 2-4 semanas até tolerar bem. Se ainda assim estiver difícil, converse com o médico sobre voltar à dose anterior. Náusea costuma melhorar com refeições menores, menos gordura e boa hidratação.',
  },
  {
    q: 'Qual a dose máxima de Ozempic/Wegovy e Mounjaro?',
    a: 'Semaglutida: Ozempic vai até 2,0 mg/semana (diabetes) e Wegovy até 2,4 mg/semana (obesidade). Tirzepatida (Mounjaro/Zepbound) vai até 15 mg/semana. Nem todos precisam chegar à dose máxima — a ideal é a menor que mantém o resultado com efeitos toleráveis.',
  },
  {
    q: 'A ferramenta exporta o calendário de doses?',
    a: 'Sim. Depois de montar o plano semana a semana, você exporta as datas para o Google Calendar, com um lembrete automático em cada aumento de dose.',
  },
];

const RELATED_LINKS: RelatedLink[] = [
  { href: '/blog/quanto-tempo-ozempic-faz-efeito', label: 'Quanto tempo o Ozempic leva pra fazer efeito', desc: 'Linha do tempo de saciedade e perda de peso.' },
  { href: '/blog/nausea-ozempic-como-lidar', label: 'Náusea no Ozempic: como lidar', desc: 'Estratégias para tolerar a subida de dose.' },
  { href: '/blog/efeito-rebote-apos-parar-semaglutida', label: 'Efeito rebote após parar', desc: 'O que esperar ao descontinuar.' },
  { href: '/peptideos/semaglutida', label: 'Ficha da semaglutida', desc: 'Dados de Ozempic e Wegovy.' },
  { href: '/peptideos/tirzepatida', label: 'Ficha da tirzepatida', desc: 'Dados de Mounjaro e Zepbound.' },
];

export const metadata: Metadata = {
  title: 'Plano de Subida de Dose — Ozempic, Wegovy e Mounjaro',
  description: 'Calendário de subida de dose para semaglutida (Ozempic/Wegovy) e tirzepatida (Mounjaro/Zepbound). Semana a semana, com datas automáticas e export para o Google Calendar.',
  openGraph: {
    title: 'Plano de Subida de Dose GLP-1 — Ozempic e Mounjaro',
    description: 'Subida de dose semana a semana, com datas automáticas.',
  },
  alternates: { canonical: '/ferramentas/titulacao' },
};

export default function TitulacaoPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <ToolSchema
        name="Plano de Subida de Dose GLP-1 (Ozempic, Wegovy, Mounjaro)"
        description="Calendário de subida de dose para semaglutida e tirzepatida, semana a semana, com datas automáticas e export para o Google Calendar."
        path="/ferramentas/titulacao"
      />
      <div className="mb-4">
        <Breadcrumb items={[{ label: 'Ferramentas', href: '/ferramentas' }, { label: 'Subida de Dose GLP-1' }]} siteUrl={SITE_URL} />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Subida de Dose — <span className="text-teal-700">Ozempic, Wegovy e Mounjaro</span>
        </h1>
        <p className="mt-2 text-ink-2 max-w-2xl text-base md:text-lg">
          Monte o calendário completo de escalonamento semana a semana para semaglutida
          (Ozempic/Wegovy) e tirzepatida (Mounjaro/Zepbound). Com datas automáticas e
          export para o Google Calendar.
        </p>
      </header>

      <TitrationCalculator />

      <div className="mt-8">
        <AffiliateBox
          productId="fornecedor_oficial"
          slot="titulacao-bottom"
          peptide="tirzepatida"
        />
      </div>

      <RelatedLinks links={RELATED_LINKS} />

      <FAQ items={FAQ_ITEMS} />

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
