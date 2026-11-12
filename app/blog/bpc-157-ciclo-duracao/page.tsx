import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';

const SLUG = 'bpc-157-ciclo-duracao';
export const metadata: Metadata = {
  title: 'Ciclo de BPC-157: quanto tempo usar e quando pausar',
  description: 'Protocolos típicos de ciclo de BPC-157 baseados em literatura pré-clínica e uso informal, com orientações de segurança.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        <strong>Aviso:</strong> <Link href="/peptideos/bpc-157">BPC-157</Link> não é aprovado para uso humano em nenhuma jurisdição. A maior parte da evidência de segurança vem de modelos animais. As doses e durações descritas abaixo vêm de literatura pré-clínica e uso off-label — não constituem recomendação médica.
      </p>

      <h2>Protocolo típico para cicatrização aguda</h2>
      <p>Usado informalmente para lesões de tendão, ligamento ou trauma muscular:</p>
      <ul>
        <li><strong>Dose</strong>: 250 mcg subcutâneo, 2× ao dia</li>
        <li><strong>Duração</strong>: 4-6 semanas</li>
        <li><strong>Local da aplicação</strong>: preferencialmente próximo à lesão</li>
      </ul>

      <h2>Protocolo para questões GI (uso experimental)</h2>
      <ul>
        <li><strong>Dose</strong>: 500 mcg oral ou 250 mcg SC, 1-2× ao dia</li>
        <li><strong>Duração</strong>: 2-4 semanas</li>
        <li>Evidência clínica limitada — apenas uso informal</li>
      </ul>

      <h2>Pausas e ciclos</h2>
      <p>Não há dados clínicos robustos para definir pausas obrigatórias. Práticas informais:</p>
      <ul>
        <li><strong>4 semanas on, 2 semanas off</strong> — padrão conservador</li>
        <li><strong>8 semanas on, 4 semanas off</strong> — para uso mais prolongado</li>
        <li>Descontinuar se resolução da lesão ou efeito atingido</li>
      </ul>

      <h2>Preocupações de longo prazo</h2>
      <ul>
        <li><strong>Angiogênese</strong>: efeito pró-angiogênico pode ser desejável para cura, mas teoricamente problemático em contexto neoplásico. Evitar em quem tem câncer ativo ou histórico recente.</li>
        <li><strong>Segurança humana</strong>: estudos em humanos são escassos. Relatos anedóticos de boa tolerância, mas sem dados sistemáticos de segurança &gt; 12 semanas.</li>
        <li><strong>Qualidade do composto</strong>: mercado cinza tem contaminação frequente. Busque COA.</li>
      </ul>

      <h2>Como calcular dose</h2>
      <p>
        Use a <Link href="/ferramentas/reconstituicao?peptide=bpc-157">calculadora</Link> com BPC-157 pré-selecionado. Protocolo comum: frasco 5 mg + 2 ml de água = 2,5 mg/ml → dose de 250 mcg = 10 unidades na seringa.
      </p>

      <h2>Quando procurar médico</h2>
      <ul>
        <li>Dor, febre ou vermelhidão no local da injeção</li>
        <li>Qualquer sintoma sistêmico incomum (palpitação, falta de ar, náusea persistente)</li>
        <li>Antes de iniciar qualquer protocolo, especialmente com comorbidades ou medicamentos em uso</li>
      </ul>
    </ArticleLayout>
  );
}
