import { db } from '@/lib/db';
import { templates, postsLog } from '@/drizzle/schema';
import { sql } from 'drizzle-orm';
import TemplatesClient from './TemplatesClient';

export const dynamic = 'force-dynamic';

async function getData() {
  const tpls = await db.select().from(templates).orderBy(templates.title);

  // Contagem de uso por variação (pra sugerir variação menos usada)
  const usage = await db
    .select({
      templateId: postsLog.templateId,
      variantIndex: postsLog.variantIndex,
      count: sql<number>`count(*)::int`,
    })
    .from(postsLog)
    .where(sql`${postsLog.templateId} IS NOT NULL`)
    .groupBy(postsLog.templateId, postsLog.variantIndex);

  const usageMap: Record<string, number> = {};
  for (const u of usage) {
    if (u.templateId !== null && u.variantIndex !== null) {
      usageMap[`${u.templateId}:${u.variantIndex}`] = u.count;
    }
  }

  return { templates: tpls, usageMap };
}

export default async function TemplatesPage() {
  const { templates: tpls, usageMap } = await getData();
  const seeded = tpls.length > 0;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Biblioteca de templates</h1>
        <p className="text-sm text-gray-600 mt-1">
          Variações escritas à mão pra evitar texto idêntico em múltiplos lugares (DIVULGACAO.md linha 247).
        </p>
      </header>

      {!seeded && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
          <p className="text-sm text-yellow-900 mb-2">Banco vazio. Rode o seed inicial:</p>
          <form action="/api/assistente/templates" method="POST">
            <button className="bg-yellow-700 text-white text-sm px-3 py-1.5 rounded">
              Inserir templates do DIVULGACAO.md
            </button>
          </form>
        </div>
      )}

      <TemplatesClient templates={tpls} usageMap={usageMap} />
    </div>
  );
}
