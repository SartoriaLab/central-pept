import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'efeito-rebote-apos-parar-semaglutida';
export const metadata: Metadata = {
  title: 'Efeito rebote após parar semaglutida: o que esperar',
  description: 'Dados do STEP-4 sobre reganho de peso pós-descontinuação e estratégias para minimizar o rebote.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        &quot;E se eu parar o Ozempic?&quot; é a pergunta mais comum depois da primeira perda de peso. A pesquisa mostra que sem continuidade ou estratégia de manutenção, o reganho é quase inevitável.
      </p>

      <h2>O estudo STEP-4</h2>
      <p>
        Participantes receberam <Link href="/peptideos/semaglutida">semaglutida 2,4 mg</Link> por 20 semanas. Depois foram randomizados:
      </p>
      <ul>
        <li><strong>Grupo A</strong>: continuou com semaglutida por mais 48 semanas → manteve perda de ~17%</li>
        <li><strong>Grupo B</strong>: trocou para placebo → recuperou ~7 dos 10 kg perdidos (70% de rebote) em 48 semanas</li>
      </ul>
      <p>
        Conclusão: semaglutida <strong>não &quot;cura&quot;</strong> obesidade — ela trata enquanto estiver ativa, como anti-hipertensivo para hipertensão.
      </p>

      <h2>Por que acontece o rebote</h2>
      <ol>
        <li>Apetite e saciedade voltam ao estado pré-tratamento em ~4 semanas após descontinuação</li>
        <li>Adaptação metabólica (metabolismo reduzido por menor massa) persiste</li>
        <li>Hábitos alimentares não foram totalmente remodelados</li>
        <li>Set point de peso corporal é geneticamente determinado e resistente</li>
      </ol>

      <h2>Estratégias para minimizar</h2>
      <ul>
        <li><strong>Reduzir dose gradualmente</strong> (sob orientação médica), não parar abruptamente</li>
        <li><strong>Treino resistido</strong> consistente durante e após — preserva massa muscular</li>
        <li><strong>Aumentar proteína</strong> (1,6 g/kg de peso) para saciedade e manutenção muscular</li>
        <li><strong>Rotina de monitoramento</strong> (balança semanal, fotos mensais)</li>
        <li><strong>Retomar em caso de rebote</strong> significativo (&gt;5% do peso mínimo atingido)</li>
      </ul>

      <h2>Uso de longo prazo é seguro?</h2>
      <p>
        Dados de 2+ anos (STEP-5) e uso em diabetes (SUSTAIN-6, 2+ anos) mostram perfil de segurança mantido. Uso crônico é considerado aceitável pela FDA para obesidade — é tratada como condição crônica, não aguda.
      </p>

      <h2>Considerações finais</h2>
      <p>
        Parar semaglutida sem estratégia de substituição leva a rebote previsível. Continuar indefinidamente é opção clínica válida. Decisão deve ser tomada com médico considerando resposta ao medicamento, efeitos adversos tolerados, custo de longo prazo e alternativas (cirurgia bariátrica, mudança de estilo de vida, outros medicamentos).
      </p>

      <div className="my-8 not-prose">
        <AffiliateBox
          productId="fornecedor_oficial"
          slot="blog-efeito-rebote"
          peptide="tirzepatida"
        />
      </div>
    </ArticleLayout>
  );
}
