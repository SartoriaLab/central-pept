'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import type { Peptide, DoseUnit } from '@/lib/peptides';
import {
  doseToMg,
  calcByVolume,
  calcByUnits,
  fmt,
  fmtConcentration,
} from './calc';
import Syringe from './Syringe';

type Mode = 'volume' | 'units';
type SyringeSize = 30 | 50 | 100;

type Props = {
  peptides: Peptide[];
};

const LS_STATE_KEY = 'peptidecalc:state:v1';
const LS_CUSTOMS_KEY = 'peptidecalc:customs:v1';

// Tamanhos de frasco padrão para sugerir (mg). Merged com commonAmounts do peptídeo.
const STANDARD_VIAL_SIZES = [5, 10, 15, 20, 30];

export default function ReconstitutionCalculator({ peptides }: Props) {
  const [peptide, setPeptide] = useState<Peptide | null>(null);
  const [customs, setCustoms] = useState<Peptide[]>([]);
  const [comboOpen, setComboOpen] = useState(false);
  const [comboQuery, setComboQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const [customFormOpen, setCustomFormOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDose, setCustomDose] = useState('');
  const [customUnit, setCustomUnit] = useState<DoseUnit>('mcg');

  const [mg, setMg] = useState<number | ''>('');
  const [waterMl, setWaterMl] = useState<number | ''>('');
  const [units, setUnits] = useState<number | ''>('');
  const [dose, setDose] = useState<number | ''>('');
  const [mode, setMode] = useState<Mode>('volume');
  const [syringe, setSyringe] = useState<SyringeSize>(50);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const comboRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Lista unificada: peptídeos da lib + personalizados salvos
  const allPeptides = useMemo(() => [...customs, ...peptides], [customs, peptides]);

  // Carregar estado + customs ao montar. URL params têm precedência sobre estado salvo.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let customList: Peptide[] = [];
    try {
      const raw = localStorage.getItem(LS_CUSTOMS_KEY);
      if (raw) customList = JSON.parse(raw);
      if (Array.isArray(customList)) setCustoms(customList);
    } catch { /* ignore */ }

    const params = new URLSearchParams(window.location.search);
    const urlSlug = params.get('peptide');
    const combined = [...customList, ...peptides];

    // Parâmetros completos de cálculo para compartilhamento
    const num = (key: string): number | '' => {
      const v = params.get(key);
      if (v === null || v === '') return '';
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : '';
    };
    const urlMg = num('mg');
    const urlWater = num('water');
    const urlUnits = num('units');
    const urlDose = num('dose');
    const urlMode = params.get('mode');
    const urlSyringe = params.get('syringe');

    if (urlSlug) {
      const p = combined.find((x) => x.slug === urlSlug);
      if (p) {
        setPeptide(p);
        setDose(urlDose !== '' ? urlDose : p.typicalDose);
        if (urlMg !== '') setMg(urlMg);
        else if (p.commonAmounts.length === 1) setMg(p.commonAmounts[0]);
        if (urlWater !== '') setWaterMl(urlWater);
        if (urlUnits !== '') setUnits(urlUnits);
        if (urlMode === 'volume' || urlMode === 'units') setMode(urlMode);
        if (urlSyringe === '30' || urlSyringe === '50' || urlSyringe === '100') {
          setSyringe(parseInt(urlSyringe) as SyringeSize);
        }
        setHydrated(true);
        return;
      }
    }

    try {
      const raw = localStorage.getItem(LS_STATE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.peptideSlug) {
          const p = combined.find((x) => x.slug === s.peptideSlug);
          if (p) setPeptide(p);
        }
        if (typeof s.mg === 'number' || s.mg === '') setMg(s.mg);
        if (typeof s.waterMl === 'number' || s.waterMl === '') setWaterMl(s.waterMl);
        if (typeof s.units === 'number' || s.units === '') setUnits(s.units);
        if (typeof s.dose === 'number' || s.dose === '') setDose(s.dose);
        if (s.mode === 'volume' || s.mode === 'units') setMode(s.mode);
        if (s.syringe === 30 || s.syringe === 50 || s.syringe === 100) setSyringe(s.syringe);
      }
    } catch { /* ignore */ }
    setHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persistir estado em localStorage quando muda (após hidratação)
  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        LS_STATE_KEY,
        JSON.stringify({
          peptideSlug: peptide?.slug ?? null,
          mg, waterMl, units, dose, mode, syringe,
        })
      );
    } catch { /* ignore */ }
  }, [hydrated, peptide, mg, waterMl, units, dose, mode, syringe]);

  // Persistir customs em localStorage quando muda (após hidratação)
  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem(LS_CUSTOMS_KEY, JSON.stringify(customs));
    } catch { /* ignore */ }
  }, [hydrated, customs]);

  // Fechar combobox ao clicar fora
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!comboOpen) return;
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setComboOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [comboOpen]);

  // Focar busca ao abrir
  useEffect(() => {
    if (comboOpen) requestAnimationFrame(() => searchRef.current?.focus());
  }, [comboOpen]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  // Lista filtrada
  const filtered = useMemo(() => {
    const q = comboQuery.trim().toLowerCase();
    return allPeptides.filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [allPeptides, comboQuery]);

  // Reset highlight quando filtro muda
  useEffect(() => { setHighlight(0); }, [comboQuery, comboOpen]);

  // Scroll item destacado para view
  useEffect(() => {
    if (!comboOpen || !listRef.current) return;
    const item = listRef.current.querySelector(`[data-idx="${highlight}"]`) as HTMLElement | null;
    item?.scrollIntoView({ block: 'nearest' });
  }, [highlight, comboOpen]);

  // Selecionar peptídeo — preenche dose típica e defaults razoáveis
  function selectPeptide(p: Peptide) {
    setPeptide(p);
    setDose(p.typicalDose);
    setComboOpen(false);
    setComboQuery('');
    // Se só tem um tamanho comum, auto-preenche mg
    if (p.commonAmounts.length === 1 && !mg) setMg(p.commonAmounts[0]);
    // Se não tem água preenchida, sugere 2 ml como padrão razoável
    if (mode === 'volume' && !waterMl) setWaterMl(2);
  }

  // Carregar exemplo pronto (BPC-157 padrão)
  function loadExample() {
    const example = peptides.find((p) => p.slug === 'bpc-157') || peptides[0];
    if (!example) return;
    setPeptide(example);
    setDose(example.typicalDose);
    setMg(example.commonAmounts[0] ?? 5);
    setWaterMl(2);
    setUnits('');
    setMode('volume');
    setSyringe(50);
    setToast('Exemplo carregado. Edite os campos à vontade.');
  }

  function clearPeptide() {
    setPeptide(null);
    setDose('');
  }

  function submitCustom() {
    const name = customName.trim();
    const d = parseFloat(customDose);
    if (!name) { setToast('Informe o nome do peptídeo.'); return; }
    if (!(d > 0)) { setToast('Informe uma dose típica válida.'); return; }
    const p: Peptide = {
      slug: `custom-${Date.now()}`,
      name,
      typicalDose: d,
      doseUnit: customUnit,
      frequency: 'Conforme orientação',
      shortDescription: 'Peptídeo personalizado.',
      commonAmounts: [],
      category: 'custom',
    };
    setCustoms((prev) => [p, ...prev]);
    selectPeptide(p);
    setCustomFormOpen(false);
    setCustomName('');
    setCustomDose('');
    setToast('Peptídeo adicionado e salvo.');
  }

  function deleteCustom(slug: string) {
    setCustoms((prev) => prev.filter((p) => p.slug !== slug));
    if (peptide?.slug === slug) clearPeptide();
    setToast('Peptídeo removido.');
  }

  // Cálculo
  const result = useMemo(() => {
    if (!peptide) return null;
    const doseMg = doseToMg(Number(dose), peptide.doseUnit);
    if (mode === 'units') {
      return calcByUnits(Number(mg), Number(units), doseMg);
    }
    return calcByVolume(Number(mg), Number(waterMl), doseMg);
  }, [peptide, mg, waterMl, units, dose, mode]);

  // Alertas
  const alerts = useMemo(() => {
    if (!result) return [];
    const out: { kind: 'err' | 'warn' | 'success'; msg: string }[] = [];
    if (result.unitsPerDose > syringe) {
      out.push({ kind: 'err', msg: `Dose excede a capacidade da seringa de ${syringe} U. Use uma seringa maior ou divida a aplicação.` });
    } else if (result.unitsPerDose < 5) {
      out.push({ kind: 'warn', msg: 'Unidades muito pequenas (< 5 U) — difíceis de medir com precisão. Considere adicionar mais água.' });
    } else if (result.unitsPerDose >= 10 && result.unitsPerDose <= 50) {
      out.push({ kind: 'success', msg: 'Faixa ideal (10–50 U). Fácil de medir com precisão.' });
    }
    if (result.waterMl > 0 && result.waterMl < 0.3) {
      out.push({ kind: 'warn', msg: 'Volume de água muito pequeno (< 0,3 ml). Pode ser difícil de medir. Considere aumentar.' });
    }
    // Divergência vs dose típica (apenas para peptídeos catalogados, não custom)
    if (peptide && peptide.category !== 'custom' && typeof dose === 'number' && dose > 0) {
      const ratio = dose / peptide.typicalDose;
      if (ratio >= 3) {
        out.push({ kind: 'warn', msg: `Dose ${fmt(ratio, 1)}× maior que a típica (${peptide.typicalDose} ${peptide.doseUnit}). Confirme se é intencional.` });
      } else if (ratio <= 0.34) {
        out.push({ kind: 'warn', msg: `Dose bem abaixo da típica (${peptide.typicalDose} ${peptide.doseUnit}). Confirme se é intencional.` });
      }
    }
    return out;
  }, [result, syringe, peptide, dose]);

  // Copiar resultado
  function copyResult() {
    if (!result || !peptide) return;
    const text = [
      '📋 Cálculo de Reconstituição',
      `Peptídeo: ${peptide.name}`,
      `Frasco: ${fmt(Number(mg), 2)} mg`,
      `Água BAC: ${fmt(result.waterMl, 2)} ml`,
      `Concentração: ${fmtConcentration(result.concentration)} mg/ml`,
      `Dose: ${fmt(Number(dose), 3)} ${peptide.doseUnit}`,
      `Unidades/dose: ${fmt(result.unitsPerDose, 1)} U (seringa ${syringe} U)`,
      `Doses/frasco: ${fmt(result.dosesPerVial, 1)}`,
    ].join('\n');
    navigator.clipboard?.writeText(text)
      .then(() => setToast('Copiado!'))
      .catch(() => setToast('Não foi possível copiar.'));
  }

  // Compartilhar URL com estado atual
  function shareUrl() {
    if (!peptide || typeof window === 'undefined') return;
    const params = new URLSearchParams();
    params.set('peptide', peptide.slug);
    if (mg !== '') params.set('mg', String(mg));
    if (waterMl !== '') params.set('water', String(waterMl));
    if (units !== '') params.set('units', String(units));
    if (dose !== '') params.set('dose', String(dose));
    params.set('mode', mode);
    params.set('syringe', String(syringe));
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    // Usa Web Share API se disponível (mobile), senão copia para clipboard
    const nav = window.navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (typeof nav.share === 'function') {
      nav.share({
        title: `Reconstituição de ${peptide.name}`,
        text: `Cálculo pronto: ${fmt(result?.unitsPerDose ?? 0, 1)} U por dose`,
        url,
      }).catch(() => {/* user cancelled */});
    } else {
      navigator.clipboard?.writeText(url)
        .then(() => setToast('Link copiado!'))
        .catch(() => setToast('Não foi possível copiar o link.'));
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[460px_minmax(0,1fr)] items-start">
      {/* ── Inputs ── */}
      <div className="flex flex-col gap-5 no-print">
        {/* Peptídeo */}
        <section className="card p-6">
          <SectionTitle num={1} label="Qual peptídeo?" hint="Selecione da lista ou adicione um personalizado." />

          <div className="relative" ref={comboRef}>
            <div
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={comboOpen}
              tabIndex={0}
              onClick={() => setComboOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setComboOpen((v) => !v); }
                if (e.key === 'Escape') setComboOpen(false);
              }}
              className={`flex items-center gap-3 h-[52px] px-4 border-[1.5px] rounded-DEFAULT bg-surface cursor-pointer transition-all ${
                comboOpen
                  ? 'border-teal ring-[3px] ring-teal-50 rounded-b-none'
                  : 'border-border-2 hover:border-teal'
              }`}
            >
              <SearchIcon className="text-ink-3" />
              {peptide ? (
                <span className="flex-1 font-semibold">{peptide.name}</span>
              ) : (
                <span className="flex-1 text-ink-3">Buscar peptídeo…</span>
              )}
              <ChevronIcon className={`text-ink-3 transition-transform ${comboOpen ? 'rotate-180' : ''}`} />
            </div>

            {comboOpen && (
              <div className="absolute left-0 right-0 top-[51px] z-50 bg-surface border-[1.5px] border-t-0 border-teal rounded-b-DEFAULT shadow-lg overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border text-ink-3">
                  <SearchIcon />
                  <input
                    ref={searchRef}
                    type="search"
                    placeholder="Buscar…"
                    value={comboQuery}
                    onChange={(e) => setComboQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') { setComboOpen(false); return; }
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setHighlight((h) => Math.max(h - 1, 0));
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        const p = filtered[highlight];
                        if (p) selectPeptide(p);
                      }
                    }}
                    aria-autocomplete="list"
                    aria-controls="peptide-listbox"
                    aria-activedescendant={filtered[highlight] ? `peptide-opt-${filtered[highlight].slug}` : undefined}
                    className="flex-1 bg-transparent outline-none text-sm text-ink"
                  />
                </div>
                <ul
                  ref={listRef}
                  id="peptide-listbox"
                  role="listbox"
                  className="list-none m-0 p-1 max-h-64 overflow-y-auto"
                >
                  {filtered.length === 0 ? (
                    <li className="px-3 py-4 text-center text-sm text-ink-3">
                      Nenhum resultado. Use &quot;Outro peptídeo&quot; abaixo.
                    </li>
                  ) : (
                    filtered.map((p, i) => {
                      const isCustom = p.category === 'custom';
                      const active = highlight === i;
                      return (
                        <li
                          key={p.slug}
                          id={`peptide-opt-${p.slug}`}
                          data-idx={i}
                          role="option"
                          aria-selected={peptide?.slug === p.slug}
                          className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded cursor-pointer ${
                            peptide?.slug === p.slug
                              ? 'bg-teal-100'
                              : active ? 'bg-teal-50' : 'hover:bg-teal-50'
                          }`}
                          onMouseEnter={() => setHighlight(i)}
                          onMouseDown={(e) => { e.preventDefault(); selectPeptide(p); }}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm flex items-center gap-1.5">
                              <span className="truncate">{p.name}</span>
                              {isCustom && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                  seu
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-ink-3 mt-0.5 truncate">{p.frequency}</div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface border border-teal-100 text-teal-700 whitespace-nowrap">
                              {p.typicalDose} {p.doseUnit}
                            </span>
                            {isCustom && (
                              <button
                                type="button"
                                aria-label={`Remover ${p.name}`}
                                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); deleteCustom(p.slug); }}
                                className="w-6 h-6 flex items-center justify-center rounded text-ink-3 hover:bg-red-50 hover:text-red-600"
                              >
                                <CloseIcon />
                              </button>
                            )}
                          </div>
                        </li>
                      );
                    })
                  )}
                </ul>
                <div className="border-t border-border p-1">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setComboOpen(false);
                      setCustomFormOpen((v) => !v);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-semibold text-teal-700 rounded hover:bg-teal-50"
                  >
                    <PlusIcon />
                    Outro peptídeo (personalizado)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form de peptídeo custom */}
          {customFormOpen && (
            <div className="mt-3 p-3.5 bg-bg border border-dashed border-border-2 rounded-DEFAULT flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2.5">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-2">
                  Nome
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitCustom(); } }}
                    placeholder="Ex.: Novo peptídeo"
                    className="h-9 px-2.5 border-[1.5px] border-border-2 rounded-md text-sm bg-surface outline-none focus:border-teal focus:ring-[3px] focus:ring-teal-50"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-2">
                  Dose típica
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      value={customDose}
                      onChange={(e) => setCustomDose(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitCustom(); } }}
                      placeholder="0"
                      className="flex-1 h-9 px-2.5 border-[1.5px] border-border-2 rounded-md text-sm bg-surface outline-none focus:border-teal focus:ring-[3px] focus:ring-teal-50 min-w-0"
                    />
                    <select
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value as DoseUnit)}
                      className="h-9 px-2 border-[1.5px] border-border-2 rounded-md text-sm bg-surface outline-none focus:border-teal"
                    >
                      <option value="mg">mg</option>
                      <option value="mcg">mcg</option>
                      <option value="UI">UI</option>
                    </select>
                  </div>
                </label>
              </div>
              <button type="button" onClick={submitCustom} className="btn-teal h-9 text-sm self-start">
                Usar este peptídeo
              </button>
            </div>
          )}

          {/* Pill com peptídeo selecionado */}
          {peptide && (
            <div className="mt-3 flex items-center justify-between gap-2.5 px-3.5 py-2.5 bg-teal-50 border-[1.5px] border-teal-100 rounded-DEFAULT">
              <div className="flex flex-col gap-0.5">
                <strong className="text-sm text-teal-700">{peptide.name}</strong>
                <span className="text-xs text-ink-2">
                  Dose típica: {peptide.typicalDose} {peptide.doseUnit} · {peptide.frequency}
                </span>
              </div>
              <button
                type="button"
                onClick={clearPeptide}
                className="w-7 h-7 flex items-center justify-center rounded-md bg-teal-700/10 text-teal-700 hover:bg-teal-700/20 flex-shrink-0"
                aria-label="Remover peptídeo"
              >
                <CloseIcon />
              </button>
            </div>
          )}
        </section>

        {/* Parâmetros */}
        <section className="card p-6">
          <SectionTitle num={2} label="Quanto tem no frasco e qual a dose?" />

          <div className="flex flex-col gap-4">
            <Field
              label="Quantidade no frasco"
              tip="Quantidade total de peptídeo no frasco, indicada pelo fabricante (valor COA)."
            >
              <InputWithUnit
                value={mg}
                onChange={setMg}
                placeholder="5"
                unit="mg"
              />
              <Chips
                options={Array.from(
                  new Set([...(peptide?.commonAmounts ?? []), ...STANDARD_VIAL_SIZES])
                )
                  .filter((a) => a >= 5)
                  .sort((a, b) => a - b)
                  .map((a) => ({
                    label: `${a} mg`,
                    value: a,
                    highlight: peptide?.commonAmounts.includes(a),
                  }))}
                onPick={(v) => setMg(v)}
              />
            </Field>

            <ModeTabs mode={mode} onChange={setMode} />

            {mode === 'volume' ? (
              <Field
                label="Água bacteriostática"
                tip="Volume de água bacteriostática a adicionar ao frasco. Mais água = menor concentração = mais unidades por dose."
              >
                <InputWithUnit
                  value={waterMl}
                  onChange={setWaterMl}
                  placeholder="2"
                  unit="ml"
                />
                <Chips
                  options={[
                    { label: '1 ml', value: 1 },
                    { label: '2 ml', value: 2 },
                    { label: '3 ml', value: 3 },
                    { label: '5 ml', value: 5 },
                  ]}
                  onPick={(v) => setWaterMl(v)}
                />
              </Field>
            ) : (
              <Field
                label="Unidades por injeção"
                tip="Quantas unidades na seringa você quer puxar para cada dose. A calculadora ajusta a quantidade de água."
              >
                <InputWithUnit
                  value={units}
                  onChange={setUnits}
                  placeholder="20"
                  unit="U"
                  step={1}
                />
                <Chips
                  options={[
                    { label: '10 U', value: 10 },
                    { label: '20 U', value: 20 },
                    { label: '30 U', value: 30 },
                    { label: '50 U', value: 50 },
                  ]}
                  onPick={(v) => setUnits(v)}
                />
              </Field>
            )}

            <Field
              label="Dose por injeção"
              tip="Quantidade de peptídeo que você quer aplicar em cada dose."
            >
              <InputWithUnit
                value={dose}
                onChange={setDose}
                placeholder="—"
                unit={peptide?.doseUnit || 'mg'}
              />
            </Field>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-ink-2">Seringa</span>
              <div role="radiogroup" className="grid grid-cols-3 gap-2" aria-label="Tamanho da seringa">
                {[30, 50, 100].map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={syringe === s}
                    onClick={() => setSyringe(s as SyringeSize)}
                    className={`flex flex-col items-center gap-0.5 py-2.5 border-[1.5px] rounded-DEFAULT font-sans cursor-pointer transition-all ${
                      syringe === s
                        ? 'border-teal bg-teal-50 ring-1 ring-teal'
                        : 'border-border-2 bg-surface hover:border-teal'
                    }`}
                  >
                    <strong className={`text-[15px] ${syringe === s ? 'text-teal-700' : 'text-ink'}`}>{s} U</strong>
                    <small className="text-[11px] text-ink-3">{s / 100} ml</small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Resultado ── */}
      <div>
        <div className="lg:sticky lg:top-20">
          {!result ? (
            <div className="bg-surface border-[1.5px] border-dashed border-border-2 rounded-xl p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M8 2h8M9 2v3.5M13 2v3.5M8 5.5h6l2 4v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8z" />
                  <path d="M6 11h10" />
                </svg>
              </div>
              <p className="font-semibold text-ink text-base">Como funciona</p>
              <ol className="mt-3 text-sm text-ink-2 text-left max-w-xs mx-auto space-y-1.5 list-decimal list-inside">
                <li>Escolha o peptídeo (ou adicione um personalizado)</li>
                <li>Informe os mg do frasco e a dose desejada</li>
                <li>Adicione a água — veja quantas unidades puxar</li>
              </ol>
              <button
                type="button"
                onClick={loadExample}
                className="mt-5 btn-teal text-sm"
              >
                <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 3v14l10-7z" fill="currentColor" />
                </svg>
                Carregar exemplo
              </button>
              <p className="mt-3 text-[11px] text-ink-3">
                Preenche BPC-157 5 mg em 2 ml de água para você ver funcionando.
              </p>
            </div>
          ) : (
            <div id="calc-result" className="bg-surface border border-border rounded-xl shadow-lg overflow-hidden animate-slide-up">
              <div className="flex items-center justify-between gap-2.5 px-5 pt-5">
                <div className="text-sm font-bold text-ink-2 truncate">{peptide?.name}</div>
                <div className="flex items-center gap-1.5 flex-shrink-0 no-print">
                  <button
                    type="button"
                    onClick={shareUrl}
                    title="Compartilhar link do cálculo"
                    aria-label="Compartilhar link"
                    className="w-9 h-9 rounded-md border border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700 hover:bg-teal-50 flex items-center justify-center"
                  >
                    <ShareIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => typeof window !== 'undefined' && window.print()}
                    title="Imprimir / Salvar como PDF"
                    aria-label="Imprimir resultado"
                    className="w-9 h-9 rounded-md border border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700 hover:bg-teal-50 flex items-center justify-center"
                  >
                    <PrintIcon />
                  </button>
                  <button
                    type="button"
                    onClick={copyResult}
                    title="Copiar resultado"
                    aria-label="Copiar resultado"
                    className="w-9 h-9 rounded-md border border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700 hover:bg-teal-50 flex items-center justify-center"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>

              {/* Hero */}
              <div className="px-5 pt-5 text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1.5">Puxe até</div>
                <div className="flex items-baseline justify-center gap-2 flex-wrap">
                  <span className="text-[56px] sm:text-[72px] font-extrabold tracking-tight text-teal leading-none tabular-nums">
                    {fmt(result.unitsPerDose, 1)}
                  </span>
                  <span className="text-[18px] sm:text-[22px] font-semibold text-ink-3 pb-1.5">unidades</span>
                </div>
                <div className="text-xs text-ink-3 mt-1.5 min-h-[20px]">
                  em seringa de {syringe} U · equivale a <span className="tabular-nums font-semibold">{fmt(result.unitsPerDose / 100, 2)} ml</span>
                </div>
              </div>

              {/* Seringa */}
              <div className="px-4 pt-2 pb-4">
                <Syringe units={result.unitsPerDose} maxUnits={syringe} />
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 border-t border-border">
                <Metric label="Concentração" value={fmtConcentration(result.concentration)} unit="mg/ml" />
                <Metric label="Doses por frasco" value={fmt(result.dosesPerVial, 1)} className="border-l border-border" />
                {mode === 'units' && (
                  <Metric
                    label="Água a adicionar"
                    value={fmt(result.waterMl, 2)}
                    unit="ml"
                    className="col-span-2 bg-bg border-t border-border"
                  />
                )}
              </div>

              {/* Duração do frasco */}
              <VialDuration
                dosesPerVial={result.dosesPerVial}
                peptideName={peptide?.name}
              />

              {/* Safety scale visual */}
              {peptide && typeof dose === 'number' && dose > 0 && peptide.category !== 'custom' && (
                <DoseSafetyScale
                  currentDose={dose}
                  typicalDose={peptide.typicalDose}
                  unit={peptide.doseUnit}
                />
              )}

              {/* Alertas */}
              {alerts.length > 0 && (
                <div>
                  {alerts.map((a, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2.5 px-4 py-3 text-sm leading-relaxed border-t ${
                        a.kind === 'err'
                          ? 'bg-red-50 border-red-200 text-red-800'
                          : a.kind === 'warn'
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-green-50 border-green-200 text-green-800'
                      }`}
                    >
                      <span>{a.kind === 'success' ? '✅' : '⚠️'}</span>
                      <span>{a.msg}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mini-resultado flutuante (só mobile quando há resultado) */}
      {result && (
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              const el = document.getElementById('calc-result');
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="lg:hidden fixed bottom-4 left-4 right-4 z-30 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-ink text-white shadow-xl animate-slide-up"
          aria-label="Ir para o resultado"
        >
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-teal-100 tabular-nums leading-none">
              {fmt(result.unitsPerDose, 1)}
            </span>
            <span className="text-xs font-semibold text-white/80">U na seringa</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            Ver detalhes
            <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 8l5 5 5-5" />
            </svg>
          </div>
        </button>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-4 py-2.5 rounded-md text-sm font-semibold shadow-lg z-[300]">
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components (locais ao arquivo, não exportados) ───

function SectionTitle({ num, label, hint }: { num: number; label: string; hint?: string }) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-2.5 text-sm font-bold text-ink uppercase tracking-wider">
        <span className="w-[22px] h-[22px] rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {num}
        </span>
        {label}
      </h2>
      {hint && <p className="text-xs text-ink-3 mt-1.5 ml-[30px]">{hint}</p>}
    </div>
  );
}

function Field({
  label,
  tip,
  children,
}: {
  label: string;
  tip?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-2">
        {label}
        {tip && <HelpTip text={tip} />}
      </span>
      {children}
    </label>
  );
}

function HelpTip({ text }: { text: string }) {
  return (
    <span className="relative group inline-flex">
      <button
        type="button"
        className="w-[17px] h-[17px] rounded-full border-[1.5px] border-border-2 bg-surface text-[10px] font-bold text-ink-3 flex items-center justify-center hover:border-teal hover:text-teal-700 hover:bg-teal-50 leading-none"
        aria-label="Ajuda"
      >
        ?
      </button>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-ink text-white text-xs leading-relaxed rounded-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shadow-lg z-10">
        {text}
      </span>
    </span>
  );
}

function InputWithUnit({
  value,
  onChange,
  placeholder,
  unit,
  step = 'any',
}: {
  value: number | '';
  onChange: (n: number | '') => void;
  placeholder: string;
  unit: string;
  step?: number | 'any';
}) {
  return (
    <div className="flex items-center border-[1.5px] border-border-2 rounded-DEFAULT bg-surface h-[52px] overflow-hidden focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal-50 transition-all">
      <input
        type="number"
        min="0"
        step={step}
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? '' : parseFloat(v));
        }}
        placeholder={placeholder}
        className="flex-1 min-w-0 h-full border-none bg-transparent px-4 text-[22px] font-bold text-ink outline-none tabular-nums placeholder:text-[20px] placeholder:font-normal placeholder:text-ink-3"
      />
      <span className="px-4 text-[13px] font-bold text-ink-3 border-l border-border h-full flex items-center flex-shrink-0">
        {unit}
      </span>
    </div>
  );
}

function Chips({
  options,
  onPick,
}: {
  options: { label: string; value: number; highlight?: boolean }[];
  onPick: (v: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onPick(opt.value)}
          className={
            opt.highlight
              ? 'inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border border-teal bg-teal-50 text-teal-700 hover:bg-teal-100 cursor-pointer transition-colors'
              : 'chip'
          }
          title={opt.highlight ? 'Tamanho comum para este peptídeo' : undefined}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ModeTabs({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div>
      <div className="text-xs font-semibold text-ink-2 mb-1.5">O que você já decidiu?</div>
      <div role="tablist" aria-label="Modo de cálculo" className="grid grid-cols-2 gap-1 p-1 bg-bg border border-border rounded-DEFAULT">
        <button
          role="tab"
          type="button"
          aria-selected={mode === 'volume'}
          onClick={() => onChange('volume')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-md font-sans text-[13px] font-semibold transition-all ${
            mode === 'volume'
              ? 'bg-surface text-teal-700 shadow'
              : 'bg-transparent text-ink-2 hover:bg-teal-50 hover:text-teal-700'
          }`}
          title="Você sabe quanta água vai usar. Calcula as unidades."
        >
          <DropIcon />
          A quantidade de água
        </button>
        <button
          role="tab"
          type="button"
          aria-selected={mode === 'units'}
          onClick={() => onChange('units')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-md font-sans text-[13px] font-semibold transition-all ${
            mode === 'units'
              ? 'bg-surface text-teal-700 shadow'
              : 'bg-transparent text-ink-2 hover:bg-teal-50 hover:text-teal-700'
          }`}
          title="Você quer puxar uma quantidade específica na seringa. Calcula a água."
        >
          <RulerIcon />
          As unidades na seringa
        </button>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
  className = '',
}: {
  label: string;
  value: string;
  unit?: string;
  className?: string;
}) {
  return (
    <div className={`p-4 flex flex-col gap-1 ${className}`}>
      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-3">{label}</span>
      <span className="text-[22px] font-bold text-ink tabular-nums tracking-tight">
        {value}
        {unit && <small className="text-[13px] font-semibold text-ink-3 ml-1">{unit}</small>}
      </span>
    </div>
  );
}

// ─── Ícones ───
function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx={9} cy={9} r={6} /><path d="m16 16-3.5-3.5" />
    </svg>
  );
}
function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 8 5 5 5-5" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx={10} cy={10} r={8} /><path d="M10 6v8M6 10h8" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x={7} y={7} width={10} height={10} rx={2} />
      <path d="M4 13H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function DropIcon() {
  return (
    <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 2.5s-5 5-5 9a5 5 0 0 0 10 0c0-4-5-9-5-9z" />
    </svg>
  );
}
function RulerIcon() {
  return (
    <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h14v8H3z" />
      <path d="M6 6v2M9 6v3M12 6v2M15 6v3" />
    </svg>
  );
}
function PrintIcon() {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 8V3h10v5" />
      <rect x={3} y={8} width={14} height={8} rx={1.5} />
      <rect x={6} y={12} width={8} height={5} />
    </svg>
  );
}
function VialDuration({ dosesPerVial, peptideName }: { dosesPerVial: number; peptideName?: string }) {
  const [freq, setFreq] = useState<'daily' | '2x-day' | '3x-week' | 'weekly'>('weekly');

  const durationDays = useMemo(() => {
    if (!(dosesPerVial > 0)) return 0;
    switch (freq) {
      case 'daily':     return dosesPerVial;
      case '2x-day':    return dosesPerVial / 2;
      case '3x-week':   return (dosesPerVial / 3) * 7;
      case 'weekly':    return dosesPerVial * 7;
    }
  }, [dosesPerVial, freq]);

  const nextBuyDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + Math.floor(durationDays));
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  }, [durationDays]);

  const days = Math.floor(durationDays);
  const weeks = Math.floor(days / 7);
  const rem = days - weeks * 7;

  return (
    <div className="border-t border-border bg-bg px-5 py-4">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-3">
          Duração do frasco
        </span>
        <div className="flex gap-0.5 p-0.5 bg-surface border border-border rounded-DEFAULT">
          {[
            { id: 'daily',   label: '1×/dia' },
            { id: '2x-day',  label: '2×/dia' },
            { id: '3x-week', label: '3×/sem' },
            { id: 'weekly',  label: '1×/sem' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFreq(f.id as typeof freq)}
              className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                freq === f.id ? 'bg-teal text-white' : 'text-ink-2 hover:bg-teal-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {dosesPerVial > 0 ? (
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-ink tabular-nums leading-none">
            {weeks > 0 ? `${weeks} sem` : ''}
            {weeks > 0 && rem > 0 ? ` + ${rem}d` : ''}
            {weeks === 0 ? `${days} dias` : ''}
          </span>
          <span className="text-xs text-ink-3">
            · próxima compra ~{nextBuyDate}
          </span>
        </div>
      ) : (
        <span className="text-xs text-ink-3">—</span>
      )}
    </div>
  );
}

