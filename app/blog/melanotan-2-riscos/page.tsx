import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';

const SLUG = 'melanotan-2-riscos';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Melanotan II é proibido ou ilegal?',
    a: 'O Melanotan II nunca foi aprovado para uso humano em nenhuma jurisdição. A MHRA, no Reino Unido, classifica os produtos como medicamentos não licenciados, de comercialização ilegal; a TGA, na Austrália, proibiu a venda; e a FDA, nos EUA, nunca o aprovou. Vender ou comercializar o composto é ilegal em vários países, e o que circula pela internet vem inteiramente do mercado não regulado.',
  },
  {
    q: 'Melanotan II causa câncer de pele?',
    a: 'Não há prova definitiva de que cause câncer, mas existe uma preocupação real e documentada. O composto estimula os melanócitos, escurece e aumenta nevos (pintas) já existentes e pode fazer surgir novos nevos rapidamente. Por isso agências reguladoras citam o potencial risco de melanoma, e o uso é contraindicado em quem tem histórico pessoal ou familiar de melanoma ou nevos atípicos. É sinal de alerta suficiente para não usar.',
  },
  {
    q: 'Melanotan II funciona mesmo para bronzear?',
    a: 'Sim, ele escurece a pele ao ativar o receptor MC1R e estimular a produção de eumelanina. Mas funcionar não é o mesmo que ser seguro: o escurecimento vem acompanhado de efeitos sistêmicos imprevisíveis (náusea, hipertensão, priapismo) e da alteração de nevos. Também não substitui protetor solar nem protege de queimaduras de forma confiável.',
  },
  {
    q: 'Qual a diferença entre PT-141 e Melanotan II?',
    a: 'Os dois são análogos de melanocortina e derivam da mesma linha de pesquisa, mas seguiram caminhos opostos. O PT-141 (bremelanotida) foi aprovado pela FDA como Vyleesi para desejo sexual hipoativo em mulheres na pré-menopausa. O Melanotan II nunca foi aprovado e circula ilegalmente como bronzeador. Veja o comparativo lado a lado em PT-141 vs Melanotan II.',
  },
  {
    q: 'Melanotan em spray nasal é mais seguro?',
    a: 'Não. É a mesma molécula, com os mesmos efeitos sistêmicos; a única diferença é a via de entrada. A dose absorvida pela mucosa nasal é ainda menos previsível do que a injetável, e o produto continua vindo do mercado ilegal, sem controle de identidade ou pureza. "Sem agulha" não significa "sem risco".',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        Melanotan II — apelidado de <em>&ldquo;Barbie drug&rdquo;</em> — é vendido pela internet
        como um atalho para o bronzeado: uma injeção (ou um spray nasal) que escurece a pele sem
        precisar de sol. O que os anúncios não contam é que o composto <strong>nunca foi aprovado
        para uso humano em nenhum país</strong> e que agências reguladoras de vários continentes já
        emitiram alertas formais contra ele.
      </p>

      <div className="not-prose p-4 rounded-xl bg-red-50 border border-red-200 my-6 text-sm text-red-900 leading-relaxed">
        <strong>⚠️ Leia antes de tudo:</strong> o Melanotan II <strong>não é aprovado para uso
        humano em nenhuma jurisdição</strong>. MHRA (Reino Unido), TGA (Austrália) e FDA (EUA)
        alertam contra o uso, e a comercialização é ilegal. Os riscos descritos vão de priapismo e
        hipertensão a disfunção renal e alteração de nevos, com preocupação sobre melanoma.
        <strong> Não existe dose segura estabelecida</strong> — por isso este texto não traz nem
        trará qualquer &ldquo;protocolo&rdquo;. É conteúdo informativo, não indicação de uso.
      </div>

      <h2>O que é o Melanotan II</h2>
      <p>
        O Melanotan II (MT-II) é um análogo sintético do <strong>α-MSH</strong> (hormônio
        estimulante de melanócitos), desenvolvido na Universidade do Arizona nos anos 1980 como
        potencial agente fotoprotetor — a ideia era escurecer a pele para reduzir dano solar. O
        desenvolvimento clínico, porém, foi <strong>interrompido por questões de segurança</strong>,
        e o composto nunca obteve aprovação regulatória. Apesar disso, é comercializado ilegalmente
        como bronzeador injetável ou em sprays nasais.
      </p>
      <p>
        Não confunda o Melanotan II com o <Link href="/peptideos/pt-141">PT-141 (bremelanotida)</Link>,
        um parente próximo que, ao contrário dele, foi aprovado pela FDA — a história dessa diferença
        está no artigo sobre o{' '}
        <Link href="/blog/pt-141-bremelanotida">PT-141</Link>. Para os dados técnicos completos do
        Melanotan II, com referências das agências, veja a{' '}
        <Link href="/peptideos/melanotan-ii">ficha técnica do Melanotan II</Link>.
      </p>

      <h2>Como funciona (α-MSH e os receptores de melanocortina)</h2>
      <p>
        O Melanotan II é um <strong>agonista não seletivo dos receptores de melanocortina</strong> —
        ativa indiscriminadamente toda a família MC1R, MC3R, MC4R e MC5R. É essa falta de
        seletividade que produz o bronzeado, mas também os efeitos colaterais imprevisíveis:
      </p>
      <ul>
        <li><strong>MC1R (melanócitos):</strong> estimula a produção de eumelanina — é o que escurece a pele.</li>
        <li><strong>MC3R / MC4R (hipotálamo):</strong> afetam o comportamento sexual (ereções espontâneas, priapismo) e reduzem o apetite.</li>
        <li><strong>Ação difusa:</strong> por atuar em receptores espalhados pelo corpo, o efeito não se limita à pele — atinge pressão arterial, sistema nervoso autônomo e outros tecidos.</li>
      </ul>
      <p>
        Ou seja: não dá para ativar só o bronzeamento. A mesma molécula que escurece a pele mexe em
        vias autonômicas e hipotalâmicas ao mesmo tempo.
      </p>

      <h2>Os riscos que o marketing não conta</h2>
      <p>
        Os relatos de efeitos adversos associados ao Melanotan II incluem:
      </p>
      <ul>
        <li><strong>Náusea e vômitos</strong> — muito comuns, principalmente nas primeiras doses.</li>
        <li><strong>Rubor facial e hipertensão</strong> — elevação da pressão arterial após a aplicação.</li>
        <li><strong>Priapismo</strong> — ereção prolongada e dolorosa que pode exigir atendimento de emergência.</li>
        <li><strong>Escurecimento e aumento de nevos</strong> preexistentes, além do surgimento rápido de novos nevos.</li>
        <li><strong>Hiperpigmentação difusa</strong>, incluindo mucosas e gengivas.</li>
        <li><strong>Disfunção renal</strong> relatada.</li>
        <li><strong>Edema cerebral</strong> descrito em casos isolados.</li>
        <li><strong>Preocupação com potencial promoção de melanoma.</strong></li>
        <li><strong>Infecções</strong> associadas a produtos do mercado ilegal.</li>
      </ul>
      <p>
        Note que essa lista mistura efeitos cosméticos indesejados com problemas potencialmente
        graves. Não é o perfil de um produto de estética — é o de um composto experimental
        abandonado por motivos de segurança.
      </p>

      <h2>Por que nunca foi aprovado</h2>
      <p>
        O Melanotan II <strong>não obteve aprovação regulatória em nenhuma jurisdição</strong>, e o
        alerta é internacional e explícito:
      </p>
      <ul>
        <li><strong>MHRA (Reino Unido):</strong> classifica os produtos como medicamentos não licenciados e de comercialização ilegal.</li>
        <li><strong>TGA (Austrália):</strong> proibiu a venda e alerta para disfunção renal, edema cerebral, alterações em nevos, priapismo, hipertensão e potencial risco de melanoma.</li>
        <li><strong>FDA (EUA):</strong> nunca aprovou o composto — não é um medicamento legalmente comercializado.</li>
      </ul>
      <p>
        Quando reguladores de países diferentes chegam à mesma conclusão de forma independente, o
        recado é claro: não há um uso &ldquo;seguro se bem feito&rdquo;. O problema está na própria
        molécula e na ausência de dados que sustentem qualquer dose.
      </p>

      <h2>Sprays nasais e o mercado ilegal</h2>
      <p>
        O Melanotan II costuma ser vendido em duas formas — injetável e spray nasal —, e a versão
        &ldquo;sem agulha&rdquo; é anunciada como se fosse mais branda. Não é: trata-se da mesma
        molécula, com os mesmos efeitos sistêmicos, só que com absorção pela mucosa ainda menos
        previsível.
      </p>
      <p>
        Some-se a isso a origem. Como nenhuma versão é aprovada, tudo o que circula vem do mercado
        não regulado, onde os produtos apresentam <strong>contaminação microbiana, dosagem variável
        e ingredientes não declarados</strong>. No caso do injetável, aplicar um produto não estéril
        adiciona risco direto de infecção. Você não sabe o que está comprando, quanto está usando,
        nem o que mais vem no frasco.
      </p>

      <h2>Melanotan II e nevos: a preocupação com melanoma</h2>
      <p>
        O ponto mais delicado é o efeito sobre as pintas. Ao estimular os melanócitos, o Melanotan
        II <strong>escurece e aumenta nevos já existentes</strong> e pode acelerar o surgimento de
        novos. Isso importa porque mudança em pintas é justamente o sinal que dermatologistas usam
        para rastrear <strong>melanoma</strong> — e as agências reguladoras citam explicitamente o
        potencial risco de promoção da doença.
      </p>
      <p>
        Por esse motivo, o uso é contraindicado em quem tem histórico pessoal ou familiar de
        melanoma, câncer de pele ou nevos atípicos/displásicos. Qualquer pinta que mude de cor,
        tamanho ou formato merece avaliação dermatológica — e mascarar esse processo com um
        bronzeador injetável é exatamente o oposto do que a prevenção recomenda.
      </p>

      <p>
        Se o interesse é entender a família dos análogos de melanocortina de forma segura, o caminho
        é comparar o Melanotan II com o seu parente aprovado: veja{' '}
        <Link href="/comparar/pt-141-vs-melanotan-ii">PT-141 vs Melanotan II</Link>.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>
    </ArticleLayout>
  );
}
