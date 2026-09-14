import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'onde-comprar-tirzepatida';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Posso comprar tirzepatida sem receita?',
    a: 'Em farmácia e em farmácia de manipulação, não: a lei exige receita. O que é vendido sem receita não tem respaldo regulatório, e a responsabilidade pelo uso passa a ser inteiramente sua. Se optar por esse caminho, exija ao menos certificado de análise do lote, envio refrigerado e comprovante — e mantenha acompanhamento médico.',
  },
  {
    q: 'O que é COA e como ler?',
    a: 'COA (Certificate of Analysis, certificado de análise) é o documento do laboratório que testou aquele lote. Deve trazer: número do lote, pureza por HPLC (idealmente 98% ou mais), identidade confirmada por espectrometria de massa e, no caso de injetáveis, teste de endotoxinas. O número do lote do COA tem que ser o mesmo impresso no rótulo do frasco — se não bater, o documento não prova nada sobre o seu produto.',
  },
  {
    q: 'Tirzepatida de fornecedor é igual ao Mounjaro?',
    a: 'É o mesmo princípio ativo, mas não é o mesmo produto. O Mounjaro passa por controle industrial de identidade, pureza, esterilidade e dose em cada caneta. No frasco, a pureza e a quantidade real de tirzepatida podem variar de lote para lote e de fornecedor para fornecedor. Por isso o COA e o lote importam tanto.',
    link: { label: 'Riscos da tirzepatida manipulada', href: '/blog/tirzepatida-manipulada-seguranca' },
  },
  {
    q: 'Quanto tempo o frasco aguenta fora da geladeira?',
    a: 'O pó liofilizado tolera alguns dias em temperatura ambiente sem perda relevante, o que permite o transporte. Depois de reconstituído, a tolerância cai para horas: refrigere sempre entre 2 e 8 °C e use em até 28 dias.',
  },
  {
    q: 'Como sei se o que chegou é falso?',
    a: 'Na caneta: lote da caixa diferente do lote da caneta, rótulo adesivo, lacre violado, líquido turvo. No frasco: rótulo sem lote ou validade, COA sem lote, pó amarelado ou com manchas, lacre de alumínio danificado.',
    link: { label: 'Guia completo: Mounjaro falso', href: '/blog/mounjaro-falso-como-identificar' },
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        A pergunta mais comum sobre tirzepatida é "onde comprar mais barato". A pergunta certa
        é outra: <strong>como saber que o que chega na sua casa é tirzepatida, na dose que
        está no rótulo, sem contaminação</strong>. Preço se resolve em cinco minutos de
        pesquisa. Procedência exige método. Este guia é sobre procedência.
      </p>

      <h2>Os três canais no Brasil</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Canal</th>
              <th>O que vende</th>
              <th>Exige receita?</th>
              <th>Como comprovar qualidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Farmácia / drogaria</strong></td>
              <td>Caneta Mounjaro (Eli Lilly)</td>
              <td>Sim</td>
              <td>Registro ANVISA, nota fiscal, lote impresso na caixa e na caneta</td>
            </tr>
            <tr>
              <td><strong>Farmácia de manipulação</strong></td>
              <td>Frasco em pó, 5-15 mg</td>
              <td>Sim</td>
              <td>Alvará sanitário, farmacêutico responsável técnico, COA por lote</td>
            </tr>
            <tr>
              <td><strong>Fornecedor especializado</strong></td>
              <td>Frasco liofilizado</td>
              <td>Varia</td>
              <td>COA com HPLC, lote no rótulo, envio refrigerado, atendimento que responde perguntas técnicas</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Checklist de procedência (use em qualquer canal)</h2>
      <ol>
        <li>
          <strong>Lote e validade impressos.</strong> No rótulo de fábrica, não em adesivo
          solto. Adesivo é o jeito mais fácil de trocar a identidade de um frasco.
        </li>
        <li>
          <strong>COA — Certificado de Análise do lote.</strong> Pureza por HPLC de 98% ou
          mais e identidade por espectrometria de massa. Peça <em>antes</em> de pagar. Quem
          tem, manda na hora.
        </li>
        <li>
          <strong>Cadeia de frio.</strong> Envio com gelo e isopor, chegada ainda fria. O pó
          liofilizado tolera alguns dias em temperatura ambiente, mas o produto reconstituído
          não — e você não sabe quanto tempo ficou no caminhão.
        </li>
        <li>
          <strong>Comprovante.</strong> Nota fiscal ou, no mínimo, recibo com CNPJ. Sem isso
          não existe a quem reclamar.
        </li>
        <li>
          <strong>Quem responde.</strong> Farmacêutico ou atendente que sabe explicar
          reconstituição, armazenamento e por que o COA importa. Quem só sabe falar de preço
          não é fonte confiável.
        </li>
        <li>
          <strong>Rótulo coerente.</strong> Nome do peptídeo, miligramas, "uso subcutâneo",
          lote e validade. Rótulo genérico ou em branco descarta na hora.
        </li>
        <li>
          <strong>Preço dentro da faixa.</strong> Muito abaixo do mercado é o sinal mais
          barato de detectar. As faixas atuais estão em{' '}
          <Link href="/blog/tirzepatida-preco-quanto-custa">quanto custa tirzepatida</Link>.
        </li>
      </ol>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-onde-comprar-tirze-mid" peptide="tirzepatida" />
      </div>

      <h2>Sinais de golpe</h2>
      <ul>
        <li><strong>Marketplace</strong> (Mercado Livre, Shopee, OLX): a ANVISA proíbe a venda de medicamento nesses canais. Anúncio ativo já é irregular.</li>
        <li><strong>Perfil de Instagram ou Telegram sem CNPJ</strong>, sem endereço e sem responsável técnico.</li>
        <li><strong>Preço 40% ou mais abaixo da faixa</strong> de mercado.</li>
        <li><strong>"Última unidade"</strong>, contagem regressiva, pressão para fechar agora.</li>
        <li><strong>Não fornece COA</strong>, ou manda um COA sem número de lote (serve para qualquer frasco, logo não serve para nenhum).</li>
        <li><strong>Só aceita Pix para conta de pessoa física</strong>, sem recibo.</li>
        <li>Promete <strong>"efeito garantido"</strong> ou "sem efeito colateral". Tirzepatida tem efeitos colaterais conhecidos; quem nega isso está vendendo outra coisa.</li>
      </ul>

      <h2>O que perguntar no primeiro contato</h2>
      <ul>
        <li>"Qual o lote e a validade?"</li>
        <li>"Pode me mandar o COA desse lote?"</li>
        <li>"Qual a pureza por HPLC?"</li>
        <li>"Como é o envio e em quanto tempo chega?"</li>
        <li>"Vem com água bacteriostática ou compro à parte?"</li>
        <li>"Qual a política se chegar com o lacre violado ou quente?"</li>
      </ul>
      <p>
        Fornecedor sério responde tudo sem se irritar, porque ouve essas perguntas todo dia.
        Quem foge de COA e lote, muda de assunto ou responde "confia", descarta.
      </p>

      <h2>Depois de comprar</h2>
      <ul>
        <li>Confira lacre, rótulo, lote e temperatura ao receber. Fotografe tudo.</li>
        <li>Guarde na geladeira (2-8 °C) imediatamente.</li>
        <li>
          Reconstitua com{' '}
          <Link href="/blog/agua-bacteriostatica-guia">água bacteriostática</Link> usando a{' '}
          <Link href="/ferramentas/reconstituicao?peptide=tirzepatida">calculadora</Link>. O
          passo a passo com tabela de unidades está em{' '}
          <Link href="/blog/como-reconstituir-tirzepatida">como reconstituir tirzepatida</Link>.
        </li>
        <li>
          Comece em 2,5 mg, mesmo com experiência prévia com outro GLP-1. A{' '}
          <Link href="/ferramentas/titulacao">calculadora de titulação</Link> monta o
          cronograma.
        </li>
      </ul>

      <h2>Receita médica</h2>
      <p>
        Tirzepatida é medicamento de prescrição. Farmácia e farmácia de manipulação exigem
        receita por lei, e não é burocracia vazia: o acompanhamento médico é o que protege
        das contraindicações reais — histórico de carcinoma medular de tireoide, síndrome
        NEM 2, pancreatite prévia — e do manejo dos efeitos gastrointestinais. A ficha técnica
        completa, com doses, efeitos e fontes, está em{' '}
        <Link href="/peptideos/tirzepatida">tirzepatida</Link>.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-onde-comprar-tirze" peptide="tirzepatida" />
      </div>
    </ArticleLayout>
  );
}
