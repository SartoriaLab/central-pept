import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../drizzle/schema';

type Db = PostgresJsDatabase<typeof schema>;

let instance: Db | null = null;

/**
 * Abre a conexão só no primeiro uso. Assim o build e as páginas públicas (que não
 * usam banco) funcionam sem DATABASE_URL; quem chamar o banco sem a variável recebe
 * o erro na hora da consulta.
 */
export function getDb(): Db {
  if (instance) return instance;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL não definida');
  // `max: 1` necessário para serverless (Vercel/Neon) — evita pool overflow
  instance = drizzle(postgres(connectionString, { max: 1 }), { schema });
  return instance;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === 'function' ? value.bind(real) : value;
  },
});