function DoseSafetyScale({
  currentDose, typicalDose, unit,
}: { currentDose: number; typicalDose: number; unit: string }) {
  // Escala: 0.33× típica → 3× típica (logarithmic feel)
  const minDose = typicalDose * 0.33;
  const maxDose = typicalDose * 3;

  // Posição na barra (0-100%)
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const logRange = Math.log(maxDose) - Math.log(minDose);
  const pos = logRange > 0
    ? (clamp(Math.log(currentDose), Math.log(minDose), Math.log(maxDose)) - Math.log(minDose)) / logRange * 100
    : 50;
  const typicalPos = (Math.log(typicalDose) - Math.log(minDose)) / logRange * 100;

  const ratio = currentDose / typicalDose;
  let status: { label: string; color: string } = { label: 'Dentro da faixa típica', color: 'bg-green-500' };
  if (ratio >= 3) status = { label: 'Acima da faixa usual', color: 'bg-red-500' };
  else if (ratio <= 0.34) status = { label: 'Abaixo da faixa usual', color: 'bg-amber-500' };
  else if (ratio >= 2) status = { label: 'Dose elevada', color: 'bg-amber-500' };
  else if (ratio <= 0.5) status = { label: 'Dose baixa', color: 'bg-amber-500' };

  return (
    <div className="border-t border-border px-5 py-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink-3">Posição da dose</span>
        <span className={`text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full ${status.color}`}>
          {status.label}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-gradient-to-r from-amber-300 via-green-400 to-red-400 overflow-hidden">
        {/* Marcador de dose típica */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-ink"
          style={{ left: `${typicalPos}%` }}
          aria-hidden
        />
        {/* Pointer da dose atual */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-teal border-2 border-white shadow-md transition-all"
          style={{ left: `${pos}%` }}
          aria-hidden
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-ink-3 mt-1.5 tabular-nums">
        <span>{fmt(minDose, 2)} {unit}</span>
        <span className="font-semibold text-ink-2">Típica: {typicalDose} {unit}</span>
        <span>{fmt(maxDose, 2)} {unit}</span>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx={5} cy={10} r={2.2} />
      <circle cx={15} cy={5} r={2.2} />
      <circle cx={15} cy={15} r={2.2} />
      <path d="m7 9 6-3M7 11l6 3" />
    </svg>
  );
}
