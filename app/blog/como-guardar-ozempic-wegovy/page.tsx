import type { Metadata } from 'next';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'como-guardar-ozempic-wegovy';
export const metadata: Metadata = {
  title: 'Como guardar Ozempic e Wegovy corretamente',
  description: 'Orientações de armazenamento conforme bula: temperatura, proteção da luz, tempo pós-abertura e dicas de viagem.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <h2>Antes de abrir</h2>
      <ul>
        <li><strong>Geladeira</strong> (2-8°C), prateleira central — nunca na porta (temperatura oscila)</li>
        <li><strong>Nunca congelar.</strong> Semaglutida perde potência irreversivelmente se congelada</li>
        <li>Proteger da luz direta — manter na caixa original</li>
        <li>Validade: até a data impressa no frasco (tipicamente 24-36 meses)</li>
      </ul>

      <h2>Depois de abrir (primeira perfuração)</h2>
      <ul>
        <li>Pode ficar em temperatura ambiente <strong>até 25°C</strong> por até <strong>56 dias</strong></li>
        <li>OU continuar refrigerado, preferencialmente</li>
        <li>Prazo máximo pós-abertura: <strong>56 dias</strong> (bula Wegovy 2,4 mg)</li>
      </ul>

      <h2>Para viagens</h2>
      <ul>
        <li>Bolsa térmica com gelox por até 8h</li>
        <li>Em voos, levar na bagagem de mão — bagagem despachada pode congelar</li>
        <li>Receita médica impressa para segurança aduaneira</li>
        <li>Evitar deixar no carro em dias quentes (&gt;30°C)</li>
      </ul>

      <h2>Como saber se estragou</h2>
      <ul>
        <li>Solução turva ou com partículas → descartar</li>
        <li>Cor alterada (amarelada, marrom) → descartar</li>
        <li>Ficou congelada → descartar mesmo após descongelar</li>
        <li>Passou de 56 dias pós-abertura → descartar</li>
      </ul>

      <h2>Descarte correto</h2>
      <p>
        Pens e seringas usadas vão em <strong>recipiente perfurocortante</strong> (Descarpack ou similar). Nunca no lixo comum. Farmácias e UBS aceitam entregas de material de descarte.
      </p>

      <div className="my-8 not-prose">
        <AffiliateBox
          productId="fornecedor_oficial"
          slot="blog-como-guardar"
          peptide="tirzepatida"
        />
      </div>
    </ArticleLayout>
  );
}
