import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'ghk-cu-para-que-serve';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'GHK-Cu tópico ou injetável: qual usar?',
    a: 'Para a maioria das pessoas, a resposta prática é o tópico. Como ingrediente cosmético (0,05% a 2% em séruns e cremes), o GHK-Cu é permitido e tem décadas de uso documentado, com bom perfil de segurança. A forma injetável, popular no biohacking, não tem aprovação regulatória para uso humano — permanece no campo da pesquisa, e os produtos vendidos são rotulados "apenas para pesquisa", geralmente de fornecedores não farmacêuticos, sem garantia de pureza ou esterilidade.',
  },
  {
    q: 'GHK-Cu funciona para o cabelo?',
    a: 'Peptídeos de cobre são usados em produtos capilares há anos, apoiados na ideia de que o GHK-Cu melhora o ambiente perifolicular, estimula a matriz extracelular e tem ação anti-inflamatória e antioxidante. É melhor visto como um coadjuvante em uma rotina — e não como substituto de tratamentos com evidência mais robusta para queda de cabelo. A base de estudos específicos para cabelo ainda é menor do que a de pele.',
  },
  {
    q: 'GHK-Cu injetável é aprovado?',
    a: 'Não. A forma injetável (subcutânea ou intramuscular) do GHK-Cu não possui aprovação da ANVISA, da FDA nem da EMA para uso humano. Os dados em humanos para essa via são muito limitados e ela permanece no domínio da pesquisa. O uso injetável fora de protocolos de pesquisa não é recomendado.',
  },
  {
    q: 'GHK-Cu clareia manchas?',
    a: 'Não é essa a sua função principal. O GHK-Cu atua sobretudo na regeneração e na síntese de colágeno e elastina, não como um clareador clássico (como a vitamina C ou os despigmentantes). A melhora geral de textura, firmeza e qualidade da pele pode dar uma impressão de uniformização, mas para manchas e melasma a evidência específica é limitada e ele não substitui um tratamento despigmentante.',
  },
  {
    q: 'GHK-Cu tem efeitos colaterais?',
    a: 'No uso tópico, o perfil é favorável: no máximo irritação local ocasional ou eritema transitório, e possível dermatite de contato em pessoas sensibilizadas ao cobre. É contraindicado em alergia ao cobre e na doença de Wilson (distúrbio do metabolismo do cobre). Na forma injetável há preocupações adicionais com esterilidade dos produtos de mercado cinza e, em tese, risco de acúmulo de cobre no uso crônico sem monitorização.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        O GHK-Cu virou um dos peptídeos mais comentados em rotinas de skincare e em fóruns de
        biohacking — e boa parte da confusão em torno dele nasce de misturar duas coisas bem
        diferentes: o uso <strong>tópico</strong> e o uso <strong>injetável</strong>. São dois
        mundos distintos em termos de regulação e de evidência. Este artigo separa um do outro e
        explica, com base no que se conhece, para que o GHK-Cu realmente serve.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ A distinção que importa:</strong> no uso <strong>tópico</strong> (séruns e
        cremes), o GHK-Cu é um <strong>ingrediente cosmético consagrado e permitido</strong>, com
        décadas de uso seguro documentado. Já a forma <strong>injetável</strong> (SC/IM){' '}
        <strong>não tem aprovação regulatória</strong> para uso humano — permanece no domínio da
        pesquisa. Este texto é informativo e não substitui orientação profissional.
      </div>

      <h2>O que é o GHK-Cu</h2>
      <p>
        O GHK-Cu é o complexo de cobre do tripeptídeo glicil-L-histidil-L-lisina (GHK), isolado
        pela primeira vez do plasma humano em 1973 pelo pesquisador Loren Pickart. O GHK é uma
        molécula que existe naturalmente no corpo e tem altíssima afinidade pelo cobre — ao se
        ligar a ele, forma um complexo estável, o GHK-Cu.
      </p>
      <p>
        Um detalhe que ajuda a entender o interesse pela molécula: os níveis plasmáticos de GHK
        <strong> caem com a idade</strong> — de cerca de 200 ng/mL aos 20 anos para algo em torno
        de 80 ng/mL aos 60. Essa queda motivou boa parte da pesquisa sobre suas ações
        regenerativas na pele, cicatrizantes e de modulação da expressão gênica. Para os dados
        técnicos completos — dose, faixa de uso e referências dos estudos —, consulte a{' '}
        <Link href="/peptideos/ghk-cu">ficha técnica do GHK-Cu</Link>.
      </p>

      <h2>Tópico vs injetável: a diferença que importa</h2>
      <p>
        Esta é a parte que mais gera dúvida. As duas formas usam a mesma molécula, mas estão em
        situações regulatórias completamente diferentes:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th>Aspecto</th><th>Tópico (cosmético)</th><th>Injetável (SC/IM)</th></tr>
          </thead>
          <tbody>
            <tr><td>Situação regulatória</td><td>Permitido e amplamente usado</td><td>Sem aprovação para uso humano</td></tr>
            <tr><td>Concentração / dose</td><td>0,05% a 2% em cosméticos</td><td>Não estabelecida para humanos</td></tr>
            <tr><td>Histórico de uso</td><td>Décadas, com segurança documentada</td><td>Dados humanos muito limitados</td></tr>
            <tr><td>Origem dos produtos</td><td>Cosméticos regulados</td><td>Rotulados "apenas para pesquisa"</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Na prática: o <strong>tópico</strong> é o que a maioria das pessoas encontra em séruns
        anti-idade, pós-procedimento e cuidados capilares — um ingrediente cosmético consagrado.
        Já o <strong>injetável</strong>, popular em círculos de biohacking, não tem aprovação de
        ANVISA, FDA ou EMA e é vendido por fornecedores geralmente não farmacêuticos, muitas vezes
        sem garantia de pureza ou esterilidade. Ele pertence ao domínio da pesquisa.
      </p>

      <h2>Como funciona (o cobre, o colágeno e a expressão gênica)</h2>
      <p>
        O mecanismo do GHK-Cu tem três camadas que se complementam:
      </p>
      <ul>
        <li>
          <strong>Transporte de cobre:</strong> o GHK carrega o cobre(II) de forma estável,
          funcionando como um transportador fisiológico. O cobre é cofator essencial de enzimas
          da cicatrização, como a lisil oxidase e a superóxido dismutase, e da montagem da matriz
          extracelular.
        </li>
        <li>
          <strong>Síntese de colágeno e elastina:</strong> o complexo estimula os fibroblastos da
          derme a produzir colágeno, elastina, glicosaminoglicanos e proteoglicanos — os
          componentes que dão firmeza, elasticidade e sustentação à pele.
        </li>
        <li>
          <strong>Modulação da expressão gênica:</strong> análises transcriptômicas mostram que o
          GHK-Cu modula a expressão de <strong>mais de 4.000 genes humanos</strong>, com efeitos
          sobre remodelamento tecidual, resposta antioxidante, sinalização anti-inflamatória
          (supressão de NF-κB) e reparo de DNA.
        </li>
      </ul>

      <h2>Benefícios para a pele</h2>
      <p>
        É aqui que o GHK-Cu tem sua base mais sólida. Ao estimular colágeno e elastina e ativar
        vias de reparo, ele é usado com objetivos anti-envelhecimento — melhora de firmeza,
        textura e qualidade geral da pele. Mas o ponto forte da evidência clínica está na
        <strong> regeneração e cicatrização</strong>:
      </p>
      <ul>
        <li>Ensaios em <strong>úlceras diabéticas</strong> documentaram aceleração da reepitelização.</li>
        <li>Estudos em pele <strong>pós-laser CO2</strong> e em contexto de cirurgia de Mohs relataram melhora na qualidade da cicatriz.</li>
      </ul>
      <p>
        Por isso o GHK-Cu tópico é uma escolha frequente em rotinas de <strong>pós-procedimento</strong>,
        quando a pele está em fase de reparo. Vale a nota de sempre: são resultados de estudos e do
        uso cosmético acumulado — não uma promessa de resultado idêntico para cada pessoa.
      </p>

      <h2>Benefícios para o cabelo</h2>
      <p>
        Peptídeos de cobre aparecem em produtos capilares há anos. A lógica é a mesma da pele: ao
        melhorar o ambiente perifolicular, estimular a matriz extracelular e trazer ação
        antioxidante e anti-inflamatória, o GHK-Cu poderia favorecer um couro cabeludo mais
        saudável. É razoável enxergá-lo como um <strong>coadjuvante</strong> dentro de uma rotina —
        e não como substituto de tratamentos com evidência mais estabelecida para queda de cabelo.
        A base de estudos específicos para cabelo ainda é menor do que a de pele, então convém
        manter expectativas calibradas.
      </p>

      <h2>Efeitos colaterais e cuidados</h2>
      <p>
        No uso <strong>tópico</strong>, o perfil de segurança é favorável, sustentado por décadas
        de uso cosmético. Os eventos são leves e locais:
      </p>
      <ul>
        <li>Irritação local ocasional e eritema transitório;</li>
        <li>Possível dermatite de contato em pessoas sensibilizadas ao cobre.</li>
      </ul>
      <p>
        As <strong>contraindicações</strong> principais são <strong>alergia conhecida ao cobre</strong> e
        a <strong>doença de Wilson</strong> (ou outros distúrbios do metabolismo do cobre), já que a
        molécula entrega justamente esse mineral. Na forma <strong>injetável</strong>, somam-se
        preocupações com esterilidade dos produtos de mercado cinza, reações no local e, em tese,
        risco de acúmulo de cobre no uso crônico sem monitorização — mais um motivo para tratá-la
        como assunto de pesquisa. Quem estuda a forma injetável costuma partir do pó liofilizado, o
        que exige diluição correta; se esse é o seu caso de estudo, a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição de peptídeos</Link>{' '}
        ajuda a acertar a concentração — sempre lembrando que a via injetável não é aprovada para
        uso humano.
      </p>

      <h2>O que é permitido e o que é pesquisa</h2>
      <p>
        Fechando o raciocínio central deste artigo:
      </p>
      <ul>
        <li>
          <strong>Permitido:</strong> o GHK-Cu <strong>tópico</strong>, como ingrediente cosmético
          em concentrações usuais (0,05% a 2%), com longo histórico de uso e boa segurança.
        </li>
        <li>
          <strong>Pesquisa:</strong> o GHK-Cu <strong>injetável</strong>, sem aprovação
          regulatória para humanos, com dados clínicos limitados e riscos ligados a produtos não
          farmacêuticos.
        </li>
      </ul>
      <p>
        Se você quer entender como o GHK-Cu se compara a outros peptídeos e onde cada um se
        encaixa em termos de evidência e regulação, vale explorar a{' '}
        <Link href="/peptideos">enciclopédia de peptídeos</Link>. Entender essa diferença entre o
        que é cosmético consagrado e o que é território de pesquisa é o passo mais importante para
        usar — ou não usar — o GHK-Cu com consciência.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-ghk-cu" />
      </div>
    </ArticleLayout>
  );
}
