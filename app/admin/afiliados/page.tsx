import Link from 'next/link';
import { db } from '@/lib/db';
import { affiliateClicks } from '@/drizzle/schema';
import { desc, gte, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const DAYS = 30;
// Um clique conta como "tirzepatida" se o slot cita tirze/mounjaro ou se o
// utm_content foi preenchido com o slug do peptídeo (ver /api/click).
const TIRZE_SLOT = /tirze|mounjaro/i;

async function getClicks() {
  const since = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);

  const bySlot = await db
    .select({
      slot: affiliateClicks.slot,
      count: sql<number>`count(*)::int`,
      last: sql<Date>`max(${affiliateClicks.clickedAt})`,
    })
    .from(affiliateClicks)
    .where(gte(affiliateClicks.clickedAt, since))
    .groupBy(affiliateClicks.slot)
    .orderBy(desc(sql`count(*)`));

  const byContent = await db
    .select({
      content: affiliateClicks.utmContent,
      count: sql<number>`count(*)::int`,
    })
    .from(affiliateClicks)
    .where(gte(affiliateClicks.clickedAt, since))
    .groupBy(affiliateClicks.utmContent)
    .orderBy(desc(sql`count(*)`));

  const total = bySlot.reduce((s, r) => s + r.count, 0);
  const tirze = bySlot
    .filter((r) => TIRZE_SLOT.test(r.slot))
    .reduce((s, r) => s + r.count, 0);
  const tirzeByContent = byContent
    .filter((r) => r.content === 'tirzepatida')
    .reduce((s, r) => s + r.count, 0);

  return { bySlot, byContent, total, tirze, tirzeByContent };
}

export default async function AfiliadosPage() {
  const { bySlot, byContent, total, tirze, tirzeByContent } = await getClicks();
  const pct = total > 0 ? Math.round((tirze / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-6">
        <span className="font-semibold text-sm text-gray-900">Afiliados</span>
        <Link href="/admin/assistente/metricas" className="text-sm text-gray-600 hover:text-gray-900">
          Métricas do assistente
        </Link>
        <Link href="/admin/utm" className="text-sm text-gray-600 hover:text-gray-900">
          UTM Builder
        </Link>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Cliques de afiliado — últimos {DAYS} dias</h1>
          <p className="text-sm text-gray-600 mt-1">
            Origem: tabela <code className="text-xs bg-gray-100 px-1">affiliate_clicks</code>,
            gravada em <code className="text-xs bg-gray-100 px-1">/api/click</code>. Cada linha é
            um clique que virou redirect para o WhatsApp do fornecedor — não é venda.
          </p>
        </header>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card label="Cliques totais" value={String(total)} />
          <Card label="Slots de tirzepatida" value={`${tirze} (${pct}%)`} />
          <Card label="utm_content = tirzepatida" value={String(tirzeByContent)} />
        </div>

        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-700 mb-2">Por slot</h2>
          <table className="w-full bg-white border border-gray-200 rounded text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 font-medium">Slot</th>
                <th className="text-right p-2 font-medium">Cliques</th>
                <th className="text-right p-2 font-medium">Último</th>
              </tr>
            </thead>
            <tbody>
              {bySlot.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500 text-xs">
                    Nenhum clique registrado nos últimos {DAYS} dias.
                  </td>
                </tr>
              ) : (
                bySlot.map((r) => (
                  <tr
                    key={r.slot}
                    className={`border-t border-gray-100 ${TIRZE_SLOT.test(r.slot) ? 'bg-green-50' : ''}`}
                  >
                    <td className="p-2 font-mono text-xs">{r.slot}</td>
                    <td className="p-2 text-right tabular-nums">{r.count}</td>
                    <td className="p-2 text-right text-xs text-gray-600">
                      {r.last ? new Date(r.last).toLocaleString('pt-BR') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-2">Por utm_content (peptídeo em contexto)</h2>
          <table className="w-full bg-white border border-gray-200 rounded text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 font-medium">utm_content</th>
                <th className="text-right p-2 font-medium">Cliques</th>
              </tr>
            </thead>
            <tbody>
              {byContent.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-gray-500 text-xs">Nenhum.</td>
                </tr>
              ) : (
                byContent.map((r) => (
                  <tr
                    key={r.content ?? 'none'}
                    className={`border-t border-gray-100 ${r.content === 'tirzepatida' ? 'bg-green-50' : ''}`}
                  >
                    <td className="p-2 font-mono text-xs">{r.content ?? '(sem contexto)'}</td>
                    <td className="p-2 text-right tabular-nums">{r.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
  );
}
