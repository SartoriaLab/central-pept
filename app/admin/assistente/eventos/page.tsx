import Link from 'next/link';
import { and, desc, eq, gte, inArray, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { siteEvents } from '@/drizzle/schema';
import { EVENTS } from '@/lib/event-names';
import { getEbookById } from '@/lib/ebooks';

export const dynamic = 'force-dynamic';

// Relatório das ações gravadas por /api/evento. Visitas por página não ficam aqui:
// veja na Vercel Analytics e divida os cliques pelas visitas da mesma página.

const PERIODS = [7, 30, 90] as const;

async function getReport(days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const inPeriod = gte(siteEvents.createdAt, since);
  const count = sql<number>`count(*)::int`;

  const [byName, offerByPage, offerByPosition, byEbook, popup, recent, app, appTotal, appClicksByPosition, appGuides] = await Promise.all([
    db.select({ name: siteEvents.name, n: count }).from(siteEvents).where(inPeriod).groupBy(siteEvents.name).orderBy(desc(count)),
    db
      .select({ page: siteEvents.page, n: count })
      .from(siteEvents)
      .where(and(inPeriod, eq(siteEvents.name, EVENTS.ebookClick)))
      .groupBy(siteEvents.page)
      .orderBy(desc(count))
      .limit(30),
    db
      .select({ position: siteEvents.position, n: count })
      .from(siteEvents)
      .where(and(inPeriod, eq(siteEvents.name, EVENTS.ebookClick)))
      .groupBy(siteEvents.position)
      .orderBy(desc(count)),
    db
      .select({
        ebook: siteEvents.ebook,
        clicks: sql<number>`count(*) filter (where ${siteEvents.name} = ${EVENTS.ebookClick})::int`,
        landings: sql<number>`count(*) filter (where ${siteEvents.name} = ${EVENTS.ebookLanding})::int`,
        checkouts: sql<number>`count(*) filter (where ${siteEvents.name} = ${EVENTS.ebookCheckout})::int`,
      })
      .from(siteEvents)
      .where(and(inPeriod, sql`${siteEvents.ebook} is not null`))
      .groupBy(siteEvents.ebook)
      .orderBy(desc(sql`count(*)`)),
    db
      .select({
        views: sql<number>`count(*) filter (where ${siteEvents.name} = ${EVENTS.ebookPopupView})::int`,
        clicks: sql<number>`count(*) filter (where ${siteEvents.name} = ${EVENTS.ebookPopupClick})::int`,
      })
      .from(siteEvents)
      .where(inPeriod),
    db.select().from(siteEvents).orderBy(desc(siteEvents.createdAt)).limit(30),
    // App (PWA) por sistema: `so` vai nas props (ios | android | desktop).
    db
      .select({
        so: sql<string>`coalesce(${siteEvents.props}->>'so', '—')`,
        installs: sql<number>`count(*) filter (where ${siteEvents.name} = ${EVENTS.installed})::int`,
        clicks: sql<number>`count(*) filter (where ${siteEvents.name} = ${EVENTS.installClick})::int`,
        opens: sql<number>`count(*) filter (where ${siteEvents.name} = ${EVENTS.pwaOpen})::int`,
      })
      .from(siteEvents)
      .where(and(inPeriod, inArray(siteEvents.name, [EVENTS.installed, EVENTS.installClick, EVENTS.pwaOpen])))
      .groupBy(sql`1`)
      .orderBy(desc(sql`2`)),
    db.select({ n: count }).from(siteEvents).where(eq(siteEvents.name, EVENTS.installed)),
    db
      .select({ position: siteEvents.position, n: count })
      .from(siteEvents)
      .where(and(inPeriod, eq(siteEvents.name, EVENTS.installClick)))
      .groupBy(siteEvents.position)
      .orderBy(desc(count)),
    // Passo a passo (quem não instala em um toque): qual guia abriu e quantos seguiram.
    db
      .select({
        guide: sql<string>`coalesce(${siteEvents.props}->>'guia', '—')`,
        opened: sql<number>`count(*) filter (where ${siteEvents.name} = ${EVENTS.installClick})::int`,
        followed: sql<number>`count(*) filter (where ${siteEvents.name} = ${EVENTS.installGuide})::int`,
      })
      .from(siteEvents)
      .where(
        and(
          inPeriod,
          sql`(${siteEvents.name} = ${EVENTS.installGuide} or (${siteEvents.name} = ${EVENTS.installClick} and ${siteEvents.props}->>'resultado' = 'guia'))`,
        ),
      )
      .groupBy(sql`1`)
      .orderBy(desc(sql`2`)),
  ]);

  return {
    byName,
    offerByPage,
    offerByPosition,
    byEbook,
    popup: popup[0] ?? { views: 0, clicks: 0 },
    recent,
    app,
    appTotal: appTotal[0]?.n ?? 0,
    appClicksByPosition,
    appGuides,
  };
}

const pct = (a: number, b: number) => (b > 0 ? `${((a / b) * 100).toFixed(1).replace('.', ',')}%` : '—');

export default async function EventosPage({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  const { dias } = await searchParams;
  const days = PERIODS.find((p) => String(p) === dias) ?? 30;
  const r = await getReport(days);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Ações no site — últimos {days} dias</h1>
        <p className="text-sm text-gray-600 mt-1">
          Cliques nas ofertas, pop-up, landing, checkout, WhatsApp e compartilhamentos. Para a taxa de clique de
          uma página, divida os cliques dela pelas visitas na Vercel Analytics.
        </p>
        <div className="mt-3 flex gap-2 text-sm">
          {PERIODS.map((p) => (
            <Link
              key={p}
              href={`/admin/assistente/eventos?dias=${p}`}
              className={`px-3 py-1 rounded border ${p === days ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-700'}`}
            >
              {p} dias
            </Link>
          ))}
        </div>
      </header>

      <Table title="Total por ação" head={['Ação', 'Vezes']} empty="Nenhuma ação gravada ainda.">
        {r.byName.map((x) => (
          <tr key={x.name} className="border-t border-gray-100">
            <td className="p-2">{x.name}</td>
            <td className="p-2 text-right">{x.n}</td>
          </tr>
        ))}
      </Table>

      <Table
        title={`App instalado (PWA) — ${r.appTotal} instalações desde o início`}
        head={['Sistema', 'Instalações no período', 'Cliques em instalar', 'Aberturas pelo ícone']}
        empty="Nenhuma instalação no período."
      >
        {r.app.map((x) => (
          <tr key={x.so} className="border-t border-gray-100">
            <td className="p-2">{x.so}</td>
            <td className="p-2 text-right font-semibold">{x.installs}</td>
            <td className="p-2 text-right">{x.clicks}</td>
            <td className="p-2 text-right">{x.opens}</td>
          </tr>
        ))}
      </Table>
      <p className="-mt-6 mb-8 text-xs text-gray-500">
        Instalação conta uma vez por aparelho: no Android quando o Chrome confirma; no iPhone na primeira vez que o
        site abre pelo ícone. Abertura conta uma vez por sessão.
      </p>

      <Table title="Cliques em instalar por lugar" head={['Lugar', 'Cliques']} empty="Sem cliques ainda.">
        {r.appClicksByPosition.map((x) => (
          <tr key={x.position ?? '-'} className="border-t border-gray-100">
            <td className="p-2 font-mono text-xs">{x.position ?? '—'}</td>
            <td className="p-2 text-right">{x.n}</td>
          </tr>
        ))}
      </Table>

      <Table
        title="Passo a passo de instalação por navegador"
        head={['Guia', 'Abriu a janela', 'Tocou em "Mostrar onde tocar"', 'Taxa']}
        empty="Ninguém abriu o passo a passo no período."
      >
        {r.appGuides.map((x) => (
          <tr key={x.guide} className="border-t border-gray-100">
            <td className="p-2 font-mono text-xs">{x.guide}</td>
            <td className="p-2 text-right">{x.opened}</td>
            <td className="p-2 text-right">{x.followed}</td>
            <td className="p-2 text-right">{pct(x.followed, x.opened)}</td>
          </tr>
        ))}
      </Table>
      <p className="-mt-6 mb-8 text-xs text-gray-500">
        &quot;—&quot; são aberturas de antes de o tipo de guia ser gravado. O botão só existe nos guias do iPhone (ios-*).
      </p>

      <Table title="Pop-up de saída" head={['Visto', 'Clicado', 'Taxa']} empty="">
        <tr className="border-t border-gray-100">
          <td className="p-2">{r.popup.views}</td>
          <td className="p-2">{r.popup.clicks}</td>
          <td className="p-2">{pct(r.popup.clicks, r.popup.views)}</td>
        </tr>
      </Table>

      <Table title="Funil por guia" head={['Guia', 'Cliques na oferta', 'Visitas à landing', 'Cliques no checkout', 'Landing → checkout']} empty="Sem cliques em guias ainda.">
        {r.byEbook.map((x) => (
          <tr key={x.ebook ?? '-'} className="border-t border-gray-100">
            <td className="p-2">{x.ebook ? `${x.ebook} · ${getEbookById(x.ebook)?.title ?? ''}` : '—'}</td>
            <td className="p-2 text-right">{x.clicks}</td>
            <td className="p-2 text-right">{x.landings}</td>
            <td className="p-2 text-right">{x.checkouts}</td>
            <td className="p-2 text-right">{pct(x.checkouts, x.landings)}</td>
          </tr>
        ))}
      </Table>

      <Table title="Cliques na oferta por formato" head={['Formato', 'Cliques']} empty="Sem cliques ainda.">
        {r.offerByPosition.map((x) => (
          <tr key={x.position ?? '-'} className="border-t border-gray-100">
            <td className="p-2 font-mono text-xs">{x.position ?? '—'}</td>
            <td className="p-2 text-right">{x.n}</td>
          </tr>
        ))}
      </Table>

      <Table title="Cliques na oferta por página (30 maiores)" head={['Página', 'Cliques']} empty="Sem cliques ainda.">
        {r.offerByPage.map((x) => (
          <tr key={x.page ?? '-'} className="border-t border-gray-100">
            <td className="p-2 font-mono text-xs">{x.page ?? '—'}</td>
            <td className="p-2 text-right">{x.n}</td>
          </tr>
        ))}
      </Table>

      <Table title="Últimas 30 ações" head={['Quando', 'Ação', 'Página', 'Guia', 'Formato']} empty="Nenhuma.">
        {r.recent.map((x) => (
          <tr key={x.id} className="border-t border-gray-100 text-xs">
            <td className="p-2">{new Date(x.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td>
            <td className="p-2">{x.name}</td>
            <td className="p-2 font-mono">{x.page ?? '—'}</td>
            <td className="p-2">{x.ebook ?? '—'}</td>
            <td className="p-2 font-mono">{x.position ?? '—'}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function Table({ title, head, empty, children }: { title: string; head: string[]; empty: string; children: React.ReactNode }) {
  const rows = Array.isArray(children) ? children : [children];
  return (
    <section className="mb-8">
      <h2 className="text-sm font-medium text-gray-700 mb-2">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded text-sm">
          <thead className="bg-gray-50">
            <tr>
              {head.map((h, i) => (
                <th key={h} className={`p-2 font-medium ${i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && empty ? (
              <tr><td colSpan={head.length} className="p-4 text-center text-gray-500 text-xs">{empty}</td></tr>
            ) : children}
          </tbody>
        </table>
      </div>
    </section>
  );
}
