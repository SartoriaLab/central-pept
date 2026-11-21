// Foto de perfil do @dosecerta_br. Uso (Node 20): npx tsx scripts/social/avatar.tsx
// Gera em social/out/perfil/ as opções em 1080×1080 (o que o Instagram pede) e uma folha
// com todas recortadas em círculo, grandes e no tamanho do feed (~64 px), para comparar.
// 2026-11-16: "1-gota" (gota brilhante sobre azul-marinho).
// 2026-11-21: fora da gota, no visual "papel" (papel.tsx): nome em duas linhas na Anton (título dos
// posts) e monograma "dc.", em variações de cor. Escolhida: "mono-g" (dc. branco, ponto amarelo, fundo azul céu #3b82c4).
import fs from 'node:fs/promises';
import path from 'node:path';
import { renderPng } from './render';
import { P } from './papel';

const SIZE = 1080;

type Option = { id: string; name: string; el: (s: number) => React.ReactElement };

const box = (s: number, bg: string): React.CSSProperties => ({
  width: s, height: s, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center', background: bg, overflow: 'hidden',
});

/** Grade fina do caderno, como no fundo dos posts. */
function Grid({ s, color }: { s: number; color: string }) {
  const step = Math.round(s / 14);
  return (
    <div
      style={{
        position: 'absolute', left: 0, top: 0, width: s, height: s, display: 'flex',
        backgroundImage: `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px)`,
        backgroundSize: `${step}px ${step}px`,
      }}
    />
  );
}

type NomeProps = { bg: string; top: string; bottom: string; grid?: string; dot?: string };

/** Nome em duas linhas na Anton, como os títulos dos posts. */
function Nome(s: number, { bg, top, bottom, grid, dot }: NomeProps) {
  return (
    <div style={box(s, bg)}>
      {grid ? <Grid s={s} color={grid} /> : null}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Anton', lineHeight: 0.92, marginTop: 0.02 * s }}>
        <div style={{ display: 'flex', fontSize: 0.27 * s, color: top, letterSpacing: 0.004 * s }}>DOSE</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: 0.27 * s, color: bottom, letterSpacing: 0.004 * s }}>
          CERTA
          {dot ? <div style={{ display: 'flex', width: 0.055 * s, height: 0.055 * s, background: dot, marginLeft: 0.012 * s, marginBottom: 0.035 * s }} /> : null}
        </div>
      </div>
    </div>
  );
}

type MonoProps = { bg: string; fg: string; dot: string; grid?: string; anton?: boolean };

/** Monograma "dc." (Inter) ou "DC." (Anton). */
function Mono(s: number, { bg, fg, dot, grid, anton }: MonoProps) {
  return (
    <div style={box(s, bg)}>
      {grid ? <Grid s={s} color={grid} /> : null}
      <div
        style={{
          display: 'flex', alignItems: 'flex-end', color: fg, lineHeight: 1,
          ...(anton
            ? { fontFamily: 'Anton', fontSize: 0.48 * s, letterSpacing: 0.005 * s, marginTop: 0.01 * s }
            : { fontFamily: 'Inter', fontWeight: 800, fontSize: 0.46 * s, letterSpacing: -0.035 * s, marginTop: -0.04 * s }),
        }}
      >
        {anton ? 'DC' : 'dc'}
        <div
          style={{
            display: 'flex', width: 0.1 * s, height: 0.1 * s, borderRadius: anton ? 0 : s, background: dot, marginLeft: 0.02 * s,
            marginBottom: anton ? 0.07 * s : 0.075 * s,
          }}
        />
      </div>
    </div>
  );
}

const GRID = 'rgba(29,35,64,0.07)';

const OPTIONS: Option[] = [
  { id: 'nome-a', name: 'Nome · papel', el: (s) => Nome(s, { bg: P.paper, top: P.ink, bottom: P.red, grid: GRID }) },
  { id: 'nome-b', name: 'Nome · tinta', el: (s) => Nome(s, { bg: P.ink, top: P.white, bottom: P.yellow }) },
  { id: 'nome-c', name: 'Nome · vermelho', el: (s) => Nome(s, { bg: P.red, top: P.white, bottom: P.ink }) },
  { id: 'nome-d', name: 'Nome · papel + ponto', el: (s) => Nome(s, { bg: P.paper, top: P.ink, bottom: P.ink, grid: GRID, dot: P.red }) },
  { id: 'mono-a', name: 'dc. · azul', el: (s) => Mono(s, { bg: P.blue, fg: P.white, dot: P.yellow }) },
  { id: 'mono-b', name: 'dc. · tinta', el: (s) => Mono(s, { bg: P.ink, fg: P.white, dot: P.yellow }) },
  { id: 'mono-c', name: 'dc. · papel', el: (s) => Mono(s, { bg: P.paper, fg: P.ink, dot: P.red, grid: GRID }) },
  { id: 'mono-d', name: 'DC. · Anton', el: (s) => Mono(s, { bg: P.ink, fg: P.white, dot: P.red, anton: true }) },
  { id: 'mono-e', name: 'dc. · azul médio', el: (s) => Mono(s, { bg: '#2a3a7c', fg: P.white, dot: P.yellow }) },
  { id: 'mono-f', name: 'dc. · azul royal', el: (s) => Mono(s, { bg: '#2f4fb0', fg: P.white, dot: P.yellow }) },
  { id: 'mono-g', name: 'dc. · azul céu', el: (s) => Mono(s, { bg: '#3b82c4', fg: P.white, dot: P.yellow }) },
  { id: 'mono-h', name: 'dc. · azul claro', el: (s) => Mono(s, { bg: '#5fa8e8', fg: P.white, dot: P.yellow }) },
];

const COLS = 4;

function Sheet() {
  const rows = Array.from({ length: Math.ceil(OPTIONS.length / COLS) }, (_, r) => OPTIONS.slice(r * COLS, r * COLS + COLS));
  return (
    <div style={{ width: 1100, height: 400 * rows.length, display: 'flex', flexDirection: 'column', background: '#ffffff', fontFamily: 'Inter' }}>
      {rows.map((row, r) => (
        <div key={r} style={{ display: 'flex', height: 400, justifyContent: 'space-around', alignItems: 'center' }}>
          {row.map((o) => (
            <div key={o.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 240 }}>
              <div style={{ display: 'flex', width: 180, height: 180, borderRadius: 180, overflow: 'hidden' }}>{o.el(180)}</div>
              <div style={{ display: 'flex', marginTop: 20, width: 64, height: 64, borderRadius: 64, overflow: 'hidden' }}>{o.el(64)}</div>
              <div style={{ display: 'flex', marginTop: 16, fontSize: 18, fontWeight: 600, color: '#0f172a' }}>{o.name}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

async function main() {
  const out = path.join(process.cwd(), 'social', 'out', 'perfil');
  await fs.mkdir(out, { recursive: true });
  for (const o of OPTIONS) {
    await fs.writeFile(path.join(out, `perfil-${o.id}.png`), await renderPng(o.el(SIZE), { width: SIZE, height: SIZE }));
  }
  await fs.writeFile(path.join(out, 'comparar.png'), await renderPng(<Sheet />, { width: 1100, height: 400 * Math.ceil(OPTIONS.length / COLS) }));
  console.log(`Gerado em ${out}`);
}

main();
