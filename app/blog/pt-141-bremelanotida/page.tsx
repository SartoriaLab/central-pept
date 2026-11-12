import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';

const SLUG = 'pt-141-bremelanotida';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'PT-141 funciona para homens?',
    a: 'A indicação aprovada pela FDA é apenas para mulheres na pré-menopausa com transtorno do desejo sexual hipoativo (TDSH). Qualquer uso em homens é off-label — ou seja, fora da bula e sem respaldo regulatório. Não existe aprovação nem esquema de dose oficial para homens, e o perfil de segurança nesse grupo não foi estabelecido pelo processo que levou à aprovação do Vyleesi.',
  },
  {
    q: 'Qual a dose de PT-141?',
    a: 'A dose aprovada é de 1,75 mg por via subcutânea, aplicada conforme necessário no abdome ou na coxa, pelo menos 45 minutos antes da atividade sexual prevista. O limite é de no máximo 1 dose a cada 24 horas e 8 doses por mês. Essa é a única dose com respaldo de bula; esquemas diferentes são off-label.',
  },
  {
    q: 'PT-141 é vendido/aprovado no Brasil?',
    a: 'O PT-141 (bremelanotida) foi aprovado pela FDA nos Estados Unidos em 2019 como Vyleesi. Não há registro do medicamento na ANVISA para uso no Brasil. Produtos oferecidos como "PT-141" fora do circuito farmacêutico regulado vêm do mercado não regulado, sem garantia de identidade, pureza ou dose.',
  },
  {
    q: 'Qual a diferença entre PT-141 e Viagra?',
    a: 'O Viagra (sildenafila) age na vasculatura genital, aumentando o fluxo de sangue — atua no corpo, na "mecânica" da resposta sexual. O PT-141 age no sistema nervoso central, ativando receptores de melanocortina (principalmente MC4R) em vias do cérebro ligadas à motivação sexual. São mecanismos e indicações diferentes: o PT-141 foi aprovado para o desejo (libido) em mulheres, não para disfunção erétil.',
  },
  {
    q: 'Quais os efeitos colaterais do PT-141?',
    a: 'O efeito mais comum é a náusea, que ocorreu em cerca de 40% das pacientes nos ensaios. Também são relatados rubor facial, reações no local da injeção, cefaleia, vômitos, fadiga e ondas de calor. Cada dose causa elevação transitória da pressão arterial e redução da frequência cardíaca. Com uso repetido pode surgir hiperpigmentação focal na pele ou gengiva, especialmente em peles mais escuras.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        O PT-141, cujo nome farmacológico é <strong>bremelanotida</strong>, ganhou atenção
        por prometer algo diferente dos remédios clássicos para a vida sexual: agir sobre o
        <em> desejo</em>, e não sobre a "mecânica" da ereção. Ele é o princípio ativo do
        Vyleesi®, um medicamento aprovado nos Estados Unidos com uma indicação bem específica.
        Este artigo explica o que é comprovado, o que é uso off-label e o que ainda não tem
        respaldo.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> a indicação aprovada do PT-141 (Vyleesi) é para
        <strong> mulheres na pré-menopausa</strong> com transtorno do desejo sexual hipoativo.
        O uso <strong>em homens ou fora dessa indicação é off-label</strong> e sem respaldo
        regulatório. O medicamento <strong>não</strong> deve ser usado por quem tem
        <strong> hipertensão não controlada</strong> ou <strong>doença cardiovascular</strong>.
        Este conteúdo é informativo e não substitui avaliação médica.
      </div>

      <h2>O que é o PT-141 (bremelanotida)</h2>
      <p>
        A bremelanotida é um peptídeo agonista dos receptores de melanocortina, comercializada
        como <strong>Vyleesi®</strong>. Foi aprovada pela <strong>FDA em 2019</strong> para o
        <strong> Transtorno do Desejo Sexual Hipoativo (TDSH)</strong> adquirido e generalizado
        em mulheres na pré-menopausa — o primeiro tratamento aprovado para uso "conforme
        necessário" nessa condição (desenvolvido por Palatin Technologies/AMAG Pharmaceuticals).
      </p>
      <p>
        A apresentação aprovada é um <strong>autoinjetor subcutâneo de dose única</strong> com
        1,75 mg. Para ver os dados técnicos completos — meia-vida, faixa de dose e as
        referências da FDA — consulte a{' '}
        <Link href="/peptideos/pt-141">ficha técnica do PT-141</Link>.
      </p>

      <h2>Como funciona: age no cérebro, não na vasculatura</h2>
      <p>
        Aqui está o diferencial. Enquanto a <strong>sildenafila (Viagra)</strong> age na
        <strong> vasculatura</strong> genital — aumentando o fluxo sanguíneo para viabilizar a
        ereção —, o PT-141 age no <strong>sistema nervoso central</strong>. Ele não atua sobre
        os vasos: atua sobre as vias do cérebro ligadas à motivação sexual.
      </p>
      <p>
        Do ponto de vista molecular, a bremelanotida é um agonista não seletivo dos receptores
        de melanocortina (MC1R, MC3R, MC4R e MC5R). Acredita-se que o efeito sobre o desejo
        seja mediado principalmente pela ativação do <strong>MC4R</strong> em vias hipotalâmicas
        e límbicas. Vale a honestidade: o mecanismo preciso ainda não está completamente
        elucidado. Essa mesma ativação de receptores de melanocortina explica boa parte dos
        efeitos adversos — como a elevação transitória da pressão arterial via MC4R em núcleos
        autonômicos.
      </p>

      <h2>Dose aprovada e como é usado</h2>
      <p>
        Segundo a bula da FDA, o esquema aprovado é:
      </p>
      <ul>
        <li><strong>1,75 mg por via subcutânea</strong>, no abdome ou na coxa;</li>
        <li>Aplicado <strong>conforme necessário</strong>, pelo menos <strong>45 minutos antes</strong> da atividade sexual prevista;</li>
        <li>No máximo <strong>1 dose a cada 24 horas</strong>;</li>
        <li>No máximo <strong>8 doses por mês</strong>.</li>
      </ul>
      <p>
        A apresentação oficial é um autoinjetor pronto para uso — não exige preparo. Já os
        produtos vendidos como pó liofilizado (frascos de pesquisa) precisariam ser
        reconstituídos, um processo que introduz risco de erro de dose e de contaminação; se
        for esse o contexto, entenda antes como funciona a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link>.
      </p>

      <h2>Efeitos colaterais</h2>
      <ul>
        <li><strong>Náusea</strong> — o efeito mais comum, em cerca de <strong>40%</strong> das pacientes nos ensaios;</li>
        <li><strong>Rubor facial</strong> (flushing), cefaleia e vômitos;</li>
        <li>Reações no local da injeção; tosse, fadiga e ondas de calor;</li>
        <li><strong>Elevação transitória da pressão arterial</strong> e redução da frequência cardíaca após cada dose (costumam se resolver em até 12h);</li>
        <li><strong>Hiperpigmentação focal</strong> na pele ou gengiva, especialmente em peles escuras ou com uso repetido.</li>
      </ul>
      <p>
        As contraindicações incluem <strong>hipertensão não controlada</strong>, doença
        cardiovascular conhecida, risco cardiovascular significativo (avaliação individualizada)
        e gravidez — nesse caso, deve-se descontinuar se a gestação ocorrer.
      </p>

      <h2>Uso off-label em homens</h2>
      <p>
        O Vyleesi foi estudado e aprovado <strong>apenas para mulheres na pré-menopausa</strong>.
        Qualquer uso em homens é off-label: não existe dose de bula, nem os dados de eficácia e
        segurança que a aprovação exigiu para a população feminina. Isso não significa que
        "não faça nada" — significa que falta a comprovação regulatória que dá segurança à
        recomendação.
      </p>
      <p>
        É útil comparar o PT-141 com outro agonista de melanocortina, o Melanotan II — ambos
        ativam a mesma família de receptores, mas o Melanotan II <strong>nunca foi aprovado</strong>
        e tem perfil de risco muito mais amplo. Veja o comparativo em{' '}
        <Link href="/comparar/pt-141-vs-melanotan-ii">PT-141 vs Melanotan II</Link> e entenda os
        alertas em <Link href="/blog/melanotan-2-riscos">Melanotan 2: riscos</Link>.
      </p>

      <h2>Está disponível no Brasil?</h2>
      <p>
        O PT-141 (bremelanotida) foi aprovado nos Estados Unidos como Vyleesi, mas
        <strong> não tem registro na ANVISA</strong> para uso no Brasil. Produtos ofertados
        pela internet como "PT-141" fora do circuito farmacêutico regulado vêm do
        <strong> mercado não regulado</strong>, sem garantia de identidade, pureza ou dose — um
        risco relevante para um peptídeo injetável que, mesmo na forma aprovada, altera a
        pressão arterial. Diante de queixas de desejo sexual, o caminho seguro é a avaliação com
        um profissional de saúde, e não a automedicação com produtos de origem incerta.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>
    </ArticleLayout>
  );
}
