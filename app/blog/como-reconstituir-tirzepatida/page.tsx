import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'como-reconstituir-tirzepatida';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Posso usar 1 ml ou 2 ml de água, tanto faz?',
    a: 'A dose final é a mesma; o que muda é o volume que você puxa na seringa. Com mais água, a concentração fica menor e as doses baixas ocupam mais unidades, o que facilita medir com precisão. Com menos água, doses altas cabem em uma única seringa. Escolha pela dose que vai usar e anote a concentração no frasco.',
  },
  {
    q: 'Ficou turvo, e agora?',
    a: 'Não use. Tirzepatida reconstituída corretamente fica límpida e incolor. Turvação, partículas ou cor amarelada indicam contaminação, peptídeo degradado ou agitação excessiva. Descarte e reconstitua um frasco novo.',
  },
  {
    q: 'Quantas unidades são 5 mg de tirzepatida?',
    a: 'Depende da concentração. A 5 mg/ml (frasco de 10 mg com 2 ml de água), 5 mg = 100 unidades. A 10 mg/ml (frasco de 10 mg com 1 ml), 5 mg = 50 unidades. Sem saber quanta água foi usada, não existe resposta — por isso a etiqueta no frasco é obrigatória.',
  },
  {
    q: 'Posso reconstituir com água para injeção comum?',
    a: 'Só se for usar o frasco inteiro no mesmo dia. Água para injeção não tem conservante; em poucos dias o frasco contamina. Para uso ao longo de semanas, a água bacteriostática (com 0,9% de álcool benzílico) é a única opção segura.',
  },
  {
    q: 'Tirzepatida reconstituída dura quanto tempo?',
    a: 'A convenção de segurança é 28 dias na geladeira, entre 2 e 8 °C, protegida da luz. Não é que o peptídeo deixe de existir no dia 29, mas a partir daí a perda de potência e o risco microbiológico deixam de ser previsíveis.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        O frasco de tirzepatida vem em pó liofilizado. A dose que você aplica depende de{' '}
        <strong>quanta água você coloca</strong> e de <strong>quantas unidades puxa na
        seringa</strong>. Errar essa conta é o erro mais comum — e o mais perigoso — de quem
        sai da caneta, onde a dose vem pronta, para o frasco, onde a dose é você quem faz.
      </p>
      <p>
        Este guia mostra o material, o passo a passo e uma tabela pronta com as unidades para
        cada combinação de frasco e dose. A fórmula por trás de tudo, para seringa de insulina
        de 100 U/ml, é: <strong>unidades = dose (mg) × água (ml) × 100 ÷ mg do frasco</strong>.
      </p>

      <h2>Material</h2>
      <ul>
        <li>Frasco de tirzepatida liofilizada (5, 10 ou 15 mg)</li>
        <li>
          <Link href="/blog/agua-bacteriostatica-guia">Água bacteriostática</Link> (com
          0,9% de álcool benzílico)
        </li>
        <li>Seringa de 3 ml com agulha, para transferir a água</li>
        <li>Seringas de insulina 100 U (de 30, 50 ou 100 U), uma por aplicação</li>
        <li>Álcool 70% e algodão</li>
      </ul>

      <h2>Passo a passo</h2>
      <ol>
        <li>Higienize as mãos e passe álcool 70% nas tampas de borracha dos dois frascos.</li>
        <li>
          Puxe a água na seringa de 3 ml: <strong>1 ml para frasco de 5 mg</strong>,{' '}
          <strong>2 ml para frascos de 10 e 15 mg</strong> (ou outro volume, conforme a
          tabela abaixo).
        </li>
        <li>
          Injete a água <strong>devagar, escorrendo pela parede</strong> do frasco. Nunca
          direto no pó: o jato quebra a estrutura do peptídeo.
        </li>
        <li>
          Gire suavemente o frasco entre as mãos. <strong>Não agite.</strong> O pó dissolve
          em 1-2 minutos e a solução fica límpida.
        </li>
        <li>Espere 5 minutos e olhe contra a luz: não pode haver partículas nem turvação.</li>
        <li>
          Etiquete o frasco com data e concentração. Exemplo: <em>"10 mg / 2 ml = 5 mg/ml"</em>.
          Sem isso, na semana seguinte você não sabe quantas unidades puxar.
        </li>
        <li>Geladeira, entre 2 e 8 °C, longe da porta e da luz.</li>
      </ol>

      <h2>Tabela pronta: unidades na seringa por dose</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Frasco</th>
              <th>Água</th>
              <th>Concentração</th>
              <th>2,5 mg</th>
              <th>5 mg</th>
              <th>7,5 mg</th>
              <th>10 mg</th>
              <th>12,5 mg</th>
              <th>15 mg</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>5 mg</td><td>1 ml</td><td>5 mg/ml</td><td>50 U</td><td>100 U</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
            <tr><td>10 mg</td><td>1 ml</td><td>10 mg/ml</td><td>25 U</td><td>50 U</td><td>75 U</td><td>100 U</td><td>—</td><td>—</td></tr>
            <tr><td>10 mg</td><td>2 ml</td><td>5 mg/ml</td><td>50 U</td><td>100 U</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
            <tr><td>15 mg</td><td>1,5 ml</td><td>10 mg/ml</td><td>25 U</td><td>50 U</td><td>75 U</td><td>100 U</td><td>—</td><td>—</td></tr>
            <tr><td>15 mg</td><td>3 ml</td><td>5 mg/ml</td><td>50 U</td><td>100 U</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>"—"</strong> = a dose não cabe em uma seringa de 100 U nessa concentração.
        Use menos água ou divida em duas aplicações no mesmo momento. Doses de 12,5 e 15 mg
        pedem concentração de 10 mg/ml (125 U e 150 U, ou seja, duas seringas) ou frasco de
        15 mg com apenas 1 ml de água (15 mg/ml: 12,5 mg = 83 U; 15 mg = 100 U).
      </p>
      <p>
        Para qualquer combinação fora da tabela, a{' '}
        <Link href="/ferramentas/reconstituicao?peptide=tirzepatida">calculadora de reconstituição</Link>{' '}
        faz a conta e desenha a seringa com a marcação exata.
      </p>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-reconstituir-tirze-mid" peptide="tirzepatida" />
      </div>

      <h2>Quantas doses rende cada frasco</h2>
      <ul>
        <li><strong>5 mg</strong>: 2 doses de 2,5 mg</li>
        <li><strong>10 mg</strong>: 4 doses de 2,5 mg, 2 de 5 mg ou 1 de 10 mg</li>
        <li><strong>15 mg</strong>: 6 doses de 2,5 mg, 3 de 5 mg, 2 de 7,5 mg ou 1 de 15 mg</li>
      </ul>
      <p>
        Lembre que o frasco reconstituído dura <strong>28 dias</strong> na geladeira. Um
        frasco de 15 mg na dose de 2,5 mg renderia 6 semanas — vai vencer antes de acabar.
        Nessa fase inicial, o frasco de 10 mg fecha a conta certinha em 4 semanas. A
        comparação de custo por dose está em{' '}
        <Link href="/blog/tirzepatida-preco-quanto-custa">quanto custa tirzepatida</Link>.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Agitar o frasco</strong>: desnatura o peptídeo e forma espuma que atrapalha a medida.</li>
        <li><strong>Água destilada ou soro em vez de bacteriostática</strong>: sem conservante, o frasco contamina em dias.</li>
        <li><strong>Não anotar a concentração</strong> e errar a dose na semana seguinte — para mais ou para menos.</li>
        <li><strong>Confundir "unidades" com "mg"</strong>: 50 unidades não são 50 mg; são 0,5 ml da solução que você preparou.</li>
        <li><strong>Reutilizar seringa</strong>: agulha romba dói mais e leva contaminação para dentro do frasco.</li>
        <li>
          <strong>Pular a titulação</strong>: começar em 5 ou 7,5 mg multiplica náusea e
          vômito. A <Link href="/ferramentas/titulacao">calculadora de titulação</Link> monta
          a escada a partir de 2,5 mg.
        </li>
      </ul>

      <h2>Armazenamento</h2>
      <ul>
        <li><strong>Pó liofilizado</strong>: geladeira. Aceita alguns dias fora, por exemplo durante o transporte.</li>
        <li><strong>Reconstituído</strong>: geladeira entre 2 e 8 °C, até 28 dias, longe da luz. Nunca congele: o gelo destrói o peptídeo.</li>
        <li><strong>Viagem</strong>: bolsa térmica com gelo reutilizável, sem contato direto do frasco com o gelo.</li>
      </ul>
      <p>
        Os princípios são os mesmos das canetas de GLP-1; o guia de{' '}
        <Link href="/blog/como-guardar-ozempic-wegovy">como guardar Ozempic e Wegovy</Link>{' '}
        detalha os cuidados com temperatura.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-reconstituir-tirze" peptide="tirzepatida" />
      </div>
    </ArticleLayout>
  );
}
