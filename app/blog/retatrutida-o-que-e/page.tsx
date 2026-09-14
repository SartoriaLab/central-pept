import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'retatrutida-o-que-e';

export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'A retatrutida já está à venda no Brasil?',
    a: 'Não. A retatrutida é um medicamento investigacional em ensaios de fase 3 (programa TRIUMPH) e não tem aprovação da ANVISA, da FDA nem da EMA. Qualquer produto vendido como "retatrutida" fora de um ensaio clínico é de origem não regulada, sem garantia de identidade, pureza ou dose.',
  },
  {
    q: 'Quanto a retatrutida faz emagrecer?',
    a: 'Nos dados de fase 2 (NEJM, 2023), a perda de peso média chegou a ~24% em 48 semanas com a dose de 12 mg/semana em pessoas sem diabetes. Em dezembro de 2025 a Eli Lilly reportou ~28,7% de perda média em 68 semanas no ensaio de fase 3 TRIUMPH-4. São resultados de ensaio controlado — não uma promessa de resultado individual.',
  },
  {
    q: 'Qual a diferença entre retatrutida, semaglutida e tirzepatida?',
    a: 'A semaglutida ativa só o receptor GLP-1; a tirzepatida ativa GLP-1 + GIP (agonista duplo); a retatrutida ativa GLP-1 + GIP + glucagon (agonista triplo). O componente de glucagon aumenta o gasto energético e a lipólise hepática, o que ajuda a explicar a perda de peso maior observada nos ensaios. A diferença prática mais importante hoje: semaglutida e tirzepatida são aprovadas; a retatrutida ainda não.',
  },
  {
    q: 'Quais os efeitos colaterais da retatrutida?',
    a: 'Assim como os outros agonistas de GLP-1, os efeitos mais comuns são gastrointestinais: náusea (até ~43% na fase 2), diarreia, constipação e vômito, geralmente durante a subida de dose. Em doses mais altas, relatou-se disestesia (sensações cutâneas anormais). Como é um medicamento experimental, o perfil de segurança de longo prazo ainda está sendo estabelecido.',
  },
  {
    q: 'Qual a dose da retatrutida?',
    a: 'As doses estudadas nos ensaios vão de 1 a 12 mg por semana, subcutânea, com titulação gradual. Não existe uma "dose de bula" porque o medicamento não foi aprovado. Os esquemas de subida de dose usados nos ensaios servem justamente para reduzir os efeitos gastrointestinais.',
  },
];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        A retatrutida (código de desenvolvimento LY3437943) é apontada como a próxima
        geração dos medicamentos para obesidade — o passo além da semaglutida (Ozempic,
        Wegovy) e da tirzepatida (Mounjaro, Zepbound). O que a coloca em evidência são os
        números de perda de peso nos ensaios clínicos, os maiores já vistos nessa classe.
      </p>

      <div className="not-prose p-4 rounded-xl bg-amber-50 border border-amber-200 my-6 text-sm text-amber-900 leading-relaxed">
        <strong>⚠️ Importante:</strong> a retatrutida é um medicamento <strong>experimental</strong>.
        Até o momento <strong>não</strong> tem aprovação da FDA, da EMA nem da ANVISA — está em
        ensaios de fase 3. Este artigo é informativo e não é indicação de uso.
      </div>

      <h2>O que é a retatrutida</h2>
      <p>
        A retatrutida é um peptídeo sintético da Eli Lilly, com 39 aminoácidos e uma cadeia
        de ácido graxo que permite aplicação semanal. Ela é um <strong>agonista triplo</strong>:
        ativa ao mesmo tempo os receptores de GLP-1, GIP e glucagon. É essa combinação de três
        alvos que a diferencia dos medicamentos já disponíveis.
      </p>
      <p>
        Para ver os dados técnicos completos — meia-vida, faixa de dose e referências dos
        ensaios — consulte a{' '}
        <Link href="/peptideos/retatrutide">ficha técnica da retatrutida</Link>.
      </p>

      <h2>Como funciona o agonismo triplo</h2>
      <p>
        Os três alvos têm papéis complementares:
      </p>
      <ul>
        <li><strong>GLP-1:</strong> aumenta a insulina de forma dependente de glicose, reduz o glucagon pós-refeição, retarda o esvaziamento gástrico e age nos centros de saciedade.</li>
        <li><strong>GIP:</strong> contribui para a sensibilidade à insulina e para o metabolismo de gordura.</li>
        <li><strong>Glucagon:</strong> aumenta o gasto energético e a queima de gordura no fígado — o diferencial que ajuda a explicar a perda de peso maior.</li>
      </ul>

      <h2>Quanto a retatrutida faz emagrecer?</h2>
      <p>
        Os números vêm dos ensaios controlados:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th>Estudo</th><th>Duração</th><th>Perda de peso média</th></tr>
          </thead>
          <tbody>
            <tr><td>Fase 2 (NEJM, 2023) — 12 mg/sem</td><td>48 semanas</td><td>~24%</td></tr>
            <tr><td>TRIUMPH-4 (fase 3, 2025)</td><td>68 semanas</td><td>~28,7%</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Para comparação, a tirzepatida chegou a ~20,9% no SURMOUNT-1 e a semaglutida a ~15%
        no STEP-1. Vale lembrar que são médias de ensaio, com acompanhamento e titulação
        controlados — não um resultado garantido para cada pessoa.
      </p>

      <h2>Dose usada nos ensaios</h2>
      <p>
        As doses investigacionais vão de <strong>1 a 12 mg por semana</strong>, subcutâneas,
        com subida gradual. Não há dose de bula porque o medicamento não foi aprovado. Como em
        toda a classe, a titulação lenta serve para reduzir os efeitos gastrointestinais — o
        mesmo princípio da{' '}
        <Link href="/ferramentas/titulacao">calculadora de subida de dose GLP-1</Link>.
      </p>

      <h2>Efeitos colaterais</h2>
      <ul>
        <li>Náusea (até ~43% na fase 2), diarreia, constipação e vômito</li>
        <li>Diminuição do apetite</li>
        <li>Disestesia (sensações cutâneas anormais) em doses mais altas</li>
      </ul>
      <p>
        Por ser experimental, contraindicações formais ainda não estão em bula. Nos ensaios,
        excluíram-se pessoas com história pessoal/familiar de carcinoma medular de tireoide ou
        NEM 2, história de pancreatite, e gestantes/lactantes.
      </p>

      <h2>Está disponível no Brasil?</h2>
      <p>
        Não. A retatrutida está em fase 3 e <strong>não tem registro na ANVISA</strong>.
        Produtos oferecidos como "retatrutida" fora de ensaios clínicos vêm do mercado não
        regulado, sem garantia de identidade, pureza ou dose — um risco relevante com um
        peptídeo injetável.
      </p>

      <h2>Retatrutida vs semaglutida e tirzepatida</h2>
      <p>
        Se você quer entender as diferenças lado a lado, veja as comparações:
      </p>
      <ul>
        <li><Link href="/comparar/tirzepatida-vs-retatrutide">Tirzepatida vs Retatrutide</Link></li>
        <li><Link href="/comparar/semaglutida-vs-retatrutide">Semaglutida vs Retatrutide</Link></li>
        <li><Link href="/blog/semaglutida-vs-tirzepatida">Semaglutida vs Tirzepatida: comparativo</Link></li>
      </ul>

      <div className="not-prose">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-retatrutida" peptide="tirzepatida" />
      </div>
    </ArticleLayout>
  );
}
