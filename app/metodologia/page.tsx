import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Metodologia Editorial',
  description: 'Como a Central Peptídeos produz conteúdo: fontes, processo de revisão, atualizações e transparência.',
  alternates: { canonical: '/metodologia' },
};

export default function MetodologiaPage() {
  return (
    <>
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Metodologia</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Como produzimos conteúdo
          </h1>
          <p className="mt-3 text-lg text-ink-2 leading-relaxed max-w-2xl">
            Informação médica sensível pede transparência radical. Aqui está como
            cada ficha e artigo é construído.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14 prose-article">
        <h2>Hierarquia de fontes</h2>
        <p>Ordenamos as fontes por nível de evidência:</p>
        <ol>
          <li><strong>Bulas oficiais</strong> aprovadas por FDA, EMA e ANVISA — a referência máxima para medicamentos aprovados.</li>
          <li><strong>Ensaios clínicos randomizados</strong> publicados em periódicos peer-reviewed indexados (NEJM, JAMA, Lancet, BMJ).</li>
          <li><strong>Revisões sistemáticas e meta-análises</strong> da Cochrane, PubMed e Embase.</li>
          <li><strong>Diretrizes de sociedades médicas</strong> (SBD, SBEM, SBGG, SBPT).</li>
          <li><strong>Documentos regulatórios</strong> de WADA, MHRA, TGA para status de uso em esporte e alertas.</li>
          <li><strong>Literatura pré-clínica</strong> — usada apenas quando não há dados humanos, sempre sinalizada como tal.</li>
        </ol>

        <h2>O que NÃO usamos como fonte</h2>
        <ul>
          <li>Blogs de opinião sem citação de referência</li>
          <li>Redes sociais</li>
          <li>Sites de venda de produtos</li>
          <li>Fóruns e grupos de discussão</li>
          <li>Comunicações de marketing farmacêutico</li>
        </ul>

        <h2>Processo de publicação</h2>
        <ol>
          <li><strong>Pesquisa</strong>: buscamos em PubMed, FDA, ANVISA e sociedades médicas.</li>
          <li><strong>Redação</strong>: um editor produz o texto com citação explícita das fontes.</li>
          <li><strong>Revisão técnica</strong>: quando disponível, um revisor credenciado valida dados clínicos (estamos construindo esta rede — busque o campo &quot;Revisado por&quot; em cada artigo).</li>
          <li><strong>Controle de atualização</strong>: cada ficha tem campo <code>lastReviewed</code> — ao publicar, a data é fixada.</li>
          <li><strong>Re-revisão periódica</strong>: meta de revisar cada peptídeo FDA-aprovado a cada 6 meses; peptídeos de pesquisa a cada 12 meses.</li>
        </ol>

        <h2>Transparência sobre o que não sabemos</h2>
        <p>
          Peptídeos são uma área em evolução rápida. Muitos compostos catalogados
          aqui têm dados limitados em humanos. Preferimos <strong>omitir um campo</strong>
          {' '}a preenchê-lo com suposição. Nossa regra interna: se não conseguimos citar
          fonte verificável, o campo fica vazio.
        </p>
        <p>
          Quando dizemos &quot;dados em humanos são limitados&quot; ou &quot;evidência principalmente pré-clínica&quot;, é exatamente isso — não é pudor editorial, é a realidade da ciência atual daquele composto.
        </p>

        <h2>Conflito de interesses</h2>
        <ul>
          <li>Não recebemos pagamento de fabricantes de medicamentos</li>
          <li>Não promovemos marcas específicas em troca de comissão no conteúdo editorial</li>
          <li>Não exibimos banners nem links de afiliado de fornecedores de peptídeos; se isso mudar, será <strong>declarado</strong> com selo visível</li>
          <li>O site se mantém com a venda de ebooks próprios, identificados como produto da Central Peptídeos</li>
          <li>Patrocínios são claramente marcados como &quot;Conteúdo patrocinado&quot;</li>
        </ul>

        <h2>Correções e erratas</h2>
        <p>
          Erros acontecem. Quando publicamos uma correção significativa, atualizamos
          o texto e sinalizamos a mudança com a data nova. Histórico de grandes
          atualizações ficará em um changelog público (em construção).
        </p>
        <p>
          Encontrou um erro? Abra uma issue no{' '}
          <Link href="/contato">canal de contato</Link>{' '} — correções de dados
          incorretos são prioridade zero.
        </p>

        <h2>O que este site não é</h2>
        <ul>
          <li>❌ Uma fonte de prescrição — doses mencionadas são <em>referências da literatura</em>, não recomendações individuais</li>
          <li>❌ Aconselhamento médico — use sempre em conjunto com profissional de saúde habilitado</li>
          <li>❌ Um marketplace — não vendemos peptídeos nem indicamos fornecedores</li>
          <li>❌ Uma autoridade regulatória — orientação legal vem de ANVISA, CFM e Vigilância Sanitária</li>
        </ul>

        <h2>Como você pode contribuir</h2>
        <p>
          Se é profissional de saúde (médico, farmacêutico, nutrólogo, biomédico)
          e gostaria de revisar fichas ou contribuir com artigos, escreva para
          contato@centralpeptideos.com.br — precisamos de revisores credenciados
          para manter o padrão de qualidade.
        </p>

        <h2>Contato</h2>
        <ul>
          <li><Link href="/contato">Canal de correções e sugestões</Link></li>
          <li><Link href="/privacidade">Política de privacidade</Link></li>
          <li><Link href="/termos">Termos de uso</Link></li>
        </ul>
      </div>
    </>
  );
}
