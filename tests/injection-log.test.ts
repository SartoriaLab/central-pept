import { describe, expect, it } from 'vitest';
import { nextSite, parseEntries, toCsv, type LogEntry } from '@/lib/injection-log';

const e = (at: string, site: LogEntry['site'], extra: Partial<LogEntry> = {}): LogEntry => ({
  id: at, at, slug: 'bpc-157', name: 'BPC-157', dose: 250, unit: 'mcg', site, ...extra,
});

describe('rodízio', () => {
  it('sem histórico começa pelo primeiro local', () => {
    expect(nextSite([])).toBe('abd-e');
  });

  it('pega o primeiro local ainda não usado', () => {
    expect(nextSite([e('2026-11-01T08:00', 'abd-e'), e('2026-11-02T08:00', 'abd-d')])).toBe('coxa-e');
  });

  it('com todos usados, volta ao que está há mais tempo parado', () => {
    const all = [
      e('2026-11-06T08:00', 'abd-e'),
      e('2026-11-02T08:00', 'abd-d'),
      e('2026-11-03T08:00', 'coxa-e'),
      e('2026-11-04T08:00', 'coxa-d'),
      e('2026-11-05T08:00', 'braco-e'),
      e('2026-11-07T08:00', 'braco-d'),
    ];
    expect(nextSite(all)).toBe('abd-d');
  });

  it('respeita os locais escolhidos', () => {
    expect(nextSite([e('2026-11-01T08:00', 'abd-e')], ['abd-e', 'coxa-d'])).toBe('coxa-d');
    expect(nextSite([], [])).toBeNull();
  });
});

describe('exportação e leitura', () => {
  it('CSV com ponto e vírgula, vírgula decimal e aspas quando preciso', () => {
    const csv = toCsv([e('2026-11-13T21:30', 'coxa-d', { dose: 2.5, unit: 'mg', note: 'leve; ardência' })]);
    const lines = csv.replace('﻿', '').split('\r\n');
    expect(lines[0]).toBe('Data;Hora;Peptídeo;Dose;Unidade;Local;Observação');
    expect(lines[1]).toBe('13/11/2026;21:30;BPC-157;2,5;mg;Coxa direita;"leve; ardência"');
  });

  it('descarta itens inválidos do armazenamento', () => {
    const ok = e('2026-11-13T08:00', 'abd-e');
    expect(parseEntries([ok, { id: 'x' }, null, { ...ok, site: 'pe' }])).toEqual([ok]);
    expect(parseEntries('lixo')).toEqual([]);
  });
});
