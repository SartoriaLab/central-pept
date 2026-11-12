import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';

const SLUG = 'selank-ansiedade';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'O Selank funciona para ansiedade?',
    a: 'Na Rússia, o Selank é um medicamento aprovado para transtorno de ansiedade generalizada e neurastenia, e ensaios clínicos locais descrevem eficácia ansiolítica comparável à de benzodiazepínicos — porém sem sedação nem dependência. O problema é que a evidência fora da Rússia é limitada: poucos ensaios controlados grandes e literatura internacional escassa. Ou seja, há indícios promissores, mas não a mesma certeza que temos sobre tratamentos aprovados. Ele não substitui o acompanhamento de um profissional de saúde mental.',
  },
  {
    q: 'Selank ou Semax, qual a diferença?',
    a: 'Os dois são heptapeptídeos sintéticos desenvolvidos no mesmo instituto russo, mas com propósitos diferentes. O Selank é um análogo da tuftsina, desenhado como ansiolítico (foco em ansiedade, via sistema GABAérgico). O Semax é um análogo do fragmento ACTH(4-10), usado como nootrópico e neuroprotetor (foco em cognição e BDNF). Veja o comparativo Semax vs Selank para os detalhes lado a lado.',
  },
  {
    q: 'O Selank causa dependência como benzodiazepínico?',
    a: 'Nos estudos publicados, não há relato significativo de sedação, tolerância, dependência ou síndrome de abstinência — e essa é justamente a principal vantagem que os pesquisadores atribuem ao Selank. O motivo apontado é que ele modula o receptor GABA-A por um caminho distinto do dos benzodiazepínicos. Ainda assim, os dados de longo prazo em populações amplas fora da Rússia são limitados, então "sem dependência conhecida" não é o mesmo que "garantidamente seguro para sempre".',
  },
  {
    q: 'O Selank é aprovado no Brasil?',
    a: 'Não. O Selank não tem registro na ANVISA — nem na FDA (EUA) nem na EMA (Europa). Ele é aprovado como medicamento apenas na Federação Russa. Qualquer produto vendido como "Selank" no Brasil vem do mercado não regulado, sem garantia de identidade, pureza ou dose.',
  },
  {
    q: 'Como o Selank é usado (dose/via)?',
    a: 'Na prática clínica russa, o Selank é usado por via intranasal, tipicamente 250 a 500 mcg em cada narina, 2 a 3 vezes ao dia. A via nasal é preferida porque o peptídeo tem meia-vida plasmática muito curta (minutos), embora os efeitos funcionais durem várias horas. Não existe "dose de bula" reconhecida fora da Rússia, porque o produto não é aprovado por outras agências.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        O Selank é um peptídeo ansiolítico desenvolvido na Rússia e usado clinicamente lá
        para transtornos de ansiedade — mas praticamente desconhecido pela medicina
        ocidental. A promessa que atrai atenção é sedutora: reduzir a ansiedade com eficácia
        parecida à dos benzodiazepínicos, porém sem sedação, sem tolerância e sem dependência.
        Este artigo mostra o que a ciência realmente sustenta — e onde a evidência ainda é frágil.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> o Selank é aprovado como medicamento <strong>apenas na
        Rússia</strong> (para ansiedade generalizada e neurastenia). <strong>Não</strong> tem
        aprovação da FDA, da EMA nem da ANVISA. A evidência científica fora da Rússia é
        <strong> modesta</strong>, e este peptídeo <strong>não substitui</strong> o tratamento
        de ansiedade prescrito por um profissional de saúde mental. Este artigo é informativo.
      </div>

      <h2>O que é o Selank</h2>
      <p>
        O Selank é um <strong>heptapeptídeo sintético</strong> (sequência
        Thr-Lys-Pro-Arg-Pro-Gly-Pro) criado no Instituto de Genética Molecular da Academia
        Russa de Ciências, em cooperação com o Instituto V.V. Zakusov de Farmacologia. Ele é
        um <strong>análogo da tuftsina</strong> — um fragmento natural da imunoglobulina G
        humana — com uma extensão na ponta C-terminal (Pro-Gly-Pro) que torna a molécula mais
        estável no organismo. A ideia por trás do projeto foi criar um ansiolítico peptídico
        que não pertencesse à família dos benzodiazepínicos.
      </p>
      <p>
        Para os dados técnicos completos — sequência, faixa de dose e referências dos estudos —
        consulte a{' '}
        <Link href="/peptideos/selank">ficha técnica do Selank</Link>.
      </p>

      <h2>Como funciona</h2>
      <p>
        O mecanismo principal do Selank envolve o <strong>sistema GABAérgico</strong>, o mesmo
        grande sistema "de freio" do cérebro em que os benzodiazepínicos atuam — mas por um
        caminho diferente. Estudos transcriptômicos (que medem a expressão de genes) mostraram
        que o Selank altera a expressão de vários genes ligados à neurotransmissão GABAérgica
        no córtex frontal, aparentemente modulando o receptor GABA-A de forma <strong>distinta</strong>
        da dos benzodiazepínicos. É essa diferença de mecanismo que os pesquisadores russos
        apontam para explicar por que, nos estudos, não apareceram sedação nem dependência.
      </p>
      <p>
        Além do GABA, foram descritos efeitos secundários: modulação dos sistemas serotonérgico
        e dopaminérgico, inibição de enzimas que degradam encefalinas (potencializando peptídeos
        endógenos), ação imunomoduladora herdada da tuftsina, e aumento da expressão de
        <strong> BDNF</strong> no hipocampo — o mesmo fator neurotrófico associado a plasticidade
        e memória que aparece nos estudos do{' '}
        <Link href="/peptideos/semax">Semax</Link>.
      </p>

      <h2>O que a evidência mostra</h2>
      <p>
        Aqui é preciso ser honesto. Do lado russo, o Selank é um medicamento aprovado para
        transtorno de ansiedade generalizada e neurastenia, e há ensaios clínicos locais que
        descrevem eficácia ansiolítica comparável à de benzodiazepínicos, sem os efeitos de
        sedação e dependência. Do lado ocidental, a situação é bem diferente: a literatura
        peer-reviewed indexada em inglês é <strong>limitada</strong>, com poucos ensaios
        controlados de grande porte e amostras pequenas.
      </p>
      <p>
        Em outras palavras, existe um corpo real de pesquisa — mas concentrado num único país,
        com metodologia e acesso que a comunidade internacional não replicou de forma ampla.
        Isso não significa que o Selank "não funciona"; significa que a certeza que temos sobre
        benzodiazepínicos ou antidepressivos, respaldada por décadas de estudos multicêntricos,
        ainda não existe para o Selank. Para quem sofre de ansiedade, essa distinção importa:
        um tratamento com evidência robusta e acompanhamento médico é mais seguro do que um
        peptídeo de evidência regionalizada.
      </p>

      <h2>Uso e formulação</h2>
      <p>
        Na prática clínica russa, o Selank é usado por <strong>via intranasal</strong>,
        tipicamente <strong>250 a 500 mcg em cada narina, 2 a 3 vezes ao dia</strong>. A via
        nasal é preferida porque o peptídeo tem meia-vida plasmática muito curta — questão de
        minutos — embora os efeitos funcionais descritos durem várias horas. Não existe "dose
        de bula" reconhecida fora da Rússia, já que o produto não é aprovado por outras agências.
      </p>
      <p>
        Peptídeos vendidos como "para pesquisa" costumam vir em pó liofilizado, que precisa ser
        reconstituído com água bacteriostática antes do uso. Se esse for o caso, a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link> ajuda a
        acertar a concentração.
      </p>

      <h2>Efeitos colaterais</h2>
      <p>
        Nos estudos publicados — em boa parte russos — a tolerabilidade do Selank é descrita
        como favorável. Os relatos incluem:
      </p>
      <ul>
        <li>Cefaleia leve e reações locais (no uso intranasal ou injetável)</li>
        <li>Sem relato significativo de sedação, dependência ou síndrome de abstinência nos estudos publicados</li>
      </ul>
      <p>
        Duas ressalvas importantes: os dados em humanos fora da Rússia são limitados, e o
        perfil de segurança de <strong>longo prazo</strong> em populações amplas não está tão
        bem caracterizado quanto o de ansiolíticos aprovados internacionalmente. Como
        contraindicações, os dados são insuficientes para gravidez e lactação, há a habitual
        precaução com hipersensibilidade ao composto, e o uso pediátrico fora de protocolos
        russos específicos não está estabelecido.
      </p>

      <h2>Status regulatório</h2>
      <p>
        O Selank é aprovado como medicamento <strong>apenas na Federação Russa</strong>. Não
        tem registro na ANVISA, na FDA nem na EMA. No Brasil, qualquer produto oferecido como
        "Selank" vem do mercado não regulado — sem garantia de identidade, pureza ou dose. Isso
        é especialmente relevante quando se trata de ansiedade, uma condição que merece
        avaliação e acompanhamento profissional, e não automedicação com um peptídeo de origem
        incerta.
      </p>
      <p>
        Se você quer comparar o Selank com seu "primo" nootrópico, veja{' '}
        <Link href="/comparar/semax-vs-selank">Semax vs Selank</Link>; e para entender o Semax
        em profundidade, vale o artigo sobre o{' '}
        <Link href="/blog/semax-nootropico">Semax como nootrópico</Link>.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>
    </ArticleLayout>
  );
}
