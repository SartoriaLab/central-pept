import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';

const SLUG = 'cjc-ipamorelina-como-combinar';
export const metadata: Metadata = {
  title: 'CJC-1295 + Ipamorelina: o combo mais usado, explicado',
  description: 'Por que combinar GHRH (CJC-1295) com GHRP (ipamorelina) potencializa liberação de GH, e limites de segurança.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        <strong>Aviso:</strong> Nem <Link href="/peptideos/cjc-1295">CJC-1295</Link> nem <Link href="/peptideos/ipamorelina">ipamorelina</Link> são aprovados para uso humano. Ambos estão na lista proibida da WADA. Este artigo descreve o uso informal off-label com fins educacionais.
      </p>

      <h2>Por que combinar?</h2>
      <p>Os dois peptídeos agem em receptores diferentes e <strong>sinérgicos</strong> da hipófise:</p>
      <ul>
        <li><strong>CJC-1295</strong> (GHRH analog): estimula GHRH-R → &quot;aumenta o volume&quot; de cada pulso de GH</li>
        <li><strong>Ipamorelina</strong> (GHRP): estimula GHSR-1a → &quot;aumenta a frequência&quot; dos pulsos</li>
      </ul>
      <p>
        Estudos em animais mostram liberação de GH significativamente maior com a combinação do que com qualquer um isolado. É por isso que essa dupla virou o &quot;combo padrão&quot; no meio off-label.
      </p>

      <h2>Protocolo típico informal</h2>
      <ul>
        <li><strong>CJC-1295 sem DAC (Mod GRF 1-29)</strong>: 100 mcg SC</li>
        <li><strong>Ipamorelina</strong>: 200-300 mcg SC</li>
        <li><strong>Frequência</strong>: 2-3× ao dia (manhã, pré-treino, antes de dormir)</li>
        <li><strong>Timing</strong>: estômago vazio, aguardar 30 min antes de comer (insulina atenua GH)</li>
      </ul>

      <h2>Por que CJC-1295 <em>sem</em> DAC?</h2>
      <p>
        A versão <strong>com DAC</strong> tem meia-vida de ~8 dias e mantém GH elevado cronicamente — o que elimina a pulsatilidade fisiológica e pode induzir dessensibilização. A versão <strong>sem DAC</strong> tem meia-vida de ~30 min, permitindo pulsos discretos que imitam o fisiológico.
      </p>

      <h2>Por que ipamorelina e não GHRP-6?</h2>
      <ul>
        <li><strong>Ipamorelina</strong>: seletiva, não eleva cortisol nem prolactina significativamente</li>
        <li><strong>GHRP-6</strong>: estimula apetite intensamente (fome extrema) + eleva cortisol</li>
        <li><strong>GHRP-2</strong>: intermediário, mas ainda eleva cortisol/prolactina mais que ipa</li>
      </ul>

      <h2>Riscos e limites</h2>
      <ul>
        <li>Elevação de IGF-1 pode preocupar em contexto oncológico teórico</li>
        <li>Resistência à insulina transitória com GH alto sustentado</li>
        <li>Retenção hídrica, formigamentos nas mãos, &quot;dormência&quot; (sinal de excesso)</li>
        <li>Uso &gt; 3 meses sem pausa é desaconselhado informalmente</li>
      </ul>

      <h2>Monitoramento mínimo</h2>
      <ul>
        <li>IGF-1 basal e a cada 6-8 semanas</li>
        <li>Glicemia de jejum + HbA1c a cada 3 meses</li>
        <li>Pressão arterial regular</li>
      </ul>

      <h2>Calcular doses com a dupla</h2>
      <p>
        Use a <Link href="/ferramentas/mistura">calculadora de mistura</Link> para combinar os dois no mesmo frasco e descobrir quantas unidades puxar em cada aplicação.
      </p>
    </ArticleLayout>
  );
}
