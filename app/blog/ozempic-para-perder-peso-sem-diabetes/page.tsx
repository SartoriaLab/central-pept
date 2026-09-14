import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'ozempic-para-perder-peso-sem-diabetes';
export const metadata: Metadata = {
  title: 'Ozempic para perder peso sem diabetes: o que a ciência mostra',
  description: 'Dados do programa STEP sobre uso de semaglutida em pessoas sem diabetes, riscos do uso estético e diferença em relação ao Wegovy.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        Ozempic é a marca da <Link href="/peptideos/semaglutida">semaglutida</Link> aprovada pelo FDA em 2017 para diabetes tipo 2. Virou um dos medicamentos mais buscados do mundo por outro motivo: perda de peso em pessoas sem diabetes. Este artigo separa evidência clínica de marketing.
      </p>

      <h2>A diferença entre Ozempic e Wegovy</h2>
      <p>Ambos contêm semaglutida, mas:</p>
      <ul>
        <li><strong>Ozempic</strong>: aprovado para diabetes tipo 2, dose máxima 2 mg/semana</li>
        <li><strong>Wegovy</strong>: aprovado para obesidade, dose máxima 2,4 mg/semana, titulação mais agressiva</li>
      </ul>
      <p>
        Usar Ozempic off-label para emagrecer é comum no Brasil por preço e disponibilidade. Clinicamente é a <em>mesma molécula</em>, mas dose e acompanhamento diferem.
      </p>

      <h2>O que dizem os estudos STEP</h2>
      <p>O programa <strong>STEP</strong> incluiu 5 ensaios fase 3 randomizados:</p>
      <ul>
        <li>STEP-1 (2021): perda média de <strong>14,9%</strong> em 68 semanas com 2,4 mg/semana + aconselhamento vs 2,4% placebo</li>
        <li>STEP-3: com terapia intensiva de estilo de vida — perda média 16%</li>
        <li>STEP-5: manutenção por 2 anos mostrou sustentação do peso</li>
      </ul>

      <h2>Riscos do uso sem acompanhamento</h2>
      <ul>
        <li><strong>Efeitos GI</strong>: 74% dos participantes STEP-1 relataram náusea, diarreia ou vômito em algum momento</li>
        <li><strong>Reganho pós-descontinuação</strong>: STEP-4 mostrou recuperação de ~2/3 do peso em 1 ano</li>
        <li><strong>Perda muscular</strong>: ~40% da perda total pode ser massa magra sem treino resistido</li>
        <li><strong>Contraindicações</strong>: histórico pessoal/familiar de câncer medular de tireoide, NEM 2, pancreatite prévia</li>
      </ul>

      <h2>Custo-benefício</h2>
      <p>
        Ozempic de marca custa R$ 800-1.200/mês no Brasil. Semaglutida manipulada custa R$ 150-400/mês, mas <strong>não tem o mesmo controle de qualidade</strong>. Veja o artigo sobre <Link href="/blog/tirzepatida-manipulada-seguranca">peptídeos manipulados</Link>.
      </p>

      <h2>Considerações finais</h2>
      <p>
        Semaglutida funciona para perda de peso em pessoas sem diabetes. O que muda é o contexto: ela é <em>parte</em> de um tratamento que inclui mudança de estilo de vida, exercício resistido e acompanhamento profissional. Sem isso, o resultado de curto prazo vem com risco aumentado de rebote e efeitos adversos.
      </p>
      <p>
        Se considerar uso: <strong>procure endocrinologista ou bariatra</strong>, não compre em marketplace, e use a <Link href="/ferramentas/titulacao">calculadora de titulação</Link> para entender o esquema de subida de dose.
      </p>

      <div className="my-8 not-prose">
        <AffiliateBox
          productId="fornecedor_oficial"
          slot="blog-ozempic-sem-diabetes"
          peptide="tirzepatida"
        />
      </div>
    </ArticleLayout>
  );
}
