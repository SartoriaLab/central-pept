import type { Metadata } from 'next';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import { SITE_URL } from '@/lib/site';
import ScheduleCalculator from '@/components/calculator/ScheduleCalculator';
import { getPeptides } from '@/lib/peptides';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import ToolSchema from '@/components/ui/ToolSchema';

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Como funciona o cronograma de aplicações?',
    a: 'Você escolhe o peptídeo, a frequência (diária, 2x/semana, semanal etc.) e a data de início. A ferramenta monta a agenda completa de aplicações e gera um arquivo que você importa no seu calendário, com lembretes automáticos.',
  },
  {
    q: 'O arquivo .ics funciona no Google, Apple e Outlook?',
    a: 'Sim. O .ics é o formato universal de calendário — funciona no Google Calendar, Apple Calendar (iPhone/Mac), Outlook e na maioria dos apps de agenda. Basta abrir o arquivo baixado que os eventos são adicionados.',
  },
  {
    q: 'Com quanta antecedência recebo o lembrete?',
    a: 'Cada aplicação vem com um alerta 15 minutos antes, para você não esquecer a dose. O horário do lembrete segue o que você definiu ao montar o cronograma.',
  },
  {
    q: 'Posso agendar mais de um peptídeo com frequências diferentes?',
    a: 'Sim. Dá para montar cronogramas separados para cada peptídeo (ex.: um semanal e outro diário) e importar todos no mesmo calendário. Cada série de eventos fica identificada pelo nome do peptídeo.',
  },
  {
    q: 'Meus dados ficam salvos em algum servidor?',
    a: 'Não. O cronograma é gerado no seu navegador e baixado como arquivo .ics — nada é enviado nem armazenado em servidor. Sem cadastro e sem coleta de dados de saúde.',
  },
];

const RELATED_LINKS: RelatedLink[] = [
  { href: '/ferramentas/titulacao', label: 'Plano de subida de dose GLP-1', desc: 'Escalonamento semana a semana.' },
  { href: '/ferramentas/reconstituicao', label: 'Calculadora de reconstituição', desc: 'Concentração e unidades por dose.' },
  { href: '/peptideos', label: 'Enciclopédia de peptídeos', desc: 'Frequência e dose de cada peptídeo.' },
];

export const metadata: Metadata = {
  title: 'Cronograma de Doses de Peptídeos (exporta para a agenda)',
  description: 'Monte um cronograma de aplicações e baixe como arquivo .ics para importar no Google Calendar, Apple Calendar ou Outlook.',
  alternates: { canonical: '/ferramentas/cronograma' },
};

export default function CronogramaPage() {
  const peptides = getPeptides();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <ToolSchema
        name="Cronograma de Doses de Peptídeos"
        description="Monte um cronograma de aplicações e baixe como arquivo .ics para importar no Google Calendar, Apple Calendar ou Outlook."
        path="/ferramentas/cronograma"
      />
      <div className="mb-4">
        <Breadcrumb items={[{ label: 'Ferramentas', href: '/ferramentas' }, { label: 'Cronograma' }]} siteUrl={SITE_URL} />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Cronograma de Doses
        </h1>
        <p className="mt-2 text-ink-2 max-w-2xl text-base md:text-lg">
          Monte um cronograma de aplicações e baixe como arquivo <code>.ics</code>
          {' '}para importar no seu calendário favorito. Alertas automáticos 15 minutos
          antes de cada dose.
        </p>
      </header>

      <ScheduleCalculator peptides={peptides} />

      <RelatedLinks links={RELATED_LINKS} />

      <FAQ items={FAQ_ITEMS} />

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
