import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'mounjaro-falso-como-identificar';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Mounjaro vende em frasco?',
    a: 'No Brasil, não. A Lilly comercializa aqui apenas a caneta KwikPen. Nos EUA existe o Zepbound em frasco, mas ele não é registrado no Brasil. Qualquer "Mounjaro em frasco" vendido aqui é, na melhor das hipóteses, tirzepatida manipulada ou de fornecedor com o nome errado — e, na pior, produto falsificado.',
  },
  {
    q: 'Quanto custa o Mounjaro original?',
    a: 'Entre R$ 1.100 e R$ 1.400 por caixa de 4 canetas, em farmácia, com pequenas variações por dose e região. Caneta anunciada abaixo de R$ 800-900 está fora da curva de custo do produto e merece desconfiança.',
    link: { label: 'Tabela de preços por dose', href: '/blog/tirzepatida-preco-quanto-custa' },
  },
  {
    q: 'Como saber se o lote é válido?',
    a: 'Três verificações: o lote impresso na caixa deve ser igual ao lote impresso na caneta; o registro do produto deve constar na consulta pública da ANVISA em nome da Eli Lilly do Brasil; e o lote não pode aparecer nos alertas de falsificação publicados pela ANVISA. Se qualquer uma falhar, não aplique.',
  },
  {
    q: 'Mounjaro precisa de receita?',
    a: 'Sim. É medicamento de prescrição: a farmácia exige apresentar a receita, embora não a retenha. Venda sem receita já é uma irregularidade do vendedor e um sinal de que outras regras também podem estar sendo ignoradas.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        O Mounjaro chegou às farmácias brasileiras em 2025 já com fila de espera e preço
        alto. Onde há escassez e preço alto, há falsificação: a Eli Lilly e agências
        reguladoras de vários países, incluindo a ANVISA, emitiram alertas sobre canetas
        falsas de tirzepatida circulando em marketplaces e redes sociais.
      </p>
      <p>
        Este guia mostra o que conferir na caixa, na caneta e no frasco, como consultar o
        registro na ANVISA e o que fazer se desconfiar.
      </p>

      <h2>Onde o risco é maior</h2>
      <ul>
        <li><strong>Marketplaces</strong> (Mercado Livre, Shopee, OLX): venda de medicamento é proibida nesses canais.</li>
        <li><strong>Redes sociais e Telegram</strong>: perfis sem CNPJ, sem endereço, que somem depois da venda.</li>
        <li><strong>"Farmácia online" sem CNPJ ou endereço</strong> no rodapé do site.</li>
        <li><strong>Preço abaixo de R$ 900 por caixa</strong>: não fecha com o custo do produto original.</li>
        <li>
          <strong>Vendedor que oferece "Mounjaro em frasco"</strong>: a Lilly não vende frasco
          no Brasil. Frasco é sempre tirzepatida manipulada ou importada — nunca Mounjaro.
        </li>
      </ul>

      <h2>O que verificar na caixa</h2>
      <ul>
        <li>Nome <strong>Mounjaro</strong> + <strong>tirzepatida</strong> + dose (2,5 / 5 / 7,5 / 10 / 12,5 ou 15 mg) impressos</li>
        <li>Fabricante <strong>Eli Lilly</strong>, com importador Eli Lilly do Brasil</li>
        <li>Número de <strong>registro ANVISA</strong> impresso</li>
        <li><strong>Lote e validade</strong> impressos em relevo ou tinta, não em adesivo</li>
        <li><strong>Lacre intacto</strong>, sem sinais de recolagem</li>
        <li><strong>Bula em português</strong> dentro da caixa, em papel de gráfica</li>
        <li>
          Apresentação nacional é <strong>caixa com 4 canetas</strong>. Caneta "solta", sem
          caixa, ou caixa de 1 unidade é suspeita.
        </li>
      </ul>

      <h2>O que verificar na caneta (KwikPen)</h2>
      <ul>
        <li>É uma <strong>caneta multidose</strong> com seletor que trava em 4 doses</li>
        <li><strong>Rótulo impresso de fábrica</strong>, com lote igual ao da caixa</li>
        <li>Líquido <strong>límpido e incolor</strong>, sem partículas nem turvação</li>
        <li>Seletor <strong>trava nas posições</strong>; se gira livre e sem clique, é suspeito</li>
        <li>Tampa e cores da apresentação <strong>coerentes com a dose</strong> impressa na caixa</li>
      </ul>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-mounjaro-falso-mid" peptide="tirzepatida" />
      </div>

      <h2>E se for frasco (tirzepatida liofilizada)?</h2>
      <p>
        Então não é Mounjaro: é tirzepatida manipulada ou de fornecedor, e a verificação é
        outra. Exija o <strong>certificado de análise (COA) com número de lote batendo com o
        rótulo</strong>, pureza por HPLC, pó branco compacto sem manchas ou amarelamento e
        lacre de alumínio intacto. O checklist completo está em{' '}
        <Link href="/blog/onde-comprar-tirzepatida">onde comprar tirzepatida com segurança</Link>{' '}
        e os riscos específicos em{' '}
        <Link href="/blog/tirzepatida-manipulada-seguranca">tirzepatida manipulada</Link>.
      </p>

      <h2>Como conferir na ANVISA</h2>
      <ol>
        <li>
          Entre em{' '}
          <a href="https://consultas.anvisa.gov.br" target="_blank" rel="noreferrer noopener">consultas.anvisa.gov.br</a>
        </li>
        <li>Busque &quot;Mounjaro&quot; — o registro válido é da Eli Lilly do Brasil</li>
        <li>Compare o número de registro, a apresentação e a dose com a caixa que você tem</li>
        <li>Verifique na página de alertas da ANVISA se o lote consta em algum comunicado de falsificação</li>
      </ol>

      <h2>Se desconfiar</h2>
      <ul>
        <li><strong>Não aplique.</strong> Tire fotos da caixa, da caneta e do rótulo</li>
        <li>
          Notifique a ANVISA via Notivisa (
          <a href="https://www8.anvisa.gov.br/notivisa" target="_blank" rel="noreferrer noopener">www8.anvisa.gov.br/notivisa</a>
          )
        </li>
        <li>Procure o Procon se comprou online</li>
        <li>Se já aplicou e há sintomas anormais, procure pronto-socorro levando o produto</li>
      </ul>

      <h2>Conclusão</h2>
      <p>
        Caneta, só em farmácia com nota fiscal. Frasco, só com COA e lote no rótulo. O
        desconto do Instagram não é economia: é uma aposta em que a parte perdedora é a sua
        saúde.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-mounjaro-falso" peptide="tirzepatida" />
      </div>
    </ArticleLayout>
  );
}
