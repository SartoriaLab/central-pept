import type { Metadata } from 'next';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'ozempic-falso-como-identificar';
export const metadata: Metadata = {
  title: 'Ozempic falso: como identificar e o que fazer',
  description: 'Sinais de falsificação em embalagens Ozempic, alertas da ANVISA e passos para verificar procedência.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        Com a explosão da demanda por <strong>Ozempic</strong> a partir de 2022, cresceu a falsificação. A ANVISA emitiu múltiplos alertas entre 2023 e 2025. Este guia mostra como identificar pens falsos antes de aplicar.
      </p>

      <h2>Onde o risco é maior</h2>
      <ul>
        <li>Marketplaces (Mercado Livre, Amazon, OLX) — ANVISA proíbe venda online</li>
        <li>Redes sociais (Instagram, Telegram) — alta incidência de falsificação</li>
        <li>Farmácias de procedência duvidosa, sem CNPJ claro</li>
        <li>Preços muito abaixo do mercado (&lt; R$ 500 para Ozempic 1 mg)</li>
      </ul>

      <h2>O que verificar na embalagem</h2>
      <ul>
        <li><strong>Caixa</strong>: impressão de alta qualidade, cor azul consistente, sem erros de ortografia</li>
        <li><strong>Número de lote</strong>: deve bater com o lote impresso no pen (dentro da caixa)</li>
        <li><strong>Fabricante</strong>: Novo Nordisk A/S — importação exclusiva Novo Nordisk Brasil</li>
        <li><strong>QR code ou código de barras</strong>: deve ser escaneável e conduzir a informação oficial</li>
        <li><strong>Bula em português</strong>: presente e em papel, não folha avulsa impressa</li>
      </ul>

      <h2>O que verificar no pen</h2>
      <ul>
        <li>Seletor de dose gira livremente sem travar</li>
        <li>Solução cristalina, sem partículas</li>
        <li>Lote impresso no corpo do pen bate com a caixa</li>
        <li>Rótulo impresso de fábrica, não adesivo</li>
      </ul>

      <h2>Como conferir com a ANVISA</h2>
      <ol>
        <li>Entre em <a href="https://consultas.anvisa.gov.br" target="_blank" rel="noreferrer noopener">consultas.anvisa.gov.br</a></li>
        <li>Busque &quot;Ozempic&quot; — o registro válido é da Novo Nordisk Farmacêutica</li>
        <li>Compare o lote que você tem com os autorizados (alertas recentes listam lotes falsificados)</li>
      </ol>

      <h2>Se desconfiar</h2>
      <ul>
        <li><strong>Não aplique.</strong> Tire fotos da embalagem e do pen</li>
        <li>Notifique a ANVISA via Notivisa (<a href="https://www8.anvisa.gov.br/notivisa" target="_blank" rel="noreferrer noopener">www8.anvisa.gov.br/notivisa</a>)</li>
        <li>Procure o Procon se comprou online</li>
        <li>Em caso de aplicação de produto suspeito, procure pronto-socorro se aparecerem sintomas anormais</li>
      </ul>

      <h2>Conclusão</h2>
      <p>
        Compre em farmácia física com CNPJ visível e nota fiscal. O &quot;desconto imperdível&quot; no Instagram é quase sempre produto falsificado. A conta de economizar R$ 500 e tomar um produto adulterado pode ser alta.
      </p>

      <div className="my-8 not-prose">
        <AffiliateBox
          productId="fornecedor_oficial"
          slot="blog-ozempic-falso"
          peptide="tirzepatida"
        />
      </div>
    </ArticleLayout>
  );
}
