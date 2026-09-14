import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'sermorelina-o-que-e';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'A sermorelina é aprovada?',
    a: 'Foi. A FDA aprovou a sermorelina em 1990 como Geref (EMD Serono), para diagnóstico de função pituitária e para tratamento de deficiência idiopática de GH em crianças. O produto foi descontinuado em 2008 por decisão comercial — e em 2013 a própria FDA publicou determinação formal de que a retirada não teve relação com segurança ou eficácia. Hoje não há mais produto aprovado: nos EUA ela existe apenas via farmácias de manipulação (off-label) e, no Brasil, não há registro ativo na ANVISA.',
  },
  {
    q: 'Qual a diferença entre sermorelina e os GHRPs (ipamorelina)?',
    a: 'São classes diferentes que agem em receptores diferentes. A sermorelina é um análogo do GHRH (GRF 1-29) e ativa o receptor de GHRH nos somatotrofos. A ipamorelina é um GHRP (secretagogo) que age no receptor da grelina (GHSR-1a). Como os dois mecanismos são distintos, em protocolos off-label costumam ser vistos como complementares. Veja a comparação lado a lado em ipamorelina vs sermorelina.',
  },
  {
    q: 'Sermorelina engorda ou emagrece?',
    a: 'A sermorelina não é um medicamento para peso. Ela estimula a liberação natural e pulsátil de GH, e o GH tem efeitos metabólicos — mas não existem ensaios modernos demonstrando perda de peso clinicamente relevante com sermorelina. Sua indicação histórica aprovada era diagnóstica e para deficiência de GH em crianças, não controle de peso em adultos.',
  },
  {
    q: 'A sermorelina pega no antidoping?',
    a: 'Sim. A sermorelina é proibida pela WADA na categoria S2 (hormônios peptídicos, fatores de crescimento e substâncias relacionadas), dentro e fora de competição. Atletas sujeitos a controle antidopagem não devem utilizá-la.',
  },
  {
    q: 'Qual a dose de sermorelina?',
    a: 'Não existe mais dose de bula ativa. No uso diagnóstico histórico (Geref) empregava-se cerca de 0,3 µg/kg por via intravenosa. Em manipulação atual off-label, descrevem-se cerca de 0,2-0,5 mg por via subcutânea à noite. Como o produto não tem registro ativo, não há posologia oficial validada, e qualquer uso ocorre sem endosso regulatório.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        A sermorelina foi um dos primeiros análogos do hormônio liberador de GH (GHRH)
        a chegar ao mercado como medicamento aprovado. Chegou a ter registro na FDA sob
        o nome Geref, mas hoje está fora das prateleiras — o que gera bastante confusão
        sobre o seu status. Este artigo explica o que ela é, como estimula o hormônio do
        crescimento e por que saiu do mercado.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> a sermorelina foi <strong>descontinuada em 2008
        por decisão comercial</strong> — não por questão de segurança. Hoje ela existe
        apenas via <strong>manipulação, em uso off-label</strong>, <strong>sem registro
        ativo na ANVISA</strong>, e é <strong>proibida no esporte pela WADA</strong>. Este
        artigo é informativo e não é indicação de uso.
      </div>

      <h2>O que é a sermorelina (GRF 1-29)</h2>
      <p>
        A sermorelina corresponde aos <strong>29 primeiros aminoácidos do GHRH endógeno
        humano</strong> — por isso o nome técnico GRF 1-29. Esse é o menor fragmento da
        molécula que ainda preserva toda a atividade biológica do hormônio nativo. Em
        outras palavras, é uma versão encurtada do próprio sinal que o corpo usa para
        pedir mais hormônio do crescimento.
      </p>
      <p>
        Ela foi aprovada pela FDA em 1990 como <strong>Geref</strong> (EMD Serono), com
        duas finalidades: diagnóstico da função pituitária e tratamento da deficiência
        idiopática de GH em crianças. Para ver os dados técnicos completos — meia-vida,
        faixa de dose e referências —, consulte a{' '}
        <Link href="/peptideos/sermorelina">ficha técnica da sermorelina</Link>.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th>Dado</th><th>Valor</th></tr>
          </thead>
          <tbody>
            <tr><td>Classe</td><td>Análogo do GHRH (GRF 1-29)</td></tr>
            <tr><td>Meia-vida</td><td>~11-12 minutos</td></tr>
            <tr><td>Dose diagnóstica histórica (Geref)</td><td>~0,3 µg/kg IV</td></tr>
            <tr><td>Uso off-label em manipulação</td><td>~0,2-0,5 mg SC à noite</td></tr>
            <tr><td>Status regulatório</td><td>Descontinuada / sem registro ativo</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Como funciona: agonista de GHRH e GH pulsátil</h2>
      <p>
        A sermorelina é um <strong>agonista do receptor de GHRH</strong> (GHRH-R) nos
        somatotrofos da hipófise anterior. Ao se ligar a esse receptor, ela ativa a
        enzima adenilato ciclase e eleva o cAMP intracelular, estimulando a síntese e a
        <strong> liberação pulsátil de GH</strong> — ou seja, ela não injeta o hormônio,
        e sim faz a hipófise liberar o seu próprio.
      </p>
      <p>
        Dois detalhes importam. Primeiro: por preservar a pulsatilidade fisiológica e
        depender de estoques hipofisários funcionantes, a sermorelina era classicamente
        usada como <strong>teste diagnóstico da reserva de GH</strong>. Segundo: ela é
        rapidamente degradada pela enzima DPP-IV e por outras proteases do sangue, o que
        explica a meia-vida curtíssima, de apenas <strong>~11-12 minutos</strong>.
      </p>

      <h2>Por que saiu do mercado (Geref e a FDA em 2013)</h2>
      <p>
        Aqui mora a principal fonte de confusão. O Geref foi{' '}
        <strong>descontinuado em 2008 por decisão comercial</strong> do fabricante — não
        por problemas de segurança ou de eficácia. Isso não é especulação: em 2013 a
        própria FDA publicou uma <strong>determinação formal</strong> de que o produto
        não havia sido retirado do mercado por razões de segurança ou efetividade.
      </p>
      <p>
        Essa distinção é relevante porque, na prática, ela abriu caminho para o uso via
        manipulação nos EUA. Mas atenção: <strong>&ldquo;não retirado por segurança&rdquo; não é
        o mesmo que &ldquo;aprovado hoje&rdquo;</strong>. Não existe mais um produto de sermorelina
        com aprovação vigente — o registro de referência deixou de ser comercializado.
      </p>

      <h2>Uso off-label hoje</h2>
      <p>
        Sem um produto aprovado, a sermorelina passou a circular quase exclusivamente por
        <strong> farmácias de manipulação</strong>, sobretudo nos EUA, para uso{' '}
        <strong>off-label em adultos</strong> — geralmente com apelo &ldquo;anti-idade&rdquo;,
        desempenho ou composição corporal. Nada disso tem endosso da FDA, e a maior parte
        desses usos nunca foi avaliada em ensaios regulatórios.
      </p>
      <p>
        No ambiente off-label, é comum ver a sermorelina (ou outros análogos de GHRH)
        associada a secretagogos da classe dos GHRPs, como a{' '}
        <Link href="/peptideos/ipamorelina">ipamorelina</Link>, pela ideia de que os dois
        mecanismos se somam. A combinação mais falada nesse contexto é a de CJC-1295 com
        ipamorelina, discutida em{' '}
        <Link href="/blog/cjc-ipamorelina-como-combinar">como combinar CJC-1295 e ipamorelina</Link>.
        Quando o produto vem de manipulação, ele chega liofilizado e precisa ser
        preparado — o que envolve cuidado com diluente e concentração, tema da{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link>.
      </p>

      <h2>Efeitos colaterais</h2>
      <p>
        Os efeitos adversos descritos historicamente para a sermorelina eram, em geral,
        leves e transitórios:
      </p>
      <ul>
        <li>Reações no local da injeção (dor, eritema, tumefação)</li>
        <li>Rubor facial (flushing)</li>
        <li>Cefaleia</li>
        <li>Disgeusia (alteração do paladar)</li>
        <li>Náusea</li>
        <li>Reações de hipersensibilidade (raras)</li>
      </ul>
      <p>
        Entre as contraindicações clássicas estão malignidade ativa, gestação e lactação,
        hipersensibilidade ao GHRH ou à sermorelina, hipotireoidismo não tratado (que pode
        atenuar a resposta) e o uso concomitante de glicocorticoides em altas doses. Como
        hoje não há bula ativa, essas orientações vêm do histórico regulatório do produto,
        e não de um rótulo em vigor.
      </p>

      <h2>Está liberada no Brasil e no esporte?</h2>
      <p>
        No Brasil, a sermorelina <strong>não tem registro ativo na ANVISA</strong>. Ou
        seja, não existe um produto aprovado para prescrição comum, e qualquer versão
        oferecida vem de manipulação ou de mercado não regulado — o que traz risco de
        variação de identidade, pureza e dose em um peptídeo injetável.
      </p>
      <p>
        No esporte, a resposta é direta: a sermorelina é <strong>proibida pela WADA</strong>{' '}
        na categoria S2, dentro e fora de competição, por estimular a liberação de GH.
        Atletas sob controle antidopagem não devem utilizá-la. Se a sua dúvida é como ela
        se compara a um GHRP seletivo, vale ler a comparação{' '}
        <Link href="/comparar/ipamorelina-vs-sermorelina">ipamorelina vs sermorelina</Link>,
        que coloca os dois mecanismos lado a lado.
      </p>
      <p>
        Em resumo: a sermorelina tem uma história legítima como fármaco aprovado, mas o seu
        status atual é de um produto <strong>descontinuado</strong>, restrito a manipulação
        e uso off-label, sem registro ativo no Brasil e proibido no esporte. Entender essa
        diferença entre &ldquo;já foi aprovada&rdquo; e &ldquo;é aprovada hoje&rdquo; é o ponto central para
        avaliar qualquer informação sobre ela.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-sermorelina" />
      </div>
    </ArticleLayout>
  );
}
