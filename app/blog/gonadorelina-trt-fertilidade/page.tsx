import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'gonadorelina-trt-fertilidade';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Para que serve a gonadorelina na TRT?',
    a: 'Na terapia de reposição de testosterona (TRT), a gonadorelina é usada de forma off-label para tentar manter a função testicular e a fertilidade. A testosterona exógena tende a "desligar" o eixo próprio, o que pode causar atrofia testicular e queda na produção de espermatozoides. A gonadorelina estimula a hipófise a liberar LH e FSH, ajudando a manter os testículos ativos — um papel parecido com o do hCG, mas agindo um degrau acima na cascata hormonal.',
  },
  {
    q: 'Por que a gonadorelina precisa ser pulsátil?',
    a: 'Porque a hipófise responde ao padrão pulsátil natural do GnRH (pulsos a cada ~90-120 minutos), e não a um nível constante. A administração contínua dessensibiliza o receptor de GnRH e acaba suprimindo o eixo — o efeito oposto ao desejado. Esse fenômeno é tão real que é explorado de propósito por medicamentos de longa ação, como leuprolida e triptorelina, para reduzir hormônios sexuais. Em resumo: a forma de administrar define se a molécula estimula ou suprime.',
  },
  {
    q: 'Gonadorelina ou hCG, qual a diferença?',
    a: 'O hCG imita diretamente o LH e age nos testículos. A gonadorelina age um passo antes: estimula a própria hipófise a liberar LH e FSH. Na prática, a gonadorelina depende de uma hipófise funcionante e de uma administração no padrão pulsátil correto; o hCG age mesmo com a hipófise suprimida. Ambos são usados em protocolos de TRT para preservar a função testicular — a escolha entre eles é clínica.',
  },
  {
    q: 'A gonadorelina é aprovada no Brasil?',
    a: 'A gonadorelina já teve uso clínico no Brasil para diagnóstico e indução de ovulação. As apresentações industrializadas históricas (como Factrel e Lutrepulse, aprovadas pela FDA) foram descontinuadas comercialmente — e não por questão de segurança. Hoje, o acesso costuma se dar via farmácias de manipulação, e o uso em TRT é off-label. Não existe um produto industrializado de prateleira para essa finalidade.',
  },
  {
    q: 'Qual a dose de gonadorelina?',
    a: 'Depende totalmente do objetivo. Como agente diagnóstico, a bula histórica usava 100 mcg em dose única (subcutânea ou intravenosa). Na indução de ovulação, o esquema era pulsátil, com poucos microgramas a cada ~90 minutos por bomba de infusão. Em manipulação para TRT, descrevem-se doses baixas subcutâneas, algumas vezes por semana. Não há "dose de bula" para o uso em TRT porque é off-label — a definição é individual e médica. Este texto não é recomendação de dose.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        A gonadorelina é a versão sintética do GnRH — o hormônio que comanda todo o eixo
        reprodutivo. Nos últimos anos ela ganhou atenção fora do consultório de fertilidade
        por um motivo específico: em protocolos de reposição de testosterona (TRT), passou a
        ser usada, de forma off-label, para tentar preservar a função testicular e a
        fertilidade. Este artigo explica o que ela é, como age e por que a forma de
        administrar — pulsátil — faz toda a diferença.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> as apresentações aprovadas da gonadorelina
        (<strong>Factrel</strong> e <strong>Lutrepulse</strong>) foram
        <strong> descontinuadas comercialmente</strong> — a retirada foi comercial, não por
        problema de segurança. O uso atual na TRT é <strong>off-label</strong> e depende de
        manipulação. A administração <strong>pulsátil</strong> correta é essencial: feita de
        forma errada, o efeito pode ser o oposto do desejado. Este conteúdo é informativo e não
        substitui avaliação médica.
      </div>

      <h2>O que é a gonadorelina (GnRH sintético)</h2>
      <p>
        A gonadorelina é a forma sintética do <strong>hormônio liberador de gonadotrofina
        (GnRH)</strong>, um decapeptídeo (10 aminoácidos) produzido naturalmente no hipotálamo.
        É a molécula que fica no topo do eixo hipotálamo-hipófise-gônadas: é ela quem dá a ordem
        para a hipófise liberar LH e FSH.
      </p>
      <p>
        Por ser idêntica ao hormônio endógeno, a gonadorelina tem farmacologia bem caracterizada
        e um histórico regulatório robusto — diferente da maioria dos peptídeos "de pesquisa". Os
        detalhes técnicos (sequência, meia-vida e referências) estão reunidos na{' '}
        <Link href="/peptideos/gonadorelina">ficha técnica da gonadorelina</Link>.
      </p>

      <h2>Como funciona: GnRH → LH/FSH → testosterona/ovulação</h2>
      <p>
        O mecanismo segue uma cascata bem definida:
      </p>
      <ul>
        <li>A gonadorelina se liga ao <strong>receptor de GnRH</strong> nas células gonadotróficas da hipófise anterior.</li>
        <li>Isso dispara a liberação de <strong>LH</strong> (hormônio luteinizante) e <strong>FSH</strong> (hormônio folículo-estimulante).</li>
        <li>No homem, o LH estimula as <strong>células de Leydig</strong> a produzir testosterona, e o FSH sustenta a espermatogênese.</li>
        <li>Na mulher, o mesmo par de gonadotrofinas comanda o desenvolvimento folicular e a ovulação.</li>
      </ul>
      <p>
        A meia-vida é curtíssima — cerca de <strong>2 a 10 minutos</strong>. E há um ponto
        conceitual importante: por agir no topo do eixo, a gonadorelina{' '}
        <strong>não repõe testosterona diretamente</strong>. Ela estimula o próprio corpo a
        produzi-la, mantendo a maquinaria testicular ativa.
      </p>

      <h2>A importância da pulsatilidade</h2>
      <p>
        Este é o ponto mais importante — e o mais mal compreendido. No corpo, o hipotálamo
        libera GnRH em <strong>pulsos</strong>, aproximadamente a cada 90 a 120 minutos. Esse
        ritmo é essencial: a hipófise responde ao padrão pulsátil, e não a um nível constante da
        substância.
      </p>
      <p>
        Quando a gonadorelina (ou um análogo de GnRH) é administrada de forma{' '}
        <strong>contínua</strong>, acontece o oposto do esperado: o receptor de GnRH{' '}
        <strong>dessensibiliza</strong> e o eixo é <strong>suprimido</strong>. Esse efeito
        paradoxal não é um acidente — é justamente o que medicamentos de longa ação como
        leuprolida e triptorelina exploram para reduzir hormônios sexuais (por exemplo, no
        tratamento do câncer de próstata).
      </p>
      <p>
        Ou seja: a mesma molécula pode <em>estimular</em> ou <em>suprimir</em> o eixo,
        dependendo apenas do padrão de administração. É por isso que a forma pulsátil — curta e
        intermitente — é o que se busca quando o objetivo é estimular a produção hormonal.
      </p>

      <h2>Uso na TRT: manter função testicular e fertilidade (off-label)</h2>
      <p>
        Quem faz reposição de testosterona enfrenta um efeito conhecido: a testosterona externa
        sinaliza ao cérebro que já há hormônio suficiente, e o eixo próprio "desliga". O
        resultado costuma ser atrofia testicular e queda da fertilidade.
      </p>
      <p>
        Para contornar isso, protocolos de TRT tradicionalmente usam <strong>hCG</strong>, que
        imita o LH e mantém os testículos ativos. A gonadorelina surgiu como alternativa: em vez
        de imitar o LH, ela estimula a própria hipófise a liberar LH e FSH — um degrau acima na
        cascata.
      </p>
      <p>
        Nos EUA, esse uso se popularizou via farmácias de <em>compounding</em> (manipulação),
        associado a protocolos de TRT para preservar a função testicular endógena e a
        fertilidade, em substituição ao hCG. Vale deixar claro: trata-se de uso{' '}
        <strong>off-label</strong>, sem indicação aprovada em bula para essa finalidade. As doses
        descritas nesses contextos são baixas e subcutâneas, com frequência pensada para
        estimular sem dessensibilizar — mas o ajuste é individual e cabe ao médico. Para entender
        o preparo do frasco manipulado, veja a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link>.
      </p>

      <h2>Efeitos colaterais</h2>
      <ul>
        <li>Reações no local da injeção (as mais comuns): dor, vermelhidão e inchaço</li>
        <li>Cefaleia, rubor e náusea transitória</li>
        <li>Reações de hipersensibilidade raras, incluindo anafilaxia (relatada na bula original do Factrel)</li>
        <li>Formação de anticorpos anti-GnRH com uso prolongado (raro)</li>
        <li>Supressão paradoxal (dessensibilização) do eixo quando a dose ou a frequência são inadequadas</li>
      </ul>
      <p>
        As principais contraindicações incluem hipersensibilidade à substância, gravidez (fora
        de protocolos supervisionados de indução de ovulação), condições hormônio-dependentes não
        controladas e neoplasia hipofisária não caracterizada.
      </p>

      <h2>Histórico regulatório e status no Brasil</h2>
      <p>
        A gonadorelina tem um passado clínico sólido. Foi aprovada pela FDA sob duas marcas:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th>Marca</th><th>Forma</th><th>Indicação aprovada</th></tr>
          </thead>
          <tbody>
            <tr><td>Factrel</td><td>Gonadorelina hidrocloreto</td><td>Diagnóstico (puberdade atrasada, hipogonadismo hipogonadotrófico)</td></tr>
            <tr><td>Lutrepulse</td><td>Gonadorelina acetato</td><td>Indução de ovulação (bomba de infusão pulsátil)</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Ambas foram <strong>descontinuadas comercialmente</strong> nos EUA. Vale repetir: a
        retirada foi comercial — ligada à complexidade do regime pulsátil e ao mercado — e{' '}
        <strong>não</strong> uma proibição por segurança. Hoje, nos EUA, a substância existe
        sobretudo via manipulação.
      </p>
      <p>
        No Brasil, a gonadorelina já teve uso clínico para diagnóstico e indução de ovulação;
        atualmente o acesso também é tipicamente via manipulação, e não como produto
        industrializado de prateleira. Para comparar com outros peptídeos hormonais e ver o
        panorama completo, consulte a{' '}
        <Link href="/peptideos">enciclopédia de peptídeos</Link>.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-gonadorelina" />
      </div>
    </ArticleLayout>
  );
}
