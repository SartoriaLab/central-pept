import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'como-reconstituir-semaglutida';

export const metadata: Metadata = {
  title: 'Como reconstituir semaglutida: passo a passo completo',
  description: 'Guia prático e seguro de reconstituição de semaglutida: proporções, cálculo de dose e armazenamento do frasco.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        A semaglutida (Ozempic®, Wegovy®, Rybelsus®) é hoje o agonista GLP-1 mais usado
        no Brasil tanto para controle glicêmico quanto para manejo de peso. Quando
        comprada em frasco (não pen), ela vem como pó liofilizado e precisa ser
        reconstituída com água bacteriostática antes do uso. Este guia explica o
        procedimento passo a passo.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> a semaglutida em pen (canetas Ozempic/Wegovy) já vem pronta
        para uso e <strong>não</strong> precisa de reconstituição. Este guia trata apenas
        dos frascos com pó.
      </div>

      <h2>O que você vai precisar</h2>
      <ul>
        <li><strong>Frasco de semaglutida</strong> (tipicamente 3 mg ou 5 mg)</li>
        <li><strong>Água bacteriostática</strong> (solução 0,9% com álcool benzílico)</li>
        <li><strong>Seringa de insulina</strong> (100 U/ml — as mais comuns têm 50 U)</li>
        <li><strong>Agulha extra</strong> para aspirar a água (opcional, reduz contaminação)</li>
        <li><strong>Álcool 70%</strong> e algodão</li>
      </ul>

      <h2>Passo 1 — Preparação</h2>
      <ol>
        <li>Lave as mãos com água e sabão</li>
        <li>Limpe a tampa de borracha do frasco de semaglutida e do frasco de água bacteriostática com álcool 70%</li>
        <li>Deixe secar ao ar por 10 segundos</li>
      </ol>

      <h2>Passo 2 — Decidir a proporção</h2>
      <p>
        Esta é a etapa onde mais gente erra. A quantidade de água que você adiciona
        determina a concentração final — e portanto quantas unidades da seringa você
        vai precisar puxar em cada dose.
      </p>
      <p>
        Regra geral: <strong>use a{' '}
        <Link href="/ferramentas/reconstituicao?peptide=semaglutida">calculadora de reconstituição</Link>
        {' '}</strong>para evitar erros. Como referência, combinações comuns com frasco de 5 mg:
      </p>

      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th>Frasco</th><th>Água</th><th>Concentração</th><th>Dose 0,25 mg</th></tr>
          </thead>
          <tbody>
            <tr><td>5 mg</td><td>1 ml</td><td>5 mg/ml</td><td>5 U</td></tr>
            <tr><td>5 mg</td><td>2 ml</td><td>2,5 mg/ml</td><td>10 U</td></tr>
            <tr><td>5 mg</td><td>3 ml</td><td>1,67 mg/ml</td><td>15 U</td></tr>
          </tbody>
        </table>
      </div>

      <p>
        <strong>Dica:</strong> 10-30 U na seringa é a faixa mais fácil de medir com
        precisão. Se sua dose ficar abaixo de 5 U, considere adicionar mais água.
      </p>

      <h2>Passo 3 — Aspirar a água</h2>
      <ol>
        <li>Introduza a seringa no frasco de água bacteriostática</li>
        <li>Aspire o volume calculado (ex.: 100 U = 1 ml)</li>
        <li>Retire as bolhas de ar batendo levemente na seringa</li>
      </ol>

      <h2>Passo 4 — Adicionar ao frasco</h2>
      <ol>
        <li>Introduza a agulha no frasco de semaglutida <strong>pela lateral</strong>, deixando a água escorrer pela parede interna</li>
        <li><strong>Não</strong> injete diretamente sobre o pó — pode danificar o peptídeo</li>
        <li>Retire a agulha sem misturar agressivamente</li>
      </ol>

      <h2>Passo 5 — Dissolução</h2>
      <p>
        Gire o frasco suavemente entre as palmas das mãos por 30-60 segundos.{' '}
        <strong>Nunca agite</strong> — a agitação desnatura o peptídeo. Espere até que
        a solução fique completamente transparente. Se ficar turva após 5 minutos de
        espera, o frasco pode estar comprometido — descarte.
      </p>

      <h2>Passo 6 — Armazenamento</h2>
      <ul>
        <li><strong>Geladeira</strong> (2-8°C), na prateleira central — nunca no freezer nem na porta</li>
        <li>Duração: <strong>28 dias</strong> após reconstituição (recomendação de bula)</li>
        <li>Use uma <Link href="/ferramentas/reconstituicao">etiqueta</Link> com data de reconstituição e concentração</li>
      </ul>

      <h2>Passo 7 — Aplicação</h2>
      <ol>
        <li>Limpe o local da injeção (abdome, coxa ou braço) com álcool 70%</li>
        <li>Puxe a dose calculada com a seringa</li>
        <li>Aplique via subcutânea em 90° (agulha curta de insulina) ou 45° (agulhas mais longas)</li>
        <li>Descarte a seringa em recipiente apropriado (nunca no lixo comum)</li>
      </ol>

      <h2>Erros comuns a evitar</h2>
      <ul>
        <li><strong>Agitar o frasco:</strong> desnatura o peptídeo</li>
        <li><strong>Usar água destilada em vez de bacteriostática:</strong> sem conservante, o frasco contamina em ~24h</li>
        <li><strong>Reutilizar agulha:</strong> perde esterilidade e fica sem corte</li>
        <li><strong>Armazenar em temperatura ambiente por &gt;24h:</strong> degrada a molécula</li>
        <li><strong>Calcular "no olho":</strong> erros de dose em GLP-1 podem causar náusea severa</li>
      </ul>

      <h2>Próximos passos</h2>
      <p>
        Depois de ter o frasco reconstituído, o próximo cálculo importante é a{' '}
        <strong>titulação</strong> — você começa em dose baixa (0,25 mg/semana) e sobe
        gradualmente. Use a{' '}
        <Link href="/ferramentas/reconstituicao?peptide=semaglutida">calculadora</Link>{' '}
        para ajustar cada etapa sem precisar rediluir.
      </p>
      <p>
        Para ver os dados completos da semaglutida — meia-vida, mecanismo, efeitos e
        referências da FDA — acesse a{' '}
        <Link href="/peptideos/semaglutida">ficha técnica da semaglutida</Link>.
      </p>

      <div className="my-8 not-prose">
        <AffiliateBox
          productId="fornecedor_oficial"
          slot="blog-reconstituir-sema"
          peptide="tirzepatida"
        />
      </div>
    </ArticleLayout>
  );
}
