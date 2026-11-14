// Catálogo dos ebooks pagos (fonte única). A estratégia por trás de títulos, posições e
// preços está em docs/ebooks-estrategia.md.
//
// Cada página mostra no máximo uma oferta, escolhida pelas funções `ebookFor*` abaixo.
// Um ebook só aparece no site quando a variável de ambiente do checkout (`checkoutEnv`)
// tem uma URL https: sem ela, oferta e landing ficam ocultas. Assim a estrutura pode ir
// ao ar antes dos PDFs.
//
// Ebook novo: entrada em EBOOKS, variável de checkout na Vercel e `npm test`
// (tests/ebooks.test.ts confere slugs e referências).

export type EbookKind = 'individual' | 'categoria' | 'transversal' | 'kit';

export type Ebook = {
  /** Código interno do plano (I1, C3, T2, KIT). */
  id: string;
  /** URL da landing: /ebooks/<slug>. */
  slug: string;
  kind: EbookKind;
  title: string;
  /** Título para teste A/B (não usado no site ainda). */
  altTitle: string;
  subtitle: string;
  /** Chamada do card (ficha, marca, fim de artigo). */
  hook: string;
  /** Chamada de uma linha (depois do resumo do artigo). */
  line: string;
  price: number;
  /** Número de páginas do PDF: atualize com o número real ao publicar. */
  pages: number;
  /** "Este guia é para você se…" */
  forWho: string[];
  /** "Não é para você se…" */
  notFor: string[];
  /** "O que custa errar": erro concreto e a consequência (landing). */
  pains?: { erro: string; custo: string }[];
  /** "Você vai descobrir": frases específicas, cada uma com o capítulo que a responde. */
  reveals?: string[];
  /** Comparação de preço verdadeira (custo real do erro), nunca preço "de/por" inventado. */
  anchor?: string;
  /** Mês da última revisão do texto, ex.: "novembro de 2026". */
  revised?: string;
  /** Sumário: capítulos na ordem do PDF. */
  toc: string[];
  bonuses: string[];
  /** Páginas de amostra (imagens em /public), mostradas na landing quando existirem. */
  sample?: string[];
  /** De onde vêm os dados. */
  sources: string[];
  /** Perguntas próprias; as comuns ficam em EBOOK_FAQ. */
  faq?: { q: string; a: string }[];
  /** Ofertas extras no checkout da Kiwify (ids). */
  bumps?: string[];
  /** Kit: ids dos ebooks incluídos. */
  includes?: string[];
  /** Capa gerada em CSS (classes Tailwind por extenso). */
  cover: string;
  /** Variável de ambiente com a URL do checkout da Kiwify. */
  checkoutEnv: string;
  /** Id do produto na Kiwify: o webhook de vendas usa para saber qual guia foi vendido. */
  kiwifyProductId?: string;
  /** Onde a oferta aparece (slugs de lib/peptides, posts, lib/tools, lib/categories). */
  places: {
    peptides?: string[];
    posts?: string[];
    tools?: string[];
    categories?: string[];
    /** Seções do site sem dado próprio: 'seringas', 'glossario'. */
    sections?: string[];
  };
};

/** Oferta pronta para a página (serializável, pode ir para componente client). */
export type EbookOffer = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  hook: string;
  line: string;
  /** "R$ 29,90" */
  priceLabel: string;
  pages: number;
  cover: string;
  bullets: string[];
};

/** Preço de um ebook quando entra como oferta extra (order bump) no checkout. */
export const BUMP_PRICE = 14.9;

export const KIND_LABELS: Record<EbookKind, string> = {
  individual: 'Guia em PDF',
  categoria: 'Guia comparativo em PDF',
  transversal: 'Guia prático em PDF',
  kit: 'Pacote de guias em PDF',
};

/** Peptídeos sem oferta nenhuma (alerta regulatório). */
export const NO_EBOOK_PEPTIDES = ['melanotan-ii'];

export const EBOOK_FAQ: { q: string; a: string }[] = [
  {
    q: 'O guia substitui acompanhamento médico?',
    a: 'Não. É material educativo, escrito a partir de bulas, estudos publicados e documentos regulatórios. Decisões sobre dose, início ou interrupção de tratamento são do seu médico.',
  },
  {
    q: 'Como recebo o guia?',
    a: 'Na hora. Assim que o pagamento é confirmado (no Pix, em segundos), a Kiwify manda para o seu email o acesso à área de membros. Lá você lê pelo celular, tablet ou computador e baixa o PDF para guardar ou imprimir.',
  },
  {
    q: 'Tem muita coisa de graça na internet. Por que pagar?',
    a: 'Porque aqui está tudo num lugar só, na ordem em que você vai precisar, com a fonte de cada número (bula ou estudo) e as tabelas prontas para imprimir. Na internet, a informação vem solta, sem fonte e muitas vezes errada: um único erro de dose ou de compra custa mais que o guia.',
  },
  {
    q: 'E se eu não gostar?',
    a: 'Você tem 7 dias para pedir o reembolso total, direto pela Kiwify, sem precisar explicar o motivo. Pode ler o guia inteiro antes de decidir.',
  },
  {
    q: 'O guia é atualizado?',
    a: 'Sim. Quando uma bula ou um estudo muda, o texto é revisado e quem comprou recebe a versão nova na mesma área de membros, sem pagar de novo.',
  },
  {
    q: 'Quais as formas de pagamento?',
    a: 'Pix, cartão e boleto, pelo checkout da Kiwify.',
  },
  {
    q: 'O site vende peptídeos?',
    a: 'Não. A Central Peptídeos não vende peptídeos nem indica fornecedores. Os guias em PDF são o único produto à venda.',
  },
];

