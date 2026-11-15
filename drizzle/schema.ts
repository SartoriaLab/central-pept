import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const channels = pgTable('channels', {
  id: serial('id').primaryKey(),
  kind: varchar('kind', { length: 20 }).notNull(), // whatsapp | reddit | telegram | fb | forum | tiktok | instagram
  name: text('name').notNull(),
  handle: text('handle'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
  notes: jsonb('notes').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 80 }).unique().notNull(),
  title: text('title').notNull(),
  channelKind: varchar('channel_kind', { length: 20 }), // null = todos
  bodyVariants: jsonb('body_variants').$type<string[]>().notNull().default([]),
  utmDefaults: jsonb('utm_defaults').$type<Record<string, string>>().notNull().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const postsLog = pgTable('posts_log', {
  id: serial('id').primaryKey(),
  channelId: integer('channel_id').references(() => channels.id).notNull(),
  templateId: integer('template_id').references(() => templates.id),
  variantIndex: integer('variant_index'),
  postedAt: timestamp('posted_at').defaultNow().notNull(),
  utmUrl: text('utm_url'),
  note: text('note'),
});

export const questionsFeed = pgTable('questions_feed', {
  id: serial('id').primaryKey(),
  source: varchar('source', { length: 20 }).notNull(), // reddit | rss
  sourceId: text('source_id').unique().notNull(), // dedup key
  url: text('url').notNull(),
  title: text('title').notNull(),
  snippet: text('snippet'),
  matchedKeywords: jsonb('matched_keywords').$type<string[]>().default([]),
  suggestedTemplateId: integer('suggested_template_id').references(() => templates.id),
  dismissed: boolean('dismissed').default(false).notNull(),
  answered: boolean('answered').default(false).notNull(),
  seenAt: timestamp('seen_at').defaultNow().notNull(),
});

export const affiliateClicks = pgTable('affiliate_clicks', {
  id: serial('id').primaryKey(),
  productId: varchar('product_id', { length: 80 }).notNull(),
  network: varchar('network', { length: 20 }).notNull(),
  slot: varchar('slot', { length: 80 }).notNull(), // ex.: reconstituicao-footer, peptideo-semaglutida
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  utmContent: text('utm_content'),
  referer: text('referer'),
  ipHash: varchar('ip_hash', { length: 64 }), // sha256(ip + salt) — LGPD-safe
  userAgent: text('user_agent'),
  clickedAt: timestamp('clicked_at').defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 254 }).unique().notNull(), // sempre minúsculo
  source: varchar('source', { length: 200 }), // página onde assinou
  consentText: text('consent_text').notNull(), // texto exato aceito (prova do consentimento, LGPD)
  consentAt: timestamp('consent_at').defaultNow().notNull(),
  unsubscribeToken: varchar('unsubscribe_token', { length: 64 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const conversions = pgTable('conversions', {
  id: serial('id').primaryKey(),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  utmContent: text('utm_content'),
  kiwifyOrderId: text('kiwify_order_id'),
  productSlug: text('product_slug'),
  amount: integer('amount'), // centavos
  occurredAt: timestamp('occurred_at').defaultNow().notNull(),
});

// Ações no site gravadas por /api/evento (lib/track.ts). Só ações (cliques, pop-up, WhatsApp...):
// "oferta vista" e "cálculo feito" ficam fora para o banco não acordar a cada visita; as visitas
// por página vêm da Vercel Analytics. Sem IP, cookie ou dado pessoal.
export const siteEvents = pgTable(
  'site_events',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 40 }).notNull(), // valor de EVENTS em lib/track.ts
    page: varchar('page', { length: 200 }), // caminho onde aconteceu
    ebook: varchar('ebook', { length: 20 }),
    position: varchar('position', { length: 40 }), // card | line | result | barra | popup | landing-* ...
    props: jsonb('props').$type<Record<string, string | number | boolean>>().default({}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('site_events_created_at_idx').on(t.createdAt)],
);

// Automação do Instagram @dosecerta_br (scripts/social): uma linha por tentativa de publicação.
// O histórico de "publicado" evita repetir tema (pick.ts); "erro" e "invalido" ficam para análise.
export const socialPosts = pgTable(
  'social_posts',
  {
    id: serial('id').primaryKey(),
    format: varchar('format', { length: 12 }).notNull(), // carrossel | reels
    topicId: varchar('topic_id', { length: 120 }).notNull(), // post:<slug> | peptide:<slug> | comparison:<slug>
    category: varchar('category', { length: 30 }).notNull(),
    status: varchar('status', { length: 12 }).notNull(), // publicado | erro | invalido
    igMediaId: varchar('ig_media_id', { length: 40 }),
    caption: text('caption'),
    error: text('error'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('social_posts_created_at_idx').on(t.createdAt)],
);

// Chave-valor da automação: o token do Instagram renovado (60 dias) e a validade dele.
export const socialState = pgTable('social_state', {
  key: varchar('key', { length: 40 }).primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
