import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';

const SLUG = 'mots-c-o-que-e';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'O MOTS-c funciona em humanos?',
    a: 'A maior parte da evidência positiva sobre o MOTS-c vem de estudos em animais, principalmente camundongos. Em humanos, temos estudos observacionais (que mostram associação entre níveis baixos de MOTS-c e doenças metabólicas) e um primeiro ensaio clínico focado em farmacocinética e segurança (NCT03998514). Não há, até hoje, ensaios de fase avançada que provem benefício clínico em pessoas. A resposta honesta é: promissor na teoria e nos animais, ainda não comprovado em humanos.',
  },
  {
    q: 'Para que serve o MOTS-c?',
    a: 'Na pesquisa, o MOTS-c é estudado por seu papel no metabolismo: ativação da AMPK, melhora da sensibilidade à insulina, oxidação de gordura e aumento da capacidade de exercício — quase tudo em modelos animais. Não é um medicamento aprovado para nenhuma indicação, então não "serve" oficialmente para tratar nada. É classificado como peptídeo de pesquisa.',
  },
  {
    q: 'O MOTS-c é proibido no esporte?',
    a: 'Sim. O MOTS-c é proibido pela WADA (Agência Mundial Antidopagem), e agências como a USADA já emitiram alertas específicos sobre ele. Atletas sujeitos a controle antidoping não devem usá-lo. O fato de ser uma molécula produzida naturalmente pelo corpo não o torna permitido.',
  },
  {
    q: 'Qual a dose de MOTS-c?',
    a: 'Não existe dose terapêutica aprovada, porque o MOTS-c não é um medicamento registrado. Os protocolos usados em pesquisa e biohacking não são padronizados e variam bastante. Por isso não há uma "dose de bula" — qualquer número que circule é uso não regulado, sem respaldo de bula ou de ensaios de eficácia.',
  },
  {
    q: 'O MOTS-c é seguro?',
    a: 'Não se pode afirmar isso com segurança. Os dados de segurança em humanos são muito limitados e restritos à fase inicial. O perfil toxicológico em estudos pré-clínicos foi aparentemente favorável, mas os efeitos de longo prazo são desconhecidos. Há relatos de reações no local da injeção em uso manipulado, e a cautela é maior em gravidez, lactação, câncer ativo e crianças, pela ausência de dados.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        O MOTS-c é um dos peptídeos mais curiosos — e mais mal compreendidos — do universo
        da longevidade. Diferente de quase tudo o que se vende como "peptídeo", ele não nasce
        num laboratório: é uma molécula que o próprio corpo produz, codificada dentro da
        mitocôndria. A promessa que circula é grande (mais energia, melhor metabolismo, mais
        desempenho no exercício), mas a distância entre o que foi demonstrado em camundongos e
        o que realmente se sabe em pessoas é enorme. Este texto separa as duas coisas.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> a <strong>maior parte da evidência</strong> sobre o
        MOTS-c vem de <strong>modelos animais</strong>. A evidência em humanos é
        <strong> inicial</strong> (farmacocinética e segurança). <strong>Não há aprovação
        regulatória</strong> em nenhum país, e o MOTS-c é <strong>proibido pela WADA</strong>.
        Este artigo é informativo e não é indicação de uso.
      </div>

      <h2>O que é o MOTS-c</h2>
      <p>
        O MOTS-c é um peptídeo curto, de apenas <strong>16 aminoácidos</strong>. O que o torna
        incomum é a sua origem: ele é codificado pelo gene <strong>12S rRNA do DNA
        mitocondrial</strong> — e não pelo DNA do núcleo, como a imensa maioria das proteínas
        do corpo. Por isso é classificado como um <strong>peptídeo derivado da mitocôndria</strong>{' '}
        (MDP, na sigla em inglês).
      </p>
      <p>
        Foi descrito em <strong>2015</strong> pelo grupo de Pinchas Cohen, na Universidade do
        Sul da Califórnia (USC), como um regulador da homeostase metabólica. Uma das suas
        características mais chamativas é a capacidade de sair da mitocôndria e migrar para o
        citosol e até para o núcleo em situações de estresse energético — funcionando como uma
        espécie de mensageiro que avisa ao resto da célula que a energia está baixa.
      </p>
      <p>
        Para os dados técnicos completos — faixa de dose, meia-vida e referências dos estudos —,
        veja a <Link href="/peptideos/mots-c">ficha técnica do MOTS-c</Link>.
      </p>

      <h2>Como funciona (a AMPK e a mitocôndria)</h2>
      <p>
        O mecanismo central proposto passa por uma enzima chamada <strong>AMPK</strong>, que
        funciona como o "sensor de combustível" da célula. Quando a energia está baixa, a AMPK
        é ativada e coloca o metabolismo em modo de economia e queima. O MOTS-c parece ativar
        essa via (via aumento do AICAR), com alguns efeitos a jusante:
      </p>
      <ul>
        <li><strong>Translocação do GLUT4</strong> para a membrana das células musculares, aumentando a captação de glicose;</li>
        <li>Redução da expressão de genes ligados à produção de gordura (lipogênese) e aumento da oxidação de ácidos graxos;</li>
        <li>Melhora da função mitocondrial no músculo e no coração — em modelos animais.</li>
      </ul>
      <p>
        Há ainda um segundo papel, mais sutil: o MOTS-c atua como um <strong>sinal
        retrógrado</strong>, ou seja, da mitocôndria de volta para o núcleo. Ele participa da
        resposta ao estresse mitocondrial e chega a se ligar a fatores de transcrição da
        resposta antioxidante, como o <strong>NRF2</strong>. Em outras palavras, não é apenas um
        "acelerador de metabolismo" — é um mensageiro de estresse celular.
      </p>

      <h2>O que a ciência realmente mostra</h2>
      <p>
        Aqui é onde a honestidade importa. É preciso separar dois mundos:
      </p>
      <p>
        <strong>Em animais (a maior parte da evidência):</strong> em camundongos, o MOTS-c foi
        associado a melhora da sensibilidade à insulina, aumento da termogênese, mais capacidade
        de exercício e efeitos anti-inflamatórios. São resultados consistentes e animadores —
        mas em roedores.
      </p>
      <p>
        <strong>Em humanos (evidência inicial e, em grande parte, apenas associativa):</strong>{' '}
        estudos observacionais mostraram que pessoas com diabetes tipo 2, diabetes gestacional e
        obesidade na infância tendem a ter níveis plasmáticos mais baixos de MOTS-c. Isso é uma
        <strong> associação</strong> — não prova que repor MOTS-c resolva o problema. Um primeiro
        ensaio clínico (registrado como <strong>NCT03998514</strong>), em adultos saudáveis e em
        pessoas com obesidade e gordura no fígado, foi conduzido para avaliar farmacocinética e
        segurança. Não há ensaios de fase mais avançada concluídos que demonstrem benefício
        clínico.
      </p>
      <p>
        Resumindo: o MOTS-c tem uma biologia fascinante e muitos dados pré-clínicos, mas ainda
        não temos ensaios em humanos que provem que injetá-lo traz os benefícios prometidos. Quem
        oferece o MOTS-c como algo "comprovado" está indo além do que os dados sustentam.
      </p>
      <p>
        Se o seu interesse é longevidade, vale comparar o racional dele com o de outro peptídeo
        popular na área — veja{' '}
        <Link href="/comparar/mots-c-vs-epithalon">MOTS-c vs Epithalon</Link>.
      </p>

      <h2>Dose e protocolos (não padronizados)</h2>
      <p>
        Não existe dose terapêutica aprovada de MOTS-c, porque ele não é um medicamento aprovado.
        Os protocolos que circulam em contextos de pesquisa e biohacking <strong>não são
        padronizados</strong> e variam bastante. Como descrição do que se vê nesses protocolos,
        fala-se em algo na ordem de centenas de microgramas por dia — mas isso não é uma
        recomendação médica, e sim um retrato do uso não regulado.
      </p>
      <p>
        O MOTS-c costuma ser vendido como pó liofilizado, que precisa ser reconstituído com água
        bacteriostática antes do uso. Se você vai calcular concentração e volume de aplicação, a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link> ajuda a
        evitar erros de dose.
      </p>

      <h2>Efeitos colaterais e o que não se sabe</h2>
      <p>
        O ponto mais importante desta seção é o tamanho da nossa ignorância. Os dados de segurança
        em humanos são <strong>muito limitados</strong>, restritos à fase inicial.
      </p>
      <ul>
        <li>Nos estudos pré-clínicos, o perfil toxicológico apareceu como aparentemente favorável;</li>
        <li>Em uso compounded (manipulado), há relatos de reações no local da injeção;</li>
        <li>Os efeitos de longo prazo são simplesmente desconhecidos.</li>
      </ul>
      <p>
        Há também situações em que a cautela é maior justamente pela falta de dados: gravidez e
        lactação, câncer ativo ou recente (os efeitos do peptídeo sobre a proliferação celular não
        foram bem caracterizados) e uso em crianças, que nunca foi estudado.
      </p>

      <h2>É liberado? E no esporte?</h2>
      <p>
        Do ponto de vista regulatório, o MOTS-c está classificado como <strong>peptídeo de
        pesquisa</strong> ("research only"). Não tem aprovação da ANVISA, da FDA nem da EMA como
        medicamento. Produtos vendidos como MOTS-c vêm do mercado não regulado, sem garantia de
        identidade, pureza ou dose — um risco relevante em um produto injetável.
      </p>
      <p>
        No esporte, a resposta é clara: o MOTS-c é <strong>proibido pela WADA</strong> (Agência
        Mundial Antidopagem). A própria USADA (agência antidopagem dos EUA) já publicou alertas
        sobre ele. Atletas sob controle antidoping não devem usá-lo em nenhuma circunstância — o
        fato de ser uma molécula "natural" do corpo não muda isso.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>
    </ArticleLayout>
  );
}
