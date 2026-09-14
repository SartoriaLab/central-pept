import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'agua-bacteriostatica-guia';

export const metadata: Metadata = {
  title: 'Água bacteriostática: o que é e quando usar',
  description: 'Entenda o diluente padrão para reconstituição de peptídeos: composição, durabilidade, alternativas e armazenamento correto.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        Toda vez que você vai reconstituir um peptídeo liofilizado, precisa adicionar
        um diluente. O mais recomendado e usado é a <strong>água bacteriostática</strong> —
        mas muitos não sabem exatamente o que diferencia ela de água destilada comum
        ou soro fisiológico. Este guia responde.
      </p>

      <h2>O que é água bacteriostática</h2>
      <p>
        Água bacteriostática é água estéril contendo <strong>0,9% de álcool benzílico</strong>
        {' '}como conservante. O álcool benzílico é bacteriostático (inibe o crescimento
        bacteriano sem necessariamente matar microrganismos) e permite que um frasco
        multi-dose seja perfurado várias vezes com agulha sem que a solução seja
        contaminada entre as aplicações.
      </p>
      <p>
        É o padrão da indústria farmacêutica para diluentes multi-dose. A bula de
        praticamente todos os peptídeos injetáveis cita água bacteriostática como o
        diluente recomendado.
      </p>

      <h2>Por que não usar água destilada?</h2>
      <p>
        Água destilada (ou para injeção sem conservante) é estéril <strong>apenas
        quando o frasco está lacrado</strong>. No momento em que você perfura com a
        agulha, o conteúdo fica exposto a bactérias do ambiente. Sem conservante, a
        solução contamina em poucas horas — e um peptídeo contaminado injetado pode
        causar infecções locais sérias, inclusive abscessos.
      </p>

      <div className="not-prose p-4 rounded-xl bg-red-50 border border-red-200 my-6 text-sm text-red-900 leading-relaxed">
        <strong>⚠️ Regra simples:</strong> se você vai aplicar mais de uma dose do
        mesmo frasco (ou guardar por mais de 24h), use bacteriostática. Sem exceção.
      </div>

      <h2>Durabilidade do frasco reconstituído</h2>
      <p>
        Com água bacteriostática, frascos de peptídeos mantêm estabilidade por:
      </p>
      <ul>
        <li><strong>28 dias refrigerados</strong> (2-8°C) — padrão para semaglutida, tirzepatida, BPC-157, etc.</li>
        <li>
          <strong>3-7 dias em temperatura ambiente</strong> (até 25°C) — varia por
          peptídeo; alguns degradam mais rápido fora da geladeira
        </li>
      </ul>
      <p>
        Esses prazos vêm de estudos de estabilidade da indústria farmacêutica e das
        bulas de referência. Após esse período, a solução pode continuar &quot;parecendo
        certa&quot; mas o peptídeo começa a se degradar e perder potência.
      </p>

      <h2>Onde comprar no Brasil</h2>
      <p>
        A água bacteriostática não é vendida em farmácia comum. As opções:
      </p>
      <ul>
        <li>
          <strong>Farmácias de manipulação</strong> — manipulam sob demanda, geralmente em
          frascos de 10-30 ml. Preço R$ 30-80 por frasco
        </li>
        <li>
          <strong>Lojas especializadas em produtos para pesquisa</strong> — vendem importada, em
          frascos de 30 ml (ex.: McGuff, Hospira). Preço maior mas qualidade pharma
        </li>
        <li>
          <strong>Receita médica</strong> — alguns médicos prescrevem junto com o peptídeo,
          permitindo compra em farmácia hospitalar
        </li>
      </ul>
      <p>
        <strong>Evite:</strong> água &quot;bacteriostática&quot; vendida em marketplaces sem
        procedência (Mercado Livre, AliExpress). Pureza e esterilidade não são
        garantidas.
      </p>

      <h2>Alternativas quando não tem bacteriostática</h2>
      <p>
        <strong>Para aplicação única</strong> (descartar o frasco após uma dose):
      </p>
      <ul>
        <li><strong>Água estéril para injeção</strong> (sem conservante) — aceitável apenas para dose única</li>
        <li><strong>Soro fisiológico 0,9%</strong> — alguns peptídeos aceitam, outros não; confira a bula</li>
      </ul>
      <p>
        <strong>Nunca use:</strong> água da torneira, água filtrada, água mineral, ou
        qualquer água não-estéril. Mesmo fervida, ela contém partículas e
        potencialmente endotoxinas que não devem ser injetadas.
      </p>

      <h2>Armazenamento antes da abertura</h2>
      <p>
        Frasco de água bacteriostática lacrado:
      </p>
      <ul>
        <li>Temperatura ambiente (até 25°C), longe da luz</li>
        <li>Validade de fábrica: geralmente 2 anos</li>
      </ul>
      <p>
        Após a primeira perfuração:
      </p>
      <ul>
        <li>Pode ser mantido em temperatura ambiente</li>
        <li>Usar dentro de <strong>28 dias</strong> pós-abertura</li>
        <li>Limpar a tampa com álcool 70% antes de cada nova perfuração</li>
      </ul>

      <h2>Quantidade padrão para reconstituição</h2>
      <p>
        Não existe &quot;volume certo&quot; universal — depende do peptídeo e da dose que você
        quer. A regra prática:
      </p>
      <ul>
        <li><strong>Frascos até 5 mg</strong>: 1-2 ml de água geralmente funcionam</li>
        <li><strong>Frascos de 10 mg</strong>: 2-3 ml</li>
        <li><strong>Frascos de 30 mg</strong>: 3-5 ml</li>
      </ul>
      <p>
        O objetivo é que cada dose fique entre <strong>10-30 unidades</strong> na
        seringa de insulina — faixa mais fácil de medir com precisão. Use a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link>
        {' '}para encontrar a proporção exata para seu caso.
      </p>

      <h2>Perguntas frequentes rápidas</h2>
      <p>
        <strong>Posso usar água bacteriostática em peptídeos diferentes?</strong><br />
        Sim — a mesma bacteriostática funciona para qualquer peptídeo que aceite
        diluente aquoso (ou seja, quase todos).
      </p>
      <p>
        <strong>E se a bacteriostática ficar turva?</strong><br />
        Descarte. Solução cristalina é o único estado aceitável.
      </p>
      <p>
        <strong>Posso congelar o frasco?</strong><br />
        Não. Congelamento quebra a estrutura do peptídeo após reconstituição.
      </p>

      <div className="my-8 not-prose">
        <AffiliateBox
          productId="fornecedor_oficial"
          slot="blog-agua-bact"
          peptide="tirzepatida"
        />
      </div>
    </ArticleLayout>
  );
}
