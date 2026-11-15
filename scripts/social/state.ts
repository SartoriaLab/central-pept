// Histórico de publicações e token do Instagram no Postgres (tabelas social_posts e
// social_state, drizzle/schema.ts). Precisa de DATABASE_URL.
import { desc, gte, inArray, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { socialPosts, socialState } from '@/drizzle/schema';
import type { Format, HistoryEntry } from './types';

const TOKEN_KEY = 'ig_token';

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