export const EBOOKS: Ebook[] = [
  // ─── Individuais ──────────────────────────────────────────────────────────
  {
    id: 'I1',
    slug: 'semaglutida-manual',
    kind: 'individual',
    title: 'Semaglutida: O Manual Que Não Vem na Caixa',
    altTitle: 'Antes da Sua Próxima Dose de Semaglutida',
    subtitle:
      'Semana a semana, de 0,25 mg até a manutenção: o que esperar em cada etapa, como atravessar a náusea e os 9 erros que fazem desistir no meio.',
    hook:
      'Quase ninguém larga a semaglutida por algo grave. Larga por erros pequenos: subir no automático, dobrar dose, julgar cedo. Os 9 e como evitar.',
    line: 'Os 9 erros que fazem desistir da semaglutida no meio, e o que fazer no lugar. Guia em PDF.',
    price: 29.9,
    pages: 49,
    forWho: [
      'Começou em 0,25 mg, a balança quase não mexeu e quer saber se isso é esperado.',
      'A data de subir chegou, mas a náusea da dose atual ainda aparece todo dia.',
      'Esqueceu uma aplicação e não sabe se aplica agora, pula ou espera a próxima.',
    ],
    notFor: [
      'Procura uma prescrição ou uma dose para usar sem médico.',
      'Espera promessa de quilos perdidos.',
    ],
    pains: [
      { erro: 'Subir de degrau no automático, com a náusea ainda diária', custo: 'Enjoo novo somado ao antigo: em poucas semanas você mal come e conclui que o remédio não é para você.' },
      { erro: 'Aplicar dose dobrada para compensar a que esqueceu', custo: 'Uma semana de náusea e vômito por um erro de calendário, sem acelerar nada no tratamento.' },
      { erro: 'Julgar a semaglutida pela balança das primeiras semanas', custo: '0,25 mg nem é dose de tratamento: quem desiste ali larga antes de chegar às doses que foram estudadas.' },
    ],
    reveals: [
      'Por que a concentração só estabiliza após 4 a 5 semanas na mesma dose e o que isso muda na subida (cap. 1)',
      'Qual degrau só existe na escada até 2,4 mg e quando a bula deixa ficar nele como manutenção (cap. 2)',
      'Os sinais que não esperam a consulta e a zona cinza que pede conversa com o médico, sem pânico (cap. 3)',
      'A regra de dose esquecida de cada caneta: até 5 dias numa, 48 horas da próxima dose na outra (cap. 5)',
      'Por que 7 mg de comprimido não é "mais forte" que 1 mg de injeção (cap. 6)',
    ],
    anchor: 'Uma única aplicação da caneta de 1 mg custa cerca de R$ 240. O guia inteiro custa R$ 29,90.',
    revised: 'novembro de 2026',
    toc: [
      'Como a semaglutida age e por que a dose sobe devagar',
      'A escada de doses, etapa por etapa: 0,25 → 0,5 → 1,0 → 1,7 → 2,4 mg (e a variante até 2,0 mg)',
      'O que é normal sentir em cada etapa e o que é sinal de alerta',
      'Náusea, constipação e refluxo: o que as bulas e os estudos recomendam',
      'Dose esquecida, viagem e armazenamento',
      'Comprimido diário: como difere da injeção',
      'Os 9 erros que fazem desistir no meio',
      'Perguntas para levar ao médico',
    ],
    bonuses: ['Escada de doses para imprimir', 'Diário de sintomas de 16 semanas'],
    sources: [
      'Bulas da FDA de Ozempic, Wegovy e Rybelsus',
      'Estudos de registro STEP, SUSTAIN e PIONEER',
      'Estudos de desfecho cardiovascular SELECT e SOUL',
    ],
    bumps: ['T1', 'T3'],
    cover: 'from-teal-600 via-teal-700 to-sky-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_SEMAGLUTIDA',
    kiwifyProductId: 'b5aa7fb0-dfc4-11f1-9b0e-1d63259b3d5d',
    places: {
      peptides: ['semaglutida'],
    },
  },
  {
    id: 'I2',
    slug: 'tirzepatida-antes-de-subir-a-dose',
    kind: 'individual',
    title: 'Tirzepatida: Não Suba a Dose Antes de Ler Isto',
    altTitle: 'Tirzepatida: O Manual Que Não Vem na Caixa',
    subtitle:
      'De 2,5 mg a 15 mg, semana a semana: quando subir, quando segurar e os 9 erros que custam frasco, dinheiro e semanas de enjoo.',
    hook:
      '4 semanas por degrau é o mínimo, não o prazo. Quando segurar a dose e os 9 erros que custam frasco, dinheiro e semanas de enjoo.',
    line: 'Antes de subir a tirzepatida: quando segurar e os 9 erros que custam frasco. Guia em PDF.',
    price: 29.9,
    pages: 51,
    forWho: [
      'Chegou a semana de subir, mas o enjoo da dose atual ainda não passou.',
      'Usa frasco e não sabe qual tamanho rende a dose inteira dentro dos 28 dias.',
      'Está em 5 ou 10 mg, a dose funciona, e ouviu que só 15 mg trata de verdade.',
    ],
    notFor: [
      'Procura uma prescrição ou uma dose para usar sem médico.',
      'Espera promessa de quilos perdidos.',
    ],
    pains: [
      { erro: 'Usar frasco de 15 mg na dose de 2,5 mg', custo: 'Só 4 doses cabem nos 28 dias: 5 mg, um terço do frasco, vencem lá dentro e vão para o lixo.' },
      { erro: 'Manter as mesmas unidades ao trocar de frasco ou de volume de água', custo: '50 unidades podem ser 2,5, 5 ou 7,5 mg: dose maior sem perceber, ou uma subida desnecessária.' },
      { erro: 'Subir de dose com o enjoo da dose atual ainda presente', custo: 'Semanas de enjoo empilhadas: o caminho mais curto para vomitar, desidratar e abandonar o tratamento.' },
    ],
    reveals: [
      'Por que 7,5 e 12,5 mg são degraus de passagem e quais 3 doses a bula lista como manutenção (cap. 3)',
      'No SURMOUNT-1, a perda média subiu 4,5 pontos de 5 para 10 mg e só 1,4 de 10 para 15 mg (cap. 3)',
      'A janela da dose esquecida: até 96 horas para aplicar e no mínimo 72 horas entre duas doses (cap. 2)',
      'Qual tamanho de frasco casa com cada degrau, de 2,5 a 15 mg, sem sobra vencendo na geladeira (cap. 6)',
      'O cuidado com a pílula anticoncepcional que se repete a cada aumento de dose (cap. 5)',
    ],
    anchor: 'Os 5 mg que vencem num frasco de 15 mg usado em 2,5 mg valem cerca de R$ 315. O guia custa R$ 29,90.',
    revised: 'novembro de 2026',
    toc: [
      'GIP + GLP-1: o que muda em relação à semaglutida',
      'A escada de 6 etapas, 2,5 mg a cada 4 semanas ou mais',
      'Ficar numa dose intermediária: o que as bulas permitem',
      'Efeitos por etapa e sinais de alerta',
      'Náusea e alimentação na subida de dose',
      'Frascos de 5, 10 e 15 mg: quantas doses rendem e a validade de 28 dias depois de reconstituído',
      'Os 9 erros que custam frasco, dinheiro e semanas de enjoo',
      'Perguntas para levar ao médico',
    ],
    bonuses: ['Escada de doses para imprimir', 'Tabela de unidades por frasco', 'Diário de 20 semanas'],
    sources: ['Bulas da FDA de Mounjaro e Zepbound', 'Estudos de registro SURPASS e SURMOUNT'],
    bumps: ['T1', 'T3'],
    cover: 'from-sky-600 via-sky-700 to-indigo-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_TIRZEPATIDA',
    kiwifyProductId: 'b8c16730-dfc5-11f1-992b-85e75ef0d685',
    places: {
      peptides: ['tirzepatida'],
      posts: ['semaglutida-vs-tirzepatida'],
      tools: ['tabela-doses-glp1'],
    },
  },
  {
    id: 'I3',
    slug: 'retatrutida-verdade',
    kind: 'individual',
    title: 'Retatrutida: A Verdade Antes da Aprovação',
    altTitle: 'Retatrutida: O Que Não Te Contam nos Grupos',
    subtitle: 'O que os estudos já provaram, o que ainda é aposta e o que estão te vendendo antes da hora.',
    hook: 'Ainda sem aprovação em nenhum país. O que os estudos mostraram até agora, dose por dose, e o que ainda é aposta.',
    line: 'Guia em PDF: o que os estudos da retatrutida mostraram até agora.',
    price: 29.9,
    pages: 45,
    forWho: [
      'Acompanha a nova geração de remédios para obesidade e quer separar dado de boato.',
      'Viu a retatrutida sendo vendida e quer saber o que existe de estudo.',
      'Quer comparar com semaglutida e tirzepatida com números publicados.',
    ],
    notFor: [
      'Procura um protocolo de uso: a retatrutida não é aprovada em nenhum país.',
      'Quer indicação de onde comprar.',
    ],
    toc: [
      'Tri-agonista: GLP-1, GIP e glucagon',
      'Resultados publicados, estudo por estudo',
      'Doses dos ensaios: de 2 a 12 mg por semana, em incrementos de 4 semanas',
      'Efeitos adversos relatados',
      'Comparação com semaglutida e tirzepatida',
      'Situação regulatória e Lista Proibida da WADA',
      'Os riscos de produto sem registro',
    ],
    bonuses: ['Linha do tempo dos estudos', 'Tabela comparativa das três moléculas'],
    sources: ['Ensaios publicados de fase 2 e o programa de fase 3 TRIUMPH', 'Lista Proibida da WADA'],
    bumps: ['T1'],
    cover: 'from-orange-500 via-rose-600 to-indigo-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_RETATRUTIDA',
    places: { peptides: ['retatrutida'] },
  },
  {
    id: 'I4',
    slug: 'bpc-157-sem-achismo',
    kind: 'individual',
    title: 'BPC-157: O Que os Fóruns Não Te Contam',
    altTitle: 'BPC-157 Sem Achismo',
    subtitle: 'O que tem estudo, o que é achismo e as 8 perguntas para fazer antes de gastar um real.',
    hook: 'Quase tudo sobre BPC-157 vem de estudo em animal. O que existe em humanos e as 8 perguntas para fazer antes de decidir.',
    line: 'Guia em PDF: BPC-157, o que tem estudo e o que é só fórum.',
    price: 29.9,
    pages: 35,
    forWho: [
      'Pesquisa recuperação de lesão e só encontra relato de fórum.',
      'Quer saber de onde vêm as doses que circulam.',
      'Pratica esporte com teste antidoping.',
    ],
    notFor: [
      'Procura um protocolo pronto: não existe dose de bula para o BPC-157.',
      'Quer indicação de onde comprar.',
    ],
    toc: [
      'Origem e mecanismo proposto',
      'Mapa da evidência: células, animais e humanos',
      'De onde vêm as doses citadas e por que não são de bula',
      'Meia-vida e frequência',
      'Riscos: angiogênese, procedência e pureza',
      'WADA: proibido dentro e fora de competição',
      'As 8 perguntas para fazer antes de gastar um real',
      'Como ler um laudo',
    ],
    bonuses: ['Quadro de evidência por tipo de lesão', 'Checklist de laudo'],
    sources: ['Estudos pré-clínicos e clínicos indexados no PubMed', 'Lista Proibida da WADA'],
    bumps: ['T1'],
    cover: 'from-emerald-600 via-teal-700 to-slate-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_BPC157',
    places: { peptides: ['bpc-157'], categories: ['cicatrizacao'] },
  },
  {
    id: 'I5',
    slug: 'ghk-cu-rotina',
    kind: 'individual',
    title: 'GHK-Cu: Você Pode Estar Anulando o Seu',
    altTitle: 'GHK-Cu Sem Marketing',
    subtitle:
      'A ordem certa com vitamina C e retinol, o que tem estudo de verdade e o que é só marketing de cosmético.',
    hook: 'Vitamina C junto pode desestabilizar o cobre. A ordem certa da rotina e o que o GHK-Cu tem de estudo de verdade.',
    line: 'Guia em PDF: GHK-Cu na rotina, sem anular o cobre.',
    price: 29.9,
    pages: 40,
    forWho: [
      'Já usa ácidos e retinoides e quer o próximo passo com base.',
      'Comprou um sérum de GHK-Cu e não sabe com o que combinar.',
      'Quer saber se a versão injetável tem estudo.',
    ],
    notFor: ['Espera rejuvenescimento garantido.', 'Procura dose injetável: não existe dose estabelecida.'],
    toc: [
      'O tripeptídeo de cobre',
      'Estudos com uso tópico: o que foi medido',
      'Concentrações de 0,05% a 2% e como ler um rótulo',
      'Rotina: horários, pH e combinações',
      'Injetável: por que não há dose estabelecida',
      'Armazenamento',
      'Quando evitar',
    ],
    bonuses: ['Tabela de compatibilidade de ativos', 'Rotina de manhã e noite para imprimir'],
    sources: ['Estudos clínicos de uso tópico', 'Literatura dermatológica sobre complexos de cobre'],
    cover: 'from-rose-500 via-amber-500 to-teal-600',
    checkoutEnv: 'KIWIFY_CHECKOUT_GHKCU',
    places: { peptides: ['ghk-cu'], categories: ['pele-e-estetica'] },
  },
  {
    id: 'I6',
    slug: 'cjc-1295-ipamorelina',
    kind: 'individual',
    title: 'CJC-1295 + Ipamorelina: Com DAC ou Sem DAC?',
    altTitle: 'CJC + Ipamorelina: O Guia Que Faltava',
    subtitle:
      'A dúvida que muda tudo: horários, mistura no mesmo frasco e os 7 erros de quem copia protocolo de fórum.',
    hook: 'Com DAC dura dias; sem DAC, cerca de 30 minutos. O que muda na prática e os 7 erros de quem copia protocolo de fórum.',
    line: 'Guia em PDF: CJC-1295 e ipamorelina, com DAC ou sem DAC.',
    price: 29.9,
    pages: 40,
    forWho: [
      'Pesquisa a combinação de GH mais citada e se perdeu nas siglas.',
      'Não sabe se o frasco que tem é com ou sem DAC.',
      'Quer entender a conta da mistura no mesmo frasco.',
    ],
    notFor: [
      'Procura um protocolo pronto: nenhum dos dois é aprovado para uso humano.',
      'Pratica esporte com teste antidoping: ambos são proibidos pela WADA.',
    ],
    toc: [
      'GHRH e GHRP: por que se combinam',
      'Com DAC (meia-vida de dias) e sem DAC (cerca de 30 minutos): duas substâncias na prática',
      'Ipamorelina: seletividade e meia-vida de cerca de 2 horas',
      'Doses citadas e de onde vêm',
      'Mistura no mesmo frasco: a conta',
      'GH, IGF-1 e riscos',
      'WADA: seção S2',
      'Os 7 erros de quem copia protocolo de fórum',
    ],
    bonuses: ['Tabela de mistura por tamanho de frasco', 'Comparativo com e sem DAC'],
    sources: ['Estudos farmacocinéticos de CJC-1295 e ipamorelina', 'Lista Proibida da WADA (seção S2)'],
    bumps: ['T1'],
    cover: 'from-violet-600 via-indigo-700 to-slate-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_CJC_IPAMORELINA',
    places: { peptides: ['cjc-1295', 'ipamorelina'], tools: ['mistura'] },
  },
  {
    id: 'I7',
    slug: 'tesamorelina',
    kind: 'individual',
    title: 'Tesamorelina: O Único Peptídeo de GH Aprovado',
    altTitle: 'Gordura Visceral e Tesamorelina: O Que É Fato',
    subtitle:
      'Para quem a FDA aprovou, o que os estudos mediram na gordura visceral e o que ninguém pode te prometer fora disso.',
    hook: 'Aprovada para um grupo específico. O que os estudos mediram na gordura visceral antes de extrapolar.',
    line: 'Guia em PDF: tesamorelina, o que a aprovação cobre e o que não cobre.',
    price: 29.9,
    pages: 30,
    forWho: [
      'Ouviu falar da tesamorelina para gordura abdominal.',
      'Quer entender para quem ela foi aprovada.',
      'Quer saber o que acontece quando o tratamento para.',
    ],
    notFor: ['Procura uso fora da bula sem médico.', 'Espera perda de gordura garantida.'],
    toc: [
      'Análogo de GHRH: como age',
      'A indicação aprovada: gordura abdominal em HIV com lipodistrofia',
      'Dose de bula (2 mg por dia) e meia-vida de minutos',
      'Resultados e o que acontece ao parar',
      'Uso fora da bula: o que falta de estudo',
      'Efeitos adversos, glicemia e IGF-1',
      'WADA',
    ],
    bonuses: ['Resumo da bula em uma página'],
    sources: ['Bula da FDA (Egrifta)', 'Ensaios de registro em lipodistrofia associada ao HIV'],
    bumps: ['T1'],
    cover: 'from-amber-500 via-orange-600 to-rose-700',
    checkoutEnv: 'KIWIFY_CHECKOUT_TESAMORELINA',
    places: { peptides: ['tesamorelina'] },
  },
  {
    id: 'I8',
    slug: 'pt-141',
    kind: 'individual',
    title: 'PT-141: Leia Antes da Primeira Dose',
    altTitle: 'PT-141 Sem Sustos',
    subtitle: 'A dose da bula, os 45 minutos, o limite de 8 por mês e como não passar a noite enjoado.',
    hook: 'Máximo de 8 doses por mês e 1 a cada 24 horas. Os outros limites da bula e como reduzir a náusea.',
    line: 'Guia em PDF: PT-141, dose, tempo de ação e limites da bula.',
    price: 29.9,
    pages: 30,
    forWho: [
      'Quer entender como a bremelanotida age antes de conversar com o médico.',
      'Quer saber os limites de uso da bula.',
      'Confunde PT-141 com Melanotan II.',
    ],
    notFor: ['Procura uso sem acompanhamento médico.', 'Tem hipertensão não controlada ou doença cardiovascular.'],
    toc: [
      'Ação central, diferente dos inibidores de PDE5',
      'Aprovação da FDA em 2019: para quem',
      'Dose de 1,75 mg, 45 minutos antes, no máximo 1 a cada 24 horas',
      'Náusea e pressão arterial',
      'Contraindicações',
      'Uso em homens: fora da bula',
      'PT-141 não é Melanotan II',
    ],
    bonuses: ['Cartão de bolso com os limites de uso'],
    sources: ['Bula da FDA (Vyleesi)', 'Ensaios de registro RECONNECT'],
    bumps: ['T1'],
    cover: 'from-fuchsia-600 via-rose-600 to-red-700',
    checkoutEnv: 'KIWIFY_CHECKOUT_PT141',
    places: { peptides: ['pt-141'], categories: ['funcao-sexual'] },
  },

  // ─── Categoria ────────────────────────────────────────────────────────────
  {
    id: 'C1',
    slug: 'peptideos-de-gh',
    kind: 'categoria',
    title: 'Os 7 Peptídeos de GH, Lado a Lado',
    altTitle: 'GHRH ou GHRP? Pare de Confundir',
    subtitle: 'Qual dá fome, qual mexe no cortisol, qual dura minutos e qual dura dias: pare de escolher no escuro.',
    hook: 'Sermorelina dura cerca de 11 minutos; CJC-1295 com DAC, dias. Os 7 secretagogos de GH lado a lado.',
    line: 'Guia em PDF: os 7 peptídeos de GH comparados.',
    price: 29.9,
    pages: 45,
    forWho: [
      'Se perdeu entre sermorelina, GHRP-2, GHRP-6, hexarelina e companhia.',
      'Quer saber qual aumenta o apetite e qual mexe no cortisol.',
      'Quer uma tabela única para comparar.',
    ],
    notFor: [
      'Procura um protocolo pronto: só a tesamorelina tem aprovação vigente.',
      'Pratica esporte com teste antidoping: todos são proibidos pela WADA.',
    ],
    toc: [
      'GHRH e GHRP: as duas famílias',
      'Uma ficha de duas páginas para cada um: sermorelina, hexarelina, GHRP-2, GHRP-6, ipamorelina, CJC-1295 e tesamorelina',
      'A tabela-mestra',
      'Efeitos em apetite, cortisol e prolactina',
      'Riscos de GH e IGF-1 elevados',
      'WADA: seção S2',
    ],
    bonuses: ['Tabela-mestra para imprimir'],
    sources: [
      'Estudos farmacocinéticos de cada secretagogo',
      'Bula da FDA da tesamorelina',
      'Lista Proibida da WADA (seção S2)',
    ],
    bumps: ['T1'],
    cover: 'from-indigo-600 via-violet-700 to-slate-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_GH',
    places: {
      peptides: ['sermorelina', 'hexarelina', 'ghrp-2', 'ghrp-6'],
      categories: ['hormonio-do-crescimento'],
    },
  },
  {
    id: 'C2',
    slug: 'tb-500-kpv-ll-37',
    kind: 'categoria',
    title: 'TB-500, KPV e LL-37: O Que Ninguém Mediu',
    altTitle: 'Recuperação Além do Hype',
    subtitle: 'O que existe de estudo, de onde saíram as doses que circulam e o que nunca foi testado em humanos.',
    hook: 'O fragmento TB-500 nunca teve a meia-vida medida em humanos. O que existe de dado sobre TB-500, KPV e LL-37.',
    line: 'Guia em PDF: TB-500, KPV e LL-37, o que tem estudo.',
    price: 29.9,
    pages: 35,
    forWho: [
      'Pesquisa peptídeos de recuperação além do BPC-157.',
      'Quer saber de onde vêm as doses que circulam.',
      'Quer separar estudo em humanos de estudo em animal.',
    ],
    notFor: ['Procura um protocolo pronto: nenhum é aprovado para uso humano.', 'Quer indicação de onde comprar.'],
    toc: [
      'Reparo tecidual em resumo',
      'TB-500 e timosina beta-4',
      'KPV',
      'LL-37',
      'O que não se sabe: meia-vida não caracterizada em humanos',
      'WADA',
      'Procedência',
    ],
    bonuses: ['Quadro de evidência dos três peptídeos'],
    sources: ['Estudos pré-clínicos e ensaios pequenos indexados no PubMed', 'Lista Proibida da WADA'],
    bumps: ['T1'],
    cover: 'from-teal-600 via-emerald-700 to-slate-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_RECUPERACAO',
    places: { peptides: ['tb-500', 'kpv', 'll-37'] },
  },
  {
    id: 'C3',
    slug: 'semax-selank-dsip',
    kind: 'categoria',
    title: 'Semax, Selank e DSIP: Funciona Fora da Rússia?',
    altTitle: 'Foco, Calma e Sono: O Guia Honesto dos Peptídeos',
    subtitle: 'Foco, ansiedade e sono: o que os estudos russos mostram, o que falta provar e como converter a dose em gotas.',
    hook: 'Dose em gotas, não em unidades de seringa. O que os estudos de Semax, Selank e DSIP mostram e como converter.',
    line: 'Guia em PDF: Semax, Selank e DSIP, o que os estudos mostram.',
    price: 29.9,
    pages: 35,
    forWho: [
      'Pesquisa peptídeos para foco, ansiedade ou sono.',
      'Quer saber o que os estudos russos mostram de fato.',
      'Não sabe converter a dose em gotas ou jatos.',
    ],
    notFor: ['Procura tratamento para ansiedade ou insônia sem médico.', 'Espera efeito garantido.'],
    toc: [
      'Origem e registro na Rússia',
      'Semax',
      'Selank',
      'DSIP: dados escassos',
      'Spray: gotas e jatos em vez de unidades',
      'Os limites da evidência',
      'Procedência',
    ],
    bonuses: ['Tabela de conversão de concentração para gotas'],
    sources: ['Estudos publicados sobre Semax e Selank', 'Registros sanitários da Rússia'],
    cover: 'from-sky-500 via-indigo-600 to-violet-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_COGNITIVO',
    places: { peptides: ['semax', 'selank', 'dsip'], categories: ['cognitivo'] },
  },
  {
    id: 'C4',
    slug: 'longevidade-sem-ilusao',
    kind: 'categoria',
    title: 'Longevidade Sem Ilusão',
    altTitle: 'Peptídeos Anti-Idade: Fato ou Promessa?',
    subtitle:
      'MOTS-c, Epithalon e Timosina Alfa-1: o que foi medido em gente, o que é estudo em rato e o que é só promessa.',
    hook: 'Nenhum peptídeo aumentou a expectativa de vida em estudo com humanos. O que de fato foi medido com MOTS-c, Epithalon e Timosina Alfa-1.',
    line: 'Guia em PDF: peptídeos de longevidade, o que foi medido.',
    price: 29.9,
    pages: 35,
    forWho: [
      'Se interessa por longevidade e quer separar estudo de promessa.',
      'Viu o Epithalon associado a telômeros e quer saber o que foi medido.',
      'Quer entender a diferença entre dado em humanos e em animais.',
    ],
    notFor: ['Espera um protocolo anti-idade pronto.', 'Quer indicação de onde comprar.'],
    toc: [
      'O que "anti-envelhecimento" quer dizer em um estudo',
      'MOTS-c',
      'Epithalon e telomerase',
      'Timosina alfa-1: aprovação regional',
      'Nenhum estudo de expectativa de vida em humanos',
      'WADA e procedência',
    ],
    bonuses: ['Quadro de evidência: humanos, animais e células'],
    sources: ['Estudos pré-clínicos e ensaios pequenos indexados no PubMed', 'Registros regionais da timosina alfa-1'],
    bumps: ['T1'],
    cover: 'from-amber-500 via-teal-600 to-slate-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_LONGEVIDADE',
    places: { peptides: ['mots-c', 'epithalon', 'timosina-alfa-1'], categories: ['longevidade'] },
  },
  {
    id: 'C5',
    slug: 'emagrecedores-o-que-funciona',
    kind: 'categoria',
    title: 'Emagrecedores: O Que Funciona, O Que Vem Aí e O Que É Furada',
    altTitle: 'Além da Semaglutida e da Tirzepatida',
    subtitle: 'Liraglutida, cagrilintida e AOD-9604: o aprovado, o que está em estudo e o que não passou nos ensaios.',
    hook: 'O AOD-9604 não mostrou eficácia nos ensaios clínicos. O que tem aprovação, o que vem aí e o que é furada.',
    line: 'Guia em PDF: liraglutida, cagrilintida e AOD-9604 comparados.',
    price: 29.9,
    pages: 35,
    forWho: [
      'Quer conhecer as opções além da semaglutida e da tirzepatida.',
      'Usa ou vai usar liraglutida (Saxenda ou Victoza).',
      'Viu o AOD-9604 vendido como queimador de gordura.',
    ],
    notFor: ['Procura uma prescrição.', 'Espera promessa de quilos perdidos.'],
    toc: [
      'O mapa das opções',
      'Liraglutida: aplicação diária, subindo toda semana até 3 mg',
      'Cagrilintida: amilina, ainda em estudo',
      'AOD-9604: sem eficácia nos ensaios',
      'Comparativo com semaglutida e tirzepatida',
      'Situação regulatória',
    ],
    bonuses: ['Tabela comparativa das opções'],
    sources: ['Bulas da FDA de Saxenda e Victoza', 'Ensaios publicados de cagrilintida e AOD-9604'],
    bumps: ['T1'],
    cover: 'from-lime-500 via-teal-600 to-sky-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_EMAGRECEDORES',
    places: { peptides: ['liraglutida', 'cagrilintida', 'aod-9604'] },
  },
  {
    id: 'C6',
    slug: 'gonadorelina-trt',
    kind: 'categoria',
    title: 'Gonadorelina na TRT: O Erro Que Desliga o Eixo',
    altTitle: 'TRT e Fertilidade: Gonadorelina e Kisspeptina',
    subtitle: 'Por que a aplicação precisa ser em pulsos, a diferença para o hCG e onde entra a kisspeptina.',
    hook: 'Estímulo contínuo de GnRH suprime o eixo em vez de ativar. Por que a frequência decide tudo.',
    line: 'Guia em PDF: gonadorelina e kisspeptina no eixo hormonal.',
    price: 29.9,
    pages: 30,
    forWho: [
      'Faz ou vai fazer reposição de testosterona e ouviu falar da gonadorelina.',
      'Quer entender a diferença para o hCG.',
      'Se preocupa com fertilidade durante a TRT.',
    ],
    notFor: ['Procura mexer no eixo hormonal sem médico e exames.', 'Espera resultado garantido.'],
    toc: [
      'O eixo: hipotálamo, hipófise e gônadas',
      'Gonadorelina: meia-vida de 2 a 10 minutos e o efeito oposto do estímulo contínuo',
      'A diferença para o hCG',
      'Kisspeptina-10: uso experimental',
      'Exames e acompanhamento',
      'WADA',
    ],
    bonuses: ['Esquema do eixo hormonal em uma página'],
    sources: ['Literatura sobre GnRH e o eixo hipotálamo-hipófise-gônadas', 'Lista Proibida da WADA'],
    bumps: ['T1'],
    cover: 'from-sky-600 via-blue-700 to-slate-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_HORMONAL',
    places: { peptides: ['gonadorelina', 'kisspeptina-10'], categories: ['hormonal'] },
  },

  // ─── Transversais ─────────────────────────────────────────────────────────
  {
    id: 'T1',
    slug: 'reconstituicao-sem-erro',
    kind: 'transversal',
    title: '7 Erros Que Mudam Sua Dose Sem Você Perceber',
    altTitle: 'Reconstituição Sem Erro',
    subtitle: 'Reconstituição do frasco à seringa em 7 passos, com a tabela de unidades pronta para imprimir.',
    hook:
      'A conta está certa e a dose que entra é outra: bolha, vírgula, etiqueta que faltou. Os 7 passos do frasco à seringa e os 7 erros que ninguém percebe.',
    line: 'Bolha, vírgula, etiqueta: os 7 erros que mudam sua dose sem você perceber. PDF.',
    price: 29.9,
    pages: 55,
    forWho: [
      'Vai reconstituir o primeiro frasco e quer cada passo na ordem, com o material na frente.',
      'Recebe a dose em mcg e o frasco em mg, e trava na hora de converter.',
      'A dose subiu no meio do frasco e não sabe se precisa reconstituir de novo.',
    ],
    notFor: ['Procura uma dose para usar sem médico.', 'Usa só canetas prontas e não reconstitui nada.'],
    toc: [
      'mg, mcg, ml e UI sem confusão',
      'Os 7 passos, do frasco à seringa',
      'Água bacteriostática: quanto e por quê',
      'Seringas de 30, 50 e 100 unidades',
      'Os 7 erros que mudam a dose sem você perceber',
      'Armazenamento e validade de 28 dias',
      'Mistura no mesmo frasco',
      'Tabelas por tamanho de frasco',
    ],
    pains: [
      { erro: 'Escrever 2,5 mg onde a dose era 0,25 mg (250 mcg)', custo: 'Dá 100 unidades, dez vezes a dose, e cabe numa seringa de 100 U: ninguém estranha o número.' },
      { erro: 'Não etiquetar o frasco e mudar a água no frasco seguinte', custo: 'As mesmas 10 unidades entregam o dobro da dose, ou 40% a menos, sem nada parecer diferente.' },
      { erro: 'Deixar uma bolha de 2 unidades numa dose de 10', custo: '20% da dose não entra. E quanto menor a dose, maior o peso da mesma bolha.' },
    ],
    reveals: [
      'Por que a "unidade" da seringa é volume, não massa, e não tem nada a ver com UI (cap. 1)',
      'Quanta água colocar para a dose cair entre 10 e 50 unidades, e o que fazer quando cai entre traços (cap. 3)',
      'Por que a mesma dose de 8 unidades é precisa numa seringa e erra mais de 10% em outra (cap. 4)',
      'Os 7 erros em que a conta está certa e a dose que entra é outra, cada um com o tamanho do desvio (cap. 5)',
      'Por que juntar um segundo peptídeo num frasco pronto reduz a dose do primeiro em cerca de um terço (cap. 7)',
    ],
    anchor: 'Um frasco de 10 mg que congela ou turva vai inteiro para o lixo: R$ 500 a R$ 900. O guia custa R$ 29,90.',
    revised: 'novembro de 2026',
    bonuses: ['Tabela de unidades para imprimir', 'Checklist de bancada'],
    sources: [
      'Calculadoras e guias de reconstituição da Central Peptídeos',
      'Prazos de armazenamento a partir das bulas de Ozempic, Wegovy e Mounjaro',
      'Padrão de seringas de insulina U-100',
    ],
    bumps: ['T2'],
    cover: 'from-teal-500 via-cyan-600 to-sky-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_RECONSTITUICAO',
    kiwifyProductId: 'd3b93e00-dfc5-11f1-b2ef-e388708c1a73',
    places: {
      posts: ['como-reconstituir-semaglutida', 'como-reconstituir-tirzepatida', 'agua-bacteriostatica-guia'],
      tools: ['reconstituicao', 'conversor', 'cronograma'],
      sections: ['seringas', 'glossario'],
    },
  },
  {
    id: 'T2',
    slug: 'antes-de-comprar',
    kind: 'transversal',
    title: 'Não Compre Antes de Checar Isto',
    altTitle: 'Original, Manipulado ou Falso?',
    subtitle: '12 checagens para não levar produto falso nem pagar mais caro por mg.',
    hook:
      'Caneta solta, frasco de "Mounjaro", laudo sem lote, preço 40% abaixo da faixa. As 12 checagens e a conta do custo real por mg.',
    line: 'As 12 checagens antes de comprar e o custo real por mg, por dose e por mês. PDF.',
    price: 29.9,
    pages: 36,
    forWho: [
      'Tem duas ofertas com tamanhos de frasco diferentes e não sabe qual sai mais barata.',
      'Achou um preço bem abaixo das farmácias e quer saber se é oportunidade ou cilada.',
      'Vai comprar e não sabe o que pedir ao vendedor antes de pagar.',
    ],
    notFor: ['Quer indicação de onde comprar: o site não indica fornecedores.', 'Procura um atalho para comprar sem receita.'],
    toc: [
      'Original, manipulado e "de pesquisa": o que cada um garante',
      'As 12 checagens: embalagem, lote, laudo e cadeia de frio',
      'Custo por mg, por dose e por mês',
      'A perda dos 28 dias na conta',
      'Sinais de golpe',
      'O que perguntar ao vendedor',
    ],
    pains: [
      { erro: 'Escolher o frasco pelo menor preço por mg', custo: 'No exemplo do guia, o frasco que parecia 11% mais barato sai R$ 50 mais caro por dose: 1/3 vence.' },
      { erro: 'Pagar sem pedir o laudo (COA) do mesmo lote do rótulo', custo: 'Laudo sem lote serve para qualquer frasco e não prova nada sobre o seu. Você só descobre depois.' },
      { erro: 'Achar que preço dentro da faixa prova que o produto é original', custo: 'Falsificador também pesquisa preço. Se for falso, perde o valor pago, o frasco e semanas de tratamento.' },
    ],
    reveals: [
      'Por que "Mounjaro em frasco" oferecido no Brasil não é o produto registrado (cap. 1)',
      'As 5 checagens que dá para fazer antes de pagar e as 7 que só valem com o produto na mão (cap. 2)',
      'Como o frasco com menor custo por mg pode sair mais caro por dose na sua dose (cap. 4)',
      'O limite de preço abaixo do qual a oferta já é sinal de alerta, e a conta para achá-lo (cap. 5)',
      'A mensagem pronta para mandar ao vendedor e como ler o conjunto das respostas (cap. 6)',
    ],
    anchor: 'Custa menos de 3% de uma caixa de 4 canetas (R$ 1.100 a R$ 1.400), o valor em jogo numa compra errada.',
    revised: 'novembro de 2026',
    bonuses: ['Checklist de uma página', 'Planilha de custo por mg'],
    sources: ['Alertas da ANVISA sobre canetas falsificadas', 'Apresentações e validades publicadas pelos fabricantes'],
    bumps: ['T1'],
    cover: 'from-slate-600 via-slate-700 to-teal-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_COMPRA',
    kiwifyProductId: '31260550-dfc6-11f1-9205-439bc5ce1992',
    places: {
      posts: [
        'ozempic-falso-como-identificar',
        'mounjaro-falso-como-identificar',
        'onde-comprar-tirzepatida',
        'tirzepatida-preco-quanto-custa',
        'tirzepatida-manipulada-seguranca',
      ],
      tools: ['custo-glp1', 'duracao-frasco'],
      categories: ['aprovados'],
    },
  },
  {
    id: 'T3',
    slug: 'parei-e-agora',
    kind: 'transversal',
    title: 'Parei. E Agora?',
    altTitle: 'Depois da Caneta',
    subtitle:
      'O que os estudos mostram sobre o peso depois da semaglutida e da tirzepatida e o plano de 90 dias para reduzir o reganho.',
    hook:
      'Nos estudos, quem parou recuperou boa parte do peso em um ano. O que levar ao médico antes de parar e o plano para os 90 dias depois.',
    line: 'Vai parar ou já parou a caneta? O que dizem os estudos e o plano dos 90 dias. PDF.',
    price: 24.9,
    pages: 37,
    forWho: [
      'O custo pesou e está pensando em parar, mas quer entender o risco antes.',
      'Parou há algumas semanas e a fome voltou maior do que esperava.',
      'Chegou na meta e quer saber se dá para reduzir ou espaçar com o médico.',
    ],
    notFor: ['Procura parar o tratamento sem falar com o médico.', 'Espera garantia de que o peso não volta.'],
    toc: [
      'O que os estudos de interrupção mostraram',
      'Por que o peso volta',
      'Opções para discutir com o médico: manter, reduzir ou espaçar',
      'Proteína, treino de força e massa magra',
      'Os primeiros 90 dias sem a medicação',
      'Quando voltar',
    ],
    pains: [
      { erro: 'Parar de uma vez, sem plano nem retorno marcado', custo: 'No SURMOUNT-4, quem passou para placebo recuperou 14% do peso em um ano, mesmo com dieta e exercício.' },
      { erro: 'Voltar ao remédio direto na dose que usava antes de parar', custo: 'A tolerância se perde na pausa: náusea e vômito intensos, que a subida gradual teria evitado.' },
      { erro: 'Espaçar as aplicações por conta própria para economizar', custo: 'Esquema sem validação em estudo grande: o nível cai entre doses e a fome pode voltar antes da próxima.' },
    ],
    reveals: [
      'Quanto do peso voltou em um ano em quem parou, no SURMOUNT-4 e na extensão do STEP 1 (cap. 1)',
      'Por que a fome não volta no dia seguinte e reaparece semanas depois da última dose (cap. 2)',
      'O que existe de evidência para manter, reduzir ou espaçar, e o que ainda não foi testado (cap. 3)',
      'Por que o treino de força deve começar antes da última dose, e não depois (cap. 4)',
      'O gatilho a combinar com o médico antes de parar, para não esperar o peso voltar todo (cap. 6)',
    ],
    anchor: 'Custa cerca de 2% de um mês de caneta de tirzepatida (média de R$ 1.250), o custo que mais leva a parar.',
    revised: 'novembro de 2026',
    bonuses: ['Plano de 90 dias para imprimir'],
    sources: ['Extensão do estudo STEP 1', 'Estudo STEP 4', 'Estudo SURMOUNT-4'],
    cover: 'from-orange-500 via-amber-600 to-teal-700',
    checkoutEnv: 'KIWIFY_CHECKOUT_PAREI',
    kiwifyProductId: '560542a0-dfc6-11f1-9b0e-1d63259b3d5d',
    places: {
      posts: ['efeito-rebote-apos-parar-semaglutida', 'efeito-rebote-apos-parar-tirzepatida'],
      tools: ['diario'],
    },
  },

  // ─── Kit (páginas genéricas) ──────────────────────────────────────────────
  {
    id: 'KIT',
    slug: 'kit-comeco-seguro',
    kind: 'kit',
    title: 'Kit Começo Seguro GLP-1',
    altTitle: 'Os 4 Guias Para Começar Sem Erro',
    subtitle:
      'Os guias de semaglutida e tirzepatida, a reconstituição sem erro e as 12 checagens antes de comprar, num pacote só.',
    hook:
      'Os erros que custam dinheiro, dose e semanas de enjoo, da compra à aplicação: os 4 guias de semaglutida, tirzepatida, reconstituição e compra.',
    line: 'Os 4 guias para começar com GLP-1 sem erro, da compra à aplicação. PDF.',
    price: 69.9,
    pages: 190,
    forWho: [
      'Vai começar e ainda não sabe se será semaglutida ou tirzepatida.',
      'Vai usar frasco: precisa comprar certo, reconstituir certo e subir a dose certo.',
      'Quer num lugar só as escadas, tabelas, diários e checklists para imprimir.',
    ],
    notFor: ['Procura uma prescrição.', 'Espera promessa de quilos perdidos.'],
    toc: [
      'Semaglutida: O Manual Que Não Vem na Caixa',
      'Tirzepatida: Não Suba a Dose Antes de Ler Isto',
      '7 Erros Que Mudam Sua Dose Sem Você Perceber',
      'Não Compre Antes de Checar Isto',
    ],
    pains: [
      { erro: 'Comprar pelo preço, sem as checagens nem a conta do custo por mg', custo: 'Produto sem garantia, ou frasco que vence com sobra: dinheiro perdido antes da primeira dose.' },
      { erro: 'Errar a conversão de mcg para mg ou a água na reconstituição', custo: 'Dez vezes a dose, ou metade dela, num número que cabe na seringa e parece normal.' },
      { erro: 'Subir de dose no automático, com a náusea da etapa anterior', custo: 'Enjoo empilhado por semanas e a vontade de largar tudo antes de chegar à dose que funciona.' },
    ],
    reveals: [
      'A escada de 0,25 a 2,4 mg e os 9 erros que fazem desistir no meio (Semaglutida: O Manual Que Não Vem na Caixa)',
      'Quando segurar a dose e qual frasco casa com cada etapa (Tirzepatida: Não Suba a Dose Antes de Ler Isto)',
      'Os 7 erros em que a conta está certa e a dose não (7 Erros Que Mudam Sua Dose Sem Você Perceber)',
      'As 12 checagens e o custo real por mg, por dose e por mês (Não Compre Antes de Checar Isto)',
      'Escadas, diários de 16 e 20 semanas, tabelas de unidades, checklists e planilha para imprimir (os 4 guias)',
    ],
    anchor: 'Os 4 guias avulsos somam R$ 119,60. No kit, saem por R$ 69,90: R$ 49,70 a menos.',
    revised: 'novembro de 2026',
    bonuses: ['Todos os bônus dos 4 guias'],
    sources: [
      'Bulas da FDA de Ozempic, Wegovy, Rybelsus, Mounjaro e Zepbound',
      'Estudos STEP, SUSTAIN, PIONEER, SURPASS e SURMOUNT',
      'Consultas e alertas da ANVISA sobre canetas falsificadas',
    ],
    includes: ['I1', 'I2', 'T1', 'T2'],
    bumps: ['T3'],
    cover: 'from-teal-600 via-sky-700 to-indigo-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_KIT',
    kiwifyProductId: '6fad40e0-dfc6-11f1-af23-a9366f1cb294',
    places: { categories: ['emagrecimento', 'proibidos-no-esporte', 'meia-vida'] },
  },
];

