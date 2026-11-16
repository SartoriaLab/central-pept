// Regras dos eventos gravados no banco (tabela site_events), usadas pelo cliente
// (lib/track.ts) e pela rota /api/evento. Sem imports de servidor: roda nos dois lados.

import { EVENTS } from './event-names';

/** Eventos que vão para o banco: só ações, nunca "visto"/"calculado" (volume alto). */
export const STORED_EVENTS: ReadonlySet<string> = new Set([
  EVENTS.ebookClick,
  EVENTS.ebookCheckout,
  EVENTS.ebookLanding,
  EVENTS.ebookKitClick,
  EVENTS.ebookPopupView,
  EVENTS.ebookPopupClick,
  EVENTS.whatsapp,
  EVENTS.share,
  EVENTS.embedCopy,
  EVENTS.newsletterSignup,
  EVENTS.print,
  EVENTS.icsDownload,
  EVENTS.copyResult,
  EVENTS.installClick,
  EVENTS.installed,
  EVENTS.pwaOpen,
]);

export type SiteEventRow = {
  name: string;
  page: string | null;
  ebook: string | null;
  position: string | null;
  props: Record<string, string | number | boolean>;
};

const MAX_PROPS = 8;
const str = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v.trim() !== '' ? v.trim().slice(0, max) : null;

/** Valida o corpo enviado pelo navegador. Devolve null se não for um evento aceito. */
export function parseSiteEvent(body: unknown): SiteEventRow | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const name = str(b.e, 40);
  if (!name || !STORED_EVENTS.has(name)) return null;

  const props: Record<string, string | number | boolean> = {};
  if (b.p && typeof b.p === 'object') {
    for (const [k, v] of Object.entries(b.p as Record<string, unknown>).slice(0, MAX_PROPS)) {
      if (!/^[a-z_]{1,20}$/i.test(k)) continue;
      if (typeof v === 'string') props[k] = v.slice(0, 120);
      else if (typeof v === 'number' && Number.isFinite(v)) props[k] = v;
      else if (typeof v === 'boolean') props[k] = v;
    }
  }

  const rawPage = str(props.pagina, 200) ?? str(b.u, 200);
  const page = rawPage && rawPage.startsWith('/') ? rawPage : null;
  const ebook = str(props.ebook, 20);
  const position = str(props.posicao, 40) ?? str(props.via, 40);
  delete props.pagina;
  delete props.ebook;
  delete props.posicao;
  return { name, page, ebook, position, props };
}
