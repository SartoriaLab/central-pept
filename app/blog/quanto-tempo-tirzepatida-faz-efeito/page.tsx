import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';

const SLUG = 'quanto-tempo-tirzepatida-faz-efeito';
export const metadata: Metadata = {
  title: 'Quanto tempo a tirzepatida (Mounjaro) leva para fazer efeito?',
  description:
    'Apetite, glicemia e peso respondem em prazos diferentes. Veja o que esperar nas primeiras semanas, quando chega a dose de manutenção e o resultado em 72 semanas.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        A <Link href="/peptideos/tirzepatida">tirzepatida</Link> começa a agir depois da primeira
        aplicação, mas o resultado que as pessoas procuram — glicemia controlada, quilos a menos — leva
        meses. O motivo é simples: o tratamento começa por uma dose baixa e sobe aos poucos.
      </p>

      <h2>O que acontece no corpo após a aplicação</h2>
      <ul>
        <li><strong>Pico no sangue:</strong> entre 8 e 72 horas depois da injeção.</li>
        <li><strong>Meia-vida:</strong> cerca de 5 dias — por isso a aplicação é semanal.</li>
        <li>
          <strong>Concentração estável:</strong> atingida após cerca de 4 semanas de aplicações semanais
          na mesma dose.
        </li>
      </ul>
      <p>
        Na prática: cada vez que a dose muda, o organismo leva em torno de um mês para chegar ao novo
        patamar. É por isso que a bula pede pelo menos 4 semanas em cada degrau.
      </p>

      <h2>Linha do tempo</h2>

      <h3>Semanas 1 a 4 — 2,5 mg (dose inicial)</h3>
      <p>
        A dose inicial serve para o corpo se acostumar. Na bula do Zepbound, 2,5 mg é dose de início, não
        aprovada como manutenção; no diabetes, ela já reduz a glicose. Muita gente percebe menos fome e saciedade mais rápida já nos primeiros
        dias. Também é quando surgem os primeiros efeitos gastrointestinais. Alguma perda de peso pode
        aparecer, mas não é o objetivo desta fase.
      </p>

      <h3>Semanas 5 a 8 — 5 mg (primeira dose de manutenção)</h3>
      <p>
        É a menor dose de manutenção prevista em bula. A glicemia de jejum cai de forma mais consistente
        e a perda de peso passa a ser regular.
      </p>

      <h3>Semanas 9 a 20 — subida até 10 ou 15 mg</h3>
      <p>
        Se for preciso mais efeito, a dose sobe 2,5 mg a cada 4 semanas ou mais. Quem vai até 15 mg só
        chega lá na 21ª semana — cinco meses depois de começar. Nem todos precisam da dose máxima: 5, 10
        e 15 mg são todas doses de manutenção.
      </p>

      <h3>Meses 6 a 18 — resultado pleno</h3>
      <p>
        Nos estudos de obesidade, o peso continuou caindo por mais de um ano antes de estabilizar. O
        resultado final só é medido depois de 72 semanas.
      </p>

      <h2>O que os estudos mediram</h2>
      <p>No SURMOUNT-1 (obesidade ou sobrepeso sem diabetes, 72 semanas, com dieta e exercício):</p>
      <ul>
        <li>Perda média de peso: <strong>15,0%</strong> (5 mg), <strong>19,5%</strong> (10 mg) e <strong>20,9%</strong> (15 mg), contra 3,1% no placebo</li>
        <li>Perderam 5% ou mais do peso: 85%, 89% e 91% dos participantes, contra 35%</li>
        <li>Perderam 20% ou mais: 50% (10 mg) e 57% (15 mg), contra 3%</li>
      </ul>
      <p>
        No SURPASS-2 (diabetes tipo 2, 40 semanas), a hemoglobina glicada caiu de 2,01 a 2,30 pontos
        percentuais, conforme a dose. Como a HbA1c reflete a média de glicose dos últimos 2 a 3 meses, o
        exame só mostra o efeito completo depois desse intervalo em dose estável.
      </p>

      <h2>Por que cada pessoa responde em um ritmo</h2>
      <ul>
        <li><strong>Dose atual</strong> — quem ainda está em 2,5 ou 5 mg não deve se comparar com resultados de 15 mg</li>
        <li><strong>Diabetes</strong> — pessoas com diabetes tipo 2 costumam perder menos peso que pessoas sem diabetes</li>
        <li><strong>Alimentação e atividade física</strong> — os estudos incluíram orientação de dieta e exercício</li>
        <li><strong>Regularidade</strong> — doses puladas quebram a concentração estável</li>
        <li><strong>Peso inicial, sono, outros medicamentos</strong> e variação individual</li>
      </ul>

      <h2>E se parecer que não está funcionando?</h2>
      <ul>
        <li>
          Confira há quanto tempo você está em dose de manutenção. Antes de 3 meses em dose estável é cedo
          para concluir.
        </li>
        <li>
          Em frasco, confirme a conta de diluição e as unidades na seringa — erro de dose é causa
          frequente de &quot;não fez efeito&quot;. Use a{' '}
          <Link href="/ferramentas/reconstituicao/tirzepatida">calculadora de tirzepatida</Link>.
        </li>
        <li>
          Verifique armazenamento e procedência: produto mal conservado ou falsificado perde efeito. Veja{' '}
          <Link href="/blog/mounjaro-falso-como-identificar">como identificar Mounjaro falso</Link>.
        </li>
        <li>Leve o registro de peso e doses à consulta; a decisão de subir a dose é do médico.</li>
      </ul>
      <p>
        Não aumente a dose por conta própria nem encurte o intervalo entre degraus: isso aumenta os{' '}
        <Link href="/blog/efeitos-colaterais-tirzepatida">efeitos colaterais</Link> sem acelerar o
        resultado.
      </p>

      <h2>Planeje as datas</h2>
      <p>
        A <Link href="/ferramentas/titulacao">calculadora de subida de dose</Link> monta o calendário
        semana a semana a partir da data da primeira aplicação, e a{' '}
        <Link href="/ferramentas/tabela-doses-glp1">tabela de doses para imprimir</Link> traz a escada
        completa com espaço para registrar cada aplicação.
      </p>
    </ArticleLayout>
  );
}