// ─── Consulta ────────────────────────────────────────────────────────────────

export function getEbooks(): Ebook[] {
  return EBOOKS;
}

export function getEbookById(id: string): Ebook | undefined {
  return EBOOKS.find((e) => e.id === id);
}

export function getEbookBySlug(slug: string): Ebook | undefined {
  return EBOOKS.find((e) => e.slug === slug);
}

/** URL do checkout (só https), ou undefined se a variável não estiver definida. */
export function checkoutUrl(e: Ebook): string | undefined {
  const url = process.env[e.checkoutEnv]?.trim();
  return url && url.startsWith('https://') ? url : undefined;
}

/** Ebooks com checkout configurado: os únicos que aparecem no site. */
export function getActiveEbooks(): Ebook[] {
  return EBOOKS.filter((e) => checkoutUrl(e));
}

/** Soma dos preços avulsos dos ebooks de um kit (âncora real). */
export function kitFullPrice(kit: Ebook): number {
  return (kit.includes ?? []).reduce((sum, id) => sum + (getEbookById(id)?.price ?? 0), 0);
}

export function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ─── Qual ebook cada página oferece ──────────────────────────────────────────
// Regra: página citada explicitamente > peptídeo principal > kit (páginas genéricas).
// As funções devolvem o ebook do catálogo, ativo ou não; `toOffer` filtra os sem checkout.

