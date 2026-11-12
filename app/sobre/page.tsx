import { getPeptides } from '@/lib/peptides';
import type { Metadata } from 'next';
import Link from 'next/link';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Metodologia editorial, fontes e compromisso com informação médica responsável na Central Peptídeos.',
  alternates: { canonical: '/sobre' },
};

export default function SobrePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">Sobre a Central Peptídeos</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">
          Central brasileira de informação sobre peptídeos de pesquisa e terapêuticos —
          ferramentas de cálculo, fichas técnicas e guias detalhados, com foco em precisão
          e responsabilidade editorial.
        </p>
      </header>

      <section className="card p-6 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">O que você encontra aqui</h2>
        <ul className="space-y-2.5 text-ink-2">
          <li>
            <Link href="/ferramentas/reconstituicao" className="text-teal-700 font-semibold hover:underline">
              Calculadora de reconstituição
            </Link>
            {' '}— quantas unidades puxar na seringa a partir da quantidade de peptídeo,
            água bacteriostática e dose desejada. Cálculos em tempo real.
          </li>
          <li>
            <Link href="/peptideos" className="text-teal-700 font-semibold hover:underline">
              Enciclopédia de peptídeos
            </Link>
            {' '}— {getPeptides().length} fichas técnicas com dose típica, mecanismo, efeitos colaterais,
            contraindicações, status regulatório (FDA / WADA) e referências primárias.
          </li>
          <li>
            <Link href="/blog" className="text-teal-700 font-semibold hover:underline">
              Blog
            </Link>
            {' '}— guias práticos, protocolos e comparações.
          </li>
        </ul>
      </section>

      <section className="card p-6 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Metodologia editorial</h2>
        <div className="text-ink-2 leading-relaxed space-y-3">
          <p>
            Todo conteúdo sobre peptídeos é construído a partir de fontes primárias verificáveis:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Bulas oficiais</strong> de agências regulatórias (FDA, EMA, ANVISA, MHRA, TGA)</li>
            <li><strong>Literatura peer-reviewed</strong> indexada em PubMed, principalmente revisões e ensaios clínicos</li>
            <li><strong>Lista Proibida da WADA</strong> para status antidoping</li>
            <li><strong>Notas oficiais de fabricantes</strong> para compostos experimentais</li>
          </ul>
          <p>
            Cada ficha traz a data da última revisão e links diretos para as fontes.
            Informações que não podemos verificar são omitidas — preferimos deixar um campo em branco
            a preencher com dados imprecisos.
          </p>
        </div>
      </section>

      <section className="card p-6 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">O que este site não é</h2>
        <ul className="space-y-2 text-ink-2 leading-relaxed">
          <li>❌ <strong>Não é prescrição médica.</strong> As doses típicas são referências da literatura, não recomendações individuais.</li>
          <li>❌ <strong>Não vende peptídeos</strong>, não indica fornecedores e não recebe comissão por indicação.</li>
          <li>❌ <strong>Não incentiva uso</strong> de compostos não aprovados ou proibidos em esporte.</li>
          <li>❌ <strong>Não é aconselhamento jurídico</strong> sobre compra, importação ou uso.</li>
        </ul>
      </section>

      <section className="card p-6 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Fases do projeto</h2>
        <ol className="space-y-2 text-ink-2 list-decimal pl-5">
          <li><strong>Fase 1 ✅</strong> — Calculadora de reconstituição, enciclopédia com {getPeptides().length} peptídeos, status regulatório</li>
          <li><strong>Fase 2</strong> — Supabase + painel editorial para atualizar conteúdo sem redeploy</li>
          <li><strong>Fase 3</strong> — Blog com artigos aprofundados e comparações</li>
          <li><strong>Fase 4</strong> — Novas calculadoras: mistura em seringa única, conversor de unidades, cronograma</li>
        </ol>
      </section>

      <section className="card p-6 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Correções e sugestões</h2>
        <p className="text-ink-2 leading-relaxed">
          Encontrou um dado incorreto, referência quebrada ou gostaria de sugerir um peptídeo
          para catalogar? Abra uma issue no repositório do projeto no GitHub.
        </p>
      </section>

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
