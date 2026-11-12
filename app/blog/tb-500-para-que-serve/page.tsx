import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';

const SLUG = 'tb-500-para-que-serve';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'TB-500 é liberado no Brasil?',
    a: 'Não. O TB-500 não tem registro na ANVISA e não é aprovado para uso humano em nenhuma jurisdição — é classificado como substância de pesquisa (research-only). Os produtos oferecidos online vêm do mercado cinza, sem controle regulatório e com problemas frequentes de pureza e rotulagem imprecisa.',
  },
  {
    q: 'Posso usar TB-500 e BPC-157 juntos?',
    a: 'A combinação é popular em protocolos informais, mas nenhum dos dois peptídeos tem aprovação para uso humano e não existem estudos clínicos que validem a segurança ou a eficácia de usá-los juntos. Além disso, ambos são proibidos pela WADA. Somar mecanismos "no papel" não equivale a benefício comprovado — este texto é informativo e não é indicação de uso.',
  },
  {
    q: 'TB-500 realmente funciona? O que diz a ciência?',
    a: 'A maior parte da evidência vem de modelos animais e estudos in vitro. A Timosina Beta-4 tem mecanismos descritos em laboratório (sequestro de actina, angiogênese), mas nenhum desses efeitos tem validação clínica robusta em humanos. Os poucos ensaios em pessoas usaram Tβ4 recombinante, não o TB-500 do mercado cinza. Ou seja, não há prova sólida de que ele funcione como se promete na venda.',
  },
  {
    q: 'TB-500 é detectado no exame antidoping?',
    a: 'O TB-500 está proibido pela WADA na Seção S2 da Lista Proibida, dentro e fora de competição, e ainda incide na cláusula S0 (substâncias não aprovadas). Para atletas sujeitos ao código WADA, a proibição é absoluta e um resultado positivo pode gerar sanção — ele é alvo dos controles antidoping.',
  },
  {
    q: 'Qual a dose de TB-500?',
    a: 'Não existe dose de bula, porque o TB-500 não é aprovado. Os protocolos que circulam são informais e sem respaldo clínico: costumam usar 2 a 5 mg por semana por via subcutânea, às vezes com uma fase de carga (2x/semana) seguida de manutenção (1x/semana). Esses números vêm da prática de usuários, não de diretrizes médicas.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        O TB-500 aparece em fóruns e lojas online como um "peptídeo de recuperação"
        capaz de acelerar a cicatrização de músculos, tendões e ligamentos. A realidade
        é mais sóbria: trata-se de uma substância <strong>sem aprovação para uso humano</strong>
        {' '}em qualquer país, com evidência concentrada em animais e proibida no esporte.
        Este artigo explica o que é o TB-500, o que a ciência realmente mostra e por que a
        cautela é indispensável.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> o TB-500 <strong>não</strong> é aprovado para uso
        humano em nenhuma jurisdição e é <strong>proibido pela WADA</strong>, dentro e fora
        de competição. A maior parte da evidência vem de modelos animais e estudos in vitro.
        Este texto é informativo e não é indicação de uso.
      </div>

      <h2>O que é o TB-500</h2>
      <p>
        O TB-500 é um <strong>fragmento sintético da Timosina Beta-4 (Tβ4)</strong>, uma
        proteína endógena de 43 aminoácidos com papel central na reparação tecidual, na
        migração celular e na angiogênese (formação de novos vasos). O marketing online o
        posiciona como agente de recuperação para lesões musculoesqueléticas, mas essa
        promessa não corresponde ao status regulatório: o TB-500 não possui aprovação em
        nenhuma jurisdição, e a maior parte da evidência é pré-clínica.
      </p>
      <p>
        Para os dados técnicos completos — faixa de dose, referências e status regulatório —
        consulte a <Link href="/peptideos/tb-500">ficha técnica do TB-500</Link>.
      </p>

      <h2>Como funciona (Timosina Beta-4 e a actina)</h2>
      <p>
        O principal mecanismo biológico descrito para a Tβ4 é o <strong>sequestro de G-actina
        monomérica</strong>: a molécula se liga à actina livre e regula a polimerização do
        citoesqueleto, o que favorece migração celular, remodelamento tecidual e exocitose. O
        motivo hexapeptídico 17-LKKTET-23 é o domínio essencial dessa ligação à actina.
      </p>
      <p>
        Descrevem-se ainda efeitos sobre a angiogênese via modulação da via Notch/NF-κB,
        aumento da expressão de VEGF em hipóxia por meio do óxido nítrico, e inibição da
        ativação de NF-κB induzida por TNF-α, com redução de IL-8. É importante frisar:
        <strong> nenhum desses efeitos tem validação clínica robusta em humanos</strong> —
        eles descrevem o que se observou em laboratório, não um benefício comprovado em pessoas.
      </p>

      <h2>Para que é usado e o que a evidência mostra</h2>
      <p>
        Nos círculos informais, o TB-500 é usado com a expectativa de acelerar a recuperação
        de lesões de tendões, ligamentos e músculos, reduzir inflamação e melhorar a
        cicatrização. O ponto que costuma ser omitido é a <strong>qualidade da evidência</strong>.
      </p>
      <ul>
        <li>A maior parte dos dados vem de <strong>modelos animais e estudos in vitro</strong>.</li>
        <li>Os poucos ensaios em humanos foram feitos com <strong>Tβ4 recombinante</strong> — não com o TB-500 vendido no mercado cinza — e em contextos clínicos específicos, não em recuperação esportiva.</li>
        <li>Não há estudos que confirmem eficácia em recuperação musculoesquelética humana.</li>
      </ul>
      <p>
        Em outras palavras, não existe validação clínica robusta que sustente as promessas
        feitas na venda do produto. Tratar o TB-500 como solução comprovada para lesões é ir
        muito além do que os dados permitem.
      </p>

      <h2>Protocolo informal e a combinação com BPC-157</h2>
      <p>
        Não existe dose de bula, porque o TB-500 não é aprovado. Os protocolos que circulam são
        informais e <strong>sem respaldo clínico</strong>: costumam usar <strong>2 a 5 mg por
        semana</strong> por via subcutânea, muitas vezes com uma fase de "carga" (cerca de 2
        aplicações semanais) seguida de "manutenção" (1 aplicação semanal). Reforçando: esses
        números vêm da prática de usuários, não de diretrizes médicas.
      </p>
      <p>
        O TB-500 é frequentemente combinado com o <Link href="/peptideos/bpc-157">BPC-157</Link>,
        outro peptídeo promovido para cicatrização. A lógica informal é somar mecanismos de
        reparo, mas nenhum dos dois tem aprovação para uso humano e não há estudos clínicos que
        validem a segurança ou a eficácia da combinação. Se você quer entender as diferenças
        entre eles, veja o comparativo{' '}
        <Link href="/comparar/bpc-157-vs-tb-500">BPC-157 vs TB-500</Link>; para a discussão de
        duração de ciclos frequentemente citada, há também o artigo sobre o{' '}
        <Link href="/blog/bpc-157-ciclo-duracao">ciclo e a duração do BPC-157</Link>.
      </p>
      <p>
        Quem manipula esses peptídeos liofilizados costuma recorrer a uma{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link> para
        acertar a diluição — o que não torna o uso seguro nem legal, apenas reduz um dos vários
        pontos de erro.
      </p>

      <h2>Efeitos colaterais e riscos</h2>
      <p>
        Como os dados de segurança em humanos são escassos, o perfil de risco do TB-500 é pouco
        caracterizado. Entre os pontos relatados e as preocupações teóricas:
      </p>
      <ul>
        <li>Dados de segurança em humanos escassos (pequenos ensaios usaram Tβ4 recombinante, não TB-500).</li>
        <li>Reações no local da injeção relatadas por usuários.</li>
        <li>Preocupação teórica pró-angiogênica em contexto tumoral, com dados pré-clínicos mistos.</li>
        <li>Produtos de mercado cinza frequentemente com contaminação e dosagem imprecisa.</li>
      </ul>
      <p>
        O último ponto merece destaque: como não há controle regulatório, o que está no frasco
        pode não corresponder ao rótulo — em pureza ou em quantidade. Com um produto injetável,
        isso é um risco relevante. O uso é especialmente desaconselhado para <strong>atletas
        sujeitos ao código WADA</strong> (proibição absoluta), <strong>gestantes e lactantes</strong>
        {' '}(ausência total de dados) e <strong>pessoas com neoplasias ativas ou histórico
        oncológico</strong>.
      </p>

      <h2>É liberado no Brasil? E no esporte?</h2>
      <p>
        No Brasil, o TB-500 <strong>não tem registro na ANVISA</strong> e não é aprovado para
        uso humano — o mesmo vale para todas as outras jurisdições, onde é classificado como
        substância de pesquisa.
      </p>
      <p>
        No esporte, a situação é ainda mais explícita: o TB-500 está proibido pela WADA na{' '}
        <strong>Seção S2 da Lista Proibida, dentro e fora de competição</strong>, e ainda incide
        na cláusula S0 (substâncias não aprovadas). Para um atleta testado, isso significa
        proibição absoluta e risco de sanção. Diante da ausência de aprovação e da evidência
        majoritariamente pré-clínica, a decisão informada passa por reconhecer o quanto ainda não
        se sabe sobre essa substância.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>
    </ArticleLayout>
  );
}
