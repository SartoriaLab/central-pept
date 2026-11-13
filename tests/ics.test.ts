import { describe, expect, it } from 'vitest';
import { buildIcs, icsDate, icsText } from '@/lib/ics';

describe('ics', () => {
  it('formata data em UTC', () => {
    expect(icsDate(new Date(Date.UTC(2026, 10, 3, 12, 5, 0)))).toBe('20261103T120500Z');
  });

  it('escapa texto', () => {
    expect(icsText('a, b; c\\d\ne')).toBe('a\\, b\\; c\\\\d\\ne');
  });

  it('monta calendário com eventos e alarme', () => {
    const start = new Date(Date.UTC(2026, 0, 1, 11, 0, 0));
    const ics = buildIcs(
      [
        { start, minutes: 15, summary: 'BPC-157, 250 mcg', alarmMinutes: 15 },
        { start, minutes: 60, summary: 'Outro' },
      ],
      'Teste',
      new Date(0),
    );
    const lines = ics.split('\r\n');
    expect(lines[0]).toBe('BEGIN:VCALENDAR');
    expect(lines.at(-1)).toBe('END:VCALENDAR');
    expect(lines.filter((l) => l === 'BEGIN:VEVENT')).toHaveLength(2);
    expect(lines).toContain('DTEND:20260101T111500Z');
    expect(lines).toContain('SUMMARY:BPC-157\\, 250 mcg');
    expect(lines).toContain('TRIGGER:-PT15M');
    expect(new Set(lines.filter((l) => l.startsWith('UID:'))).size).toBe(2);
  });
});
