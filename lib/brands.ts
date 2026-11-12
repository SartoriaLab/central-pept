// Marcas comerciais de agonistas GLP-1. Cada uma vira uma rota /medicamentos/<slug>.
// Quem busca pelo nome da marca ("Mounjaro", "Ozempic") quer saber o que é, as doses e
// a diferença para a marca irmã — dados que vêm das bulas FDA e dos ensaios de registro.

export type BrandFaq = { q: string; a: string; link?: { label: string; href: string } };

export type Brand = {
  slug: string;
  name: string;
  /** Slug do princípio ativo em lib/peptides.ts. */
  peptideSlug: string;
  activeIngredient: string;
  manufacturer: string;
  drugClass: string;
  /** Ano da primeira aprovação pela FDA. */
  fdaApprovalYear: number;
  /** Indicações da bula FDA. */
  indications: string[];
  /** Id do esquema em lib/titration.ts. */
  titrationSchemeId: string;
  maintenance: string;
  presentation: string;
  /** Resumo de uma frase (descrição e meta description). */
  summary: string;
  /** Parágrafos da seção "O que é". */
  about: string[];
  /** Situação no Brasil. */
  brazil: string;
  /** Marca irmã (mesmo princípio ativo). */
  sibling: { slug: string; difference: string };
  /** Resultados dos principais ensaios clínicos. */
  evidence: { trial: string; result: string }[];
  references: { title: string; url: string }[];
  /** Slugs de artigos do blog relacionados. */
  articles: string[];
  faq: BrandFaq[];
};

const LILLY = 'Eli Lilly';
const NOVO = 'Novo Nordisk';

const REF = {
  surmount1: { title: 'Jastreboff AM, et al. Tirzepatide Once Weekly for the Treatment of Obesity (SURMOUNT-1). N Engl J Med. 2022.', url: 'https://doi.org/10.1056/NEJMoa2206038' },
  surmount4: { title: 'Aronne LJ, et al. Continued Treatment With Tirzepatide for Maintenance of Weight Reduction (SURMOUNT-4). JAMA. 2024.', url: 'https://doi.org/10.1001/jama.2023.24945' },
  surpass2: { title: 'Frías JP, et al. Tirzepatide versus Semaglutide Once Weekly in Patients with Type 2 Diabetes (SURPASS-2). N Engl J Med. 2021.', url: 'https://doi.org/10.1056/NEJMoa2107519' },
  step1: { title: 'Wilding JPH, et al. Once-Weekly Semaglutide in Adults with Overweight or Obesity (STEP 1). N Engl J Med. 2021.', url: 'https://doi.org/10.1056/NEJMoa2032183' },
  select: { title: 'Lincoff AM, et al. Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes (SELECT). N Engl J Med. 2023.', url: 'https://doi.org/10.1056/NEJMoa2307563' },
  sustain6: { title: 'Marso SP, et al. Semaglutide and Cardiovascular Outcomes in Patients with Type 2 Diabetes (SUSTAIN-6). N Engl J Med. 2016.', url: 'https://doi.org/10.1056/NEJMoa1607141' },
  surmount5: { title: 'Aronne LJ, et al. Tirzepatide as Compared with Semaglutide for the Treatment of Obesity (SURMOUNT-5). N Engl J Med. 2025.', url: 'https://doi.org/10.1056/NEJMoa2416394' },
  mounjaroLabel: { title: 'Mounjaro (tirzepatide) — Prescribing Information. Eli Lilly.', url: 'https://pi.lilly.com/us/mounjaro-uspi.pdf' },
  zepboundLabel: { title: 'Zepbound (tirzepatide) — Prescribing Information. Eli Lilly.', url: 'https://pi.lilly.com/us/zepbound-uspi.pdf' },
};

