// Páginas por objetivo ("peptídeos para emagrecer", "peptídeos para cicatrização"...).
// Cada uma vira uma rota /peptideos/categoria/<slug> e lista os peptídeos da categoria
// com dose, meia-vida e status regulatório lado a lado.

import { getPeptides, type Peptide, type PeptideCategory } from './peptides';

export type CategoryPage = {
  slug: string;
  /** Categorias de lib/peptides.ts cobertas por esta página. */
  categories: PeptideCategory[];
  /** Nome curto (chips, breadcrumb). */
  label: string;
  /** H1 e título da página. */
  title: string;
  /** Resumo (meta description e subtítulo). */
  summary: string;
  /** Parágrafos de introdução. */
  intro: string[];
  /** O que pesa na avaliação dos peptídeos desta categoria. */
  keyPoints: string[];
  faq: { q: string; a: string; link?: { label: string; href: string } }[];
};

export const CATEGORY_PAGES: CategoryPage[] = [
  {
    slug: 'emagrecimento',
    categories: ['glp-1', 'weight-loss'],
    label: 'Emagrecimento',
    title: 'Peptídeos para emagrecer',
    summary:
      'Semaglutida, tirzepatida, retatrutida e AOD-9604 lado a lado: dose, frequência, meia-vida, perda de peso nos estudos e situação regulatória de cada um.',
    intro: [
      'Os peptídeos usados para perda de peso com evidência clínica sólida são os agonistas de incretinas: imitam hormônios intestinais (GLP-1, GIP) que aumentam a saciedade, retardam o esvaziamento do estômago e melhoram o controle da glicose. Semaglutida e tirzepatida são aprovadas para obesidade; a retatrutida ainda está em fase 3.',
      'Fora desse grupo, o AOD-9604 — um fragmento do hormônio do crescimento — circula como "queimador de gordura", mas não mostrou eficácia nos ensaios clínicos e não tem aprovação como medicamento.',
    ],
    keyPoints: [
      'Desta lista, só semaglutida (Wegovy) e tirzepatida (Zepbound; Mounjaro no Brasil) têm aprovação regulatória para controle de peso.',
      'A perda média nos estudos de registro foi de 14,9% com semaglutida 2,4 mg (STEP 1, 68 semanas) e de até 20,9% com tirzepatida 15 mg (SURMOUNT-1, 72 semanas).',
      'Todos exigem subida gradual de dose; os efeitos adversos mais comuns são gastrointestinais.',
      'O peso tende a voltar após a interrupção: obesidade é tratada como condição crônica.',
    ],
    faq: [
      {
        q: 'Qual peptídeo emagrece mais?',
        a: 'Entre os aprovados, a tirzepatida: na comparação direta do estudo SURMOUNT-5 a perda média foi de 20,2% do peso em 72 semanas, contra 13,7% com semaglutida (1,7 ou 2,4 mg). A retatrutida mostrou perdas maiores em fase 2, mas ainda não concluiu os estudos de fase 3 nem foi aprovada.',
        link: { label: 'Semaglutida vs Tirzepatida vs Retatrutida', href: '/comparar/semaglutida-vs-tirzepatida-vs-retatrutida' },
      },
      {
        q: 'Peptídeos para emagrecer precisam de receita?',
        a: 'Sim. Semaglutida e tirzepatida são medicamentos de prescrição, com contraindicações e necessidade de acompanhamento. Retatrutida não é aprovada em nenhum país; AOD-9604 não é aprovado como medicamento.',
      },
      {
        q: 'Qual a diferença entre Ozempic, Wegovy, Mounjaro e Zepbound?',
        a: 'São quatro marcas para duas moléculas: Ozempic e Wegovy são semaglutida; Mounjaro e Zepbound são tirzepatida. Cada par se diferencia pela indicação em bula e pela dose máxima.',
        link: { label: 'Guia das marcas', href: '/medicamentos' },
      },
      {
        q: 'O peso volta quando o tratamento para?',
        a: 'Em boa parte. No estudo SURMOUNT-4, quem trocou a tirzepatida por placebo recuperou em média 14% do peso em um ano; com a semaglutida, a extensão do STEP 1 mostrou recuperação de cerca de dois terços do peso perdido.',
        link: { label: 'Efeito rebote após parar tirzepatida', href: '/blog/efeito-rebote-apos-parar-tirzepatida' },
      },
    ],
  },
  {
    slug: 'cicatrizacao',
    categories: ['healing'],
    label: 'Cicatrização',
    title: 'Peptídeos para cicatrização e recuperação de lesões',
    summary:
      'BPC-157 e TB-500 comparados: o que se sabe do mecanismo, as doses citadas em protocolos, a meia-vida e por que nenhum dos dois é aprovado para uso humano.',
    intro: [
      'BPC-157 e TB-500 são os peptídeos mais citados para recuperação de tendões, ligamentos e músculos. Os dois atuam, em modelos experimentais, sobre angiogênese e migração celular — etapas do reparo tecidual.',
      'A evidência, porém, vem quase toda de estudos em animais e em células. Nenhum dos dois tem aprovação regulatória para uso em humanos, e ambos constam na Lista Proibida da WADA.',
    ],
    keyPoints: [
      'Não há ensaios clínicos robustos em humanos: doses "típicas" vêm de protocolos informais, não de bula.',
      'Ambos são proibidos no esporte pela WADA, dentro e fora de competição.',
      'Por estimularem angiogênese, há cautela teórica em quem tem ou teve câncer.',
      'Produtos sem registro variam em pureza e dosagem — procedência é o principal risco prático.',
    ],
    faq: [
      {
        q: 'Qual a diferença entre BPC-157 e TB-500?',
        a: 'BPC-157 é um fragmento de 15 aminoácidos derivado de uma proteína do suco gástrico, usado em doses diárias de microgramas. TB-500 é um fragmento sintético da timosina beta-4, usado em miligramas, uma ou duas vezes por semana. Os mecanismos propostos são diferentes e complementares.',
        link: { label: 'BPC-157 vs TB-500', href: '/comparar/bpc-157-vs-tb-500' },
      },
      {
        q: 'BPC-157 e TB-500 são aprovados?',
        a: 'Não. Nenhum dos dois é aprovado por FDA, EMA ou ANVISA para uso humano. O uso é experimental, sem dose estabelecida em bula.',
      },
      {
        q: 'Podem ser usados juntos?',
        a: 'A combinação é comum em protocolos informais, mas não foi testada em ensaios clínicos — não há dados de segurança ou eficácia da associação em humanos.',
        link: { label: 'Calculadora de mistura', href: '/ferramentas/mistura' },
      },
    ],
  },
  {
    slug: 'hormonio-do-crescimento',
    categories: ['gh'],
    label: 'Hormônio do crescimento',
    title: 'Peptídeos de GH: secretagogos do hormônio do crescimento',
    summary:
      'CJC-1295, ipamorelina, sermorelina, tesamorelina, hexarelina, GHRP-2 e GHRP-6: como cada um estimula o GH, dose, meia-vida e status regulatório.',
    intro: [
      'Estes peptídeos não são hormônio do crescimento: eles estimulam a hipófise a liberar o GH do próprio corpo. Dividem-se em duas famílias. Os análogos de GHRH (sermorelina, tesamorelina, CJC-1295) imitam o hormônio hipotalâmico que dispara a liberação de GH. Os GHRPs (ipamorelina, hexarelina, GHRP-2, GHRP-6) agem no receptor de grelina e amplificam esse pulso.',
      'Apenas a tesamorelina tem aprovação vigente da FDA, para excesso de gordura abdominal em pessoas com HIV e lipodistrofia. Os demais são de uso experimental ou tiveram aprovação restrita e descontinuada.',
    ],
    keyPoints: [
      'A meia-vida varia de minutos (sermorelina) a cerca de uma semana (CJC-1295 com DAC) — isso define a frequência de aplicação.',
      'GHRP-6 e GHRP-2 aumentam o apetite e podem elevar cortisol e prolactina; a ipamorelina é mais seletiva.',
      'Todos os secretagogos de GH são proibidos pela WADA.',
      'Elevar GH e IGF-1 não é isento de risco: retenção de líquido, alteração de glicemia e cautela em histórico de câncer.',
    ],
    faq: [
      {
        q: 'Qual a diferença entre GHRH e GHRP?',
        a: 'Os análogos de GHRH (sermorelina, tesamorelina, CJC-1295) ativam o receptor do hormônio liberador de GH. Os GHRPs (ipamorelina, hexarelina, GHRP-2, GHRP-6) ativam o receptor de grelina. Como as vias são diferentes, os dois tipos costumam ser combinados em protocolos.',
        link: { label: 'CJC-1295 + Ipamorelina', href: '/blog/cjc-ipamorelina-como-combinar' },
      },
      {
        q: 'Algum peptídeo de GH é aprovado?',
        a: 'A tesamorelina é aprovada pela FDA para reduzir gordura abdominal em adultos com HIV e lipodistrofia. A sermorelina já foi aprovada e saiu do mercado por decisão comercial. O GHRP-2 é aprovado no Japão apenas como teste diagnóstico.',
        link: { label: 'Tesamorelina e gordura visceral', href: '/blog/tesamorelina-gordura-visceral' },
      },
      {
        q: 'Peptídeos de GH são doping?',
        a: 'Sim. Hormônio do crescimento, seus fragmentos e os fatores de liberação (GHRH, GHRPs e secretagogos) constam na seção S2 da Lista Proibida da WADA.',
      },
    ],
  },
  {
    slug: 'longevidade',
    categories: ['longevity'],
    label: 'Longevidade',
    title: 'Peptídeos para longevidade',
    summary:
      'MOTS-c e Epithalon: o que são, o que os estudos realmente mostram sobre metabolismo e telomerase e por que ainda são substâncias de pesquisa.',
    intro: [
      'MOTS-c e Epithalon são os peptídeos mais associados a "anti-envelhecimento". O MOTS-c é codificado pelo DNA mitocondrial e estudado por seu papel no metabolismo energético; o Epithalon é um tetrapeptídeo sintético investigado por ativar a telomerase em células.',
      'Os dados são majoritariamente pré-clínicos ou de estudos pequenos. Nenhum dos dois é aprovado como medicamento, e não há dose terapêutica estabelecida.',
    ],
    keyPoints: [
      'Não existe ensaio clínico mostrando aumento de expectativa de vida em humanos com qualquer peptídeo.',
      'As doses divulgadas vêm de protocolos de pesquisa não padronizados.',
      'A meia-vida plasmática de ambos é curta; os efeitos descritos são indiretos.',
      'Sem registro sanitário, a qualidade do produto é o principal risco prático.',
    ],
    faq: [
      {
        q: 'Epithalon aumenta os telômeros?',
        a: 'Estudos em cultura de células e alguns trabalhos pequenos descrevem ativação da telomerase. Não há ensaios clínicos controlados de porte que confirmem benefício clínico ou segurança a longo prazo em humanos.',
        link: { label: 'Epithalon e telomerase', href: '/blog/epithalon-telomerase' },
      },
      {
        q: 'O que é o MOTS-c?',
        a: 'Um peptídeo de 16 aminoácidos codificado pelo DNA mitocondrial. Em modelos animais melhora a sensibilidade à insulina e a capacidade de exercício; os dados em humanos ainda são iniciais.',
        link: { label: 'MOTS-c: o que é', href: '/blog/mots-c-o-que-e' },
      },
      {
        q: 'Peptídeos de longevidade são aprovados?',
        a: 'Não. MOTS-c e Epithalon não têm aprovação de FDA, EMA ou ANVISA. São substâncias de pesquisa.',
      },
    ],
  },
  {
    slug: 'cognitivo',
    categories: ['cognitive'],
    label: 'Cognitivo',
    title: 'Peptídeos nootrópicos: foco, memória e ansiedade',
    summary:
      'Semax e Selank comparados: origem, via intranasal, doses usadas na Rússia, o que os estudos mostram e a situação regulatória fora de lá.',
    intro: [
      'Semax e Selank são peptídeos sintéticos desenvolvidos na Rússia e usados por via intranasal. O Semax deriva de um fragmento do ACTH e é estudado por efeitos sobre BDNF e neuroproteção; o Selank deriva da tuftsina e é estudado como ansiolítico sem sedação.',
      'Ambos têm registro na Rússia, mas não foram aprovados por FDA, EMA ou ANVISA. A maior parte dos estudos é russa, com amostras pequenas.',
    ],
    keyPoints: [
      'A via usual é intranasal — a dose é contada em gotas ou jatos, não em unidades de seringa.',
      'A meia-vida no plasma é de minutos, mas os efeitos funcionais descritos duram horas.',
      'Faltam ensaios clínicos grandes e independentes.',
      'Fora da Rússia não há produto registrado: procedência e concentração são incertas.',
    ],
    faq: [
      {
        q: 'Qual a diferença entre Semax e Selank?',
        a: 'O Semax é mais associado a foco, memória e neuroproteção; o Selank, a redução de ansiedade. Os dois são heptapeptídeos de uso intranasal e às vezes são usados juntos.',
        link: { label: 'Semax vs Selank', href: '/comparar/semax-vs-selank' },
      },
      {
        q: 'Semax e Selank são aprovados no Brasil?',
        a: 'Não. Têm registro apenas na Rússia e em alguns países vizinhos. Não há aprovação de FDA, EMA ou ANVISA.',
      },
      {
        q: 'Preciso de calculadora de reconstituição para spray nasal?',
        a: 'Para formulações prontas, não. A calculadora serve para o pó liofilizado que será diluído — nesse caso ela mostra a concentração por ml para você converter em gotas ou jatos.',
        link: { label: 'Calculadora de reconstituição', href: '/ferramentas/reconstituicao' },
      },
    ],
  },
  {
    slug: 'funcao-sexual',
    categories: ['sexual'],
    label: 'Função sexual',
    title: 'Peptídeos para libido e função sexual',
    summary:
      'PT-141 (bremelanotida): como age no sistema nervoso central, a dose aprovada pela FDA, limites de uso e efeitos adversos.',
    intro: [
      'O PT-141, ou bremelanotida, é o único peptídeo aprovado para desejo sexual. Diferente dos inibidores de PDE5 (como a sildenafila), que agem no fluxo sanguíneo, ele ativa receptores de melanocortina no sistema nervoso central.',
      'A FDA aprovou a bremelanotida em 2019 para transtorno do desejo sexual hipoativo em mulheres na pré-menopausa. O uso em homens é off-label.',
    ],
    keyPoints: [
      'Dose aprovada: 1,75 mg por via subcutânea, conforme necessário, pelo menos 45 minutos antes da atividade sexual.',
      'Limite de 1 dose a cada 24 horas e 8 doses por mês.',
      'Náusea é o efeito adverso mais comum; pode haver aumento transitório da pressão arterial.',
      'Contraindicado em hipertensão não controlada e doença cardiovascular conhecida.',
    ],
    faq: [
      {
        q: 'PT-141 é aprovado?',
        a: 'Sim, pela FDA, desde 2019, para transtorno do desejo sexual hipoativo em mulheres na pré-menopausa. Não tem registro na ANVISA.',
        link: { label: 'PT-141 (bremelanotida)', href: '/blog/pt-141-bremelanotida' },
      },
      {
        q: 'PT-141 e Melanotan II são a mesma coisa?',
        a: 'Não. A bremelanotida foi desenvolvida a partir do Melanotan II, mas é outra molécula. O Melanotan II não é aprovado em nenhum país e é alvo de alertas de agências reguladoras.',
        link: { label: 'Riscos do Melanotan II', href: '/blog/melanotan-2-riscos' },
      },
      {
        q: 'Com que frequência pode ser usado?',
        a: 'Pela bula, no máximo uma dose em 24 horas e não mais que 8 doses por mês.',
      },
    ],
  },
  {
    slug: 'pele-e-estetica',
    categories: ['cosmetic'],
    label: 'Pele e estética',
    title: 'Peptídeos para pele e estética',
    summary:
      'GHK-Cu e Melanotan II: o que cada um faz, a diferença entre uso tópico e injetável e os alertas regulatórios sobre bronzeamento injetável.',
    intro: [
      'Nesta categoria estão dois peptídeos de perfis opostos. O GHK-Cu, tripeptídeo ligado ao cobre, tem décadas de uso em cosméticos tópicos, com estudos sobre colágeno e textura da pele. O Melanotan II é um análogo do hormônio estimulante de melanócitos usado para bronzeamento — sem aprovação em nenhum país.',
      'A distância entre os dois é grande: o GHK-Cu tópico é ingrediente cosmético comum; o Melanotan II é alvo de alertas explícitos de agências reguladoras.',
    ],
    keyPoints: [
      'GHK-Cu tópico: concentrações de 0,05% a 2% em cosméticos. A forma injetável não tem dose estabelecida para uso humano.',
      'Melanotan II: não há dose segura estabelecida; há relatos de alterações em pintas e efeitos cardiovasculares.',
      'Bronzeado por Melanotan II não substitui protetor solar.',
      'Em cosméticos, o cobre do GHK-Cu pode ser desestabilizado por ácidos em pH baixo aplicados juntos.',
    ],
    faq: [
      {
        q: 'GHK-Cu funciona para a pele?',
        a: 'Há estudos clínicos pequenos com uso tópico mostrando melhora de firmeza, textura e linhas finas. Para uso injetável faltam dados em humanos.',
        link: { label: 'GHK-Cu: para que serve', href: '/blog/ghk-cu-para-que-serve' },
      },
      {
        q: 'Melanotan II é seguro?',
        a: 'Não há segurança estabelecida. O produto não é aprovado em nenhum país, é vendido sem controle de qualidade e agências reguladoras de vários países publicaram alertas contra o uso.',
        link: { label: 'Riscos do Melanotan II', href: '/blog/melanotan-2-riscos' },
      },
      {
        q: 'Posso usar GHK-Cu com vitamina C ou retinol?',
        a: 'Em geral se recomenda aplicar em horários diferentes: fórmulas ácidas podem interferir na estabilidade do complexo de cobre.',
      },
    ],
  },
  {
    slug: 'hormonal',
    categories: ['hormone'],
    label: 'Hormonal',
    title: 'Peptídeos hormonais: eixo testosterona e fertilidade',
    summary:
      'Gonadorelina (GnRH): como estimula LH e FSH, por que a aplicação precisa ser pulsátil, doses usadas e situação regulatória.',
    intro: [
      'A gonadorelina é a versão sintética do GnRH, o hormônio do hipotálamo que comanda a liberação de LH e FSH pela hipófise — e, por consequência, a produção de testosterona e a fertilidade.',
      'Foi aprovada como teste diagnóstico e para indução de ovulação, em produtos hoje descontinuados em vários mercados. Em farmácias de manipulação é usada junto à terapia de reposição de testosterona, uso sem ensaios clínicos robustos.',
    ],
    keyPoints: [
      'A meia-vida é de 2 a 10 minutos: o efeito depende de estímulo em pulsos.',
      'Estímulo contínuo de GnRH tem efeito oposto — suprime o eixo em vez de ativá-lo.',
      'As doses de manipulação para TRT não vêm de estudos de registro.',
      'Qualquer intervenção no eixo hormonal exige acompanhamento médico e exames.',
    ],
    faq: [
      {
        q: 'Para que serve a gonadorelina na TRT?',
        a: 'A proposta é manter o estímulo de LH e FSH — e com isso o volume testicular e a fertilidade — durante a reposição de testosterona. A evidência para esse uso é limitada.',
        link: { label: 'Gonadorelina, TRT e fertilidade', href: '/blog/gonadorelina-trt-fertilidade' },
      },
      {
        q: 'Gonadorelina é a mesma coisa que hCG?',
        a: 'Não. A hCG imita o LH e age direto no testículo. A gonadorelina age um degrau acima, na hipófise, que então libera LH e FSH.',
      },
      {
        q: 'Por que a frequência de aplicação importa tanto?',
        a: 'Porque o GnRH natural é liberado em pulsos. Com meia-vida de minutos, a gonadorelina reproduz um pulso por aplicação; exposição contínua dessensibiliza o receptor.',
      },
    ],
  },
];

export function getCategoryPages(): CategoryPage[] {
  return CATEGORY_PAGES;
}
export function getCategoryPage(slug: string): CategoryPage | undefined {
  return CATEGORY_PAGES.find((c) => c.slug === slug);
}
export function getCategoryPageSlugs(): string[] {
  return CATEGORY_PAGES.map((c) => c.slug);
}
export function getCategoryPeptides(page: CategoryPage): Peptide[] {
  return getPeptides().filter((p) => (page.categories as string[]).includes(p.category ?? ''));
}
/** Página de categoria a que um peptídeo pertence. */
export function getCategoryPageForPeptide(peptide: Peptide): CategoryPage | undefined {
  return CATEGORY_PAGES.find((c) => (c.categories as string[]).includes(peptide.category ?? ''));
}