const KIT_ID = 'KIT';

function byPlace(key: keyof Ebook['places'], slug: string): Ebook | undefined {
  return EBOOKS.find((e) => e.places[key]?.includes(slug));
}

export function ebookForPeptide(slug: string | undefined): Ebook | undefined {
  if (!slug || NO_EBOOK_PEPTIDES.includes(slug)) return undefined;
  return byPlace('peptides', slug);
}

/** Post: lista explícita do ebook; senão, o primeiro peptídeo citado. */
export function ebookForPost(slug: string, relatedPeptides: string[] = []): Ebook | undefined {
  const explicit = byPlace('posts', slug);
  if (explicit) return explicit;
  if (relatedPeptides.length === 0) return getEbookById(KIT_ID);
  return ebookForPeptide(relatedPeptides[0]);
}

/** Ferramenta: lista explícita; senão, peptídeo da página (se houver). */
export function ebookForTool(slug: string, peptide?: string): Ebook | undefined {
  return byPlace('tools', slug) ?? ebookForPeptide(peptide);
}

/** Página de objetivo ou lista transversal (/peptideos/categoria/<slug>). */
export function ebookForCategory(slug: string): Ebook | undefined {
  return byPlace('categories', slug) ?? getEbookById(KIT_ID);
}

/** Comparativo: o ebook do primeiro peptídeo da comparação. */
export function ebookForComparison(peptideSlugs: string[]): Ebook | undefined {
  return ebookForPeptide(peptideSlugs[0]);
}

