'use client';

// Gerador da Tabela personalizada (produto pago). A Kiwify manda o comprador para
// /tabela-personalizada?k=<chave>; a chave libera esta página no aparelho (localStorage).
// Só o hash da chave fica no código: o repositório é público.

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Peptide } from '@/lib/peptides';
import { doseToMg, fmt, fmtConcentration } from '@/components/calculator/calc';
import { FREQ_LABELS, type Freq } from '@/lib/vial-plan';
import { getTitrationDoses } from '@/lib/titration';
import { buildTabela, guessFreq, type Syringe } from '@/lib/tabela';
import { todayLocalISO } from '@/lib/dates';
import DecimalInput from '@/components/ui/DecimalInput';

const KEY_HASH = '7a71913287ccca3063252dd3913b9436da42d82276523d2515a8986af8689518';
const UNLOCK_KEY = 'cp:tabela:acesso';
const CALC_STATE_KEY = 'peptidecalc:state:v1';
const SYRINGES: Syringe[] = [30, 50, 100];
const FREQS = Object.keys(FREQ_LABELS) as Freq[];

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

function dateBR(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' });
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y} (${wd.replace('.', '')})`;
}

type Status = 'checking' | 'locked' | 'open';

export default function TabelaGenerator({ peptides }: { peptides: Peptide[] }) {
  const [status, setStatus] = useState<Status>('checking');
  const [slug, setSlug] = useState('');
  const [vialMg, setVialMg] = useState<number | ''>(10);
  const [waterMl, setWaterMl] = useState<number | ''>(2);
  const [dose, setDose] = useState<number | ''>('');
  const [syringe, setSyringe] = useState<Syringe>(100);
  const [freq, setFreq] = useState<Freq>('semanal');
  const [everyDays, setEveryDays] = useState<number | ''>(2);
  const [startISO, setStartISO] = useState('');
  const [shelfDays, setShelfDays] = useState<number | ''>(28);

  const peptide = peptides.find((p) => p.slug === slug) ?? null;
  const unit = peptide?.doseUnit ?? 'mg';

  // Libera com a chave da URL ou com o acesso já salvo neste aparelho.
  useEffect(() => {
    let alive = true;
    (async () => {
      let ok = false;
      try {
        ok = window.localStorage.getItem(UNLOCK_KEY) === '1';
      } catch {}
      const k = new URLSearchParams(window.location.search).get('k');
      if (!ok && k && crypto?.subtle) ok = (await sha256(k)) === KEY_HASH;
      if (ok) {
        try {
          window.localStorage.setItem(UNLOCK_KEY, '1');
        } catch {}
      }
      if (alive) setStatus(ok ? 'open' : 'locked');
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Começa com o último cálculo da calculadora de reconstituição, se houver.
  useEffect(() => {
    setStartISO(todayLocalISO());
    try {
      const s = JSON.parse(window.localStorage.getItem(CALC_STATE_KEY) || 'null');
      if (!s) throw new Error('sem cálculo salvo');
      const p = peptides.find((x) => x.slug === s.peptideSlug);
      if (p) {
        setSlug(p.slug);
        const f = guessFreq(p.frequency);
        if (f) setFreq(f);
      }
      if (typeof s.mg === 'number') setVialMg(s.mg);
      if (typeof s.dose === 'number') setDose(s.dose);
      if (s.syringe === 30 || s.syringe === 50 || s.syringe === 100) setSyringe(s.syringe);
      if (s.mode === 'units' && typeof s.units === 'number' && typeof s.mg === 'number' && typeof s.dose === 'number' && p) {
        const doseMg = doseToMg(s.dose, p.doseUnit);
        if (doseMg > 0) setWaterMl(Math.round(((s.units * s.mg) / (doseMg * 100)) * 100) / 100);
      } else if (typeof s.waterMl === 'number') setWaterMl(s.waterMl);
    } catch {}
    // Parâmetros da URL (mesmos nomes da calculadora) vencem o último cálculo.
    const q = new URLSearchParams(window.location.search);
    const n = (k: string) => {
      const v = parseFloat(q.get(k) ?? '');
      return Number.isFinite(v) && v > 0 ? v : null;
    };
    const p = peptides.find((x) => x.slug === q.get('peptide'));
    if (p) setSlug(p.slug);
    if (n('mg')) setVialMg(n('mg')!);
    if (n('water')) setWaterMl(n('water')!);
    if (n('dose')) setDose(n('dose')!);
    const sy = Number(q.get('syringe'));
    if (sy === 30 || sy === 50 || sy === 100) setSyringe(sy);
  }, [peptides]);

  function pickPeptide(next: string) {
    setSlug(next);
    const p = peptides.find((x) => x.slug === next);
    if (!p) return;
    setDose(p.typicalDose);
    if (p.commonAmounts[0]) setVialMg(p.commonAmounts[0]);
  }

  const doseMg = dose === '' || !peptide ? NaN : doseToMg(dose, unit);
  const tabela = useMemo(() => {
    if (!peptide || vialMg === '' || waterMl === '' || shelfDays === '' || !(doseMg > 0)) return null;
    return buildTabela({
      vialMg,
      waterMl,
      doseMg,
      syringe,
      freq,
      everyDays: everyDays === '' ? 1 : everyDays,
      startISO,
      shelfDays,
      extraDosesMg: getTitrationDoses(peptide.slug),
    });
  }, [peptide, vialMg, waterMl, doseMg, syringe, freq, everyDays, startISO, shelfDays]);

  const showDose = (mg: number) => (unit === 'mg' ? `${fmt(mg, 3)} mg` : `${fmt(mg * 1000, 1)} ${unit}`);

  if (status === 'checking') return <p className="text-ink-3">Carregando…</p>;

  if (status === 'locked') {
    return (
      <div className="card p-6 max-w-xl">
        <h2 className="text-lg font-bold">Esta página gera a tabela de quem comprou</h2>
        <p className="mt-2 text-ink-2">
          Depois do pagamento, a Kiwify traz você para cá com um link de acesso. Se já comprou, abra o link
          que apareceu depois do pagamento, no mesmo aparelho. Não achou? Responda o e-mail da compra
          que a gente reenvia.
        </p>
        <Link href="/ebooks/tabela-personalizada" className="btn-teal mt-4">
          Ver a tabela personalizada · R$ 14,90
        </Link>
      </div>
    );
  }

  const input = 'w-full h-11 rounded-lg border border-border bg-surface px-3 text-ink';
  const label = 'block text-sm font-semibold text-ink-2 mb-1';

  return (
    <div>
      <div className="no-print card p-5 md:p-6">
        <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800 dark:bg-teal-400/10 dark:text-teal-200">
          Acesso liberado neste aparelho. <strong>Salve o endereço desta página nos favoritos</strong> para gerar
          a tabela de novo quando trocar de frasco.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="tb-pep" className={label}>Peptídeo</label>
            <select id="tb-pep" className={input} value={slug} onChange={(e) => pickPeptide(e.target.value)}>
              <option value="">Escolha…</option>
              {peptides.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tb-mg" className={label}>Quantidade no frasco (mg)</label>
            <DecimalInput id="tb-mg" className={input} value={vialMg} onChange={setVialMg} />
          </div>
          <div>
            <label htmlFor="tb-agua" className={label}>Água bacteriostática (ml)</label>
            <DecimalInput id="tb-agua" className={input} value={waterMl} onChange={setWaterMl} />
          </div>
          <div>
            <label htmlFor="tb-dose" className={label}>Dose definida com o médico ({unit})</label>
            <DecimalInput id="tb-dose" className={input} value={dose} onChange={setDose} />
          </div>
          <div>
            <span className={label}>Seringa</span>
            <div className="flex gap-2">
              {SYRINGES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSyringe(s)}
                  className={`flex-1 h-11 rounded-lg border text-sm font-semibold ${syringe === s ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-border text-ink-2'}`}
                >
                  {s} U
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="tb-freq" className={label}>Frequência</label>
            <select id="tb-freq" className={input} value={freq} onChange={(e) => setFreq(e.target.value as Freq)}>
              {FREQS.map((f) => (
                <option key={f} value={f}>{FREQ_LABELS[f]}</option>
              ))}
            </select>
          </div>
          {freq === 'cada' ? (
            <div>
              <label htmlFor="tb-cada" className={label}>A cada quantos dias</label>
              <DecimalInput id="tb-cada" className={input} value={everyDays} onChange={setEveryDays} />
            </div>
          ) : null}
          <div>
            <label htmlFor="tb-data" className={label}>Data da reconstituição</label>
            <input id="tb-data" type="date" className={input} value={startISO} onChange={(e) => setStartISO(e.target.value)} />
          </div>
          <div>
            <label htmlFor="tb-val" className={label}>Validade depois de misturar (dias)</label>
            <DecimalInput id="tb-val" className={input} value={shelfDays} onChange={setShelfDays} />
            <p className="mt-1 text-xs text-ink-3">28 dias é a regra de frasco multidose com água bacteriostática. Confirme o prazo do seu produto.</p>
          </div>
        </div>
        <button type="button" onClick={() => window.print()} disabled={!tabela} className="btn-teal w-full mt-6 disabled:opacity-50">
          Baixar PDF / imprimir
        </button>
        <p className="mt-2 text-center text-xs text-ink-3">No celular: compartilhar → imprimir → salvar como PDF.</p>
      </div>

      {tabela && peptide ? (
        <article className="mt-8 card p-5 md:p-8 print:border-0 print:p-0 print:shadow-none" aria-label="Sua tabela">
          <header className="border-b border-border pb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Central Peptídeos · tabela personalizada</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">{peptide.name}</h2>
            <p className="mt-1 text-sm text-ink-2">
              Frasco de {fmt(Number(vialMg), 2)} mg + {fmt(Number(waterMl), 2)} ml de água bacteriostática ·{' '}
              {fmtConcentration(tabela.concentration)} mg/ml · seringa de {syringe} U
            </p>
          </header>

          <section className="mt-5 rounded-xl bg-teal-50 p-4 text-center dark:bg-teal-400/10 print:bg-transparent print:border print:border-border">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Sua dose: {showDose(doseMg)}</p>
            <p className="mt-1 text-4xl font-extrabold text-ink">{fmt(tabela.unitsPerDose, 1)} unidades</p>
            <p className="text-sm text-ink-2">= {fmt(tabela.mlPerDose, 3)} ml · {tabela.dosesPerVial} doses inteiras no frasco</p>
            {tabela.unitsPerDose > syringe ? (
              <p className="mt-2 text-sm font-semibold text-red-700">Não cabe numa seringa de {syringe} U: use uma seringa maior ou mais água.</p>
            ) : null}
          </section>

          <section className="mt-6">
            <h3 className="font-bold text-ink">Outras doses com este frasco</h3>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-ink-3">
                  <th className="py-2">Dose</th>
                  <th className="py-2">Unidades</th>
                  <th className="py-2">ml</th>
                </tr>
              </thead>
              <tbody>
                {tabela.doseRows.map((r) => (
                  <tr key={r.doseMg} className={`border-b border-border last:border-0 ${r.mine ? 'font-bold text-teal-700' : ''}`}>
                    <td className="py-1.5">{showDose(r.doseMg)}{r.mine ? ' (sua)' : ''}</td>
                    <td className="py-1.5 tabular-nums">{r.fits ? fmt(r.units, 1) : `${fmt(r.units, 1)} (não cabe em ${syringe} U)`}</td>
                    <td className="py-1.5 tabular-nums">{fmt(r.ml, 3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-1 text-xs text-ink-3">Doses de referência para conferência, não recomendação. A dose é a que o médico definiu.</p>
          </section>

          <section className="mt-6 break-inside-avoid">
            <h3 className="font-bold text-ink">Calendário deste frasco</h3>
            <p className="text-sm text-ink-2">
              Descarte em <strong>{dateBR(tabela.discardISO)}</strong>
              {tabela.limitedByShelf ? `, mesmo com sobra: ficam cerca de ${fmt(tabela.wastedMg, 2)} mg no frasco.` : '.'}
            </p>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-ink-3">
                  <th className="py-2 w-10">Nº</th>
                  <th className="py-2">Data</th>
                  <th className="py-2">Puxar</th>
                  <th className="py-2">Sobra</th>
                  <th className="py-2 w-14">Feito</th>
                </tr>
              </thead>
              <tbody>
                {tabela.calendar.map((c) => (
                  <tr key={c.n} className="border-b border-border last:border-0">
                    <td className="py-1.5 tabular-nums">{c.n}</td>
                    <td className="py-1.5">{dateBR(c.dateISO)}{c.period ? ` · ${c.period}` : ''}</td>
                    <td className="py-1.5 tabular-nums">{fmt(tabela.unitsPerDose, 1)} U</td>
                    <td className="py-1.5 tabular-nums">{fmt(c.leftMg, 2)} mg</td>
                    <td className="py-1.5"><span className="inline-block h-4 w-4 rounded border border-ink-3" aria-hidden /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mt-6 break-inside-avoid">
            <h3 className="font-bold text-ink">Etiqueta do frasco (recorte e cole)</h3>
            <div className="mt-2 inline-block rounded-lg border-2 border-dashed border-ink-3 p-3 text-sm leading-snug">
              <p className="font-bold">{peptide.name} · {fmt(Number(vialMg), 2)} mg</p>
              <p>{fmt(Number(waterMl), 2)} ml de água · {fmtConcentration(tabela.concentration)} mg/ml</p>
              <p>{showDose(doseMg)} = <strong>{fmt(tabela.unitsPerDose, 1)} U</strong> (seringa {syringe} U)</p>
              <p>Misturado em {dateBR(startISO)}</p>
              <p>Descartar em <strong>{dateBR(tabela.discardISO)}</strong></p>
            </div>
          </section>

          <section className="mt-6 break-inside-avoid">
            <h3 className="font-bold text-ink">Checklist de bancada</h3>
            <ul className="mt-2 space-y-1 text-sm text-ink-2">
              {[
                'Mãos lavadas e tampa do frasco limpa com álcool 70%',
                'Água bacteriostática escorrendo pela parede do frasco, sem jato no pó',
                'Girar devagar até dissolver; não agitar',
                'Conferir a seringa: o número é unidade da seringa, não mg',
                'Tirar as bolhas antes de conferir a marca',
                'Frasco na geladeira (2 a 8 °C), longe do congelador',
                'Etiqueta com a data colada no frasco',
              ].map((t) => (
                <li key={t} className="flex gap-2"><span aria-hidden>☐</span><span>{t}</span></li>
              ))}
            </ul>
          </section>

          <p className="mt-6 text-xs text-ink-3">
            Material educativo gerado com os números informados. Não é prescrição: confirme dose, frequência e
            validade com o médico ou o farmacêutico. centralpeptideos.com.br
          </p>
        </article>
      ) : (
        <p className="no-print mt-6 text-ink-3">Preencha o peptídeo, o frasco, a água e a dose para ver a tabela.</p>
      )}
    </div>
  );
}
