import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, articleOpenGraph } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'semaglutida-vs-tirzepatida';

export const metadata: Metadata = {
  title: 'Semaglutida vs Tirzepatida: qual escolher em 2026',
  description: 'Comparação detalhada entre Ozempic/Wegovy e Mounjaro/Zepbound: mecanismo, eficácia clínica, efeitos colaterais e custos.',
  alternates: { canonical: `/blog/${SLUG}` },
  ...articleOpenGraph(getArticleBySlug(SLUG)!),
};

export default function Article() {
  const article = getArticleBySlug(SLUG)!;

  return (
    <ArticleLayout article={article}>
      <p>
        Semaglutida e tirzepatida são os dois injetáveis mais buscados para controle
        de peso e diabetes tipo 2. Ambos revolucionaram o tratamento da obesidade nos
        últimos anos, mas funcionam de formas diferentes e têm perfis distintos de
        eficácia, efeitos e custo. Este comparativo consolida dados dos ensaios
        clínicos de fase 3 e das bulas aprovadas pelo FDA.
      </p>

      <h2>Resumo rápido</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Semaglutida</th>
              <th>Tirzepatida</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Marcas</strong></td>
              <td>Ozempic · Wegovy · Rybelsus</td>
              <td>Mounjaro · Zepbound</td>
            </tr>
            <tr>
              <td><strong>Mecanismo</strong></td>
              <td>Agonista GLP-1</td>
              <td>Agonista GLP-1 <em>+</em> GIP (dual)</td>
            </tr>
            <tr>
              <td><strong>Meia-vida</strong></td>
              <td>~7 dias</td>
              <td>~5 dias</td>
            </tr>
            <tr>
              <td><strong>Dose máxima</strong></td>
              <td>2,4 mg/semana</td>
              <td>15 mg/semana</td>
            </tr>
            <tr>
              <td><strong>Perda de peso (48-72 sem)</strong></td>
              <td>~15%</td>
              <td>~21%</td>
            </tr>
            <tr>
              <td><strong>Aprovação FDA</strong></td>
              <td>2017 (DM2), 2021 (obesidade)</td>
              <td>2022 (DM2), 2023 (obesidade)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Como agem no corpo</h2>
      <p>
        <Link href="/peptideos/semaglutida">Semaglutida</Link> é um agonista seletivo
        do receptor GLP-1 (glucagon-like peptide-1). Ela imita um hormônio que o
        intestino libera naturalmente após as refeições, estimulando a produção de
        insulina de forma glicose-dependente, suprimindo o glucagon, retardando o
        esvaziamento gástrico e atuando em centros cerebrais de saciedade.
      </p>
      <p>
        <Link href="/peptideos/tirzepatida">Tirzepatida</Link> faz tudo isso{' '}
        <strong>e mais</strong>: ativa também o receptor GIP (polipeptídeo
        insulinotrópico dependente de glicose). A coativação GIP/GLP-1 parece
        potencializar a sensibilidade à insulina e a supressão do apetite — e é isso
        que explica a maior perda de peso observada nos ensaios.
      </p>

      <h2>Eficácia em perda de peso</h2>
      <p>
        Os dados mais comparáveis vêm de ensaios fase 3 com desenho similar:
      </p>
      <ul>
        <li>
          <strong>STEP-1 (semaglutida 2,4 mg/semana)</strong>: perda média de ~14,9%
          em 68 semanas em adultos com obesidade sem diabetes.
        </li>
        <li>
          <strong>SURMOUNT-1 (tirzepatida 15 mg/semana)</strong>: perda média de
          ~20,9% em 72 semanas — o maior número já visto com medicação oral/injetável.
        </li>
      </ul>
      <p>
        Um estudo de comparação direta publicado em 2024 (SURMOUNT-5) confirmou
        superioridade da tirzepatida sobre a semaglutida em redução de peso:
        ~20,2% contra ~13,7% após 72 semanas.
      </p>

      <h2>Eficácia em diabetes tipo 2</h2>
      <p>
        Para HbA1c, ambas são muito efetivas, mas a tirzepatida leva vantagem:
      </p>
      <ul>
        <li><strong>Semaglutida</strong>: redução média de ~1,5% na HbA1c</li>
        <li><strong>Tirzepatida</strong>: redução de ~1,8-2,4% na HbA1c (dose-dependente)</li>
      </ul>

      <h2>Efeitos colaterais</h2>
      <p>
        Os dois compartilham o mesmo perfil (efeitos gastrointestinais), com
        magnitudes ligeiramente diferentes:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Efeito</th>
              <th>Semaglutida (2,4 mg)</th>
              <th>Tirzepatida (15 mg)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Náusea</td><td>44%</td><td>33%</td></tr>
            <tr><td>Diarreia</td><td>30%</td><td>22%</td></tr>
            <tr><td>Vômito</td><td>25%</td><td>10%</td></tr>
            <tr><td>Constipação</td><td>24%</td><td>17%</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Curiosamente, apesar da maior perda de peso, a tirzepatida tende a apresentar
        <em> menos</em> efeitos gastrointestinais em percentual de pacientes —
        possivelmente pelo efeito antiemético do agonismo GIP.
      </p>
      <p>
        <strong>Contraindicações comuns aos dois:</strong> história pessoal ou
        familiar de carcinoma medular de tireoide (CMT), síndrome de NEM-2, gravidez.
      </p>

      <h2>Custo no Brasil (abril/2026)</h2>
      <p>
        Os preços variam semanalmente — use como referência aproximada:
      </p>
      <ul>
        <li><strong>Ozempic 1 mg</strong>: ~R$ 950-1.200 por pen (4 doses)</li>
        <li><strong>Mounjaro 5 mg</strong>: ~R$ 1.100-1.400 por pen (4 doses)</li>
        <li><strong>Frascos manipulados de semaglutida</strong>: R$ 300-600 (5 mg)</li>
        <li><strong>Frascos manipulados de tirzepatida</strong>: R$ 500-900 (10 mg)</li>
      </ul>
      <p>
        <strong>Nota:</strong> peptídeos manipulados não têm garantia de qualidade
        equivalente aos produtos industrializados. Compre apenas de farmácias com
        procedência comprovada.
      </p>

      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-sema-vs-tirze-mid" peptide="tirzepatida" />
      </div>

      <h2>Qual escolher?</h2>
      <ul>
        <li><strong>Se o foco é perda máxima de peso:</strong> tirzepatida tem vantagem consistente nos ensaios</li>
        <li><strong>Se tolerabilidade é prioridade:</strong> ambos são similares; tirzepatida ligeiramente melhor</li>
        <li><strong>Se experiência de uso é prioridade:</strong> semaglutida tem mais dados de longo prazo (7+ anos desde aprovação) e mais estudos de segurança cardiovascular</li>
        <li><strong>Se orçamento é apertado:</strong> semaglutida manipulada é tipicamente mais barata</li>
      </ul>

      <h2>Decisão é clínica</h2>
      <p>
        Ambos são medicamentos de prescrição. A escolha deve ser feita com um médico
        que considere seu histórico, comorbidades (especialmente risco tiroidiano
        familiar, pancreatite prévia) e objetivos terapêuticos.
      </p>
      <p>
        Para começar a calcular doses no seu frasco manipulado, use a{' '}
        <Link href="/ferramentas/reconstituicao">calculadora de reconstituição</Link>
        {' '}com os dados corretos do rótulo.
      </p>

      <h2>Leia também</h2>
      <ul>
        <li><Link href="/blog/onde-comprar-tirzepatida">Onde comprar tirzepatida com segurança</Link></li>
        <li><Link href="/blog/tirzepatida-preco-quanto-custa">Quanto custa tirzepatida por dose</Link></li>
        <li><Link href="/blog/como-reconstituir-tirzepatida">Como reconstituir tirzepatida 5, 10 e 15 mg</Link></li>
        <li><Link href="/blog/mounjaro-falso-como-identificar">Mounjaro falso: como identificar</Link></li>
        <li><Link href="/blog/tirzepatida-manipulada-seguranca">Tirzepatida manipulada: riscos e como escolher a farmácia</Link></li>
      </ul>

      <div className="my-8 not-prose">
        <AffiliateBox
          productId="fornecedor_oficial"
          slot="blog-sema-vs-tirze"
          peptide="tirzepatida"
        />
      </div>
    </ArticleLayout>
  );
}
