// Escada de doses (titulação) dos GLP-1, em tabelas por esquema. Usada na tabela para
// imprimir (/ferramentas/tabela-doses-glp1) e na versão embed (/embed/tabela-doses-glp1).

import { fmt } from '@/components/calculator/calc';
import { TITRATION_SCHEMES, doseLabel, durationLabel, stepPeriodLabel, type TitrationScheme } from '@/lib/titration';

const th = 'p-2.5 font-bold text-left text-xs uppercase tracking-wider text-ink-3';
const td = 'p-2.5 tabular-nums whitespace-nowrap';

// Esquemas com a mesma escada (Mounjaro e Zepbound) viram uma tabela só.
function uniqueSchemes(): { scheme: TitrationScheme; label: string }[] {
  const seen = new Map<string, { scheme: TitrationScheme; label: string }>();
  for (const s of TITRATION_SCHEMES) {
    const key = `${s.peptideSlug}:${s.steps.map((x) => x.dose).join('/')}`;
    const brand = s.name.split(' — ')[1]?.replace(/\s*\(.*\)$/, '');
    const existing = seen.get(key);
    if (existing) {
      if (brand) existing.label += ` / ${brand}`;
    } else {
      seen.set(key, { scheme: s, label: s.name.replace(/\s*\(.*\)$/, '') });
    }
  }
  return Array.from(seen.values());
}

export default function DoseLadder() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {uniqueSchemes().map(({ scheme, label }) => (
        <div key={scheme.id} className="card overflow-hidden">
          <h3 className="px-3 pt-3 font-bold text-ink">{label}</h3>
          <p className="px-3 text-xs text-ink-3">
            {scheme.route === 'oral' ? 'Comprimido' : 'Injeção'} {scheme.frequency === 'diaria' ? 'diária' : 'semanal'} · mínimo de {durationLabel(scheme.stepDays)} por etapa
          </p>
          <table className="w-full text-sm mt-1">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className={th}>Etapa</th>
                <th scope="col" className={th}>Período</th>
                <th scope="col" className={th}>{doseLabel(scheme.frequency)}</th>
              </tr>
            </thead>
            <tbody>
              {scheme.steps.map((step, i) => {
                const last = i === scheme.steps.length - 1;
                return (
                  <tr key={step.dose} className="border-b border-border last:border-0">
                    <td className={td}>{i + 1}</td>
                    <td className={td}>{stepPeriodLabel(i, scheme.stepDays, last)}</td>
                    <td className={`${td} font-bold text-teal-700`}>{fmt(step.dose, 2)} mg</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
