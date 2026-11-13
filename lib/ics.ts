// Gerador de calendário .ics (RFC 5545) usado pelo Cronograma e pela Subida de Dose.

export type IcsEvent = {
  start: Date;
  /** Duração em minutos. */
  minutes: number;
  summary: string;
  description?: string;
  /** Lembrete N minutos antes. */
  alarmMinutes?: number;
  alarmText?: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

/** Data em UTC no formato básico do iCalendar (20261113T120000Z). */
export function icsDate(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

/** Escapa texto: barra, ponto e vírgula, vírgula e quebra de linha. */
export function icsText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

export function buildIcs(events: IcsEvent[], product: string, now = new Date()): string {
  const stamp = icsDate(now);
  const body = events.map((e, i) => {
    const end = new Date(e.start.getTime() + e.minutes * 60_000);
    const lines = [
      'BEGIN:VEVENT',
      `UID:${now.getTime()}-${i}@centralpeptideos`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${icsDate(e.start)}`,
      `DTEND:${icsDate(end)}`,
      `SUMMARY:${icsText(e.summary)}`,
    ];
    if (e.description) lines.push(`DESCRIPTION:${icsText(e.description)}`);
    if (e.alarmMinutes != null) {
      lines.push(
        'BEGIN:VALARM',
        `TRIGGER:-PT${e.alarmMinutes}M`,
        'ACTION:DISPLAY',
        `DESCRIPTION:${icsText(e.alarmText ?? e.summary)}`,
        'END:VALARM',
      );
    }
    lines.push('END:VEVENT');
    return lines.join('\r\n');
  });
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//Central Peptídeos//${product}//PT-BR`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...body,
    'END:VCALENDAR',
  ].join('\r\n');
}

/** Baixa o .ics no navegador. */
export function downloadIcs(filename: string, ics: string): void {
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
