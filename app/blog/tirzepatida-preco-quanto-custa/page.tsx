import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'tirzepatida-preco-quanto-custa';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Mounjaro tem genérico no Brasil?',
    a: 'Não. A patente da tirzepatida vale até por volta de 2036, então não existe genérico nem similar registrado. O que existe fora da caneta da Lilly é tirzepatida manipulada em farmácia de manipulação ou frasco liofilizado importado — produtos sem registro próprio na ANVISA, cuja qualidade depende de quem fabrica e de quem vende.',
  },
  {
    q: 'Plano de saúde cobre tirzepatida?',
    a: 'Em geral, não para obesidade. Medicamento de uso domiciliar fica fora da cobertura obrigatória da ANS. Alguns planos e programas de reembolso cobrem para diabetes tipo 2 com laudo médico, e há decisões judiciais pontuais para obesidade grave. Vale consultar o plano por escrito antes de contar com isso.',
  },
  {
    q: 'Frasco de 10 mg rende quanto?',
    a: 'Depende da dose semanal: 4 doses de 2,5 mg (cerca de 1 mês), 2 doses de 5 mg (2 semanas) ou 1 dose de 10 mg (1 semana). Como o frasco reconstituído dura 28 dias na geladeira, ele só é aproveitado por inteiro se o conteúdo for usado dentro desse prazo.',
  },
  {
    q: 'O preço da tirzepatida vai cair?',
    a: 'A tendência é de queda gradual: mais oferta de canetas, a chegada da marca Zepbound em outros mercados e a concorrência com a semaglutida pressionam o preço. Mas sem genérico à vista, não espere uma queda brusca. O que muda mais rápido é o preço dos frascos, que oscila com câmbio e demanda.',
  },
  {
    q: 'Compensa importar tirzepatida?',
    a: 'Nos EUA a Lilly vende o Zepbound em frasco por cerca de US$ 400-500 por mês nas doses baixas, o que pode sair mais barato que o Mounjaro no Brasil. Mas importação pessoal de medicamento exige receita, o produto precisa de cadeia de frio e a ANVISA pode reter na alfândega. Na prática, poucos conseguem fazer isso com segurança.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        Quem pesquisa o preço da tirzepatida encontra números que vão de R$ 400 a R$ 1.500
        e não entende por quê. A confusão tem uma causa simples: são <strong>três produtos
        diferentes</strong> com o mesmo princípio ativo — a caneta Mounjaro, o frasco
        manipulado e o frasco liofilizado de fornecedor — e cada um tem uma lógica de preço
        própria. Comparar o valor de um frasco de 10 mg com o de uma caneta de 4 doses é
        comparar coisas que não se equivalem.
      </p>
      <p>
        Este artigo organiza a conta. Os valores são <strong>faixas de mercado de setembro de
        2026</strong>, levantadas em farmácias, farmácias de manipulação e fornecedores
        especializados. Mudam toda semana com câmbio e estoque, então trate como ordem de
        grandeza, não como tabela oficial.
      </p>

      <h2>As três formas de comprar tirzepatida</h2>
      <ul>
        <li>
          <strong>Caneta Mounjaro</strong> — produto industrializado da Eli Lilly, registrado
          na ANVISA. Cada caixa traz 4 canetas de dose fixa (2,5 / 5 / 7,5 / 10 / 12,5 ou
          15 mg), uma por semana. Vendida em farmácia, com receita. Faixa de R$ 1.100 a
          R$ 1.400 por caixa.
        </li>
        <li>
          <strong>Frasco manipulado</strong> — tirzepatida em pó, geralmente 5, 10 ou 15 mg
          por frasco, preparada por farmácia de manipulação sob prescrição. Precisa ser
          reconstituída com água bacteriostática. Faixa de R$ 500 a R$ 900 pelo frasco de
          10 mg.
        </li>
        <li>
          <strong>Frasco liofilizado de fornecedor</strong> — mesmo formato do manipulado,
          sem a intermediação de uma farmácia. A qualidade depende 100% do fornecedor: lote,
          certificado de análise e cadeia de frio são o único controle que existe. Faixa de
          preço parecida com a do manipulado, às vezes um pouco abaixo.
        </li>
      </ul>

      <h2>Tabela: custo por mês em cada dose</h2>
      <p>
        A tabela abaixo converte tudo para <strong>custo mensal</strong>, considerando 4,3
        aplicações por mês. Base: caneta a R$ 1.250 (média, qualquer dose), frasco de 10 mg a
        R$ 700 e frasco de 15 mg a R$ 950.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Dose semanal</th>
              <th>Caneta Mounjaro (mês)</th>
              <th>Frasco 10 mg (mês)</th>
              <th>Frasco 15 mg (mês)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>2,5 mg</td><td>~R$ 1.250</td><td>~R$ 750 (4 doses por frasco)</td><td>~R$ 680 (6 doses)</td></tr>
            <tr><td>5 mg</td><td>~R$ 1.250</td><td>~R$ 1.500 (2 doses)</td><td>~R$ 1.360 (3 doses)</td></tr>
            <tr><td>7,5 mg</td><td>~R$ 1.250</td><td>—</td><td>~R$ 2.040 (2 doses)</td></tr>
            <tr><td>10 mg</td><td>~R$ 1.250</td><td>~R$ 3.000 (1 dose)</td><td>~R$ 2.720 (1,5 dose)</td></tr>
            <tr><td>15 mg</td><td>~R$ 1.250</td><td>—</td><td>~R$ 4.080 (1 dose)</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        O padrão é claro: <strong>em dose baixa o frasco é mais barato</strong>; a partir de
        7,5-10 mg a caneta empata ou ganha com folga, porque a Lilly cobra o mesmo por caixa
        independentemente da dose. Isso surpreende quem olha só o preço do frasco e esquece
        que um frasco de 10 mg vira uma única aplicação quando a dose chega a 10 mg.
      </p>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-tirze-preco-mid" peptide="tirzepatida" />
      </div>

      <h2>Por que o preço varia tanto</h2>
      <ul>
        <li><strong>Patente</strong>: sem genérico até por volta de 2036, a Lilly define o preço da caneta.</li>
        <li><strong>Importação e câmbio</strong>: tanto a caneta quanto a matéria-prima dos frascos são importadas; o dólar mexe no preço em semanas.</li>
        <li><strong>Cadeia de frio</strong>: transporte e armazenamento refrigerados encarecem cada etapa.</li>
        <li><strong>Dose</strong>: a caneta tem preço único por caixa, então a dose alta é proporcionalmente muito mais barata que a baixa.</li>
        <li><strong>Demanda</strong>: a falta de estoque de 2024-2025 elevou preços e abriu espaço para intermediários.</li>
        <li><strong>Margem do canal</strong>: farmácia, manipulação e fornecedor têm custos e margens diferentes para o mesmo miligrama.</li>
      </ul>

      <h2>Preço por miligrama: a conta que importa</h2>
      <p>
        A forma mais honesta de comparar é dividir o preço pela quantidade total de
        tirzepatida que você recebe:
      </p>
      <ul>
        <li>Frasco de 10 mg a R$ 700 → <strong>R$ 70/mg</strong></li>
        <li>Frasco de 15 mg a R$ 950 → <strong>R$ 63/mg</strong></li>
        <li>Caneta de 5 mg (4 × 5 = 20 mg) a R$ 1.250 → <strong>R$ 62/mg</strong></li>
        <li>Caneta de 15 mg (4 × 15 = 60 mg) a R$ 1.250 → <strong>R$ 21/mg</strong></li>
      </ul>
      <p>
        Por miligrama, a <strong>caneta de dose alta é disparada a mais barata</strong>. O
        frasco só compensa em doses baixas — quando a caneta obriga a pagar por 4 aplicações
        de 2,5 mg o mesmo que pagaria por 4 de 15 mg — ou quando a caneta simplesmente não
        está disponível na sua região.
      </p>

      <h2>Barato demais é caro</h2>
      <p>
        Frasco de 10 mg abaixo de R$ 350 ou caneta abaixo de R$ 800 não é promoção: é sinal
        de matéria-prima duvidosa, subdosagem ou falsificação. O custo de produzir e
        transportar tirzepatida com cadeia de frio não fecha nesses valores. Antes de pagar
        por qualquer oferta fora da faixa, leia{' '}
        <Link href="/blog/mounjaro-falso-como-identificar">como identificar Mounjaro falso</Link>{' '}
        e{' '}
        <Link href="/blog/tirzepatida-manipulada-seguranca">os riscos da tirzepatida manipulada</Link>.
      </p>

      <h2>Como economizar sem arriscar</h2>
      <ul>
        <li><strong>Compare por mg</strong>, não por frasco ou por caixa.</li>
        <li><strong>Escolha o frasco compatível com a dose</strong>: sobra que vence em 28 dias é dinheiro jogado fora.</li>
        <li>
          Use a{' '}
          <Link href="/ferramentas/reconstituicao?peptide=tirzepatida">calculadora de reconstituição</Link>{' '}
          para não desperdiçar nenhuma unidade na seringa.
        </li>
        <li>
          Siga a <Link href="/ferramentas/titulacao">titulação</Link> e não suba a dose antes
          da hora: cada degrau a mais custa mais por mês.
        </li>
        <li>
          Peça o certificado de análise <strong>antes de pagar</strong>. O{' '}
          <Link href="/blog/onde-comprar-tirzepatida">guia de procedência</Link> mostra o que
          exigir de qualquer canal.
        </li>
      </ul>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-tirze-preco" peptide="tirzepatida" />
      </div>
    </ArticleLayout>
  );
}
