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

export type EbookKind = 'individual' | 'categoria' | 'transversal' | 'kit' | 'tabela';

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
  /**
   * Preço de lançamento: `price` vale para as primeiras `units` vendas e depois o preço sobe para
   * `after` (na Kiwify e aqui, no mesmo dia). Só use se o aumento vai mesmo acontecer; ao subir,
   * apague `launch` e ponha `price: after`.
   */
  launch?: { units: number; after: number };
  /** Mês da última revisão do texto, ex.: "novembro de 2026". */
  revised?: string;
  /** Sumário: capítulos na ordem do PDF. */
  toc: string[];
  /** Uma linha por capítulo de `toc` (mesma ordem): o que ele responde. Aparece na landing. */
  tocNotes?: string[];
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
  /** URL do checkout usada quando a variável de ambiente não existe. */
  checkoutDefault?: string;
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
  price: number;
  /** Texto do botão ("Ver o guia", "Ver a tabela"). */
  cta: string;
  /** Rótulo da capa ("Guia em PDF"). */
  coverLabel: string;
  pages: number;
  cover: string;
  bullets: string[];
  /** Comparação de preço verdadeira (mesma da landing). */
  anchor?: string;
  /** "Lançamento: R$ 39,90 nas 10 primeiras unidades. Depois, R$ 69,90." */
  launchNote?: string;
  /** Primeira página de amostra (imagem em /public). */
  sample?: string;
};

/** Pop-up de saída (components/ebook/ExitOffer.tsx). Desligue aqui se ele não trouxer venda. */
export const EXIT_OFFER_ENABLED = true;

/**
 * Cupom do pop-up de saída. Existe de verdade na Kiwify (oferta principal dos 8 produtos,
 * checkout com cupom ligado). Mudou o código ou o percentual lá? Mude aqui. null desliga.
 */
export const EXIT_COUPON: { code: string; percent: number } | null = { code: 'SAIDA10', percent: 10 };

/** Preço com o cupom de saída aplicado. */
export function couponPrice(price: number, percent: number): number {
  return Math.round(price * (100 - percent)) / 100;
}

/**
 * Upsell da página de obrigado (/ebooks/obrigado): o kit por um preço só para quem acabou de
 * comprar um guia. Oferta própria do produto do kit na Kiwify, sem cupom.
 */
export const KIT_UPSELL = { price: 39.9, checkoutUrl: 'https://pay.kiwify.com.br/ijyQkSI' };

/** Preço de um ebook quando entra como oferta extra (order bump) no checkout. */
export const BUMP_PRICE = 14.9;

