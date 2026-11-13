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
    q: 'Como recebo o PDF?',
    a: 'A Kiwify envia o acesso para o seu email assim que o pagamento é confirmado. O PDF abre no celular, no tablet e no computador.',
  },
  {
    q: 'E se eu não gostar?',
    a: 'Você tem 7 dias para pedir o reembolso total, direto pela Kiwify, sem precisar explicar o motivo.',
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
    hook: 'Da primeira dose de 0,25 mg até a manutenção: o que esperar em cada etapa e os 9 erros que fazem desistir no meio.',
    line: 'Guia em PDF: a semaglutida semana a semana, do 0,25 mg à manutenção.',
    price: 29.9,
    pages: 40,
    forWho: [
      'Vai começar a semaglutida e quer saber o que esperar de cada etapa.',
      'Está nas primeiras semanas e não sabe se o que sente é normal.',
      'Já pensou em desistir por causa da náusea.',
    ],
    notFor: [
      'Procura uma prescrição ou uma dose para usar sem médico.',
      'Espera promessa de quilos perdidos.',
    ],
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
      'Estudos de registro STEP e SUSTAIN',
    ],
    bumps: ['T1', 'T3'],
    cover: 'from-teal-600 via-teal-700 to-sky-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_SEMAGLUTIDA',
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
    hook: 'As 6 etapas de 2,5 mg a 15 mg, quando faz sentido segurar a dose e os 9 erros que custam frasco e semanas de enjoo.',
    line: 'Guia em PDF: a tirzepatida semana a semana, de 2,5 mg a 15 mg.',
    price: 29.9,
    pages: 40,
    forWho: [
      'Vai começar em 2,5 mg e quer o mapa das próximas etapas.',
      'Está na hora de subir a dose e não sabe se deve.',
      'Quer aproveitar cada frasco sem perder dose pela validade.',
    ],
    notFor: [
      'Procura uma prescrição ou uma dose para usar sem médico.',
      'Espera promessa de quilos perdidos.',
    ],
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
    hook: 'A conta está certa; o que muda a dose é a prática. Os 7 passos do frasco à seringa e os 7 erros que ninguém percebe.',
    line: 'PDF: os 7 erros que mudam sua dose sem você perceber.',
    price: 29.9,
    pages: 35,
    forWho: [
      'Usa a calculadora, mas tem medo de errar na hora de aplicar.',
      'Vai reconstituir um frasco pela primeira vez.',
      'Quer uma tabela de unidades pronta para deixar perto do frasco.',
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
    bonuses: ['Tabela de unidades para imprimir', 'Checklist de bancada'],
    sources: ['Bulas dos fabricantes sobre armazenamento e validade', 'Padrão de seringas de insulina U-100'],
    bumps: ['T2'],
    cover: 'from-teal-500 via-cyan-600 to-sky-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_RECONSTITUICAO',
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
    hook: 'Antes de fechar, passe pelas 12 checagens: embalagem, lote, laudo, cadeia de frio e o custo real por mg.',
    line: 'PDF: as 12 checagens antes de comprar.',
    price: 29.9,
    pages: 30,
    forWho: [
      'Está comparando preço e fornecedor.',
      'Tem medo de levar caneta ou frasco falsificado.',
      'Quer saber o custo real por mg, por dose e por mês.',
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
    bonuses: ['Checklist de uma página', 'Planilha de custo por mg'],
    sources: ['Alertas da ANVISA sobre canetas falsificadas', 'Apresentações e validades publicadas pelos fabricantes'],
    bumps: ['T1'],
    cover: 'from-slate-600 via-slate-700 to-teal-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_COMPRA',
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
    hook: 'Nos estudos, boa parte do peso voltou em um ano. O que dá para fazer antes e depois de parar.',
    line: 'PDF: o plano de 90 dias para depois da semaglutida e da tirzepatida.',
    price: 24.9,
    pages: 30,
    forWho: [
      'Pensa em parar a semaglutida ou a tirzepatida.',
      'Já parou e viu o peso começar a voltar.',
      'Quer conversar com o médico sobre manter, reduzir ou espaçar.',
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
    bonuses: ['Plano de 90 dias para imprimir'],
    sources: ['Extensão do estudo STEP 1', 'Estudo SURMOUNT-4'],
    cover: 'from-orange-500 via-amber-600 to-teal-700',
    checkoutEnv: 'KIWIFY_CHECKOUT_PAREI',
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
    hook: 'Semaglutida, tirzepatida, reconstituição e as 12 checagens antes de comprar: os 4 guias num pacote só.',
    line: 'PDF: os 4 guias para começar com GLP-1 sem erro.',
    price: 69.9,
    pages: 145,
    forWho: [
      'Vai começar com GLP-1 e ainda não sabe qual.',
      'Quer o caminho inteiro, da compra à aplicação.',
      'Prefere ter tudo num lugar só.',
    ],
    notFor: ['Procura uma prescrição.', 'Espera promessa de quilos perdidos.'],
    toc: [
      'Semaglutida: O Manual Que Não Vem na Caixa',
      'Tirzepatida: Não Suba a Dose Antes de Ler Isto',
      '7 Erros Que Mudam Sua Dose Sem Você Perceber',
      'Não Compre Antes de Checar Isto',
    ],
    bonuses: ['Todos os bônus dos 4 guias'],
    sources: ['Bulas da FDA de Ozempic, Wegovy, Mounjaro e Zepbound', 'Estudos STEP, SURPASS e SURMOUNT'],
    includes: ['I1', 'I2', 'T1', 'T2'],
    bumps: ['T3'],
    cover: 'from-teal-600 via-sky-700 to-indigo-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_KIT',
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
    cover: e.cover,
    bullets: e.toc.slice(0, 3),
  };
}
