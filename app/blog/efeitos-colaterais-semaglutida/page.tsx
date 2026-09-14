import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'efeitos-colaterais-semaglutida';
export const metadata: Metadata = {
  title: 'Semaglutida faz mal? Efeitos colaterais documentados',
  description: 'Revisão dos efeitos adversos da semaglutida a partir dos ensaios STEP, SUSTAIN e relatórios pós-comercialização.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        <Link href="/peptideos/semaglutida">Semaglutida</Link> é um dos medicamentos mais estudados da última década. Os efeitos colaterais estão bem mapeados — este artigo resume os documentados em ensaios clínicos e monitoramento pós-comercialização.
      </p>

      <h2>Efeitos muito comuns (&gt;10% dos pacientes)</h2>
      <ul>
        <li><strong>Náusea</strong> — até 44% em dose 2,4 mg (Wegovy). Geralmente transitória, picos durante titulação.</li>
        <li><strong>Diarreia</strong> — ~30%</li>
        <li><strong>Vômito</strong> — ~25%</li>
        <li><strong>Constipação</strong> — ~24%</li>
        <li><strong>Dor abdominal</strong> — ~20%</li>
      </ul>

      <h2>Efeitos comuns (1-10%)</h2>
      <ul>
        <li>Dispepsia, eructação, flatulência</li>
        <li>Reações no local da injeção</li>
        <li>Fadiga</li>
        <li>Tontura</li>
        <li>Hipoglicemia quando combinada com insulina/sulfonilureias</li>
      </ul>

      <h2>Efeitos sérios (raros, mas importantes)</h2>
      <ul>
        <li><strong>Pancreatite aguda</strong> — incidência ~0,3% vs 0,2% placebo. Sinal: dor abdominal severa persistente.</li>
        <li><strong>Cálculos biliares</strong> — aumento de risco relacionado à perda rápida de peso.</li>
        <li><strong>Retinopatia diabética</strong> em pacientes com DM2 pré-existente (SUSTAIN-6).</li>
        <li><strong>Gastroparesia</strong> — casos raros mas documentados no FAERS pós-comercialização.</li>
        <li><strong>Reações de hipersensibilidade</strong> — incluindo anafilaxia.</li>
      </ul>

      <h2>Contraindicações absolutas</h2>
      <ul>
        <li>História pessoal ou familiar de <strong>carcinoma medular de tireoide</strong> (CMT)</li>
        <li>Síndrome de <strong>Neoplasia Endócrina Múltipla tipo 2</strong> (NEM 2)</li>
        <li>Hipersensibilidade grave a semaglutida ou excipientes</li>
        <li>Gravidez (classificação FDA X para obesidade)</li>
      </ul>

      <h2>Como minimizar efeitos GI</h2>
      <ul>
        <li>Respeitar titulação de dose (4+ semanas por etapa)</li>
        <li>Refeições menores e mais frequentes</li>
        <li>Evitar gordura e frituras durante náusea</li>
        <li>Hidratação reforçada</li>
        <li>Gengibre ou medicação sintomática (dimenidrinato) conforme médico</li>
      </ul>
      <p>
        Se náusea persistir, veja o guia de <Link href="/blog/nausea-ozempic-como-lidar">como lidar com náusea</Link>.
      </p>

      <h2>Fontes</h2>
      <ul>
        <li>FDA Label Ozempic (2025)</li>
        <li>FDA Label Wegovy (2023)</li>
        <li>STEP-1 NEJM 2021</li>
        <li>FAERS — FDA Adverse Event Reporting System</li>
      </ul>

      <div className="my-8 not-prose">
        <AffiliateBox
          productId="fornecedor_oficial"
          slot="blog-efeitos-colaterais"
          peptide="tirzepatida"
        />
      </div>
    </ArticleLayout>
  );
}
