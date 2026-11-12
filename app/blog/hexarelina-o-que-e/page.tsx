import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';

const SLUG = 'hexarelina-o-que-e';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'A hexarelina é aprovada?',
    a: 'Não. A hexarelina (examorelina) nunca foi aprovada em nenhum país — não tem registro na ANVISA, na FDA nem na EMA. Foi investigada em ensaios de fase II, mas o desenvolvimento clínico foi descontinuado. Hoje é considerada um peptídeo exclusivamente de pesquisa e é proibida pela WADA (classe S2). Qualquer produto vendido como "hexarelina" vem do mercado não regulado.',
  },
  {
    q: 'Hexarelina x ipamorelina x GHRP-6, qual a diferença?',
    a: 'Os três são GHRPs (agonistas do receptor de grelina/GHSR-1a) e todos estimulam a liberação de GH. O que muda é a seletividade. A ipamorelina é a mais "limpa" (praticamente só GH, quase sem mexer em cortisol e prolactina). O GHRP-6 é conhecido por estimular muito o apetite e por elevar cortisol e prolactina. A hexarelina é a mais potente para liberar GH, mas tem o perfil hormonal mais amplo — eleva cortisol/ACTH e prolactina de forma marcada e tende a dessensibilizar a hipófise.',
  },
  {
    q: 'Por que a hexarelina dessensibiliza?',
    a: 'Com uso crônico ou doses altas, a hipófise passa a responder cada vez menos ao estímulo do receptor de grelina. Na prática, a liberação de GH diminui com o tempo: o pico inicial não se sustenta. É um dos fatores que limita o interesse pela hexarelina como secretagogo de uso contínuo.',
  },
  {
    q: 'Hexarelina pega no exame antidoping?',
    a: 'Sim. A hexarelina é proibida pela WADA na classe S2 (hormônios peptídicos e fatores liberadores), dentro e fora de competição. Como acontece com outros secretagogos de GH, existem métodos de detecção em controle antidoping, com casos já sancionados na classe.',
  },
  {
    q: 'Qual a dose de hexarelina?',
    a: 'Não existe "dose de bula" porque a hexarelina nunca foi aprovada. Nos estudos de pesquisa foram usadas doses da ordem de 1,5–2 µg/kg por via intravenosa, num contexto controlado de investigação — não como esquema de uso. A meia-vida em humanos é de ~55 minutos (IV). Este artigo é informativo e não recomenda doses.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        A hexarelina — também chamada examorelina — costuma aparecer em fóruns como
        "o GHRP mais forte". E, entre os secretagogos de GH, ela é de fato um dos mais
        potentes para liberar hormônio do crescimento. Mas potência não é o mesmo que
        segurança ou utilidade: foi justamente o perfil hormonal amplo da hexarelina que
        levou ao abandono do seu desenvolvimento clínico. Este artigo explica o que ela é,
        como funciona e — principalmente — onde estão os seus limites.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> a hexarelina <strong>nunca foi aprovada</strong> em
        nenhum país — é um peptídeo exclusivamente de <strong>pesquisa</strong>. É{' '}
        <strong>proibida pela WADA</strong> (classe S2), eleva cortisol e prolactina de forma
        dose-dependente e tende a <strong>dessensibilizar</strong> a hipófise com uso crônico.
        Este conteúdo é informativo e não é indicação de uso.
      </div>

      <h2>O que é a hexarelina</h2>
      <p>
        A hexarelina é um <strong>hexapeptídeo sintético</strong> (seis aminoácidos) da família
        dos GHRPs — os peptídeos liberadores de GH. Estruturalmente, é um análogo do{' '}
        <Link href="/peptideos/ghrp-6">GHRP-6</Link>, porém com potência superior para
        estimular a liberação de GH. Foi investigada em ensaios de fase II para deficiência de
        GH e para insuficiência cardíaca congestiva, mas o desenvolvimento clínico foi
        descontinuado e ela nunca chegou a ser comercializada.
      </p>
      <p>
        Para os dados técnicos completos — meia-vida de ~55 minutos (IV, em humanos), faixa de
        dose estudada e referências dos estudos — consulte a{' '}
        <Link href="/peptideos/hexarelina">ficha técnica da hexarelina</Link>.
      </p>

      <h2>Como funciona</h2>
      <p>
        A hexarelina age como <strong>agonista do receptor GHSR-1a</strong> — o receptor de
        grelina, também chamado receptor secretagogo de GH — presente na hipófise e no
        hipotálamo. Ao ativá-lo, ela induz a liberação <strong>pulsátil</strong> de GH, com
        potência superior à do GHRP-6.
      </p>
      <p>
        Esse é o mesmo mecanismo básico de outros GHRPs, como ipamorelina, GHRP-2 e GHRP-6:
        todos ativam o receptor de grelina para estimular os somatotrofos da hipófise. O que
        diferencia cada um é a <strong>seletividade</strong>. A ipamorelina é a mais seletiva
        (quase só GH); a hexarelina está no extremo oposto — muito potente, mas ativando também
        outros eixos hormonais.
      </p>

      <h2>Os limites: cortisol, prolactina e dessensibilização</h2>
      <p>
        Aqui está o principal motivo pelo qual o interesse clínico na hexarelina esfriou.
        Diferentemente da ipamorelina, ela não estimula apenas o GH:
      </p>
      <ul>
        <li>
          <strong>Cortisol e ACTH:</strong> a hexarelina eleva o eixo ACTH/cortisol de forma
          dose-dependente. Cortisol cronicamente alto é catabólico — o oposto do que se costuma
          buscar com um secretagogo de GH.
        </li>
        <li>
          <strong>Prolactina:</strong> também sobe de forma dose-dependente.
        </li>
        <li>
          <strong>Dessensibilização:</strong> com uso crônico ou dose alta, a hipófise responde
          cada vez menos ao estímulo. A resposta de GH tende a diminuir com o tempo — o pico
          inicial não se mantém.
        </li>
      </ul>
      <p>
        Entre os GHRPs, a hexarelina tem o perfil de estimulação hormonal mais amplo, mexendo
        nos eixos de cortisol/ACTH e prolactina de forma mais marcada que a ipamorelina. Foi
        esse conjunto — e não a falta de potência — que limitou o seu uso.
      </p>

      <h2>Efeito cardíaco (CD36)</h2>
      <p>
        Um ponto que aparece na literatura é que a hexarelina tem afinidade por um segundo
        receptor: o <strong>CD36</strong>, um receptor <em>scavenger</em> presente no miocárdio.
        Por essa via, ela demonstrou efeitos cardíacos diretos, <strong>independentes da
        liberação de GH</strong> — o que motivou parte da investigação em insuficiência cardíaca.
        É uma linha de pesquisa interessante do ponto de vista de mecanismo, mas que não se
        traduziu em um medicamento aprovado. Vale registrar como fato, não como indicação.
      </p>

      <h2>Efeitos colaterais</h2>
      <ul>
        <li>Rubor facial transitório</li>
        <li>Elevação dose-dependente de cortisol e ACTH</li>
        <li>Elevação dose-dependente de prolactina</li>
        <li>Reações no local da injeção</li>
        <li>Cefaleia</li>
        <li>Dessensibilização hipofisária com uso crônico ou dose alta</li>
      </ul>
      <p>
        Por ser um peptídeo de pesquisa, não há bula com contraindicações formais. Pela
        farmacologia e pelos estudos, situações de cautela incluem malignidade ativa, gestação
        e lactação, doença crítica aguda, hiperprolactinemia ou distúrbios do eixo adrenal, e
        hipersensibilidade ao peptídeo. Ao manipular ou reconstituir qualquer peptídeo,
        entender diluição e dose é essencial — a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link> ajuda
        nessa parte.
      </p>

      <h2>Status regulatório e WADA</h2>
      <p>
        A hexarelina <strong>não tem aprovação em nenhum país</strong> — não é registrada pela
        ANVISA, FDA ou EMA — e é classificada como peptídeo exclusivamente de pesquisa. No
        esporte, é <strong>proibida pela WADA na classe S2</strong> (hormônios peptídicos e
        fatores liberadores), dentro e fora de competição. Como outros secretagogos de GH,
        existem métodos de detecção em controle antidoping. Qualquer produto oferecido como
        "hexarelina" vem do mercado não regulado, sem garantia de identidade, pureza ou dose —
        um risco relevante com um peptídeo injetável.
      </p>

      <h2>Hexarelina e os outros GHRPs</h2>
      <p>
        Se você quer entender como a hexarelina se posiciona frente aos GHRPs mais usados, veja:
      </p>
      <ul>
        <li><Link href="/comparar/ghrp-2-vs-ghrp-6">GHRP-2 vs GHRP-6: comparativo</Link></li>
        <li><Link href="/peptideos/ghrp-2">Ficha técnica do GHRP-2</Link></li>
        <li><Link href="/peptideos/ghrp-6">Ficha técnica do GHRP-6</Link></li>
      </ul>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>
    </ArticleLayout>
  );
}
