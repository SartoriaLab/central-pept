// Diário de aplicações: rodízio de locais e exportação. Funções puras
// (testadas em tests/injection-log.test.ts); a tela é components/calculator/InjectionDiary.tsx.

export const SITES = [
  { id: 'abd-e', label: 'Abdome esquerdo', short: 'Abdome E' },
  { id: 'abd-d', label: 'Abdome direito', short: 'Abdome D' },
  { id: 'coxa-e', label: 'Coxa esquerda', short: 'Coxa E' },
  { id: 'coxa-d', label: 'Coxa direita', short: 'Coxa D' },
  { id: 'braco-e', label: 'Braço esquerdo', short: 'Braço E' },
  { id: 'braco-d', label: 'Braço direito', short: 'Braço D' },
] as const;

export type SiteId = (typeof SITES)[number]['id'];

export type LogEntry = {
  id: string;
  /** Data e hora local (aaaa-mm-ddThh:mm). */
  at: string;
  slug: string;
  name: string;
  dose: number | '';
  unit: string;
  site: SiteId;
  note?: string;
};

export const siteLabel = (id: string) => SITES.find((s) => s.id === id)?.label ?? id;

/** Mais recentes primeiro. */
export function sortEntries(list: LogEntry[]): LogEntry[] {
  return [...list].sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
}

/**
 * Próximo local do rodízio: um que nunca foi usado (na ordem da lista) ou,
 * se todos já foram, o que está há mais tempo sem uso.
 */
export function nextSite(entries: LogEntry[], enabled: readonly SiteId[] = SITES.map((s) => s.id)): SiteId | null {
  if (enabled.length === 0) return null;
  const last = new Map<SiteId, string>();
  for (const e of entries) {
    const prev = last.get(e.site);
    if (!prev || e.at > prev) last.set(e.site, e.at);
  }
  const unused = enabled.find((s) => !last.has(s));
  if (unused) return unused;
  return [...enabled].sort((a, b) => (last.get(a)! < last.get(b)! ? -1 : 1))[0];
}

/** Dias desde a última aplicação em cada local (para mostrar no seletor). */
export function daysSinceBySite(entries: LogEntry[], now: Date): Partial<Record<SiteId, number>> {
  const out: Partial<Record<SiteId, number>> = {};
  for (const e of entries) {
    const d = Math.floor((now.getTime() - new Date(e.at).getTime()) / 86_400_000);
    if (out[e.site] === undefined || d < out[e.site]!) out[e.site] = Math.max(0, d);
  }
  return out;
}

const csvCell = (v: string) => (/[";\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

/** CSV com ";" (abre direto no Excel em português) e BOM para acentos. */
export function toCsv(entries: LogEntry[]): string {
  const head = ['Data', 'Hora', 'Peptídeo', 'Dose', 'Unidade', 'Local', 'Observação'];
  const rows = sortEntries(entries).map((e) => [
    e.at.slice(0, 10).split('-').reverse().join('/'),
    e.at.slice(11, 16),
    e.name,
    e.dose === '' ? '' : String(e.dose).replace('.', ','),
    e.unit,
    siteLabel(e.site),
    e.note ?? '',
  ]);
  return '﻿' + [head, ...rows].map((r) => r.map(csvCell).join(';')).join('\r\n');
}

/** Valida o que veio do localStorage (descarta itens quebrados). */
export function parseEntries(raw: unknown): LogEntry[] {
  if (!Array.isArray(raw)) return [];
  const ids = new Set<string>(SITES.map((s) => s.id));
  return raw.filter(
    (e): e is LogEntry =>
      !!e && typeof e === 'object' &&
      typeof e.id === 'string' &&
      typeof e.at === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(e.at) &&
      typeof e.name === 'string' &&
      ids.has(e.site),
  );
}
