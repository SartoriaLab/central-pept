// Histórico de publicações, token do Instagram e diretos do "comenta GUIA" no Postgres (tabelas
// social_posts, social_state e social_dms, drizzle/schema.ts). Precisa de DATABASE_URL.
import { desc, eq, gte, inArray, and, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { socialDms, socialPosts, socialState } from '@/drizzle/schema';
import type { Format, HistoryEntry } from './types';

const TOKEN_KEY = 'ig_token';

/**
 * Cria as duas tabelas se ainda não existem (espelho de drizzle/schema.ts). Assim a primeira
 * execução no GitHub Actions prepara o banco sem `db:push`, que compara o schema inteiro e
 * poderia propor mudanças em outras tabelas. Mudou a tabela lá → mude aqui também.
 */
export async function ensureTables(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS social_posts (
      id serial PRIMARY KEY,
      format varchar(12) NOT NULL,
      topic_id varchar(120) NOT NULL,
      category varchar(30) NOT NULL,
      status varchar(12) NOT NULL,
      ig_media_id varchar(40),
      caption text,
      error text,
      created_at timestamp DEFAULT now() NOT NULL
    )`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS social_posts_created_at_idx ON social_posts (created_at)`);
  await ensureWebhookTables();
}

let webhookTablesReady = false;

/**
 * Tabelas que o webhook do "comenta GUIA" usa: social_state (token) e social_dms (espelho de
 * drizzle/schema.ts). O webhook pode rodar antes da primeira execução do robô. Uma vez por processo.
 */
export async function ensureWebhookTables(): Promise<void> {
  if (webhookTablesReady) return;
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS social_state (
      key varchar(40) PRIMARY KEY,
      value text NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    )`);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS social_dms (
      comment_id varchar(40) PRIMARY KEY,
      media_id varchar(40) NOT NULL,
      user_id varchar(40) NOT NULL,
      ebook_id varchar(12),
      status varchar(12) NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL
    )`);
  await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS social_dms_media_user_idx ON social_dms (media_id, user_id)`);
  webhookTablesReady = true;
}

/**
 * Reserva o envio do direct. false = já houve um para esta pessoa neste post, ou é a mesma
 * notificação repetida pela Meta: não envia de novo.
 */
export async function claimDm(r: { commentId: string; mediaId: string; userId: string }): Promise<boolean> {
  const rows = await db
    .insert(socialDms)
    .values({ ...r, status: 'pendente' })
    .onConflictDoNothing()
    .returning({ id: socialDms.commentId });
  return rows.length > 0;
}

export async function finishDm(commentId: string, ebookId: string | null): Promise<void> {
  await db.update(socialDms).set({ status: 'enviado', ebookId }).where(eq(socialDms.commentId, commentId));
}

/** Envio falhou: libera a reserva para a pessoa conseguir de novo comentando outra vez. */
export async function releaseDm(commentId: string): Promise<void> {
  await db.delete(socialDms).where(eq(socialDms.commentId, commentId));
}

/** Já saiu um post deste formato no dia `day` (AAAA-MM-DD, horário de Brasília)? */
export async function publishedOn(format: Format, day: string): Promise<boolean> {
  const rows = await db
    .select({ id: socialPosts.id })
    .from(socialPosts)
    .where(
      and(
        eq(socialPosts.format, format),
        eq(socialPosts.status, 'publicado'),
        // created_at é gravado em UTC (now() do Postgres na Neon).
        sql`(${socialPosts.createdAt} AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo')::date = ${day}::date`,
      ),
    )
    .limit(1);
  return rows.length > 0;
}

/** Publicados e reprovados dos últimos `days` dias (ambos contam na quarentena do tema). */
export async function getHistory(days = 120): Promise<HistoryEntry[]> {
  const since = new Date(Date.now() - days * 86_400_000);
  const rows = await db
    .select()
    .from(socialPosts)
    .where(and(gte(socialPosts.createdAt, since), inArray(socialPosts.status, ['publicado', 'invalido'])))
    .orderBy(desc(socialPosts.createdAt));
  return rows.map((r) => ({ topicId: r.topicId, format: r.format as Format, category: r.category, at: r.createdAt }));
}

export async function record(entry: {
  format: Format;
  topicId: string;
  category: string;
  status: 'publicado' | 'erro' | 'invalido';
  igMediaId?: string;
  caption?: string;
  error?: string;
}): Promise<void> {
  await db.insert(socialPosts).values({ ...entry, error: entry.error?.slice(0, 4000) });
}

/** Token salvo (renovado) ou o inicial do segredo IG_ACCESS_TOKEN. */
export async function getToken(): Promise<{ token: string; expiresAt: Date | null }> {
  const [row] = await db.select().from(socialState).where(inArray(socialState.key, [TOKEN_KEY]));
  if (row) {
    const { token, expiresAt } = JSON.parse(row.value) as { token: string; expiresAt: string };
    return { token, expiresAt: new Date(expiresAt) };
  }
  const env = process.env.IG_ACCESS_TOKEN?.trim();
  if (!env) throw new Error('IG_ACCESS_TOKEN não definido');
  return { token: env, expiresAt: null };
}

export async function saveToken(token: string, expiresAt: Date): Promise<void> {
  const value = JSON.stringify({ token, expiresAt: expiresAt.toISOString() });
  await db
    .insert(socialState)
    .values({ key: TOKEN_KEY, value })
    .onConflictDoUpdate({ target: socialState.key, set: { value, updatedAt: new Date() } });
}
