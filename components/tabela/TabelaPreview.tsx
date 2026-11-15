'use client';

// Prévia da Tabela personalizada dentro da oferta da calculadora: as primeiras datas do
// calendário com os números da pessoa, o resto fica para o PDF. Data só depois de montar
// (evita diferença de fuso entre servidor e navegador).

import { useEffect, useState } from 'react';
import { fmt } from '@/components/calculator/calc';
import { buildTabela, guessFreq } from '@/lib/tabela';
import { todayLocalISO } from '@/lib/dates';

type Props = { vialMg: number; waterMl: number; doseMg: number; frequency?: string };

function short(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' }).replace('.', '');
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')} (${wd})`;
}

export default function TabelaPreview({ vialMg, waterMl, doseMg, frequency }: Props) {
  const [today, setToday] = useState('');
  useEffect(() => setToday(todayLocalISO()), []);
  const freq = guessFreq(frequency);
  if (!today || !freq) return null;
  const t = buildTabela({ vialMg, waterMl, doseMg, syringe: 100, freq, startISO: today, shelfDays: 28 });
  if (!t || t.calendar.length < 2) return null;
  const rows = t.calendar.slice(0, 3);
  const more = t.calendar.length - 2;

  return (
    <div className="mt-3 rounded-lg border border-teal-100 bg-surface p-3 text-sm" aria-label="Prévia da sua tabela">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-3">Prévia da sua tabela, se misturar hoje</p>
      <table className="mt-1.5 w-full tabular-nums">
        <tbody>
          {rows.map((c, i) => (
            <tr
              key={c.n}
              className={`border-b border-border last:border-0 ${i === 2 ? 'blur-[3px] select-none' : ''}`}
              aria-hidden={i === 2 || undefined}
            >
              <td className="py-1 pr-2 text-ink-3">{c.n}</td>
              <td className="py-1">{short(c.dateISO)}{c.period ? ` · ${c.period}` : ''}</td>
              <td className="py-1 text-right font-bold text-teal-700">{fmt(t.unitsPerDose, 1)} U</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1.5 text-xs text-ink-2">
        {more > 0 ? `+ ${more} ${more === 1 ? 'aplicação' : 'aplicações'}, ` : 'No PDF: '}descarte em{' '}
        <strong>{short(t.discardISO)}</strong>, etiqueta do frasco e outras doses{more > 0 ? ' no PDF' : ''}.
      </p>
    </div>
  );
}