export const KIND_LABELS: Record<EbookKind, string> = {
  individual: 'Guia em PDF',
  categoria: 'Guia comparativo em PDF',
  transversal: 'Guia prático em PDF',
  kit: 'Pacote de guias em PDF',
  tabela: 'Tabela personalizada em PDF',
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
    tocNotes: [
      'Os quatro efeitos do GLP-1, a meia-vida de cerca de 7 dias e as diferenças entre Ozempic, Wegovy e Rybelsus',
      'As duas escadas das bulas em tabela, semana a semana, e a lista do que é regra, do que é flexível e do que não é',
      'O esperado em cada dose, as frequências da bula do Wegovy (náusea em 44%) e o aviso antes de anestesia',
      '8 medidas para náusea, 5 para constipação e 6 para refluxo, e as três situações em que não faz sentido subir',
      'Como trocar o dia da aplicação, o prazo da caneta após o primeiro uso (6 semanas no Brasil) e 8 cuidados de viagem',
      'A escada de 3, 7 e 14 mg contada em dias e as 4 regras de tomada: jejum, até 120 ml de água, inteiro, 30 minutos',
      'Cada erro em três partes: o que acontece, por que faz desistir e o que fazer no lugar',
      '33 perguntas prontas em 6 momentos, de antes de começar ao longo prazo, com o motivo de cada uma',
    ],
    bonuses: ['Escada de doses para imprimir', 'Diário de sintomas de 16 semanas'],
    sources: [
      'Bulas da FDA de Ozempic, Wegovy e Rybelsus',
      'Estudos de registro STEP, SUSTAIN e PIONEER',
      'Estudos de desfecho cardiovascular SELECT e SOUL',
    ],
    bumps: ['T1', 'T3'],
    sample: ['/ebooks/semaglutida-manual/amostra-1.webp', '/ebooks/semaglutida-manual/amostra-2.webp'],
    faq: [
      {
        q: 'Serve para Ozempic, Wegovy, comprimido ou frasco?',
        a: 'O guia trata da molécula e mostra as duas escadas de caneta (até 2,0 mg e até 2,4 mg), com a regra de dose esquecida de cada uma; o capítulo 6 é só do comprimido diário. Para frasco há apenas uma orientação curta: as unidades na seringa dependem da concentração e a conta deve ser refeita a cada degrau.',
      },
      {
        q: 'Já passei das primeiras semanas. Ainda vale?',
        a: 'Os capítulos 1 e 2 são pensados para antes da primeira dose. O restante é de consulta ao longo do tratamento: o capítulo 3 a cada subida, náusea, dose esquecida, viagem e armazenamento quando precisar, e as perguntas ao médico vão até o longo prazo. Quem já está estável na manutenção aproveita menos a parte da escada.',
      },
      {
        q: 'O guia diz qual dose usar ou quanto vou emagrecer?',
        a: 'Não. Ele mostra as escadas das bulas como referência e avisa que a escada que vale é a que o médico prescreveu. O resultado do STEP 1 (perda média de 14,9% em 68 semanas com 2,4 mg) aparece como média de estudo, não como promessa.',
      },
    ],
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
    tocNotes: [
      'Por que os mg não se comparam com os da semaglutida e o que SURPASS-2 e SURMOUNT-5 mediram frente a frente',
      'O calendário com etapas de 4, 6 e 8 semanas (15 mg na semana 21, 31 ou 41) e 3 perguntas antes de cada degrau',
      '5 situações em que segurar a dose entra na conversa e o que a bula do Zepbound prevê se uma dose não é tolerada',
      'Tabela do SURMOUNT-1 com náusea, diarreia, constipação e vômito em 5, 10 e 15 mg, e 7 sinais para atendimento',
      'O semáforo verde, amarelo e vermelho para decidir a subida, o que ajuda no prato e o que não deixar faltar',
      'Tabela de unidades por frasco e volume de água, o limite de 4 doses por frasco e a conta da escada inteira',
      'Cada erro com o que acontece, quanto custa e como evitar, do calendário à seringa e ao anticoncepcional',
      '48 perguntas em 8 momentos, com um bloco para cada subida de dose e outro para quem usa frasco',
    ],
    bonuses: ['Escada de doses para imprimir', 'Tabela de unidades por frasco', 'Diário de 20 semanas'],
    sources: ['Bulas da FDA de Mounjaro e Zepbound', 'Estudos de registro SURPASS e SURMOUNT'],
    bumps: ['T1', 'T3'],
    sample: ['/ebooks/tirzepatida-antes-de-subir-a-dose/amostra-1.webp', '/ebooks/tirzepatida-antes-de-subir-a-dose/amostra-2.webp'],
    faq: [
      {
        q: 'Uso caneta, não frasco. O guia serve?',
        a: 'Sim, a maior parte vale para os dois: escada, dose intermediária, efeitos por etapa, náusea, dose esquecida e perguntas ao médico. O capítulo 6, a tabela de unidades e parte dos 9 erros (unidades, escolha e preparo do frasco) são específicos de quem usa frasco.',
      },
      {
        q: 'Já estou em 10 mg. Ainda vale?',
        a: 'O guia vai até 15 mg: traz os efeitos em 10, 12,5 e 15 mg, o que as bulas dizem sobre ficar em 10 mg ou voltar um degrau e os números do SURMOUNT-1 por dose, sem dizer qual é a sua dose. Os trechos sobre 2,5 e 5 mg terão menos uso, e quem já está estável em 15 mg aproveita menos, porque o foco é a subida.',
      },
      {
        q: 'Vim da semaglutida. O guia diz em que dose de tirzepatida começar?',
        a: 'Não. O capítulo 1 explica por que os miligramas das duas não se comparam e informa que as bulas não trazem tabela de conversão. A dose de partida na troca é decisão do médico.',
      },
    ],
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
    subtitle: 'O que os estudos já mediram, o que ainda não tem resposta e o que estão te vendendo antes da hora.',
    hook: 'Sem aprovação em nenhum país. O que os estudos mediram, por que o 28% vira 25% e o que ninguém confere no que está à venda.',
    line: 'O que os estudos da retatrutida mostraram e o que ainda não tem resposta. Guia em PDF.',
    price: 29.9,
    pages: 58,
    forWho: [
      'Viu a retatrutida sendo vendida em grupo ou site e quer saber o que existe de estudo antes de decidir.',
      'Usa ou vai começar semaglutida ou tirzepatida e ficou em dúvida se vale esperar a retatrutida.',
      'Ouviu que ela "emagrece 30%" e quer saber de onde esse número saiu.',
    ],
    notFor: [
      'Procura um protocolo de uso: a retatrutida não é aprovada em nenhum país e o guia não ensina a usar.',
      'Quer indicação de onde comprar.',
    ],
    pains: [
      { erro: 'Tomar o número do anúncio (28% ou 29%) como o resultado esperado', custo: 'No principal estudo publicado, contando todos os participantes, a média com 12 mg foi 25,0%, e na fase 3 de 7,7% a 18,2% pararam nessa dose por efeito adverso.' },
      { erro: 'Seguir a escada "2, 4, 6, 8, 10, 12 mg" que circula como se fosse a dos estudos', custo: 'Nenhum ensaio usou essa sequência. Na fase 2, só mudar a dose inicial levou a náusea de 17% para 60% na mesma dose final.' },
      { erro: 'Confiar no laudo do vendedor e no relato de quem "usou e deu certo"', custo: 'Identidade, pureza, esterilidade e dose seguem sem ninguém conferir, e a ANVISA mandou apreender esses produtos em outubro de 2026.' },
    ],
    reveals: [
      'Por que a mesma dose aparece com 28,3% no comunicado da empresa e 25,0% na revista científica (cap. 2)',
      'A sequência de doses que os ensaios de fase 3 usaram de fato, e por que a tabela que circula não bate com ela (cap. 3)',
      'O efeito na pele que atingiu até 1 em cada 5 participantes na dose mais alta de um dos estudos (cap. 4)',
      'O que existe, e o que ainda não existe, de comparação direta com tirzepatida e semaglutida (cap. 5)',
      'O que a Lista da WADA diz: a retatrutida não é citada pelo nome e mesmo assim é proibida para atletas (cap. 6)',
    ],
    anchor: 'Uma reportagem de janeiro de 2026 encontrou canetas falsas de retatrutida vendidas por R$ 2,1 mil a R$ 3 mil. O guia custa R$ 29,90 e mostra o que esse dinheiro não compra.',
    revised: 'novembro de 2026',
    toc: [
      'Tri-agonista: o que o glucagon acrescenta ao GLP-1 e ao GIP',
      'Resultados publicados, estudo por estudo',
      'As doses dos ensaios e como a escada foi feita',
      'Efeitos adversos relatados, incluindo o que se concentrou nas doses altas',
      'Retatrutida, tirzepatida e semaglutida lado a lado',
      'Onde está a aprovação: o que falta, WADA e ANVISA',
      'O que está sendo vendido hoje: o que um frasco "de pesquisa" não garante',
      'As 12 perguntas para fazer antes de qualquer decisão',
    ],
    tocNotes: [
      'O que é um tri-agonista e o que o glucagon acrescenta: o que é dado e o que ainda é hipótese',
      'Cada estudo, da fase 1 à fase 3: quem participou, quanto perdeu em média e se o resultado já saiu em revista',
      'As doses que os pesquisadores usaram e como a subida mudou da fase 2 para a fase 3',
      'As taxas de náusea, vômito, diarreia e alteração de sensibilidade na pele em cada estudo, e quantos pararam',
      'As três moléculas com números publicados, e por que comparar estudos diferentes engana',
      'Em que etapa está a aprovação, o que a ANVISA fez em 2026 e o que a Lista da WADA diz',
      'O que um produto sem registro não garante: identidade, pureza, esterilidade, dose, conservação e responsável',
      '7 perguntas para você responder e 5 para levar ao médico',
    ],
    bonuses: ['Linha do tempo dos estudos', 'Tabela comparativa das três moléculas'],
    sources: [
      'Artigos publicados: Lancet 2022 e 2023, NEJM 2023 e 2026, Nature Medicine 2024',
      'Comunicados da Eli Lilly sobre o programa de fase 3 TRIUMPH, identificados como comunicado no texto',
      'Registros dos ensaios no ClinicalTrials.gov',
      'Nota e resolução da ANVISA de 2026 e a Lista Proibida da WADA de 2026',
    ],
    faq: [
      {
        q: 'O guia ensina a usar ou diz onde comprar retatrutida?',
        a: 'Não. A retatrutida não é aprovada em nenhum país. O guia descreve as doses que os pesquisadores usaram nos ensaios, como fato, e não traz protocolo, preparo, aplicação nem indicação de fornecedor.',
      },
      {
        q: 'De onde vêm os números?',
        a: 'De artigos publicados (Lancet 2022 e 2023, NEJM 2023 e 2026, Nature Medicine 2024), de comunicados oficiais da Eli Lilly, do ClinicalTrials.gov, da ANVISA e da WADA. Cada número traz a origem, e o texto avisa quando o dado só existe em comunicado da empresa.',
      },
      {
        q: 'O conteúdo não fica desatualizado quando a aprovação sair?',
        a: 'A revisão é de novembro de 2026. Até essa data não havia pedido de registro enviado; a fabricante informou que planeja pedir à FDA no primeiro trimestre de 2027. O capítulo 6 mostra onde conferir a situação atual em fontes oficiais, e quem comprou recebe as revisões sem pagar de novo.',
      },
    ],
    sample: ['/ebooks/retatrutida-verdade/amostra-1.webp', '/ebooks/retatrutida-verdade/amostra-2.webp'],
    cover: 'from-orange-500 via-rose-600 to-indigo-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_RETATRUTIDA',
    kiwifyProductId: '7cbc7730-e069-11f1-8857-8d1aae0a9d8c',
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
    title: 'GHK-Cu Sem Marketing',
    altTitle: 'GHK-Cu: O Que o Rótulo Não Explica',
    subtitle:
      'Como encaixar o peptídeo de cobre na rotina com vitamina C, ácidos e retinol: o que tem estudo de verdade, o que é só precaução e o que é marketing de cosmético.',
    hook: 'Peptídeo de cobre com vitamina C, ácidos e retinol: o que foi medido, o que é só precaução e como montar a rotina.',
    line: 'GHK-Cu na rotina: o que separar, o que pode ir junto e o que os estudos mediram. Guia em PDF.',
    price: 29.9,
    pages: 54,
    forWho: [
      'Comprou um sérum de GHK-Cu e não sabe com o que combinar.',
      'Usa vitamina C de manhã e retinol à noite e não sabe onde o peptídeo de cobre entra.',
      'Está em dúvida entre um sérum "3%" e um "10%" e quer saber o que o número significa.',
    ],
    notFor: [
      'Espera rejuvenescimento garantido ou um prazo para ver resultado.',
      'Procura dose injetável: não existe dose estabelecida e o guia não traz nenhuma.',
    ],
    pains: [
      { erro: 'Aplicar o sérum de GHK-Cu junto com a vitamina C ácida', custo: 'Em meio ácido o peptídeo segura pior o cobre, e cobre solto oxida a vitamina C: você pode estar reduzindo a ação dos dois. É dado de laboratório, ainda não testado na pele.' },
      { erro: 'Escolher o sérum pelo percentual da embalagem', custo: 'O número pode ser de uma solução diluída ou de uma mistura de ativos, e nenhum estudo comparou concentrações: você paga por um número que não dá para comparar.' },
      { erro: 'Comprar pela frase "70% mais colágeno que a vitamina C"', custo: 'São 7 pessoas de 10 contra 5 de 10, na coxa, por um mês: a expectativa fica maior do que o estudo permite.' },
    ],
    reveals: [
      'O estudo dos "70% contra 50% da vitamina C" tinha 20 voluntários e foi feito na coxa (cap. 2)',
      'Retinol e peptídeo de cobre "se anulam"? Procuramos a prova e não existe estudo (cap. 4)',
      'O dado de laboratório que explica por que o pH do seu sérum de vitamina C importa para o cobre (cap. 4)',
      'O relatório de segurança registrou uso típico abaixo de 0,001% neste grupo de ingredientes: o que isso diz sobre o "10%" do rótulo (cap. 3)',
      'O gel de peptídeo de cobre que foi bem num estudo pequeno e não superou o placebo com 511 pacientes (cap. 2)',
    ],
    anchor: 'O guia custa R$ 29,90: menos da metade do sérum de peptídeo de cobre mais barato que encontramos em farmácia brasileira em novembro de 2026 (R$ 64,50 por 30 ml).',
    revised: 'novembro de 2026',
    toc: [
      'O tripeptídeo de cobre: o que é e o que cai com a idade',
      'O que os estudos com uso tópico mediram, e em quem',
      'Concentração e como ler um rótulo',
      'Rotina: ordem, horário, pH e o que combinar ou separar',
      'Cabelo: o que tem e o que não tem de evidência',
      'Injetável: por que não existe dose estabelecida',
      'Armazenamento, validade e sinais de produto degradado',
      'Quando evitar e os 7 erros mais comuns',
    ],
    tocNotes: [
      'O que é o GHK-Cu, de onde vem o número "cai com a idade" e o que são os "4.000 genes"',
      'Quantas pessoas, por quanto tempo e o que cada estudo tópico mediu de fato',
      'O que o percentual do rótulo significa e como achar o ativo na lista de ingredientes',
      'Três esquemas de manhã e noite, com o nível de evidência de cada orientação sobre vitamina C, ácidos e retinol',
      'O que existe de estudo para cabelo e por que GHK-Cu não é AHK-Cu',
      'Por que o injetável não tem dose estabelecida e o que a ANVISA alertou em 2026',
      'Como guardar o sérum e reconhecer um produto degradado',
      'Quem deve evitar ou perguntar antes, e os 7 erros mais comuns',
    ],
    bonuses: ['Tabela de compatibilidade de ativos', 'Rotina de manhã e noite para imprimir'],
    sources: [
      'Estudos em pessoas com uso tópico (1998 a 2025), com o tamanho e o tipo de publicação de cada um',
      'Estudos de laboratório sobre a ligação do cobre ao peptídeo e a estabilidade em cada pH',
      'Relatório de segurança do painel CIR (2018) e alertas da ANVISA de 2026',
    ],
    faq: [
      {
        q: 'O guia diz qual sérum comprar?',
        a: 'Não. Ele não indica marca. Ensina a ler o rótulo (nome do ativo, pH, cor, percentual) para você comparar os produtos por conta própria.',
      },
      {
        q: 'Tem dose ou protocolo de GHK-Cu injetável?',
        a: 'Não. Um capítulo explica por que não existe dose estabelecida e o que a ANVISA alertou em 2026. O guia não traz dose, diluição nem técnica de aplicação.',
      },
      {
        q: 'Então posso ou não usar com vitamina C e retinol?',
        a: 'O guia mostra o que foi medido e o que é precaução. Para vitamina C ácida e ácidos, a orientação é separar por horário, uma precaução baseada em química de laboratório. Para retinol não há prova de incompatibilidade; separar ajuda com a irritação. Há três esquemas prontos de manhã e noite.',
      },
    ],
    sample: ['/ebooks/ghk-cu-rotina/amostra-1.webp', '/ebooks/ghk-cu-rotina/amostra-2.webp'],
    cover: 'from-rose-500 via-amber-500 to-teal-600',
    checkoutEnv: 'KIWIFY_CHECKOUT_GHKCU',
    kiwifyProductId: '906a27a0-e069-11f1-8857-8d1aae0a9d8c',
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
    title: 'Você Tem Certeza de Que Entende Seu Frasco?',
    altTitle: '7 Erros Que Mudam Sua Dose Sem Você Perceber',
    subtitle:
      'Quantidade do frasco, concentração e volume sem confusão: o que cada número significa, os 7 erros de interpretação que mudam sua dose e o que confirmar com um profissional.',
    hook:
      'Quantidade do frasco, concentração e volume parecem a mesma coisa. Não são. O guia mostra o que cada número significa, os 7 erros de interpretação que mudam sua dose sem você perceber e o que confirmar com um profissional antes de aplicar.',
    line: 'mg do frasco, mg/ml e ml não são a mesma coisa: os 7 erros de interpretação que mudam sua dose. PDF.',
    price: 39.9,
    launch: { units: 10, after: 69.9 },
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
    tocNotes: [
      'As duas fórmulas da seringa, 3 exemplos resolvidos (dose em mg, em mcg e doses por frasco) e 3 perguntas antes da conta',
      'Da bancada à leitura do êmbolo, com lista de material, modelo de etiqueta e exemplo completo com frasco de 10 mg',
      'Por que só a bacteriostática serve para frasco multidose, o prazo da água aberta e o mesmo frasco com 1, 2 e 3 ml',
      'Seringa U-100 e U-40, o menor traço de cada tamanho e o que fazer quando a dose passa de 100 unidades',
      'Unidade lida como mg, vírgula, água esquecida, seringa, bolha, êmbolo e frasco degradado, e a conferência de 10 segundos',
      'Geladeira de 2 a 8 °C, como calcular a data de descarte e 4 exemplos de sobra quando o frasco rende mais que o prazo',
      'A fórmula por peptídeo, por que a razão entre as doses fica fixa e como ler a seringa ao puxar de dois frascos',
      '9 tamanhos de frasco, de 1,6 a 100 mg, com unidades para 1 e 2 ml de água e doses por frasco em cada linha',
    ],
    pains: [
      { erro: 'Escrever 2,5 mg onde a dose era 0,25 mg (250 mcg)', custo: 'Dá 100 unidades, dez vezes a dose, e cabe numa seringa de 100 U: ninguém estranha o número.' },
      { erro: 'Não etiquetar o frasco e mudar a água no frasco seguinte', custo: 'As mesmas 10 unidades entregam o dobro da dose, ou 40% a menos, sem nada parecer diferente.' },
      { erro: 'Deixar uma bolha de 2 unidades numa dose de 10', custo: '20% da dose não entra. E quanto menor a dose, maior o peso da mesma bolha.' },
    ],
    reveals: [
      'O que quantidade do frasco, concentração e volume significam, e as duas fórmulas que ligam um ao outro (cap. 1)',
      'Os 7 erros de interpretação em que a conta está certa e a dose que entra é outra, cada um com o tamanho do desvio (cap. 5)',
      'Por que a "unidade" da seringa é volume, não massa, e não tem nada a ver com UI (cap. 1)',
      'Quanta água colocar para a dose cair entre 10 e 50 unidades, e o que fazer quando cai entre traços (cap. 3)',
      'Por que juntar um segundo peptídeo num frasco pronto reduz a dose do primeiro em cerca de um terço (cap. 7)',
    ],
    anchor: 'Um frasco de 10 mg aplicado com a dose errada, ou que congela e vai para o lixo, custa R$ 500 a R$ 900. O guia custa R$ 39,90.',
    revised: 'novembro de 2026',
    bonuses: ['Tabela de unidades para imprimir', 'Checklist de bancada'],
    sources: [
      'Calculadoras e guias de reconstituição da Central Peptídeos',
      'Prazos de armazenamento a partir das bulas de Ozempic, Wegovy e Mounjaro',
      'Padrão de seringas de insulina U-100',
    ],
    bumps: ['TAB', 'T2'],
    sample: ['/ebooks/reconstituicao-sem-erro/amostra-1.webp', '/ebooks/reconstituicao-sem-erro/amostra-2.webp'],
    faq: [
      {
        q: 'Uso caneta pronta. Este guia serve para mim?',
        a: 'Não. O próprio guia avisa que caneta já vem com a dose pronta, não é reconstituída, e que quase nada do conteúdo se aplica a ela. Ele é para quem usa frasco com pó liofilizado.',
      },
      {
        q: 'As tabelas servem para o meu peptídeo e o meu frasco?',
        a: 'As tabelas são por tamanho de frasco (9 tamanhos, de 1,6 a 100 mg), com 1 ml e 2 ml de água, porque as unidades dependem só dos mg do frasco, da água e da dose. Para outro volume ou dose fora da tabela, o guia manda usar a calculadora do site. Melanotan II fica fora.',
      },
      {
        q: 'O guia diz qual dose eu devo aplicar?',
        a: 'Não. Ele converte em unidades da seringa a dose que o médico definiu. As linhas das tabelas são doses de referência do site, não recomendação, e vários peptídeos listados não têm aprovação para uso humano.',
      },
    ],
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
    tocNotes: [
      'Tabela dos três grupos lado a lado (registro, receita, quem responde) e 5 perguntas para situar a oferta',
      'Cada checagem com o que passa e o que falha, e o que um laudo (COA) útil traz: lote, HPLC, identidade, endotoxinas',
      'As 5 fórmulas, o motivo do fator 4,33 semanas por mês e exemplos de frasco e de caneta com preços hipotéticos',
      'A conta corrigida: no máximo 4 doses semanais por frasco, custo real por dose e quantos frascos um ciclo pede',
      'Sinais em 4 grupos (onde, como, o que e quanto) e o roteiro se desconfiar antes de pagar, ao receber ou após aplicar',
      '17 perguntas em 5 blocos, de CNPJ a envio refrigerado, com o que passa, o que falha e o que não perguntar',
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
    anchor: 'Custa menos de 2% de uma caixa de 4 canetas (a partir de cerca de R$ 1.720 na farmácia), o valor em jogo numa compra errada.',
    revised: 'novembro de 2026',
    bonuses: ['Checklist de uma página', 'Planilha de custo por mg'],
    sources: ['Alertas da ANVISA sobre canetas falsificadas', 'Apresentações e validades publicadas pelos fabricantes'],
    bumps: ['T1'],
    sample: ['/ebooks/antes-de-comprar/amostra-1.webp', '/ebooks/antes-de-comprar/amostra-2.webp'],
    faq: [
      {
        q: 'Vou comprar caneta em farmácia. Ainda serve?',
        a: 'Em parte. As checagens de canal, receita, registro na ANVISA, embalagem, lacre, lote e alertas valem para caneta, e o capítulo 3 tem exemplo de custo de caneta. O laudo (COA) e a perda dos 28 dias são assuntos de frasco.',
      },
      {
        q: 'O guia traz os preços atuais?',
        a: 'Não. Todo valor em reais no guia é hipotético e serve só para mostrar a conta, porque o preço muda com frequência. Ele ensina a calcular custo por mg, por dose e por mês e a comparar com a faixa pesquisada na data da compra.',
      },
      {
        q: 'Se a oferta passar nas 12 checagens, o produto é seguro?',
        a: 'O guia não promete isso. As checagens ajudam a reconhecer produto irregular, mas não tornam um produto "de pesquisa" seguro nem legal para uso humano. O laudo atesta o lote analisado, não a esterilidade nem o que aconteceu no transporte.',
      },
    ],
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
      'O que os estudos mostram sobre o peso depois da semaglutida e da tirzepatida e um plano de 90 dias para atravessar o período e agir cedo se o peso voltar.',
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
    tocNotes: [
      'Três estudos em tabela, incluindo o STEP 4, o que volta além do peso e o que os números não dizem',
      'Seis explicações, da adaptação metabólica ao ambiente, e em quanto tempo cada medicamento sai do organismo',
      'Quatro caminhos (manter, reduzir, espaçar, parar com plano), os 5 itens de um plano de parada e 9 perguntas prontas',
      'A referência da OMS de força em 2 ou mais dias por semana, como começar e por que o guia não dá gramas de proteína',
      'Três fases (semanas 1 a 4, 5 a 8 e 9 a 13), 5 itens para anotar e os sinais para não esperar o retorno',
      'Sinais para marcar consulta, por que não retomar na dose antiga e os esquemas de subida das bulas como referência',
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
    anchor: 'Custa menos de 2% de um mês de caneta de tirzepatida (cerca de R$ 1.850 já na dose inicial), o custo que mais leva a parar.',
    revised: 'novembro de 2026',
    bonuses: ['Plano de 90 dias para imprimir'],
    sources: ['Extensão do estudo STEP 1', 'Estudo STEP 4', 'Estudo SURMOUNT-4'],
    sample: ['/ebooks/parei-e-agora/amostra-1.webp', '/ebooks/parei-e-agora/amostra-2.webp'],
    faq: [
      {
        q: 'Ainda não parei. Ou já parei há algumas semanas. Serve nos dois casos?',
        a: 'Sim. Para quem ainda usa, os capítulos 1 a 3 preparam a conversa com o médico e há uma lista do que deixar pronto antes da última dose. Para quem já parou, o guia indica começar pelos capítulos 5 e 6 e imprimir o plano de 90 dias.',
      },
      {
        q: 'Vale para semaglutida e para tirzepatida?',
        a: 'Sim. Os estudos apresentados são o SURMOUNT-4 (tirzepatida) e a extensão do STEP 1 e o STEP 4 (semaglutida). O tempo de saída do organismo e os esquemas de retomada aparecem para as duas moléculas.',
      },
      {
        q: 'O guia ensina a reduzir ou espaçar a dose para parar aos poucos?',
        a: 'Não. Ele mostra o que existe de evidência para cada caminho e deixa claro que não há protocolo de retirada validado e que espaçar não é o esquema da bula. São temas para levar ao médico, e o guia não garante que o peso não volta.',
      },
    ],
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
    id: 'TAB',
    slug: 'tabela-personalizada',
    kind: 'tabela',
    title: 'Tabela Personalizada do Seu Frasco',
    altTitle: 'A Tabela do Seu Frasco em PDF',
    subtitle:
      'Os números do seu frasco num PDF para colar na geladeira: unidades de cada dose, calendário com a data de descarte e etiqueta do frasco.',
    hook:
      'A conta que você acabou de fazer, pronta para imprimir: unidades de cada dose, as datas de cada aplicação até o descarte e a etiqueta do frasco.',
    line: 'Seus números num PDF para a geladeira: doses, calendário do frasco e etiqueta.',
    price: 9.9,
    pages: 2,
    forWho: [
      'Reconstitui frasco e quer os números à mão na hora de aplicar, sem abrir o site.',
      'Já errou ou teve medo de errar a data de descarte ou a unidade da seringa.',
      'Divide a aplicação com alguém da casa e precisa de uma folha clara para conferir.',
    ],
    notFor: ['Usa caneta pronta: ela já vem com a dose marcada.', 'Procura quem diga qual dose usar: a tabela usa a dose que o médico definiu.'],
    toc: [
      'Sua dose em unidades e em ml',
      'Outras doses com o mesmo frasco',
      'Calendário do frasco até o descarte',
      'Etiqueta do frasco para recortar',
      'Checklist de bancada',
    ],
    tocNotes: [
      'Unidades na seringa de 30, 50 ou 100 U, o volume em ml e quantas doses inteiras o frasco tem',
      'Meia dose, 1,5× e 2× e a escada de titulação quando existe, com aviso quando a dose não cabe na seringa',
      'Cada aplicação com data, quanto puxar, quanto sobra no frasco e uma caixa para marcar, até a data de descarte',
      'Peptídeo, concentração, unidades da sua dose, data da mistura e data de descarte',
      'Os 7 cuidados da mistura à geladeira, para conferir antes de cada aplicação',
    ],
    pains: [
      { erro: 'Esquecer em que dia o frasco foi misturado', custo: 'Ou você joga fora antes da hora, ou aplica de um frasco vencido sem saber.' },
      { erro: 'Refazer a conta de cabeça na hora de aplicar', custo: 'Uma vírgula fora do lugar dá dez vezes a dose, num número que cabe na seringa.' },
      { erro: 'Trocar o volume de água no frasco seguinte e manter as unidades', custo: 'As mesmas unidades passam a entregar outra dose, sem nada parecer diferente.' },
    ],
    reveals: [
      'Quantas unidades puxar na sua dose e nas doses vizinhas, numa folha só (tabela de doses)',
      'A data de cada aplicação e o dia exato de jogar o frasco fora (calendário)',
      'Quanto sobra no frasco a cada aplicação, para saber quando comprar o próximo (calendário)',
    ],
    anchor: 'Um frasco de 10 mg aplicado depois de vencer, ou jogado fora antes da hora, custa R$ 500 a R$ 900. A tabela custa R$ 9,90.',
    revised: 'novembro de 2026',
    bonuses: ['Etiqueta do frasco', 'Checklist de bancada'],
    sources: [
      'Fórmulas da calculadora de reconstituição da Central Peptídeos (seringa U-100)',
      'Escadas de titulação das bulas de semaglutida e tirzepatida',
      'Prazo de 28 dias para frasco multidose com água bacteriostática',
    ],
    bumps: ['T1'],
    faq: [
      {
        q: 'Como recebo a tabela?',
        a: 'Depois do pagamento, a Kiwify leva você à página que gera a tabela. Você confere os números, baixa em PDF ou imprime. O acesso fica salvo no aparelho: salve o endereço nos favoritos para gerar de novo quando trocar de frasco.',
      },
      {
        q: 'A calculadora do site não faz a mesma conta?',
        a: 'Faz, e continua grátis. A tabela organiza a conta numa folha para imprimir, com o calendário até o descarte, a etiqueta do frasco e as doses vizinhas. É para quem quer os números na geladeira, não na tela.',
      },
      {
        q: 'Serve para qualquer peptídeo?',
        a: 'Serve para qualquer frasco com pó para reconstituir: você informa os mg do frasco, a água, a dose e a frequência. Melanotan II fica de fora. A tabela não diz qual dose usar.',
      },
      {
        q: 'Quais as formas de pagamento? E se eu não gostar?',
        a: 'Pix ou cartão, pelo checkout da Kiwify. Se não valer, peça o reembolso total pela Kiwify em até 7 dias, sem precisar explicar.',
      },
    ],
    cover: 'from-emerald-500 via-teal-600 to-cyan-800',
    checkoutEnv: 'KIWIFY_CHECKOUT_TABELA',
    checkoutDefault: 'https://pay.kiwify.com.br/0cZRVbJ',
    kiwifyProductId: 'df1675f0-e115-11f1-9ed5-1d1ad40effc1',
    // Vendida como oferta extra no checkout do guia de reconstituição (T1) e na própria landing.
    places: {},
  },
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
      'Você Tem Certeza de Que Entende Seu Frasco?',
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
      'Os 7 erros em que a conta está certa e a dose não (Você Tem Certeza de Que Entende Seu Frasco?)',
      'As 12 checagens e o custo real por mg, por dose e por mês (Não Compre Antes de Checar Isto)',
      'Escadas, diários de 16 e 20 semanas, tabelas de unidades, checklists e planilha para imprimir (os 4 guias)',
    ],
    anchor: 'Os 4 guias avulsos somam R$ 129,60. No kit, saem por R$ 69,90: R$ 59,70 a menos.',
    revised: 'novembro de 2026',
    bonuses: ['Todos os bônus dos 4 guias'],
    sources: [
      'Bulas da FDA de Ozempic, Wegovy, Rybelsus, Mounjaro e Zepbound',
      'Estudos STEP, SUSTAIN, PIONEER, SURPASS e SURMOUNT',
      'Consultas e alertas da ANVISA sobre canetas falsificadas',
    ],
    includes: ['I1', 'I2', 'T1', 'T2'],
    bumps: ['T3'],
    faq: [
      {
        q: 'O kit cobre semaglutida e tirzepatida?',
        a: 'Sim. Há um guia para cada molécula, com a escada de doses, os efeitos por etapa e a regra de dose esquecida de cada uma. Os guias de reconstituição e de compra valem para as duas.',
      },
      {
        q: 'Os guias repetem conteúdo entre si?',
        a: 'Há alguma sobreposição. A regra dos 28 dias do frasco reconstituído e a fórmula das unidades aparecem no guia de tirzepatida, no de reconstituição e no de compra, cada um com um foco: escolher o frasco de cada etapa, preparar e medir, e calcular o custo real. Os guias das duas moléculas têm estrutura parecida, mas doses, prazos e regras de bula diferentes.',
      },
      {
        q: 'Por qual guia começar? E se eu uso só caneta?',
        a: 'Cada guia cobre um momento: o de compra antes de pagar, o da sua molécula antes da primeira dose e a cada subida, e o de reconstituição com o material na frente, na hora de preparar o frasco. Quem usa só caneta pronta deve saber que o guia de reconstituição quase não se aplica e que a perda dos 28 dias, no guia de compra, é assunto de frasco.',
      },
    ],
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
  const url = process.env[e.checkoutEnv]?.trim() || e.checkoutDefault;
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

/** Rótulo da capa: a tabela não é guia. */
export function coverLabel(e: Pick<Ebook, 'kind'>): string {
  return e.kind === 'tabela' ? 'PDF personalizado' : 'Guia em PDF';
}

/** Frase do preço de lançamento, ou undefined sem lançamento. */
export function launchNote(e: Pick<Ebook, 'price' | 'launch'>): string | undefined {
  if (!e.launch) return undefined;
  return `Lançamento: ${formatPrice(e.price)} nas ${e.launch.units} primeiras unidades. Depois, ${formatPrice(e.launch.after)}.`;
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
    price: e.price,
    cta: e.kind === 'tabela' ? 'Ver a tabela' : 'Ver o guia',
    coverLabel: coverLabel(e),
    pages: e.pages,
    cover: e.cover,
    bullets: (e.reveals?.length ? e.reveals : e.toc).slice(0, 3).map(stripChapter),
    anchor: e.anchor,
    launchNote: launchNote(e),
    sample: e.sample?.[0],
  };
}

const RECONSTITUTION_ID = 'T1';

/**
 * Oferta da página com reserva: se o guia escolhido ainda não está à venda, oferece o guia de
 * reconstituição (todo peptídeo do site é vendido em frasco) ou, em página de caneta pronta
 * (marca), o kit. Sem guia escolhido (peptídeo sem oferta, como Melanotan II), nada.
 */
export function offerFor(e: Ebook | undefined, opts: { pen?: boolean } = {}): EbookOffer | null {
  if (!e) return null;
  const own = toOffer(e);
  if (own) return own;
  const fallback = opts.pen ? [KIT_ID] : [RECONSTITUTION_ID, KIT_ID];
  for (const id of fallback) {
    const offer = id === e.id ? null : toOffer(getEbookById(id));
    if (offer) return offer;
  }
  return null;
}

/** Kit ativo que inclui este ebook (para oferecer o pacote na landing do avulso). */
export function kitFor(e: Ebook): Ebook | undefined {
  if (e.kind === 'kit') return undefined;
  return EBOOKS.find((k) => k.kind === 'kit' && k.includes?.includes(e.id) && checkoutUrl(k));
}
