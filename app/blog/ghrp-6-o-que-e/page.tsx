import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';

const SLUG = 'ghrp-6-o-que-e';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Por que o GHRP-6 dá tanta fome?',
    a: 'Porque, além de agir na hipófise, o GHRP-6 ativa o receptor de grelina (GHSR-1a) no núcleo arqueado do hipotálamo e no núcleo do trato solitário — os mesmos circuitos que a grelina endógena, o "hormônio da fome", usa para sinalizar apetite. Entre todos os GHRPs, o GHRP-6 é o que estimula o apetite de forma mais intensa, e esse efeito costuma aparecer logo depois da aplicação.',
  },
  {
    q: 'GHRP-6 ou GHRP-2, qual escolher?',
    a: 'Os dois são secretagogos de GH e agonistas do receptor de grelina, muito parecidos no mecanismo. A diferença mais prática é o apetite: o GHRP-6 estimula a fome de forma bem mais intensa, enquanto o GHRP-2 é mais "limpo" nesse aspecto. Há também uma diferença regulatória — o GHRP-2 (pralmorelina) tem aprovação regional no Japão como agente diagnóstico, ao passo que o GHRP-6 nunca foi aprovado em lugar nenhum. Ambos são proibidos pela WADA.',
  },
  {
    q: 'O GHRP-6 é aprovado?',
    a: 'Não. Apesar de ter sido bastante estudado em ensaios clínicos iniciais (inclusive por via oral em crianças com baixa estatura), o GHRP-6 nunca obteve aprovação regulatória para comercialização em nenhum país. Ele permanece um peptídeo exclusivamente de pesquisa, sem registro na ANVISA, na FDA ou na EMA.',
  },
  {
    q: 'GHRP-6 pega no antidoping?',
    a: 'Sim. O GHRP-6 é proibido pela WADA, na classe S2 (hormônios peptídicos, fatores de crescimento e secretagogos de GH), dentro e fora de competição. Atletas sujeitos a controle antidoping não devem usá-lo.',
  },
  {
    q: 'Qual a dose de GHRP-6?',
    a: 'Não existe dose de bula, porque o GHRP-6 não foi aprovado como medicamento. Nos estudos de pesquisa, as faixas descritas vão de 100 a 400 µg/kg por via intravenosa, e a meia-vida de eliminação é de cerca de 2,5 horas. Não há esquema clínico validado nem dose segura estabelecida para uso fora de pesquisa.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        O GHRP-6 é um dos nomes mais antigos — e mais citados — no universo dos peptídeos
        secretagogos de hormônio do crescimento (GH). Ele ficou conhecido por dois motivos:
        por ser o protótipo farmacológico da classe dos GHRPs e por um efeito que virou sua
        marca registrada — uma fome intensa que aparece logo após a aplicação. Este artigo
        explica, de forma cautelosa, o que a molécula é, como ela age e por que ela nunca
        saiu do terreno da pesquisa.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> o GHRP-6 é um peptídeo <strong>exclusivamente de
        pesquisa</strong>. Nunca foi aprovado para comercialização em nenhum país — não tem
        registro na ANVISA, na FDA nem na EMA — e é <strong>proibido pela WADA</strong>
        {' '}(classe S2). Este conteúdo é informativo e não é indicação de uso.
      </div>

      <h2>O que é o GHRP-6</h2>
      <p>
        O GHRP-6 (<em>Growth Hormone-Releasing Peptide 6</em>) é um hexapeptídeo sintético —
        seis aminoácidos na sequência His-D-Trp-Ala-Trp-D-Phe-Lys-NH2. Foi um dos primeiros
        GHRPs desenvolvidos e é considerado o <strong>protótipo farmacológico da classe</strong>:
        boa parte do que se sabe hoje sobre esses secretagogos de GH veio justamente dos
        estudos com ele.
      </p>
      <p>
        Durante seu desenvolvimento, o GHRP-6 foi amplamente estudado em ensaios clínicos
        iniciais, incluindo administração por via oral em crianças com baixa estatura. Mesmo
        assim, nunca obteve aprovação regulatória para comercialização em nenhum país. Para os
        dados técnicos completos — sequência, meia-vida e referências dos estudos — consulte a{' '}
        <Link href="/peptideos/ghrp-6">ficha técnica do GHRP-6</Link>.
      </p>

      <h2>Como funciona: receptor de grelina e núcleo arqueado</h2>
      <p>
        O GHRP-6 é um agonista do receptor <strong>GHSR-1a</strong> — o receptor de grelina.
        Nos somatotrofos da hipófise, essa ativação estimula a liberação <strong>pulsátil</strong>
        {' '}de GH, imitando o padrão fisiológico com que o hormônio é secretado.
      </p>
      <p>
        Mas o receptor de grelina não está apenas na hipófise. Ele também aparece em áreas do
        cérebro que controlam a fome — sobretudo o <strong>núcleo arqueado do hipotálamo</strong>
        {' '}e o núcleo do trato solitário. Quando o GHRP-6 ativa esses receptores, dispara o
        mesmo sinal de apetite que a grelina endógena, o chamado "hormônio da fome". É desse
        mecanismo compartilhado que vem o efeito descrito a seguir.
      </p>
      <p>
        Há ainda uma terceira consequência: o GHRP-6 coativa os corticotrofos, elevando ACTH e
        cortisol, e também estimula a liberação de prolactina.
      </p>

      <h2>O apetite como marca da molécula</h2>
      <p>
        Entre todos os GHRPs, o GHRP-6 é o que estimula o apetite de forma mais intensa. Essa
        fome pronunciada costuma surgir pouco depois da aplicação e é consequência direta da
        ativação potente do receptor de grelina nos núcleos hipotalâmicos que regulam a fome.
      </p>
      <p>
        O traço tem dois lados. Em contextos de pesquisa voltados a ganho de peso ou caquexia,
        o estímulo de apetite pode ser visto como um efeito de interesse. Para outros
        objetivos, ele costuma ser incômodo — e é exatamente esse ponto que separa o GHRP-6 de
        secretagogos considerados mais "limpos" nesse aspecto, como a ipamorelina.
      </p>

      <h2>Efeitos colaterais</h2>
      <p>
        Além da fome, o perfil de efeitos relatado com o GHRP-6 inclui:
      </p>
      <ul>
        <li>Aumento acentuado do apetite</li>
        <li>Reações no local da injeção</li>
        <li>Elevação transitória de cortisol e ACTH</li>
        <li>Elevação de prolactina</li>
        <li>Rubor facial e sonolência</li>
        <li>Retenção hídrica</li>
      </ul>
      <p>
        A elevação de cortisol, ACTH e prolactina é mais marcada com o GHRP-6 do que com a
        ipamorelina — um detalhe relevante, já que cortisol cronicamente alto tende a ir na
        direção oposta de muitos objetivos. Nos estudos, figuram como contraindicações
        situações como malignidade ativa, gestação e lactação, doença crítica aguda,
        hiperprolactinemia e distúrbios do eixo adrenal.
      </p>

      <h2>Status regulatório e WADA</h2>
      <p>
        O ponto mais importante para manter expectativas realistas: o GHRP-6 <strong>nunca foi
        aprovado</strong> como medicamento em lugar nenhum. Ele permanece um peptídeo
        exclusivamente de pesquisa, sem registro na ANVISA, na FDA ou na EMA.
      </p>
      <p>
        No esporte, é <strong>proibido pela WADA</strong>, na classe S2 (hormônios peptídicos,
        fatores de crescimento e secretagogos de GH), dentro e fora de competição. Produtos
        vendidos como "GHRP-6" fora de um contexto de pesquisa vêm do mercado não regulado, sem
        garantia de identidade, pureza ou dose — um risco relevante em um peptídeo injetável.
      </p>

      <h2>Dose</h2>
      <p>
        Como o GHRP-6 não foi aprovado, não existe dose de bula. Nas referências de pesquisa, as
        faixas descritas vão de <strong>100 a 400 µg/kg por via intravenosa</strong>, e a
        meia-vida de eliminação é de cerca de 2,5 horas (com uma fase de distribuição de ~7,6
        minutos). Não há esquema clínico validado nem dose segura estabelecida para uso fora de
        pesquisa.
      </p>
      <p>
        Se o seu interesse é apenas entender como peptídeos liofilizados são preparados, veja a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link>.
      </p>

      <h2>Comparações e leituras relacionadas</h2>
      <p>
        O GHRP-6 é quase sempre discutido ao lado do seu parente mais próximo, o GHRP-2. Para
        entender as diferenças lado a lado:
      </p>
      <ul>
        <li><Link href="/comparar/ghrp-2-vs-ghrp-6">GHRP-2 vs GHRP-6: comparativo</Link></li>
        <li><Link href="/peptideos/ghrp-2">Ficha técnica do GHRP-2</Link></li>
        <li><Link href="/blog/ghrp-2-o-que-e">GHRP-2: o que é, como funciona e status</Link></li>
      </ul>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>
    </ArticleLayout>
  );
}
