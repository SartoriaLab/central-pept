import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'ghrp-2-o-que-e';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'O GHRP-2 é aprovado em algum lugar?',
    a: 'Sim, mas apenas no Japão. Lá o GHRP-2 (pralmorelina) é aprovado como agente diagnóstico da deficiência de GH em adultos, sob o nome GHRP Kaken 100 (Kaken Pharmaceutical). Não tem registro na FDA, na EMA nem na ANVISA. Fora do Japão, e fora do uso diagnóstico, é tratado como peptídeo de pesquisa, sem respaldo regulatório para uso humano.',
  },
  {
    q: 'GHRP-2 ou GHRP-6, qual a diferença?',
    a: 'Os dois são GHRPs, agonistas do receptor de grelina que estimulam a liberação de GH. A diferença prática está no perfil: o GHRP-6 estimula o apetite de forma muito mais intensa — é o que mais "dá fome" da classe — e eleva cortisol e prolactina de maneira mais marcada; o GHRP-2 tem estímulo de fome mais moderado. Além disso, o GHRP-2 tem aprovação regional (Japão, diagnóstico), enquanto o GHRP-6 nunca foi aprovado em lugar nenhum.',
  },
  {
    q: 'O GHRP-2 aumenta muito a fome?',
    a: 'O GHRP-2 estimula o apetite porque ativa o receptor de grelina — o mesmo hormônio da fome —, mas de forma menos intensa que o GHRP-6. Ainda assim, aumento de fome é um efeito esperado do peptídeo, apenas em grau mais moderado que o do "primo" GHRP-6.',
  },
  {
    q: 'GHRP-2 é detectado no antidoping?',
    a: 'Sim. O GHRP-2 é proibido pela WADA (classe S2, hormônios peptídicos) dentro e fora de competição, e existem métodos validados de LC–MS/MS para detectá-lo na urina, com casos positivos já sancionados. Não é uma substância "indetectável", ao contrário do que às vezes se afirma no mercado.',
  },
  {
    q: 'Qual a dose de GHRP-2?',
    a: 'A única dose com respaldo de bula é a do uso diagnóstico japonês: 100 µg por via intravenosa, em dose única. Fora dessa indicação não existe dose aprovada. Protocolos informais e de manipulação usam em torno de 100 µg por via subcutânea, 2 a 3 vezes ao dia, mas isso é off-label, sem validação regulatória e sujeito aos riscos do mercado não regulado.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        O GHRP-2 é um dos secretagogos de GH mais citados no universo dos "peptídeos do
        hormônio do crescimento", ao lado de nomes como GHRP-6, ipamorelina e hexarelina.
        Seu ponto distintivo tem menos a ver com potência e mais com regulação: ele é o único
        do grupo que chegou a receber aprovação de uma agência — mas em um único país e para
        uma única finalidade.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> o GHRP-2 é aprovado <strong>apenas no Japão</strong> e
        somente como <strong>agente diagnóstico</strong>. Não tem registro na FDA, na EMA nem
        na ANVISA. É <strong>proibido pela WADA</strong> (classe S2), com métodos de detecção
        já validados. Este artigo é informativo e não é indicação de uso.
      </div>

      <h2>O que é o GHRP-2 (pralmorelina)</h2>
      <p>
        O GHRP-2 (pralmorelina, código de desenvolvimento GPA-748) é um{' '}
        <strong>hexapeptídeo sintético</strong> da família dos GHRPs — os peptídeos liberadores
        de hormônio do crescimento. Ele age como <strong>agonista do receptor de grelina</strong>,
        estimulando a hipófise a liberar GH. Recebeu aprovação regulatória apenas no Japão
        (Kaken Pharmaceutical), onde é usado como agente diagnóstico para deficiência de GH em
        adultos sob o nome <strong>GHRP Kaken 100</strong>. Não é aprovado pelo FDA, pela EMA
        nem pela ANVISA.
      </p>
      <p>
        Para ver os dados técnicos completos — meia-vida, faixa de dose e referências dos
        estudos — consulte a{' '}
        <Link href="/peptideos/ghrp-2">ficha técnica do GHRP-2</Link>.
      </p>

      <h2>Como funciona: receptor de grelina e sinergia com o GHRH</h2>
      <p>
        O GHRP-2 é um agonista do receptor <strong>GHSR-1a</strong> — o receptor da grelina,
        também chamado receptor secretagogo de GH — presente nos somatotrofos da hipófise e no
        hipotálamo. Ao ativá-lo, estimula a liberação pulsátil de GH, imitando parte do que a
        grelina endógena faz.
      </p>
      <p>
        Um ponto importante do mecanismo é a <strong>sinergia com análogos de GHRH</strong>: em
        coadministração, GHRP e GHRH agem em receptores diferentes e complementares, amplificando
        a liberação de GH mais do que qualquer um isolado. É por isso que, no uso de pesquisa e no
        mercado manipulado, o GHRP-2 costuma aparecer combinado a análogos de GHRH — o mesmo
        princípio por trás de combos como CJC-1295 + ipamorelina.
      </p>

      <h2>GHRP-2 vs outros GHRPs: cortisol, prolactina e apetite</h2>
      <p>
        Dentro da classe, o GHRP-2 ocupa um meio-termo. Comparado à ipamorelina, é{' '}
        <strong>menos seletivo</strong>: eleva ACTH, cortisol e prolactina de forma
        dose-dependente. Mas essa elevação costuma ser de <strong>magnitude inferior</strong> à
        provocada pela hexarelina e pelo GHRP-6. No apetite, vale a mesma lógica — ele estimula a
        fome, porém menos que o GHRP-6.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th>Característica</th><th>GHRP-2</th><th>GHRP-6</th></tr>
          </thead>
          <tbody>
            <tr><td>Estímulo de apetite</td><td>Moderado</td><td>Muito intenso (o maior da classe)</td></tr>
            <tr><td>Cortisol / prolactina</td><td>Elevação dose-dependente</td><td>Elevação mais marcada</td></tr>
            <tr><td>Status regulatório</td><td>Aprovado no Japão (diagnóstico)</td><td>Nunca aprovado (pesquisa)</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Para aprofundar, veja a{' '}
        <Link href="/comparar/ghrp-2-vs-ghrp-6">comparação GHRP-2 vs GHRP-6</Link>, a{' '}
        <Link href="/peptideos/ghrp-6">ficha técnica do GHRP-6</Link> e o guia{' '}
        <Link href="/blog/ghrp-6-o-que-e">GHRP-6: o secretagogo de GH que dá fome</Link>.
      </p>

      <h2>Status regulatório (só o Japão) e antidoping</h2>
      <p>
        O único registro do GHRP-2 no mundo é o japonês, restrito ao uso diagnóstico. Fora dessa
        indicação — e fora do Japão — ele é considerado um <strong>peptídeo de pesquisa</strong>,
        sem aprovação para uso terapêutico. No Brasil, não há registro na ANVISA.
      </p>
      <p>
        No esporte, o GHRP-2 é <strong>proibido pela WADA</strong> (classe S2), dentro e fora de
        competição. Existem métodos validados de LC–MS/MS para detectá-lo na urina em controle
        antidoping, e já houve casos positivos sancionados. Ou seja: não é uma substância que
        "passa despercebida" nos testes.
      </p>

      <h2>Efeitos colaterais</h2>
      <p>
        Entre os efeitos relatados do GHRP-2 estão:
      </p>
      <ul>
        <li>Reações no local da injeção</li>
        <li>Elevação de cortisol e ACTH (dose-dependente)</li>
        <li>Elevação leve a moderada de prolactina</li>
        <li>Rubor e sensação de calor</li>
        <li>Estímulo de apetite (menos intenso que o GHRP-6)</li>
        <li>Cefaleia</li>
      </ul>
      <p>
        Como não há bula ampla, as contraindicações vêm do que se conhece do peptídeo e da classe:
        malignidade ativa, gestação e lactação, doença crítica aguda, distúrbios do eixo
        hipotálamo-hipófise-adrenal e hipersensibilidade ao peptídeo.
      </p>

      <h2>Dose</h2>
      <p>
        A única referência com respaldo de bula é a do <strong>uso diagnóstico no Japão</strong>:{' '}
        <strong>100 µg por via intravenosa, em dose única</strong>. Fora dessa indicação, não
        existe dose aprovada. Em protocolos informais e de manipulação, o GHRP-2 aparece em torno
        de 100 µg por via subcutânea, 2 a 3 vezes ao dia — a meia-vida curta, estimada em cerca de
        15 a 60 minutos, é o que justifica as múltiplas aplicações diárias. Vale reforçar: isso é
        off-label, sem validação regulatória.
      </p>
      <p>
        Quem lida com peptídeos manipulados em pó precisa reconstituí-los antes do uso. Para
        acertar a proporção de água e a marcação na seringa, veja a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link>.
      </p>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-ghrp-2" />
      </div>
    </ArticleLayout>
  );
}
