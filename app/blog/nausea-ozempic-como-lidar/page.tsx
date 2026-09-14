import type { Metadata } from 'next';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'nausea-ozempic-como-lidar';
export const metadata: Metadata = {
  title: 'Náusea no Ozempic: como minimizar e quando procurar médico',
  description: 'Estratégias práticas para reduzir náusea durante titulação de semaglutida, quando persistir é sinal de alerta.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        Náusea é o efeito colateral <strong>mais comum</strong> da semaglutida — até 44% dos pacientes com Wegovy em dose máxima relatam algum grau. A boa notícia: é gerenciável e geralmente transitório.
      </p>

      <h2>Quando aparece</h2>
      <ul>
        <li>Primeiros 2-3 dias após cada subida de dose</li>
        <li>Mais intensa nas 12-24h após a aplicação</li>
        <li>Tende a diminuir após 1-2 semanas em dose estável</li>
      </ul>

      <h2>Estratégias alimentares</h2>
      <ul>
        <li><strong>Refeições pequenas</strong> — 5-6×/dia em vez de 3 grandes</li>
        <li><strong>Evitar gordura, frituras, picantes</strong> durante os picos</li>
        <li><strong>Preferir carboidratos leves</strong> (arroz, batata, bolacha sem açúcar)</li>
        <li><strong>Proteína magra</strong> (peito de frango, peixe) em vez de carne vermelha gordurosa</li>
        <li><strong>Líquidos longe das refeições</strong> — reduzem saciedade precoce</li>
      </ul>

      <h2>Timing da aplicação</h2>
      <ul>
        <li>Aplicar no <strong>mesmo dia da semana</strong>, não varie</li>
        <li>Muitos preferem à noite para dormir durante o pico</li>
        <li>Outros preferem sexta-feira à noite — passam o pior no fim de semana</li>
      </ul>

      <h2>Remédios complementares</h2>
      <ul>
        <li><strong>Gengibre</strong> (chá, bala) — evidência razoável para náusea</li>
        <li><strong>Hidratação</strong> reforçada — desidratação piora</li>
        <li><strong>Dimenidrinato</strong> (Dramin) — pode ser usado pontualmente, conversar com médico</li>
        <li><strong>Ondansetrona</strong> — antiemético mais forte, prescrição médica</li>
      </ul>

      <h2>Não suba a dose se:</h2>
      <ul>
        <li>Náusea atual ainda é diária</li>
        <li>Você está perdendo refeições inteiras</li>
        <li>Apareceu vômito persistente</li>
      </ul>
      <p>
        Repetir a dose atual por mais 2-4 semanas é <strong>totalmente aceitável</strong>. A titulação da bula é referência, não obrigatoriedade.
      </p>

      <h2>Quando procurar médico</h2>
      <ul>
        <li><strong>Dor abdominal severa e persistente</strong> — pode ser sinal de pancreatite</li>
        <li>Vômito impedindo hidratação por mais de 24h</li>
        <li>Perda de peso muito rápida (&gt;4 kg/semana)</li>
        <li>Febre, icterícia, dor nas costas alta</li>
      </ul>

      <div className="my-8 not-prose">
        <AffiliateBox
          productId="fornecedor_oficial"
          slot="blog-nausea-ozempic"
          peptide="tirzepatida"
        />
      </div>
    </ArticleLayout>
  );
}
