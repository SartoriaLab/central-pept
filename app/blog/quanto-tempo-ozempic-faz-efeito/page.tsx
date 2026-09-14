import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'quanto-tempo-ozempic-faz-efeito';
export const metadata: Metadata = {
  title: 'Quanto tempo Ozempic leva para começar a fazer efeito?',
  description: 'Linha do tempo: controle glicêmico em dias, saciedade em semanas, perda de peso em meses.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        Expectativas realistas importam. <Link href="/peptideos/semaglutida">Semaglutida</Link> atua em vários sistemas com tempos diferentes — veja o que esperar semana a semana.
      </p>

      <h2>Dias 1-7: primeira dose</h2>
      <ul>
        <li>Saciedade já perceptível após 2-3 dias</li>
        <li>Náusea pode aparecer nos primeiros dias (principalmente após a dose)</li>
        <li>Pouca mudança na glicemia ainda — precisa steady state</li>
      </ul>

      <h2>Semanas 2-4: adaptação</h2>
      <ul>
        <li>Náusea tende a reduzir à medida que o corpo se adapta</li>
        <li>Redução de apetite mais consistente</li>
        <li>Primeiras perdas de peso: 1-3 kg tipicamente</li>
        <li>Glicemia começa a estabilizar em diabéticos</li>
      </ul>

      <h2>Semanas 5-12: dose em escalada</h2>
      <ul>
        <li>HbA1c começa a cair (detectável em exames a partir de 8-12 semanas)</li>
        <li>Perda de peso média: 4-8 kg até a semana 12</li>
        <li>Cada subida de dose pode reintroduzir náusea temporariamente</li>
      </ul>

      <h2>Meses 4-6: dose de manutenção</h2>
      <ul>
        <li>Perda de peso média: 10-15% do peso inicial (Wegovy 2,4 mg)</li>
        <li>HbA1c reduz 1-2% em DM2</li>
        <li>Maior parte da perda acontece nos primeiros 6 meses</li>
      </ul>

      <h2>Após 1 ano</h2>
      <ul>
        <li>Perda de peso estabiliza em um novo set point</li>
        <li>Continuação do tratamento mantém o peso perdido</li>
        <li>Parar leva a reganho gradual (50-70% em 1 ano) — veja <Link href="/blog/efeito-rebote-apos-parar-semaglutida">efeito rebote</Link></li>
      </ul>

      <h2>Por que leva tempo</h2>
      <ol>
        <li>Semaglutida tem meia-vida de ~7 dias — precisa 4-5 semanas para estado estacionário</li>
        <li>Titulação gradual é necessária para tolerância aos efeitos GI</li>
        <li>Ação em centros cerebrais de apetite leva tempo para remodelar hábitos alimentares</li>
        <li>A perda de peso depende também de deficit calórico real, não só da medicação</li>
      </ol>
      <p>
        Use a <Link href="/ferramentas/titulacao">calculadora de titulação</Link> para ver sua linha do tempo exata de subida de dose.
      </p>

      <div className="my-8 not-prose">
        <AffiliateBox
          productId="fornecedor_oficial"
          slot="blog-quanto-tempo-ozempic"
          peptide="tirzepatida"
        />
      </div>
    </ArticleLayout>
  );
}
