export type Ebook = {
  slug: string;
  title: string;
  /** Título curto para mini-covers e CTAs compactos (ex: "Retatrutida", "GHK-Cu") */
  shortTitle?: string;
  subtitle: string;
  /** Benefício em 1 frase que vira gancho */
  hook: string;
  /** Preço em reais (de — por) */
  priceFrom?: number;
  price: number;
  /** Número de páginas */
  pages: number;
  /** Tempo estimado de leitura */
  readMinutes: number;
  /** Cores do gradient da capa (fallback) */
  coverColor: string;
  /** Imagem da capa/banner do ebook (em /public) */
  coverImage?: string;
  /** O que o leitor vai aprender — aparece como bullets */
  learn: string[];
  /** Para quem é */
  audience: string[];
  /** FAQ da página de venda */
  faq: { q: string; a: string }[];
  /** Peptídeos relacionados (para cross-placement) */
  relatedPeptides?: string[];
  /** Tags do blog relacionadas (para cross-placement) */
  relatedTags?: string[];
  /** URL do checkout (Kiwify/Hotmart/Gumroad) — preenchido via env */
  checkoutUrl: string;
};

// URLs de checkout vêm de env pra facilitar trocar sem rebuild de código.
const CHECKOUT_RETATRUTIDA =
  process.env.NEXT_PUBLIC_KIWIFY_RETATRUTIDA ||
  'https://pay.kiwify.com.br/PLACEHOLDER';

const CHECKOUT_GHKCU =
  process.env.NEXT_PUBLIC_KIWIFY_GHKCU ||
  'https://pay.kiwify.com.br/PLACEHOLDER';

const CHECKOUT_COMBO_RETA_GHKCU =
  process.env.NEXT_PUBLIC_KIWIFY_COMBO_RETA_GHKCU ||
  'https://pay.kiwify.com.br/PLACEHOLDER';

export const EBOOKS: Ebook[] = [
  {
    slug: 'retatrutida-estrategias',
    title: 'Retatrutida: Estratégias para Maximizar Resultados',
    shortTitle: 'Retatrutida',
    subtitle: 'O manual prático da nova geração de emagrecedores',
    hook: 'Do primeiro frasco à dose de manutenção: protocolo completo, cálculo de doses, armazenamento, comparativo com semaglutida e tirzepatida e os erros que sabotam resultados.',
    priceFrom: 49.90,
    price: 29.99,
    pages: 64,
    readMinutes: 90,
    coverColor: 'from-orange-500 via-teal-500 to-blue-600',
    coverImage: '/ebooks/retatrutida.jpg',
    learn: [
      'Como a retatrutida age em 3 receptores simultâneos e por que isso potencializa o efeito',
      'Os resultados dos estudos TRIUMPH e a perda de peso esperada em cada dose',
      'Protocolo completo de titulação: como começar, quando subir, quando pausar',
      'Como reconstituir e calcular doses com precisão milimétrica',
      'Efeitos colaterais e como minimizar náusea durante a escalada',
      'Comparativo honesto: Retatrutida vs Tirzepatida vs Semaglutida',
      'O que fazer na fase de manutenção pra evitar o efeito rebote',
      'Sinais de alerta que exigem interromper o uso imediatamente',
      'Como escolher uma farmácia de manipulação confiável',
      'Combinação com treino e dieta para otimizar resultado sem perder massa muscular',
    ],
    audience: [
      'Pessoas considerando iniciar retatrutida sob acompanhamento médico',
      'Quem já usa mas quer entender o mecanismo a fundo',
      'Profissionais de saúde que querem base técnica atualizada (2026)',
      'Quem comparou GLP-1 e quer entender a nova geração',
    ],
    faq: [
      {
        q: 'O ebook substitui acompanhamento médico?',
        a: 'Não. É material educativo técnico baseado em literatura científica. Qualquer protocolo com retatrutida deve ser feito sob orientação de médico habilitado.',
      },
      {
        q: 'Como recebo o ebook após comprar?',
        a: 'Entrega automática por email em até 2 minutos após confirmação do pagamento. PDF compatível com celular, tablet e computador.',
      },
      {
        q: 'Os dados são atualizados?',
        a: 'Sim — edição de 2026, incluindo os resultados mais recentes dos estudos TRIUMPH-4 e análise farmacocinética.',
      },
      {
        q: 'Retatrutida é aprovada no Brasil?',
        a: 'Ainda não — está em estudos fase 3 da Eli Lilly. O ebook trata tanto do que a ciência mostra quanto do uso off-label atual em contexto de pesquisa.',
      },
      {
        q: 'Posso pedir reembolso?',
        a: 'Sim — garantia incondicional de 7 dias conforme CDC. Não gostou? Devolvemos 100% do valor sem perguntas.',
      },
      {
        q: 'O pagamento é seguro?',
        a: 'Sim. Checkout processado pela Kiwify (infraestrutura brasileira com criptografia SSL, gateway antifraude). Aceita cartão, Pix e boleto.',
      },
    ],
    relatedPeptides: ['retatrutida', 'semaglutida', 'tirzepatida'],
    relatedTags: ['glp-1', 'emagrecimento', 'comparação'],
    checkoutUrl: CHECKOUT_RETATRUTIDA,
  },
  {
    slug: 'ghk-cu-pele',
    title: 'GHK-Cu: O Peptídeo que Faz a Pele Voltar no Tempo',
    shortTitle: 'GHK-Cu',
    subtitle: 'Pele firme, viçosa e rejuvenescida com o peptídeo de cobre que está revolucionando o anti-idade',
    hook: 'Descubra como conquistar uma pele com aparência mais firme, viçosa e rejuvenescida com o GHK-Cu, o peptídeo que vem ganhando destaque no universo do cuidado anti-idade.',
    priceFrom: 49.90,
    price: 29.99,
    pages: 56,
    readMinutes: 75,
    coverColor: 'from-rose-400 via-amber-400 to-teal-500',
    coverImage: '/ebooks/ghk-cu.jpg',
    learn: [
      'O que é o GHK-Cu e por que o tripeptídeo de cobre virou o "santo graal" do anti-idade',
      'Como ele estimula colágeno, elastina e glicosaminoglicanos — os 3 pilares da pele jovem',
      'Uso tópico vs subcutâneo: qual faz sentido, qual é marketing, qual tem evidência',
      'Protocolo prático de aplicação tópica: concentração, frequência, momento do dia',
      'Como diluir e armazenar corretamente (sensibilidade à luz, temperatura e pH)',
      'Sinergia com vitamina C, retinol e ácido hialurônico — e as combinações que anulam o efeito',
      'Benefícios para cicatrizes, flacidez, poros dilatados e queda capilar',
      'Resultados esperados semana a semana (semana 2, 4, 8 e 12) com base em estudos clínicos',
      'Quando EVITAR: contraindicações, alergia ao cobre e sinais de sensibilização',
      'Comparativo honesto com outros peptídeos de pele (Matrixyl, Argireline, SNAP-8)',
    ],
    audience: [
      'Quem busca anti-idade com evidência científica e não quer cair em modismos',
      'Usuários experientes de ácidos e retinóides que querem dar o próximo passo',
      'Profissionais de estética e dermatologia que querem base técnica para recomendar',
      'Quem sofre com flacidez, cicatrizes, poros dilatados ou queda capilar inicial',
    ],
    faq: [
      {
        q: 'GHK-Cu é seguro?',
        a: 'Uso tópico cosmético tem décadas de histórico com perfil favorável. Injetável é de uso experimental — dados humanos são limitados. O ebook cobre os dois caminhos com transparência.',
      },
      {
        q: 'Em quanto tempo vou ver resultado?',
        a: 'Uso consistente tópico mostra melhora visível de textura em 4-8 semanas e firmeza em 12 semanas segundo estudos clínicos. O ebook traz o cronograma completo.',
      },
      {
        q: 'Posso combinar com retinol e vitamina C?',
        a: 'Sim — com ressalvas. A vitamina C em pH baixo pode desativar o cobre se aplicados juntos. O ebook mostra como estratificar horários para potencializar sem anular.',
      },
      {
        q: 'Como recebo o ebook após comprar?',
        a: 'Entrega automática por email em até 2 minutos após confirmação do pagamento. PDF compatível com celular, tablet e computador.',
      },
      {
        q: 'Posso pedir reembolso?',
        a: 'Sim — garantia incondicional de 7 dias conforme CDC. Não gostou? Devolvemos 100% do valor sem perguntas.',
      },
      {
        q: 'O pagamento é seguro?',
        a: 'Sim. Checkout processado pela Kiwify (infraestrutura brasileira com criptografia SSL, gateway antifraude). Aceita cartão, Pix e boleto.',
      },
    ],
    relatedPeptides: ['ghk-cu'],
    relatedTags: ['pele', 'anti-idade', 'cosmetic', 'colageno'],
    checkoutUrl: CHECKOUT_GHKCU,
  },
];