/** Seções sem dado próprio (seringas, glossário). */
export function ebookForSection(slug: string): Ebook | undefined {
  return byPlace('sections', slug);
}

/** Home e índices (peptídeos, ferramentas, blog, comparar, medicamentos). */
export function ebookForHub(): Ebook | undefined {
  return getEbookById(KIT_ID);
}

/** "… (cap. 3)" → "…": a referência ao capítulo só aparece na landing. */
export function stripChapter(s: string): string {
  return s.replace(/\s*\((?:cap\.|capítulo)[^)]*\)\s*$/i, '');
}

/** Oferta para a página, ou null se o ebook não existe ou não tem checkout. */
export function toOffer(e: Ebook | undefined): EbookOffer | null {
  if (!e || !checkoutUrl(e)) return null;
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    subtitle: e.subtitle,
    hook: e.hook,
    line: e.line,
    priceLabel: formatPrice(e.price),
    pages: e.pages,
    cover: e.cover,
    bullets: (e.reveals?.length ? e.reveals : e.toc).slice(0, 3).map(stripChapter),
  };
}

/** Kit ativo que inclui este ebook (para oferecer o pacote na landing do avulso). */
export function kitFor(e: Ebook): Ebook | undefined {
  if (e.kind === 'kit') return undefined;
  return EBOOKS.find((k) => k.kind === 'kit' && k.includes?.includes(e.id) && checkoutUrl(k));
}
