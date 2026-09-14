import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'semax-nootropico';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'O Semax funciona mesmo como nootrópico?',
    a: 'Depende de para quem e para quê. Na Rússia existe um corpo considerável de pesquisa clínica apoiando seu uso neuroprotetor (por exemplo em AVC isquêmico e recuperação cognitiva), e o Semax consta da lista de medicamentos essenciais do país. Já a evidência para uso em pessoas saudáveis buscando "foco" ou "memória" é muito mais fraca, e a literatura peer-reviewed indexada em inglês é modesta. É honesto dizer que o Semax é promissor e bem tolerado nos dados russos, mas que faltam ensaios grandes, independentes e replicados no padrão ocidental.',
  },
  {
    q: 'Semax ou Selank, qual a diferença?',
    a: 'Os dois são heptapeptídeos russos, intranasais e nascidos no mesmo instituto — mas com propósitos diferentes. O Semax é orientado à cognição e à neuroproteção, com mecanismo centrado em BDNF/TrkB e melanocortina. O Selank é um ansiolítico, que modula o sistema GABAérgico sem a sedação e a dependência dos benzodiazepínicos. Veja a comparação lado a lado em /comparar/semax-vs-selank.',
  },
  {
    q: 'O Semax é aprovado no Brasil?',
    a: 'Não. O Semax não tem registro na ANVISA — nem aprovação da FDA ou da EMA. Ele é aprovado e comercializado essencialmente na Rússia (e em alguns países vizinhos). No Brasil, qualquer Semax disponível vem do mercado não regulado, sem garantia de identidade, pureza ou dose.',
  },
  {
    q: 'O Semax causa dependência?',
    a: 'Nos estudos publicados não há relatos significativos de dependência, tolerância ou síndrome de abstinência — um dos pontos que o diferencia de estimulantes e de ansiolíticos benzodiazepínicos. Ainda assim, os dados de uso prolongado fora da Rússia são limitados, então "ausência de relato" não é o mesmo que "segurança de longo prazo comprovada em larga escala".',
  },
  {
    q: 'Como o Semax é usado (dose/via)?',
    a: 'A forma clássica russa é intranasal, nas concentrações de 0,1% ou 1%. As doses estudadas vão de cerca de 200 mcg a 2000 mcg por dia, geralmente divididas em 1-2 aplicações, conforme a indicação. A meia-vida plasmática é de poucos minutos, mas os efeitos centrais persistem por várias horas. Não existe "dose de bula" validada no Brasil, já que o produto não é aprovado aqui.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        Entre os peptídeos ligados à cognição, o Semax ocupa uma posição peculiar: ao
        contrário da maioria dos compostos vendidos como "nootrópicos de pesquisa", ele é um
        medicamento de verdade — registrado, fabricado e prescrito. O detalhe é que isso
        acontece essencialmente em um único país. Este artigo explica o que o Semax é, como
        ele age no cérebro e, com honestidade, o que a evidência realmente sustenta.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> o Semax é usado clinicamente na Rússia e consta da
        lista russa de medicamentos vitais e essenciais, mas <strong>não</strong> tem
        aprovação da FDA, da EMA nem da ANVISA. A literatura peer-reviewed em inglês é
        modesta. Este artigo é informativo e não é indicação de uso.
      </div>

      <h2>O que é o Semax</h2>
      <p>
        O Semax é um heptapeptídeo sintético (Met-Glu-His-Phe-Pro-Gly-Pro), <strong>análogo
        do fragmento ACTH(4-10)</strong> — uma porção do hormônio adrenocorticotrófico que já
        não carrega a atividade hormonal clássica. A ele foi acoplada uma modificação
        C-terminal (Pro-Gly-Pro) para aumentar a estabilidade metabólica.
      </p>
      <p>
        Foi desenvolvido no final dos anos 1980 no Instituto de Genética Molecular da Academia
        Russa de Ciências e é usado clinicamente na Rússia como nootrópico e neuroprotetor —
        em contextos como AVC isquêmico, encefalopatia, transtornos cognitivos e distúrbios do
        nervo óptico. Para os dados técnicos completos — sequência, faixa de dose e referências
        — consulte a{' '}
        <Link href="/peptideos/semax">ficha técnica do Semax</Link>.
      </p>

      <h2>Como funciona</h2>
      <p>
        O mecanismo mais bem descrito é a <strong>elevação rápida do BDNF</strong> (fator
        neurotrófico derivado do cérebro) e do seu receptor TrkB no hipocampo. Em modelos
        animais, relatou-se triplicação do RNA mensageiro de BDNF poucas horas após uma única
        dose intranasal. Como o BDNF está ligado à plasticidade sináptica, à sobrevivência
        neuronal e à consolidação de memória, essa é a via mais citada para explicar os efeitos
        cognitivos e neuroprotetores.
      </p>
      <p>
        Além disso, o Semax atua em outros sistemas:
      </p>
      <ul>
        <li><strong>Melanocortina:</strong> age como agonista parcial de receptores de melanocortina (em especial o MC4R), ativando as vias de sinalização cAMP/PKA e MAPK/ERK.</li>
        <li><strong>Dopamina e serotonina:</strong> modula esses sistemas monoaminérgicos, o que ajuda a explicar efeitos sobre humor e atenção.</li>
        <li><strong>Encefalinas:</strong> inibe enzimas que degradam encefalinas endógenas, com possível efeito analgésico e antidepressivo indireto.</li>
      </ul>

      <h2>O que a evidência mostra</h2>
      <p>
        Aqui vale ser direto. Existe um volume relevante de pesquisa clínica russa com o Semax,
        sobretudo em cenários neurológicos (AVC, recuperação cognitiva), e o composto consta da
        <strong> Lista Russa de Medicamentos Vitais e Essenciais</strong> (aprovada pelo governo
        em 07/12/2011). Isso é bem mais do que a maioria dos peptídeos "de pesquisa" pode
        mostrar.
      </p>
      <p>
        Por outro lado, a literatura peer-reviewed indexada em inglês é significativamente mais
        modesta que o corpo total de publicações russas. Muitos estudos são pequenos e nem
        sempre seguem o rigor metodológico (duplo-cego, placebo, amostra ampla) esperado no
        Ocidente. Isso não quer dizer que o Semax "não funciona" — quer dizer que a base de
        evidência internacional é limitada, e que o efeito em pessoas saudáveis usando o
        composto off-label como "turbinador cognitivo" é muito menos estabelecido do que o uso
        neuroprotetor estudado em hospitais russos.
      </p>

      <h2>Uso e formulação (intranasal)</h2>
      <p>
        A forma clássica russa do Semax é <strong>intranasal</strong> (gotas ou spray), nas
        concentrações de 0,1% e 1%. A via nasal favorece o acesso ao sistema nervoso central e
        contorna a meia-vida plasmática muito curta — de poucos minutos —, enquanto os efeitos
        centrais persistem por várias horas.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th>Parâmetro</th><th>Referência (uso russo)</th></tr>
          </thead>
          <tbody>
            <tr><td>Via</td><td>Intranasal (gotas/spray)</td></tr>
            <tr><td>Concentração</td><td>0,1% ou 1%</td></tr>
            <tr><td>Faixa de dose</td><td>200 a 2000 mcg/dia, em 1-2 aplicações</td></tr>
            <tr><td>Meia-vida</td><td>Plasmática de minutos; efeitos centrais por horas</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Quem obtém o Semax como pó liofilizado no mercado cinza precisa reconstituí-lo antes do
        uso — o mesmo princípio de qualquer peptídeo injetável ou nasal, detalhado na{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link>. Vale
        lembrar que produtos fora do circuito regulado não têm garantia de pureza nem de dose.
      </p>

      <h2>Efeitos colaterais</h2>
      <ul>
        <li>Tolerabilidade descrita como favorável no uso intranasal na literatura clínica russa</li>
        <li>Possível irritação nasal local e cefaleia transitória</li>
        <li>Dados de uso prolongado fora da Rússia são limitados</li>
        <li>Sem relatos significativos de dependência ou tolerância</li>
      </ul>
      <p>
        As precauções descritas incluem gravidez e lactação (dados insuficientes), transtornos
        psicóticos agudos ou mania (cautela pela ação em sistemas monoaminérgicos),
        hipersensibilidade ao composto e uso pediátrico fora de protocolos russos específicos.
      </p>

      <h2>Status regulatório</h2>
      <p>
        Na Rússia, o Semax é aprovado e está na lista de medicamentos essenciais. Fora dela, o
        cenário muda: <strong>FDA, EMA e ANVISA nunca o avaliaram ou aprovaram</strong>. No
        Brasil, ele não tem registro, e o acesso ocorre apenas pelo mercado não regulado — com
        os riscos de identidade, pureza e dose que isso implica. Um ponto a favor: ao contrário
        dos secretagogos de GH, o Semax <strong>não é proibido pela WADA</strong>.
      </p>

      <h2>Semax e Selank: qual a diferença</h2>
      <p>
        Semax e Selank são frequentemente citados juntos, e não por acaso: ambos são
        heptapeptídeos intranasais nascidos do mesmo instituto russo. Mas têm alvos distintos —
        o Semax mira cognição e neuroproteção (BDNF, melanocortina), enquanto o Selank é um
        ansiolítico que modula o sistema GABAérgico. Para entender as diferenças:
      </p>
      <ul>
        <li><Link href="/comparar/semax-vs-selank">Semax vs Selank: comparação lado a lado</Link></li>
        <li><Link href="/peptideos/selank">Ficha técnica do Selank</Link></li>
        <li><Link href="/blog/selank-ansiedade">Selank: o peptídeo ansiolítico russo</Link></li>
      </ul>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-semax" />
      </div>
    </ArticleLayout>
  );
}
