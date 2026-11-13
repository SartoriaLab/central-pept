import type { Metadata } from 'next';
import { social } from '@/lib/og';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import { SITE_URL } from '@/lib/site';
import InjectionDiary from '@/components/calculator/InjectionDiary';
import InjectionSiteGuide from '@/components/peptide/InjectionSiteGuide';
import { getPeptides } from '@/lib/peptides';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import ToolSchema from '@/components/ui/ToolSchema';

const PATH = '/ferramentas/diario';

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Por que fazer rodízio dos locais de aplicação?',
    a: 'Aplicar sempre no mesmo ponto pode causar lipohipertrofia: um endurecimento da gordura sob a pele que piora a absorção e deixa a dose menos previsível. Alternar entre abdome, coxas e braços, e entre os lados, dá tempo para cada região se recuperar.',
  },
  {
    q: 'Como o diário escolhe o próximo local?',
    a: 'Primeiro sugere um local que você ainda não usou; quando todos já foram usados, sugere o que está há mais tempo parado. Você pode escolher outro na hora e desligar locais que não usa nos ajustes.',
  },
  {
    q: 'Meus dados ficam salvos onde?',
    a: 'Só no seu navegador (localStorage). Nada é enviado para o site. Isso também quer dizer que limpar os dados do navegador apaga o diário: exporte o CSV de vez em quando para guardar uma cópia.',
  },
  {
    q: 'Dá para colocar a próxima aplicação na agenda?',
    a: 'Sim. Escolha a frequência nos ajustes e use "Lembrete .ics": o arquivo abre no Google Agenda, Apple Calendar ou Outlook com um alerta 15 minutos antes e o local sugerido pelo rodízio.',
  },
];

const RELATED_LINKS: RelatedLink[] = [
  { href: '/ferramentas/cronograma', label: 'Cronograma de doses', desc: 'Calendário completo do ciclo em .ics.' },
  { href: '/ferramentas/reconstituicao', label: 'Calculadora de reconstituição', desc: 'Quantas unidades puxar na seringa.' },
  { href: '/ferramentas/duracao-frasco', label: 'Duração do frasco', desc: 'Quantos frascos o ciclo pede.' },
  { href: '/seringas', label: 'Como ler a seringa de insulina', desc: 'Escalas de 30, 50 e 100 unidades.' },
];

export const metadata: Metadata = {
  title: 'Diário de aplicações com rodízio de locais',
  description:
    'Anote cada aplicação, veja qual local usar na próxima pelo rodízio (abdome, coxa, braço) e exporte em CSV ou para a agenda. Gratuito e só no seu navegador.',
  ...social({
    kind: 'pagina', slug: 'diario', path: PATH,
    title: 'Diário de aplicações',
    description: 'Registro de aplicações com rodízio de locais.',
  }),
  alternates: { canonical: PATH },
};

export default function DiarioPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <ToolSchema
        name="Diário de aplicações"
        description="Registro de aplicações de peptídeos com sugestão de rodízio de locais e exportação em CSV e .ics."
        path={PATH}
      />
      <div className="mb-4">
        <Breadcrumb items={[{ label: 'Ferramentas', href: '/ferramentas' }, { label: 'Diário de aplicações' }]} siteUrl={SITE_URL} />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">Diário de aplicações</h1>
        <p className="mt-2 text-ink-2 max-w-2xl text-base md:text-lg">
          Registre cada aplicação e veja onde aplicar a próxima. Os dados ficam só no seu navegador.
        </p>
      </header>

      <InjectionDiary peptides={getPeptides()} />

      <div className="mt-10">
        <InjectionSiteGuide />
      </div>

      <RelatedLinks links={RELATED_LINKS} />

      <FAQ items={FAQ_ITEMS} />

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
