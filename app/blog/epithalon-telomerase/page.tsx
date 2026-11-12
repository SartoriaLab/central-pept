import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';

const SLUG = 'epithalon-telomerase';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'O Epithalon realmente aumenta a longevidade?',
    a: 'A evidência é promissora, porém preliminar. Coortes observacionais russas de idosos relataram redução de mortalidade, mas esses estudos vêm em grande parte de um único grupo (Khavinson) e têm limitações metodológicas. Não existe um ensaio clínico randomizado, controlado e replicado por grupos independentes que comprove aumento de longevidade em humanos. Trate a promessa como uma hipótese em investigação, não como um fato estabelecido.',
  },
  {
    q: 'O Epithalon alonga os telômeros em humanos?',
    a: 'Estudos in vitro do grupo russo (como o do Bulletin of Experimental Biology and Medicine, 2003) descreveram indução da telomerase e alongamento de telômeros em fibroblastos humanos em cultura. Isso é diferente de provar alongamento sustentado de telômeros em pessoas vivas, com desfecho clínico relevante. Essa ponte — da placa de cultura para o organismo humano — ainda não foi solidamente demonstrada nem replicada de forma independente.',
  },
  {
    q: 'Epithalon ou MOTS-c para longevidade?',
    a: 'São abordagens diferentes: o Epithalon age (hipoteticamente) na telomerase e nos telômeros, enquanto o MOTS-c é um peptídeo mitocondrial que ativa a AMPK e atua no metabolismo. Ambos estão em categoria de pesquisa, sem aprovação regulatória e sem evidência humana robusta. Nenhum dos dois tem dados que justifiquem uso clínico. Veja a comparação lado a lado em Epithalon vs MOTS-c.',
  },
  {
    q: 'O Epithalon é seguro? Tem risco de câncer?',
    a: 'Os estudos clínicos russos em idosos descreveram boa tolerabilidade, sem eventos adversos significativos em observações de até 6-15 anos, mas os dados ocidentais independentes são muito limitados. O ponto de atenção mais importante é o risco teórico oncológico: a reativação da telomerase é uma característica de muitas células cancerosas. Os efeitos de longo prazo sobre a proliferação celular não estão bem caracterizados, e histórico de câncer é uma contraindicação.',
  },
  {
    q: 'Como o Epithalon é usado (ciclos/dose)?',
    a: 'Os protocolos russos descritos na literatura usam tipicamente 5-10 mg por dia, em ciclos de 10-20 dias, repetidos 1-2 vezes ao ano. Não há dose de bula, porque o Epithalon não é aprovado por nenhuma agência. Qualquer produto vendido como "Epithalon" vem do mercado não regulado, sem garantia de identidade, pureza ou esterilidade.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        O Epithalon (também grafado Epitalon) é talvez o peptídeo mais associado à
        ideia de "reverter o envelhecimento". A promessa é ousada: ativar a{' '}
        <strong>telomerase</strong> — a enzima que reconstrói as pontas dos cromossomos —
        e assim retardar o relógio biológico das células. É uma história fascinante,
        mas, como você vai ver, boa parte dela ainda repousa sobre uma base de
        evidência frágil.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> a maior parte da evidência sobre o Epithalon vem
        de <strong>um único grupo de pesquisa russo</strong> (Khavinson), com replicação
        independente escassa fora da Rússia. O peptídeo <strong>não é aprovado</strong> pela
        FDA, EMA nem ANVISA, e existe um <strong>risco teórico oncológico</strong> ligado à
        reativação da telomerase. Este artigo é informativo e não é indicação de uso.
      </div>

      <h2>O que é o Epithalon</h2>
      <p>
        O Epithalon é um <strong>tetrapeptídeo sintético</strong> de sequência Ala-Glu-Asp-Gly
        (a sigla <strong>AEDG</strong>). Ele foi desenvolvido a partir da pesquisa do grupo de
        Vladimir Khavinson, no Instituto de Bioregulação e Gerontologia de São Petersburgo,
        na Rússia. Sua origem é um peptídeo pineal natural chamado Epitalamina, estudado desde
        os anos 1980-1990 como agente geroprotetor — ou seja, uma substância que buscaria
        proteger contra os efeitos do envelhecimento, mexendo em coisas como telomerase, ritmo
        circadiano e função da glândula pineal.
      </p>
      <p>
        Para ver os dados técnicos completos — dose típica, meia-vida e as referências dos
        estudos — consulte a{' '}
        <Link href="/peptideos/epithalon">ficha técnica do Epithalon</Link>.
      </p>

      <h2>Como funciona (e o que ainda é especulação)</h2>
      <p>
        A hipótese central é a seguinte: os telômeros são as "capas de proteção" nas pontas
        dos cromossomos, e eles encurtam a cada divisão celular — um dos marcadores do
        envelhecimento. A <strong>telomerase (hTERT)</strong> é a enzima capaz de reconstruir
        esses telômeros. A proposta é que o Epithalon ative a telomerase, alongue os telômeros
        e reverta parcialmente a senescência replicativa das células. Estudos mais recentes
        sugerem que o peptídeo poderia ainda acionar mecanismos alternativos de manutenção de
        telômeros (a chamada via ALT).
      </p>
      <p>
        Há também mecanismos complementares propostos: modulação de genes ligados ao eixo
        pineal-hipotálamo, normalização da secreção de melatonina, efeitos antioxidantes e até
        regulação epigenética com ligação direta do peptídeo a sequências promotoras no DNA.
        Vale sublinhar com clareza: <strong>esses mecanismos permanecem, em grande parte,
        especulativos</strong>. São modelos teóricos e achados de laboratório, não certezas
        sobre o que acontece dentro de um ser humano.
      </p>

      <h2>O que a ciência realmente mostra</h2>
      <p>
        Aqui é onde a honestidade importa. A parte mais citada da literatura vem de
        publicações como a do <em>Bulletin of Experimental Biology and Medicine</em> (2003),
        que descreveu indução da telomerase e alongamento de telômeros em fibroblastos humanos
        — mas <strong>em cultura celular</strong>. Coortes observacionais russas também
        relataram redução de mortalidade em idosos ao longo de vários anos de acompanhamento.
      </p>
      <p>
        O problema não é a ausência de dados, e sim a <strong>fragilidade e a concentração</strong>
        deles:
      </p>
      <ul>
        <li>A maior parte da literatura positiva origina-se de <strong>um mesmo grupo</strong> (Khavinson e colaboradores).</li>
        <li>As coortes clínicas têm <strong>limitações metodológicas</strong> (desenho observacional, e não randomizado e cego).</li>
        <li>A <strong>replicação independente</strong> por grupos fora da Rússia é escassa.</li>
        <li>O salto da placa de cultura para desfechos clínicos em pessoas vivas ainda não foi solidamente demonstrado.</li>
      </ul>
      <p>
        Em resumo: a evidência é <strong>promissora, porém preliminar</strong>. A maioria dos
        estudos positivos não foi confirmada por pesquisadores independentes — e isso é uma
        ressalva importante, não um detalhe.
      </p>

      <h2>Dose: os protocolos russos em ciclos</h2>
      <p>
        Não existe "dose de bula" para o Epithalon, porque ele não foi aprovado por nenhuma
        agência. O que circula são os <strong>protocolos russos</strong> descritos na
        literatura, geralmente:
      </p>
      <ul>
        <li><strong>5-10 mg por dia</strong>, via injetável;</li>
        <li>em <strong>ciclos de 10-20 dias</strong>;</li>
        <li>repetidos <strong>1-2 vezes ao ano</strong>.</li>
      </ul>
      <p>
        A meia-vida plasmática do peptídeo é muito curta (minutos), ainda que se proponha que
        os efeitos biológicos sejam mais duradouros. Como todo peptídeo em pó liofilizado, ele
        precisaria ser reconstituído com água bacteriostática antes de qualquer manipulação —
        é para isso que serve a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link>. Reforçando:
        descrevemos os protocolos por transparência, não como recomendação de uso.
      </p>

      <h2>Efeitos colaterais e o risco teórico</h2>
      <p>
        Os estudos clínicos russos em idosos descreveram <strong>boa tolerabilidade</strong>,
        sem eventos adversos significativos em observações de até 6-15 anos. Reações locais no
        sítio da injeção são possíveis, e os dados ocidentais independentes são muito limitados.
      </p>
      <p>
        O ponto de atenção mais sério é <strong>conceitual</strong>: a reativação da telomerase
        é justamente uma das características de muitas células cancerosas, que a usam para
        "escapar" da morte celular programada e se dividir indefinidamente. Por isso existe um{' '}
        <strong>risco teórico oncológico</strong> em estimular essa enzima, e os efeitos de
        longo prazo sobre a proliferação celular não estão bem caracterizados. As
        contraindicações apontadas incluem gravidez e lactação, <strong>histórico de câncer</strong>,
        hipersensibilidade ao peptídeo e uso pediátrico (não estudado).
      </p>

      <h2>Status regulatório</h2>
      <p>
        O Epithalon é classificado como uso de <strong>pesquisa apenas</strong> ("research-only").
        Não tem aprovação da FDA, da EMA nem da ANVISA. Qualquer produto oferecido como
        "Epithalon" vem do <strong>mercado não regulado</strong>, sem garantia de identidade,
        pureza ou esterilidade — um risco concreto para algo que seria injetado.
      </p>

      <h2>Epithalon vs MOTS-c: duas apostas diferentes de longevidade</h2>
      <p>
        O Epithalon e o MOTS-c costumam aparecer juntos nas conversas sobre longevidade, mas
        atacam o problema por caminhos distintos: um mira a telomerase e os telômeros, o outro
        é um peptídeo mitocondrial que ativa a AMPK e atua no metabolismo. Ambos estão em fase
        de pesquisa, sem evidência humana robusta. Para se aprofundar:
      </p>
      <ul>
        <li><Link href="/comparar/mots-c-vs-epithalon">MOTS-c vs Epithalon</Link> — comparação lado a lado</li>
        <li><Link href="/peptideos/mots-c">Ficha técnica do MOTS-c</Link></li>
        <li><Link href="/blog/mots-c-o-que-e">MOTS-c: o que é o peptídeo mitocondrial</Link></li>
      </ul>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>
    </ArticleLayout>
  );
}
