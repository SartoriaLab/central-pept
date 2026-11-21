// Tipos da automação do Instagram (@dosecerta_br). Spec:
// docs/superpowers/specs/2026-11-15-instagram-dosecerta-design.md
import type { Illustration } from './illustrations';
import type { SlideLayout } from './layouts';

export type Format = 'carrossel' | 'reels';

/** Um assunto publicável, com o texto do site que a IA pode usar (e nada além dele). */
export type Topic = {
  /** "post:<slug>", "peptide:<slug>" ou "comparison:<slug>". */
  id: string;
  kind: 'post' | 'peptide' | 'comparison';
  slug: string;
  title: string;
  /** Categoria do peptídeo principal (CATEGORY_HEX) ou "geral". */
  category: string;
  peptides: string[];
  /** Caminho no site, ex.: "/blog/semaglutida-vs-tirzepatida". */
  url: string;
  /** Fatos permitidos: o validador exige que todo número com unidade do texto gerado esteja aqui. */
  source: string;
};

/** Publicação anterior, para não repetir tema nem categoria. */
export type HistoryEntry = {
  topicId: string;
  format: Format;
  category: string;
  at: Date;
};

/** Um lado da comparação de frascos. */
export type VialSpec = { label: string; note?: string; liquid?: 'claro' | 'amarelo' | 'po' };

/**
 * Desenho do meio da cena do Reels (papel.tsx). Cada tipo é um "adereço" plano, no estilo de
 * explicador: o número ou a comparação vira imagem, não parágrafo.
 */
export type SceneVisual =
  | { type: 'frasco'; label: string; liquid?: 'claro' | 'amarelo' | 'po'; tag?: string; stamp?: string }
  | { type: 'frascos'; left: VialSpec; right: VialSpec; sign: '≠' | 'vs' | '+' }
  | { type: 'numero'; value: string; note: string }
  | { type: 'barras'; bars: { label: string; value: number; display: string }[] }
  | { type: 'pontos'; total: number; marked: number; note: string }
  | { type: 'linha'; steps: string[]; current: number; note?: string }
  | { type: 'lista'; items: { text: string; mark: 'ok' | 'nao' | 'duvida' }[] }
  | { type: 'icone'; icon: Illustration; note?: string }
  | { type: 'carimbo'; text: string; note?: string };

/** Cena do Reels: uma frase falada, com título de duas linhas e um desenho. */
export type Scene = {
  /** Seção no selo do topo ("o frasco", "os estudos"). */
  chip: string;
  /** Linha pequena acima do título ("— o que a ANVISA disse"). */
  kicker: string;
  /** Primeira linha do título (escura) e segunda (em destaque). */
  title: string;
  accent: string;
  tone: 'vermelho' | 'azul';
  /** Frase falada nesta cena (legenda palavra a palavra). */
  speech: string;
  visual: SceneVisual;
  /** De onde vem o dado, no rodapé ("ANVISA, 24/07/2026"). */
  source?: string;
};

/** O que o Claude devolve (schema em write.ts). */
export type Draft = {
  /** Frase da capa: a mania ou o erro do dia a dia. */
  hook: string;
  /** Ilustração da capa (diferente da do 1º slide); sem ela, usa a do 1º slide. */
  hookIcon?: Illustration;
  /** Slides de conteúdo (sem capa nem CTA), 2 a 6; `icon` = chave de illustrations.ts. */
  slides: { title: string; body: string; icon?: Illustration; layout?: SlideLayout }[];
  /**
   * Falas do Reels, uma por cena (3 a 6): a primeira é o gancho. A chamada final
   * são montados pelo código (caption.ts).
   */
  narration?: { text: string }[];
  /**
   * Cenas do Reels no estilo explicador (uma frase por cena; a primeira é o gancho). Texto antigo
   * da fila só tem `narration`: o render monta as cenas a partir dela (scenes.ts).
   */
  scenes?: Scene[];
  /** Corpo da legenda, sem CTA, aviso nem hashtags (montados por caption.ts). */
  caption: string;
  /** Pergunta para os comentários sobre a experiência do leitor (caption.ts põe "💬" e o convite). */
  question: string;
  /** Para quem mandar o post, ex.: "aquela amiga que também come correndo" (caption.ts monta a frase). */
  share?: string;
};

/** Guia do slide final. */
export type Cta = {
  id: string;
  slug: string;
  title: string;
  priceLabel: string;
  cover: string;
  /** Quantos outros guias ativos existem além deste. */
  others: number;
};