export type EbookBundle = {
  /** ID único do bundle */
  id: string;
  /** Slugs dos dois ebooks que formam o combo */
  ebookSlugs: [string, string];
  /** Preço total do combo (já aplicado o desconto do 2º ebook) */
  totalPrice: number;
  /** Preço do 2º ebook quando adicionado ao combo */
  bonusPrice: number;
  /** URL do checkout Kiwify do produto combo */
  checkoutUrl: string;
  /** Imagem do combo (banner/hero) */
  coverImage?: string;
};

export const BUNDLES: EbookBundle[] = [
  {
    id: 'retatrutida-ghkcu',
    ebookSlugs: ['retatrutida-estrategias', 'ghk-cu-pele'],
    totalPrice: 44.98,
    bonusPrice: 14.99,
    checkoutUrl: CHECKOUT_COMBO_RETA_GHKCU,
    coverImage: '/ebooks/combo.jpg',
  },
];

export function getEbooks(): Ebook[] { return EBOOKS; }
export function getEbookBySlug(slug: string): Ebook | undefined {
  return EBOOKS.find((e) => e.slug === slug);
}
export function getEbookSlugs(): string[] {
  return EBOOKS.map((e) => e.slug);
}

// Encontrar ebooks relevantes para um peptídeo (para cross-placement)
export function getEbooksForPeptide(peptideSlug: string): Ebook[] {
  return EBOOKS.filter((e) => e.relatedPeptides?.includes(peptideSlug));
}
// Encontrar ebooks relevantes para tags de artigo
export function getEbooksForTags(tags: string[]): Ebook[] {
  return EBOOKS.filter((e) =>
    e.relatedTags?.some((t) => tags.includes(t))
  );
}

/**
 * Retorna o bundle que inclui este ebook (se houver) e o "outro" ebook
 * do combo. Usado na landing para oferecer cross-sell.
 */
export function getBundleForEbook(
  slug: string
): { bundle: EbookBundle; otherEbook: Ebook } | undefined {
  for (const b of BUNDLES) {
    if (b.ebookSlugs.includes(slug)) {
      const otherSlug = b.ebookSlugs.find((s) => s !== slug)!;
      const otherEbook = getEbookBySlug(otherSlug);
      if (otherEbook) return { bundle: b, otherEbook };
    }
  }
  return undefined;
}
