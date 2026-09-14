import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'tirzepatida-manipulada-seguranca';
export const metadata: Metadata = {
  title: 'Tirzepatida manipulada é segura? Cuidados ao usar',
  description: 'Diferenças entre Mounjaro industrializado e tirzepatida manipulada: controle de qualidade, sinais de confiabilidade e riscos.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      <p>
        Tirzepatida manipulada é cerca de <strong>60-70% mais barata</strong> que Mounjaro industrializado e virou alternativa comum no Brasil. Mas &quot;manipulada&quot; não garante &quot;equivalente&quot;. Este guia explica o que investigar antes.
      </p>

      <h2>O que é peptídeo manipulado</h2>
      <p>
        Farmácias de manipulação compram tirzepatida como matéria-prima de fornecedores (frequentemente chineses) e fracionam em frascos menores. Não é o mesmo produto do Mounjaro — a Lilly tem patente, e o composto manipulado é <em>cópia</em>, não genérico.
      </p>

      <h2>Riscos potenciais</h2>
      <ul>
        <li><strong>Pureza variável</strong>: matérias-primas de fornecedores não farmacêuticos podem ter impurezas &gt; 2%</li>
        <li><strong>Estabilidade não comprovada</strong>: sem estudos de estabilidade equivalentes à indústria</li>
        <li><strong>Dose imprecisa</strong>: pode haver ±20% de variação real vs rótulo</li>
        <li><strong>Contaminação microbiana</strong>: risco maior em farmácias sem validação adequada</li>
      </ul>

      <h2>Sinais de uma farmácia confiável</h2>
      <ul>
        <li>Registro ANVISA + alvará de vigilância sanitária visíveis</li>
        <li>Fornece <strong>COA (Certificado de Análise)</strong> do peptídeo com cada frasco</li>
        <li>Mostra resultado de HPLC (pureza)</li>
        <li>Tem farmacêutico responsável técnico identificado</li>
        <li>Prescrição médica obrigatória — fuja se vender sem receita</li>
      </ul>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-tirze-manipulada-mid" peptide="tirzepatida" />
      </div>

      <h2>Como usar com segurança</h2>
      <ul>
        <li>Armazenar refrigerado (2-8°C) desde o recebimento</li>
        <li>Reconstituir com <Link href="/blog/agua-bacteriostatica-guia">água bacteriostática</Link></li>
        <li>Usar <Link href="/ferramentas/reconstituicao?peptide=tirzepatida">calculadora de reconstituição</Link> para dose exata</li>
        <li>Começar em dose baixa mesmo se experiência prévia com Mounjaro</li>
        <li>Acompanhamento clínico periódico (peso, glicemia, pressão)</li>
      </ul>

      <h2>Comparativo</h2>
      <ul>
        <li><strong>Mounjaro</strong>: controle FDA-grade, dose exata, pen descartável pronto</li>
        <li><strong>Manipulada</strong>: custo menor, qualidade variável, requer reconstituição e cálculo</li>
      </ul>
      <p>
        Se o orçamento permite, industrializado é sempre mais seguro. Se o preço é barreira, manipulada pode ser opção <em>com farmácia validada</em> e acompanhamento médico — não como escolha &quot;de primeira&quot;.
      </p>

      <h2>Leia também</h2>
      <ul>
        <li><Link href="/blog/onde-comprar-tirzepatida">Onde comprar tirzepatida com segurança</Link></li>
        <li><Link href="/blog/tirzepatida-preco-quanto-custa">Quanto custa tirzepatida por dose</Link></li>
        <li><Link href="/blog/como-reconstituir-tirzepatida">Como reconstituir tirzepatida 5, 10 e 15 mg</Link></li>
        <li><Link href="/blog/mounjaro-falso-como-identificar">Mounjaro falso: como identificar</Link></li>
      </ul>

      <div className="my-8 not-prose">
        <AffiliateBox
          productId="fornecedor_oficial"
          slot="blog-tirze-manipulada"
          peptide="tirzepatida"
        />
      </div>
    </ArticleLayout>
  );
}