export const BRANDS: Brand[] = [
  {
    slug: 'mounjaro',
    name: 'Mounjaro',
    peptideSlug: 'tirzepatida',
    activeIngredient: 'Tirzepatida',
    manufacturer: LILLY,
    drugClass: 'Agonista duplo dos receptores GIP e GLP-1',
    fdaApprovalYear: 2022,
    indications: [
      'Diabetes tipo 2 em adultos e crianças a partir de 10 anos, junto com dieta e exercício',
      'Redução do risco de eventos cardiovasculares maiores em adultos com diabetes tipo 2 e alto risco cardiovascular',
    ],
    titrationSchemeId: 'tirzepatida-t2d',
    maintenance: '5, 10 ou 15 mg uma vez por semana',
    presentation: 'Caneta de dose única ou KwikPen com 4 doses (nos EUA, também frasco); solução pronta, aplicação subcutânea semanal',
    summary:
      'Mounjaro é o nome comercial da tirzepatida, da Eli Lilly: uma injeção semanal que age nos receptores GIP e GLP-1, aprovada para diabetes tipo 2 e usada também no controle de peso.',
    about: [
      'Mounjaro é a marca da tirzepatida, medicamento injetável de aplicação semanal desenvolvido pela Eli Lilly. Foi o primeiro agonista duplo aprovado: ativa ao mesmo tempo os receptores de GIP e de GLP-1, dois hormônios intestinais que regulam a liberação de insulina, o esvaziamento do estômago e a saciedade.',
      'A FDA aprovou o Mounjaro em 2022 para diabetes tipo 2. Como a perda de peso observada nos estudos foi a maior já registrada para um medicamento da classe, a mesma molécula recebeu depois uma segunda marca nos Estados Unidos — Zepbound — voltada a obesidade e sobrepeso.',
      'Mounjaro vem em caneta pronta para uso: não é reconstituído e a dose já está definida pela caneta. Cálculo de unidades na seringa só se aplica à tirzepatida em frasco (liofilizada ou manipulada).',
    ],
    brazil:
      'No Brasil a tirzepatida é vendida apenas com o nome Mounjaro, em caneta, com receita médica retida na farmácia. A ANVISA aprovou o medicamento para diabetes tipo 2, para controle crônico de peso (junho de 2025) e para apneia obstrutiva do sono em adultos com obesidade (outubro de 2025) — a marca Zepbound não é comercializada aqui.',
    sibling: {
      slug: 'zepbound',
      difference:
        'Mesma molécula, mesmo fabricante e mesmas doses. A diferença é a indicação em bula nos EUA: Mounjaro para diabetes tipo 2, Zepbound para obesidade, sobrepeso e apneia obstrutiva do sono.',
    },
    evidence: [
      { trial: 'SURPASS-2 (diabetes tipo 2, 40 semanas)', result: 'Redução de HbA1c de 2,01 a 2,30 pontos com tirzepatida 5-15 mg, contra 1,86 com semaglutida 1 mg; perda de peso de 7,6 a 11,2 kg contra 5,7 kg.' },
      { trial: 'SURMOUNT-1 (obesidade sem diabetes, 72 semanas)', result: 'Perda média de 15,0% (5 mg), 19,5% (10 mg) e 20,9% (15 mg) do peso corporal, contra 3,1% com placebo.' },
      { trial: 'SURMOUNT-4 (manutenção)', result: 'Quem continuou a tirzepatida perdeu mais 5,5% em 52 semanas; quem trocou por placebo recuperou 14,0%.' },
    ],
    references: [REF.mounjaroLabel, REF.surpass2, REF.surmount1, REF.surmount4, REF.surmount5],
    articles: [
      'tirzepatida-preco-quanto-custa',
      'mounjaro-falso-como-identificar',
      'efeitos-colaterais-tirzepatida',
      'quanto-tempo-tirzepatida-faz-efeito',
      'nausea-tirzepatida-como-lidar',
      'efeito-rebote-apos-parar-tirzepatida',
      'onde-comprar-tirzepatida',
      'semaglutida-vs-tirzepatida',
    ],
    faq: [
      {
        q: 'Mounjaro e tirzepatida são a mesma coisa?',
        a: 'Sim. Tirzepatida é o princípio ativo; Mounjaro é o nome comercial dado pela Eli Lilly. Zepbound é outra marca da mesma molécula, vendida nos EUA para obesidade.',
        link: { label: 'Ficha da tirzepatida', href: '/peptideos/tirzepatida' },
      },
      {
        q: 'Qual a dose inicial do Mounjaro?',
        a: 'A bula prevê começar com 2,5 mg uma vez por semana. Se for preciso mais controle da glicose, a dose sobe em degraus de 2,5 mg, depois de pelo menos 4 semanas na dose atual, até o máximo de 15 mg por semana em adultos.',
        link: { label: 'Montar calendário de subida de dose', href: '/ferramentas/titulacao' },
      },
      {
        q: 'Mounjaro precisa ser reconstituído?',
        a: 'Não. A caneta já vem com a solução pronta e a dose definida. Reconstituição com água bacteriostática só existe para tirzepatida em frasco liofilizado; nesse caso use a calculadora para saber quantas unidades puxar na seringa.',
        link: { label: 'Calculadora de tirzepatida em frasco', href: '/ferramentas/reconstituicao/tirzepatida' },
      },
      {
        q: 'Mounjaro é melhor que Ozempic?',
        a: 'Nos estudos comparativos a tirzepatida reduziu mais a glicemia e o peso que a semaglutida: no SURPASS-2 (diabetes) e no SURMOUNT-5 (obesidade: 20,2% contra 13,7% de perda em 72 semanas). Por outro lado, a semaglutida tem mais tempo de mercado e redução de eventos cardiovasculares demonstrada. A escolha é médica e individual.',
        link: { label: 'Semaglutida vs Tirzepatida', href: '/comparar/semaglutida-vs-tirzepatida' },
      },
      {
        q: 'Quais os efeitos colaterais mais comuns?',
        a: 'Os gastrointestinais: náusea, diarreia, constipação e vômito, concentrados nas semanas de aumento de dose e geralmente leves a moderados. A bula traz alerta sobre tumores de células C da tireoide (visto em roedores) e contraindica o uso em quem tem histórico pessoal ou familiar de carcinoma medular de tireoide ou NEM 2.',
        link: { label: 'Efeitos colaterais da tirzepatida', href: '/blog/efeitos-colaterais-tirzepatida' },
      },
      {
        q: 'Esqueci uma dose do Mounjaro. O que fazer?',
        a: 'Pela bula, aplique assim que lembrar se ainda estiver dentro de 4 dias (96 horas) da data prevista. Passado esse prazo, pule a dose e retome no dia habitual. Não aplique duas doses com menos de 3 dias de intervalo.',
      },
    ],
  },
  {
    slug: 'zepbound',
    name: 'Zepbound',
    peptideSlug: 'tirzepatida',
    activeIngredient: 'Tirzepatida',
    manufacturer: LILLY,
    drugClass: 'Agonista duplo dos receptores GIP e GLP-1',
    fdaApprovalYear: 2023,
    indications: [
      'Controle crônico de peso em adultos com obesidade (IMC ≥ 30) ou sobrepeso (IMC ≥ 27) com pelo menos uma comorbidade relacionada ao peso',
      'Apneia obstrutiva do sono moderada a grave em adultos com obesidade',
    ],
    titrationSchemeId: 'tirzepatida-obesity',
    maintenance: '5, 10 ou 15 mg uma vez por semana (apneia do sono: 10 ou 15 mg)',
    presentation: 'Caneta ou frasco de dose única; KwikPen ou frasco multidose com 4 doses',
    summary:
      'Zepbound é a marca da tirzepatida aprovada pela FDA para obesidade, sobrepeso e apneia do sono. É a mesma molécula do Mounjaro, com as mesmas doses.',
    about: [
      'Zepbound é o nome com que a Eli Lilly vende a tirzepatida nos Estados Unidos para controle de peso. A FDA aprovou a marca em 2023 com base no programa SURMOUNT, em que a perda média de peso chegou a 20,9% na dose de 15 mg.',
      'Em 2024 a bula ganhou uma segunda indicação: apneia obstrutiva do sono moderada a grave em adultos com obesidade — foi o primeiro medicamento aprovado para essa condição.',
      'A molécula, o fabricante, as doses (2,5 a 15 mg por semana) e o esquema de subida são idênticos aos do Mounjaro. O que muda é a indicação registrada e a apresentação.',
    ],
    brazil:
      'Zepbound não é vendido no Brasil. Aqui a tirzepatida é comercializada só como Mounjaro, cuja bula brasileira inclui também o controle de peso e a apneia do sono. Produto anunciado como "Zepbound" no país é importação irregular ou falsificação.',
    sibling: {
      slug: 'mounjaro',
      difference:
        'Mesma molécula e mesmas doses. Nos EUA, Zepbound é a marca para obesidade e apneia do sono; Mounjaro, para diabetes tipo 2. No Brasil só existe o Mounjaro, que reúne as indicações das duas marcas.',
    },
    evidence: [
      { trial: 'SURMOUNT-1 (72 semanas)', result: 'Perda média de 15,0% (5 mg), 19,5% (10 mg) e 20,9% (15 mg) do peso, contra 3,1% com placebo. Perderam 5% ou mais: 85%, 89% e 91% dos participantes, contra 35%.' },
      { trial: 'SURMOUNT-4 (manutenção, 88 semanas)', result: 'Após 36 semanas de tratamento (perda média de 20,9%), quem continuou perdeu mais 5,5%; quem passou para placebo recuperou 14,0%.' },
      { trial: 'SURMOUNT-5 (comparação direta, 72 semanas)', result: 'Na dose máxima tolerada de cada um — tirzepatida 10 ou 15 mg: perda de 20,2% do peso; semaglutida 1,7 ou 2,4 mg: 13,7%.' },
    ],
    references: [REF.zepboundLabel, REF.surmount1, REF.surmount4, REF.surmount5],
    articles: [
      'efeitos-colaterais-tirzepatida',
      'quanto-tempo-tirzepatida-faz-efeito',
      'efeito-rebote-apos-parar-tirzepatida',
      'nausea-tirzepatida-como-lidar',
      'tirzepatida-preco-quanto-custa',
      'semaglutida-vs-tirzepatida',
    ],
    faq: [
      {
        q: 'Qual a diferença entre Zepbound e Mounjaro?',
        a: 'Nenhuma na molécula: os dois são tirzepatida, da Eli Lilly, nas mesmas doses. A diferença é regulatória — nos EUA o Zepbound é registrado para obesidade, sobrepeso e apneia do sono, e o Mounjaro para diabetes tipo 2.',
        link: { label: 'Página do Mounjaro', href: '/medicamentos/mounjaro' },
      },
      {
        q: 'Zepbound é vendido no Brasil?',
        a: 'Não. No Brasil a tirzepatida é vendida apenas como Mounjaro, em farmácia e com receita. Ofertas de "Zepbound" em redes sociais ou marketplaces não têm registro sanitário no país.',
        link: { label: 'Como identificar produto falsificado', href: '/blog/mounjaro-falso-como-identificar' },
      },
      {
        q: 'Quanto peso se perde com Zepbound?',
        a: 'No estudo SURMOUNT-1, com 72 semanas de tratamento associado a dieta e exercício, a perda média foi de 15,0% do peso com 5 mg, 19,5% com 10 mg e 20,9% com 15 mg. São médias: há quem perca mais e quem perca menos.',
        link: { label: 'Quanto tempo leva para fazer efeito', href: '/blog/quanto-tempo-tirzepatida-faz-efeito' },
      },
      {
        q: 'Qual a dose de manutenção?',
        a: 'A bula indica 5, 10 ou 15 mg por semana, conforme resposta e tolerância. O tratamento começa com 2,5 mg por 4 semanas e sobe em degraus de 2,5 mg a cada 4 semanas ou mais.',
        link: { label: 'Tabela de doses para imprimir', href: '/ferramentas/tabela-doses-glp1' },
      },
      {
        q: 'O peso volta depois de parar?',
        a: 'Em boa parte, sim. No SURMOUNT-4, quem trocou a tirzepatida por placebo recuperou em média 14% do peso em um ano, enquanto quem continuou seguiu perdendo. Obesidade é tratada como condição crônica; a decisão de parar ou reduzir deve ser planejada com o médico.',
        link: { label: 'Efeito rebote após parar tirzepatida', href: '/blog/efeito-rebote-apos-parar-tirzepatida' },
      },
    ],
  },
  {
    slug: 'ozempic',
    name: 'Ozempic',
    peptideSlug: 'semaglutida',
    activeIngredient: 'Semaglutida',
    manufacturer: NOVO,
    drugClass: 'Agonista do receptor de GLP-1',
    fdaApprovalYear: 2017,
    indications: [
      'Diabetes tipo 2 em adultos, junto com dieta e exercício',
      'Redução do risco de eventos cardiovasculares maiores em adultos com diabetes tipo 2 e doença cardiovascular estabelecida',
      'Redução do risco de progressão da doença renal em adultos com diabetes tipo 2 e doença renal crônica',
    ],
    titrationSchemeId: 'semaglutida-t2d',
    maintenance: '0,5 mg, 1 mg ou 2 mg uma vez por semana',
    presentation: 'Caneta pré-preenchida multidose para aplicação subcutânea semanal',
    summary:
      'Ozempic é a semaglutida da Novo Nordisk em caneta semanal, aprovada para diabetes tipo 2. Não tem indicação em bula para emagrecimento — essa é a do Wegovy, com dose maior.',
    about: [
      'Ozempic é a marca da semaglutida injetável da Novo Nordisk para diabetes tipo 2. A semaglutida imita o GLP-1, hormônio intestinal que estimula a liberação de insulina quando a glicose sobe, retarda o esvaziamento do estômago e reduz o apetite.',
      'Aprovado pela FDA em 2017, o Ozempic recebeu depois indicações de proteção cardiovascular e renal em pessoas com diabetes tipo 2. A dose vai de 0,25 mg (adaptação) a no máximo 2 mg por semana.',
      'O uso para perder peso sem diabetes é off-label: a mesma molécula tem uma marca própria para isso, o Wegovy, com dose usual de manutenção de 2,4 mg por semana. Ozempic vem em caneta pronta — não é reconstituído.',
    ],
    brazil:
      'No Brasil o Ozempic é vendido em farmácia, em caneta, com receita médica. A indicação em bula é diabetes tipo 2; a prescrição para emagrecimento é off-label e fica a critério do médico.',
    sibling: {
      slug: 'wegovy',
      difference:
        'Mesma molécula e mesmo fabricante. Ozempic é registrado para diabetes tipo 2 e vai até 2 mg por semana; Wegovy é registrado para obesidade e sobrepeso e tem dose usual de manutenção de 2,4 mg.',
    },
    evidence: [
      { trial: 'SUSTAIN-6 (diabetes tipo 2 com alto risco cardiovascular)', result: 'Redução de 26% no risco de eventos cardiovasculares maiores em relação ao placebo.' },
      { trial: 'SURPASS-2 (comparação com tirzepatida, 40 semanas)', result: 'Semaglutida 1 mg reduziu a HbA1c em 1,86 ponto e o peso em 5,7 kg; a tirzepatida reduziu de 2,01 a 2,30 pontos e de 7,6 a 11,2 kg.' },
      { trial: 'STEP 1 (semaglutida 2,4 mg — dose do Wegovy, não do Ozempic)', result: 'Perda média de 14,9% do peso em 68 semanas, contra 2,4% com placebo.' },
    ],
    references: [REF.sustain6, REF.surpass2, REF.step1],
    articles: [
      'ozempic-para-perder-peso-sem-diabetes',
      'quanto-tempo-ozempic-faz-efeito',
      'nausea-ozempic-como-lidar',
      'ozempic-falso-como-identificar',
      'como-guardar-ozempic-wegovy',
      'efeitos-colaterais-semaglutida',
      'efeito-rebote-apos-parar-semaglutida',
      'semaglutida-vs-tirzepatida',
    ],
    faq: [
      {
        q: 'Ozempic e semaglutida são a mesma coisa?',
        a: 'Sim. Semaglutida é o princípio ativo; Ozempic é a marca injetável da Novo Nordisk para diabetes tipo 2. Wegovy (injetável, para obesidade) e Rybelsus (comprimido) são outras marcas da mesma molécula.',
        link: { label: 'Ficha da semaglutida', href: '/peptideos/semaglutida' },
      },
      {
        q: 'Ozempic serve para emagrecer?',
        a: 'A bula do Ozempic é para diabetes tipo 2. A semaglutida reduz o peso, mas a dose estudada e aprovada para obesidade é a de 2,4 mg — a do Wegovy. Usar Ozempic para emagrecer é off-label e depende de avaliação médica.',
        link: { label: 'Ozempic para perder peso sem diabetes', href: '/blog/ozempic-para-perder-peso-sem-diabetes' },
      },
      {
        q: 'Qual a dose inicial do Ozempic?',
        a: '0,25 mg uma vez por semana por 4 semanas, apenas para adaptação. Depois 0,5 mg; se for preciso mais controle, 1 mg e então 2 mg, sempre com pelo menos 4 semanas em cada degrau.',
        link: { label: 'Montar calendário de subida de dose', href: '/ferramentas/titulacao' },
      },
      {
        q: 'Em quanto tempo o Ozempic faz efeito?',
        a: 'A glicemia começa a cair nas primeiras semanas, mas a concentração estável no sangue só é atingida após 4 a 5 semanas de uso, e as primeiras doses são de adaptação. O efeito pleno aparece depois de alguns meses, na dose de manutenção.',
        link: { label: 'Quanto tempo o Ozempic leva para fazer efeito', href: '/blog/quanto-tempo-ozempic-faz-efeito' },
      },
      {
        q: 'Como guardar a caneta?',
        a: 'Antes do primeiro uso, na geladeira (2 a 8 °C), sem congelar. Depois de aberta, siga o prazo e a temperatura indicados na bula e mantenha a tampa para proteger da luz.',
        link: { label: 'Como guardar Ozempic e Wegovy', href: '/blog/como-guardar-ozempic-wegovy' },
      },
      {
        q: 'Ozempic precisa ser reconstituído?',
        a: 'Não. A caneta vem pronta. Reconstituição só se aplica à semaglutida em frasco liofilizado, que não é o produto Ozempic.',
        link: { label: 'Calculadora de semaglutida em frasco', href: '/ferramentas/reconstituicao/semaglutida' },
      },
    ],
  },
  {
    slug: 'wegovy',
    name: 'Wegovy',
    peptideSlug: 'semaglutida',
    activeIngredient: 'Semaglutida',
    manufacturer: NOVO,
    drugClass: 'Agonista do receptor de GLP-1',
    fdaApprovalYear: 2021,
    indications: [
      'Controle crônico de peso em adultos e adolescentes a partir de 12 anos com obesidade, ou adultos com sobrepeso e comorbidade relacionada ao peso',
      'Redução do risco de eventos cardiovasculares maiores em adultos com doença cardiovascular estabelecida e obesidade ou sobrepeso',
      'Esteato-hepatite associada à disfunção metabólica (MASH) não cirrótica, com fibrose moderada a avançada, em adultos (aprovação acelerada)',
    ],
    titrationSchemeId: 'semaglutida-obesity',
    maintenance: '2,4 mg uma vez por semana é a dose usual (1,7 mg se não for tolerada)',
    presentation: 'Caneta pré-preenchida para aplicação subcutânea semanal; nos EUA há também comprimido de uso diário',
    summary:
      'Wegovy é a semaglutida 2,4 mg da Novo Nordisk, aprovada para obesidade e sobrepeso. É a mesma molécula do Ozempic, em dose maior e com outra indicação.',
    about: [
      'Wegovy é a marca da semaglutida injetável da Novo Nordisk para controle de peso. A FDA aprovou o medicamento em 2021 a partir do programa STEP, em que a dose de 2,4 mg por semana levou a uma perda média de 14,9% do peso corporal em 68 semanas.',
      'Em 2024 a bula passou a incluir a redução de eventos cardiovasculares em adultos com doença cardiovascular e excesso de peso, com base no estudo SELECT — que acompanhou mais de 17 mil pessoas sem diabetes.',
      'A subida de dose da caneta tem cinco degraus (0,25 → 0,5 → 1 → 1,7 → 2,4 mg), cada um por 4 semanas. A bula americana atual lista ainda uma caneta de 7,2 mg (Wegovy HD) e comprimidos de uso diário. Em qualquer apresentação o produto vem pronto: não é reconstituído.',
    ],
    brazil:
      'No Brasil o Wegovy é vendido em farmácia, em caneta, com receita médica, com indicação em bula para obesidade e sobrepeso com comorbidades.',
    sibling: {
      slug: 'ozempic',
      difference:
        'Mesma molécula e mesmo fabricante. Wegovy é registrado para obesidade e sobrepeso, com dose usual de manutenção de 2,4 mg por semana; Ozempic é registrado para diabetes tipo 2 e vai até 2 mg.',
    },
    evidence: [
      { trial: 'STEP 1 (68 semanas)', result: 'Perda média de 14,9% do peso corporal com semaglutida 2,4 mg, contra 2,4% com placebo.' },
      { trial: 'SELECT (doença cardiovascular sem diabetes)', result: 'Redução de 20% no risco de eventos cardiovasculares maiores em relação ao placebo.' },
      { trial: 'SURMOUNT-5 (comparação com tirzepatida, 72 semanas)', result: 'Na dose máxima tolerada de cada um — semaglutida 1,7 ou 2,4 mg: perda de 13,7% do peso; tirzepatida 10 ou 15 mg: 20,2%.' },
    ],
    references: [REF.step1, REF.select, REF.surmount5],
    articles: [
      'ozempic-para-perder-peso-sem-diabetes',
      'efeitos-colaterais-semaglutida',
      'efeito-rebote-apos-parar-semaglutida',
      'como-guardar-ozempic-wegovy',
      'nausea-ozempic-como-lidar',
      'quanto-tempo-ozempic-faz-efeito',
      'semaglutida-vs-tirzepatida',
    ],
    faq: [
      {
        q: 'Qual a diferença entre Wegovy e Ozempic?',
        a: 'Os dois são semaglutida, da Novo Nordisk. Wegovy é registrado para obesidade e sobrepeso, com dose de manutenção de 2,4 mg por semana; Ozempic é registrado para diabetes tipo 2, com dose máxima de 2 mg.',
        link: { label: 'Página do Ozempic', href: '/medicamentos/ozempic' },
      },
      {
        q: 'Quanto peso se perde com Wegovy?',
        a: 'No estudo STEP 1, a perda média foi de 14,9% do peso em 68 semanas, com dieta e atividade física, contra 2,4% no grupo placebo. O resultado individual varia.',
      },
      {
        q: 'Qual a dose do Wegovy?',
        a: 'Começa com 0,25 mg por semana e sobe a cada 4 semanas: 0,5 mg, 1 mg, 1,7 mg e, por fim, 2,4 mg — a dose de manutenção. Se a dose máxima não for tolerada, a bula permite manter 1,7 mg.',
        link: { label: 'Tabela de doses para imprimir', href: '/ferramentas/tabela-doses-glp1' },
      },
      {
        q: 'Wegovy ou Mounjaro: qual emagrece mais?',
        a: 'Na comparação direta do estudo SURMOUNT-5, a tirzepatida levou a uma perda média de 20,2% do peso em 72 semanas, contra 13,7% com semaglutida (1,7 ou 2,4 mg). O Wegovy, por sua vez, tem benefício cardiovascular demonstrado em estudo de desfechos. A escolha depende do quadro de cada pessoa.',
        link: { label: 'Semaglutida vs Tirzepatida', href: '/comparar/semaglutida-vs-tirzepatida' },
      },
      {
        q: 'O peso volta depois de parar o Wegovy?',
        a: 'Na extensão do STEP 1, um ano depois de interromper o tratamento os participantes tinham recuperado cerca de dois terços do peso perdido. Por isso a obesidade é tratada como condição crônica, e a interrupção deve ser combinada com o médico.',
        link: { label: 'Efeito rebote após parar semaglutida', href: '/blog/efeito-rebote-apos-parar-semaglutida' },
      },
      {
        q: 'Wegovy precisa ser reconstituído?',
        a: 'Não. A caneta vem pronta para uso. Reconstituição só se aplica à semaglutida em frasco liofilizado.',
        link: { label: 'Calculadora de semaglutida em frasco', href: '/ferramentas/reconstituicao/semaglutida' },
      },
    ],
  },
];

export function getBrands(): Brand[] {
  return BRANDS;
}
export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}
export function getBrandSlugs(): string[] {
  return BRANDS.map((b) => b.slug);
}
export function getBrandsByPeptide(peptideSlug: string): Brand[] {
  return BRANDS.filter((b) => b.peptideSlug === peptideSlug);
}
