// Tipos da automação do Instagram (@dosecerta_br). Spec:
// docs/superpowers/specs/2026-11-15-instagram-dosecerta-design.md
import type { Illustration } from './illustrations';
import type { Pose } from './poses';

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

/** O que o Claude devolve (schema em write.ts). */
export type Draft = {
  /** Frase da capa: a mania ou o erro do dia a dia, dito pela Gotinha. */
  hook: string;
  /** Ilustração da capa (diferente da do 1º slide); sem ela, usa a do 1º slide. */
  hookIcon?: Illustration;
  /** Pose da Gotinha na capa e no gancho do Reels. */
  hookPose?: Pose;
  /** Slides de conteúdo (sem capa nem CTA), 2 a 6; `icon` = chave de illustrations.ts. */
  slides: { title: string; body: string; icon?: Illustration; pose?: Pose }[];
  /**
   * Falas do Reels, uma por cena (3 a 6): a primeira é o gancho. Os bordões e a chamada final
   * são montados pelo código (caption.ts).
   */
  narration: { text: string; pose?: Pose }[];
  /** Corpo da legenda, sem CTA, aviso nem hashtags (montados por caption.ts). */
  caption: string;
  /** Pergunta para os comentários sobre a experiência do leitor (caption.ts põe "💬" e o convite). */
  question: string;
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
