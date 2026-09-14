import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'aod-9604-o-que-e';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'O AOD-9604 funciona para emagrecer?',
    a: 'A evidência disponível indica que não de forma clinicamente relevante. Nos ensaios em humanos, a perda de peso ficou em torno de -2,6 kg contra -0,8 kg com placebo em 12 semanas, e o estudo decisivo de fase IIb (24 semanas, 536 pacientes) não atingiu significância estatística. Foi justamente por isso que o desenvolvimento como medicamento antiobesidade foi interrompido em 2007.',
  },
  {
    q: 'O AOD-9604 é aprovado?',
    a: 'Não. O AOD-9604 não tem aprovação como medicamento na FDA, na EMA nem na ANVISA. Hoje é comercializado como peptídeo para pesquisa ou manipulado em compounding para usos off-label, sem o controle de identidade, pureza e esterilidade exigido de um fármaco registrado.',
  },
  {
    q: 'AOD-9604 x GLP-1 (semaglutida), o que a evidência mostra?',
    a: 'A diferença é grande. Os agonistas de GLP-1 como a semaglutida produzem perdas de peso de dois dígitos em ensaios de fase 3 e têm aprovação regulatória. O AOD-9604 mostrou menos de 2 kg de vantagem sobre o placebo e falhou no estudo de fase IIb. Em termos de qualidade de evidência, as duas moléculas não são comparáveis.',
  },
  {
    q: 'O AOD-9604 altera IGF-1 ou glicemia?',
    a: 'Nos ensaios, não. Uma característica central do AOD-9604 é que ele não ativa o receptor de GH; por isso, nas doses testadas, não elevou o IGF-1 nem alterou de forma significativa a glicemia. Essa foi exatamente a racionalidade do desenvolvimento: reproduzir a lipólise do GH sem seus efeitos metabólicos e proliferativos.',
  },
  {
    q: 'Qual a dose de AOD-9604?',
    a: 'Não existe dose de bula, porque o produto não é aprovado. Nos ensaios clínicos usava-se cerca de 1 mg/dia por via subcutânea; nos protocolos de compounding atuais fala-se em 250-500 mcg/dia. Por ser liofilizado, precisa ser reconstituído antes do uso.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        O AOD-9604 é vendido como um "peptídeo queimador de gordura" derivado do hormônio
        do crescimento (GH). A promessa é atraente: perder gordura aproveitando o efeito
        lipolítico do GH, mas sem os efeitos anabólicos e sobre a glicose. A história real,
        porém, é mais sóbria — a molécula chegou a ser testada como medicamento antiobesidade
        e o desenvolvimento foi abandonado depois que os ensaios não entregaram o resultado
        esperado.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> o desenvolvimento do AOD-9604 como medicamento foi
        <strong> interrompido em 2007</strong>, depois que o estudo de fase IIb <strong>não
        atingiu significância estatística</strong>. Ele <strong>não</strong> é aprovado pela
        FDA, EMA ou ANVISA. Hoje é apenas um peptídeo de pesquisa / manipulação (compounding)
        usado off-label. Este artigo é informativo e não é indicação de uso.
      </div>

      <h2>O que é o AOD-9604</h2>
      <p>
        O AOD-9604 — a sigla vem de <em>"Anti-Obesity Drug 9604"</em> — é um fragmento
        modificado do hormônio do crescimento humano (hGH). Ele corresponde aos aminoácidos
        <strong> 176-191</strong> da cadeia do hGH, a região ligada ao efeito lipolítico do
        hormônio, com uma tirosina adicionada ao N-terminal para dar estabilidade à molécula.
        Foi desenvolvido nos anos 1990 pela Metabolic Pharmaceuticals, na Austrália, com uma
        ideia clara: isolar a parte do GH que queima gordura e deixar de fora a parte que
        estimula crescimento e mexe na glicose.
      </p>
      <p>
        Os dados técnicos completos — faixa de dose, meia-vida e referências dos estudos —
        estão na{' '}
        <Link href="/peptideos/aod-9604">ficha técnica do AOD-9604</Link>.
      </p>

      <h2>Como funciona</h2>
      <p>
        O mecanismo proposto é a estimulação da lipólise (quebra de gordura) e a inibição da
        lipogênese (formação de gordura) por meio de receptores nos adipócitos, com ativação
        de AMPc e de receptores β3-adrenérgicos e aumento da oxidação de ácidos graxos.
      </p>
      <p>
        O ponto que diferencia o AOD-9604 do GH inteiro é justamente o que ele <strong>não</strong>{' '}
        faz: ele não ativa o receptor de GH. Por isso, nas doses estudadas, não eleva o IGF-1
        nem produz os efeitos proliferativos associados ao hormônio de crescimento. Essa era a
        racionalidade original do projeto — obter lipólise sem os riscos do GH.
      </p>
      <p>
        Há ainda relatos pré-clínicos de um possível efeito condroprotetor (proteção da
        cartilagem), o que alimenta o uso off-label para articulações. É preciso ser honesto:
        essa indicação nunca foi validada em ensaios humanos controlados.
      </p>

      <h2>O que os ensaios mostraram</h2>
      <p>
        Aqui está a parte que costuma ser omitida no marketing. O AOD-9604 passou por um
        programa de desenvolvimento sério: foram <strong>6 ensaios em humanos</strong>, com
        mais de <strong>900 participantes</strong>. E os resultados foram, na melhor das
        hipóteses, modestos.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th>Estudo</th><th>Resultado</th></tr>
          </thead>
          <tbody>
            <tr><td>Estudos iniciais (12 semanas)</td><td>-2,6 kg vs -0,8 kg com placebo</td></tr>
            <tr><td>Fase IIb (24 semanas, 536 pacientes)</td><td>Não atingiu significância estatística</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        A diferença de peso nos estudos iniciais foi pequena — menos de 2 kg acima do placebo.
        E o estudo decisivo, a fase IIb com 536 pacientes ao longo de 24 semanas, não alcançou
        significância estatística. Sem um efeito consistente, a Metabolic Pharmaceuticals
        interrompeu o desenvolvimento farmacêutico em <strong>2007</strong>. Em outras palavras:
        como medicamento antiobesidade, o AOD-9604 falhou nos testes que importavam.
      </p>

      <h2>AOD-9604 vs GLP-1: o que a evidência diz</h2>
      <p>
        Para dimensionar, vale comparar com o que a medicina de obesidade usa hoje. Os
        agonistas de GLP-1, como a semaglutida, produzem perdas de peso de dois dígitos (na
        faixa de 15% do peso corporal em ensaios de fase 3) e têm aprovação regulatória. O
        AOD-9604, com sua diferença de menos de 2 kg contra placebo e um estudo de fase IIb
        negativo, joga em outra categoria de evidência.
      </p>
      <p>
        Se o seu objetivo é emagrecimento com respaldo científico, o caminho baseado em
        evidência passa por essas opções aprovadas — veja como funciona a{' '}
        <Link href="/peptideos/semaglutida">semaglutida</Link> e o texto sobre{' '}
        <Link href="/blog/ozempic-para-perder-peso-sem-diabetes">usar Ozempic para emagrecer
        sem diabetes</Link>.
      </p>

      <h2>Uso off-label hoje</h2>
      <p>
        Se o desenvolvimento parou em 2007, por que o AOD-9604 ainda circula? Porque migrou do
        universo farmacêutico para o de peptídeos de pesquisa e de manipulação (compounding).
        Hoje ele é usado off-label para <strong>composição corporal</strong> e{' '}
        <strong>queixas articulares</strong> — sempre com evidência humana muito limitada ou
        ausente para esses fins.
      </p>
      <p>
        As doses também mudaram. Nos ensaios clínicos usava-se cerca de <strong>1 mg/dia</strong>{' '}
        por via subcutânea; nos protocolos de compounding atuais, fala-se em{' '}
        <strong>250-500 mcg/dia</strong>. Como esses produtos vêm liofilizados, exigem
        reconstituição com água bacteriostática antes do uso — a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link> ajuda a
        acertar a diluição e a dose por aplicação.
      </p>
      <p>
        Vale reforçar: produtos rotulados "apenas para pesquisa" não passam pelo controle de
        identidade, pureza e esterilidade exigido de um medicamento.
      </p>

      <h2>Efeitos colaterais</h2>
      <p>
        Nos ensaios originais, o AOD-9604 foi geralmente bem tolerado. Os eventos relatados
        eram leves:
      </p>
      <ul>
        <li>Cefaleia leve, reações no local da injeção e sintomas transitórios</li>
        <li>Sem alterações significativas de IGF-1 ou de glicemia nas doses testadas</li>
        <li>Dados de uso prolongado fora de ensaio são escassos</li>
      </ul>
      <p>
        O problema, portanto, não é uma toxicidade evidente de curto prazo, e sim a ausência
        de dados: o perfil de segurança de longo prazo em uso off-label não está estabelecido.
        As contraindicações citadas incluem gravidez e lactação; neoplasia ativa (precaução,
        ainda que não haja elevação documentada de IGF-1); hipersensibilidade; e uso por
        menores de 18 anos.
      </p>

      <h2>Status regulatório</h2>
      <p>
        O AOD-9604 <strong>não tem aprovação</strong> como medicamento em nenhuma agência de
        referência — nem FDA, nem EMA, nem ANVISA. Seu status atual é o de peptídeo de
        pesquisa. Ele não consta atualmente na lista de substâncias proibidas da WADA, mas
        isso não deve ser lido como aval de eficácia ou segurança — reflete apenas a
        classificação antidoping.
      </p>
      <p>
        Em resumo, o AOD-9604 é um caso de ciência que não se confirmou. A hipótese era
        interessante, o programa de testes foi conduzido, e o resultado foi negativo. Quem
        opta por usá-lo hoje deve fazê-lo entendendo que a indicação original falhou na fase
        IIb e que não há um corpo de evidência humana que sustente os usos off-label atuais.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-aod-9604" />
      </div>
    </ArticleLayout>
  );
}
