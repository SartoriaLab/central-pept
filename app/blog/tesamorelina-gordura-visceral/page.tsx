import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';

const SLUG = 'tesamorelina-gordura-visceral';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'A tesamorelina serve para emagrecer em geral?',
    a: 'Não é para isso que ela foi aprovada. A indicação da tesamorelina (Egrifta) é reduzir o excesso de gordura visceral abdominal em adultos HIV-positivos com lipodistrofia, medida por imagem — e não perda de peso na balança em pessoas saudáveis. Nos estudos pivotais, a redução de gordura visceral foi de ~15-18% em 26 semanas nessa população específica. Usá-la como "emagrecedor" geral é off-label e não foi avaliado em ensaios regulatórios.',
  },
  {
    q: 'Qual a dose da tesamorelina?',
    a: 'A dose aprovada é fixa: 2 mg por dia, por via subcutânea. Diferente dos análogos de GLP-1, não há esquema de titulação com subida gradual — a bula trabalha com dose única. Por ser um peptídeo liofilizado (em pó), precisa ser reconstituída com diluente antes da aplicação.',
  },
  {
    q: 'Tesamorelina x sermorelina, qual a diferença?',
    a: 'Ambas são análogos do GHRH que estimulam a liberação do próprio GH. As diferenças mais importantes são de estrutura e de status regulatório: a tesamorelina tem uma modificação N-terminal que a torna resistente à enzima DPP-4 e tem indicação aprovada pela FDA (Egrifta) para gordura visceral no HIV; a sermorelina é uma versão mais curta (GRF 1-29) cujo produto original foi descontinuado. Veja a ficha da sermorelina para os detalhes.',
  },
  {
    q: 'A tesamorelina é aprovada no Brasil?',
    a: 'Não. A Egrifta (tesamorelina) tem aprovação da FDA nos Estados Unidos, mas não tem registro comercial na ANVISA. Produtos oferecidos no Brasil como "tesamorelina" vêm de manipulação ou do mercado não regulado, sem a garantia de identidade, pureza e dose de um medicamento registrado — um risco relevante em um peptídeo injetável.',
  },
  {
    q: 'Quais os efeitos colaterais da tesamorelina?',
    a: 'Os mais relatados são artralgia (dor articular), reações no local da injeção (eritema, prurido, dor, hematoma), dor em extremidades e mialgia, edema periférico, parestesia e náusea. Há contraindicações formais, como malignidade ativa, gravidez, disfunção do eixo hipotálamo-hipofisário e hipersensibilidade aos componentes. O uso deve ser acompanhado por um médico.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        A tesamorelina é um dos poucos peptídeos análogos de hormônios com aprovação
        regulatória formal — e, ao mesmo tempo, um dos mais mal compreendidos. Vendida em
        fóruns e no mercado de manipulados como promessa de "queima de gordura" ou
        "anti-idade", sua única indicação realmente aprovada é muito mais estreita: reduzir
        gordura visceral abdominal em um grupo específico de pacientes. Entender essa
        distinção é o que separa informação de marketing.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> a indicação aprovada da tesamorelina (marca{' '}
        <strong>Egrifta</strong>) é <strong>específica</strong> — redução de excesso de
        gordura visceral abdominal em adultos <strong>HIV-positivos com lipodistrofia</strong>.
        Usá-la para perda de gordura geral, estética ou "anti-idade" é uso <strong>off-label</strong>,
        sem respaldo de ensaios regulatórios. É <strong>proibida pela WADA</strong> (categoria S2).
        Este texto é informativo e não é indicação de uso.
      </div>

      <h2>O que é a tesamorelina</h2>
      <p>
        A tesamorelina é um <strong>análogo sintético do GHRH humano</strong> (hormônio
        liberador de hormônio do crescimento), composto por 44 aminoácidos. Ela recebeu uma
        modificação química na extremidade N-terminal — a adição de um ácido trans-3-hexenoico
        no resíduo Tyr1 — que a torna resistente à degradação pela enzima DPP-4 e prolonga sua
        meia-vida funcional em relação ao GHRH natural. Foi aprovada pela FDA em 2010 sob a
        marca Egrifta, com uma formulação atualizada (Egrifta WR) liberada posteriormente.
      </p>
      <p>
        Para os dados técnicos completos — meia-vida, faixa de dose e referências dos
        estudos — consulte a{' '}
        <Link href="/peptideos/tesamorelina">ficha técnica da tesamorelina</Link>.
      </p>

      <h2>Como funciona</h2>
      <p>
        O mecanismo é indireto e vale a pena entender, porque explica tanto os efeitos quanto
        os limites do peptídeo. A tesamorelina liga-se e ativa o receptor de GHRH na hipófise
        anterior, estimulando a síntese e a <strong>liberação pulsátil endógena de hormônio do
        crescimento (GH)</strong>. Ou seja: ela não é GH — ela faz o próprio corpo produzir mais
        GH, dentro de um padrão fisiológico de pulsos.
      </p>
      <p>
        O GH liberado atua de duas formas: diretamente nos tecidos-alvo e indiretamente,
        estimulando a produção hepática de <strong>IGF-1</strong>. O efeito relevante para a
        indicação aprovada é a <strong>lipólise</strong> (quebra de gordura), que ocorre
        preferencialmente no <strong>tecido adiposo visceral</strong> — a gordura profunda do
        abdome, ao redor dos órgãos. A modificação N-terminal protege a molécula da clivagem
        pela DPP-4, o que resulta em meia-vida plasmática de cerca de <strong>26 a 38 minutos</strong>:
        mais longa que a do GHRH endógeno, mas ainda curta — o que justifica a aplicação diária.
      </p>

      <h2>A indicação aprovada</h2>
      <p>
        Aqui está o ponto central. A única indicação aprovada da tesamorelina é a
        <strong> redução do excesso de gordura abdominal visceral (lipodistrofia) em adultos
        HIV-positivos</strong> em terapia antirretroviral. A lipodistrofia associada ao HIV é
        uma redistribuição anormal da gordura corporal, com acúmulo de gordura visceral — que
        está ligado a maior risco metabólico e cardiovascular.
      </p>
      <p>
        Nos estudos pivotais que embasaram a aprovação, a tesamorelina produziu reduções médias
        de cerca de <strong>15% a 18% no tecido adiposo visceral após 26 semanas</strong> de uso.
        É importante ler esse número no contexto: trata-se de redução de gordura visceral medida
        por imagem, em uma população específica — e não de perda de peso na balança nem de
        emagrecimento estético generalizado.
      </p>

      <h2>Dose</h2>
      <p>
        A dose aprovada é fixa e simples: <strong>2 mg por dia, por via subcutânea</strong>.
        Diferente dos análogos de GLP-1, não há esquema de titulação com subida gradual — a bula
        trabalha com dose única. Por ser um peptídeo liofilizado (em pó), a tesamorelina precisa
        ser <strong>reconstituída com diluente</strong> antes da aplicação; se você quer entender
        o volume correto e não errar na concentração, a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link> ajuda nessa
        conta. Vale reforçar que a "dose de bula" aqui se refere exclusivamente à indicação aprovada.
      </p>

      <h2>Efeitos colaterais</h2>
      <p>
        Os efeitos adversos mais relatados envolvem articulações, retenção de líquido e o local
        da aplicação:
      </p>
      <ul>
        <li>Artralgia (dor articular)</li>
        <li>Reações no local da injeção (eritema, prurido, dor, hematoma)</li>
        <li>Dor em extremidades e mialgia</li>
        <li>Edema periférico (inchaço)</li>
        <li>Parestesia (formigamento)</li>
        <li>Náusea</li>
      </ul>
      <p>
        Como a tesamorelina eleva o GH e o IGF-1, há atenção especial em relação a esses
        parâmetros. Entre as contraindicações formais estão: disfunção do eixo
        hipotálamo-hipofisário (por hipofisectomia, hipopituitarismo, radiação ou trauma),
        malignidade ativa, gravidez e hipersensibilidade à tesamorelina, ao manitol ou a outros
        excipientes. Qualquer uso deve ser acompanhado por um médico.
      </p>

      <h2>Uso off-label e status no Brasil</h2>
      <p>
        Fora da indicação para lipodistrofia associada ao HIV, a tesamorelina aparece sendo
        usada para perda de gordura geral, performance ou "anti-envelhecimento". Esses usos são
        <strong> off-label</strong> e não foram avaliados em ensaios regulatórios — não há
        evidência aprovada de que "derreta gordura" em pessoas saudáveis nem de que seja segura
        nessa finalidade a longo prazo. Além disso, a tesamorelina é <strong>proibida pela WADA
        na categoria S2</strong>, o que a torna inelegível para atletas sob controle antidoping.
      </p>
      <p>
        No Brasil, a Egrifta <strong>não tem registro comercial na ANVISA</strong>. Isso
        significa que produtos oferecidos como "tesamorelina" vêm de manipulação ou do mercado
        não regulado, sem a garantia de identidade, pureza e dose de um medicamento registrado —
        um risco relevante em um peptídeo injetável.
      </p>
      <p>
        Para comparar com outros análogos de GHRH e secretagogos de GH, vale ver a ficha da{' '}
        <Link href="/peptideos/sermorelina">sermorelina</Link> e navegar pela{' '}
        <Link href="/peptideos">enciclopédia de peptídeos</Link>.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>
    </ArticleLayout>
  );
}
