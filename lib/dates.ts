// Datas "AAAA-MM-DD" (valor de <input type="date">) no fuso do visitante.
// `new Date('2026-01-10')` é lido como UTC e, no Brasil (UTC-3), vira dia 9.

const pad = (n: number) => String(n).padStart(2, '0');

/** Hoje, no fuso local, como AAAA-MM-DD. */
export function todayLocalISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Converte AAAA-MM-DD em Date à meia-noite local (ou no horário informado). */
export function parseLocalDate(iso: string, hours = 0, minutes = 0): Date {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, m - 1, d, hours, minutes, 0, 0);
}
