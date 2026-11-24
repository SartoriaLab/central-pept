// Visual "papel" do @dosecerta_br (carrossel e Reels), no estilo de explicador: fundo creme
// quadriculado, título condensado em duas linhas (escura + destaque), um desenho plano no meio
// (frasco, barras, pontos, linha do tempo...), fonte do dado no rodapé e, no Reels, a legenda
// numa pílula escura com a palavra falada em destaque. O logo (gota com check) assina o topo; sem mascote.
// JSX para o satori: todo nó com mais de um filho precisa de display flex; texto dentro de <svg>
// não é desenhado (rótulos vão em <div> por cima). A fonte Anton é a dos títulos; Inter, o resto.
// No Reels, `clock` (motion.ts) anima cada quadro; sem ele, o quadro sai no estado final (carrossel, capa).
import { INSTAGRAM_HANDLE, SITE_HOST } from '@/lib/site';
import { DM_KEYWORD } from '@/lib/instagram-dm';
import DropCheck from '@/components/brand/DropCheck';
import { illustrationSrc } from './illustrations';
import { splitTitle } from './scenes';
import { clamp, countUp, easeBack, easeInOut, easeOut, exitAt, idle, pacing, partStart, prog, titleLine, VISUAL_START, wobble, type Clock } from './motion';
import type { Cta, Platform, Scene, SceneVisual, VialSpec } from './types';

export type Size = { width: number; height: number };
export const CAROUSEL: Size = { width: 1080, height: 1350 };
export const REEL: Size = { width: 1080, height: 1920 };

const PAPEL = {
  paper: '#efe9dc',
  grid: 'rgba(29,35,64,0.07)',
  ink: '#1d2340',
  ink2: '#4a5072',
  ink3: '#8a8ea6',
  red: '#c9351f',
  blue: '#3949c7',
  blueSoft: '#9aa8ff',
  yellow: '#e9b62e',
  cap: '#b5532e',
  white: '#ffffff',
  track: '#dcd6c8',
  green: '#22c55e',
};
type Palette = typeof PAPEL;

/**
 * Temas do fundo e das cores (desde 23/11/2026): o mesmo molde todo dia parece canal feito em
 * série, que o YouTube trata como "conteúdo inautêntico". Todos claros, com texto escuro (o
 * desenho e a legenda continuam legíveis); muda o fundo, o padrão e o par de destaques.
 * `pattern`: grade (caderno quadriculado), pauta (linhas + margem), pontos ou nenhum.
 */
export const THEMES = {
  papel: { palette: PAPEL, pattern: 'grade', layout: 'topo' },
  pautado: {
    palette: { ...PAPEL, paper: '#fbf3d0', grid: 'rgba(36,86,184,0.16)', red: '#d23a2a', blue: '#2456b8', track: '#eadfb4', cap: '#d23a2a' },
    pattern: 'pauta',
    layout: 'topo',
  },
  quadro: {
    palette: { ...PAPEL, paper: '#f6f7f9', grid: 'rgba(29,35,64,0.16)', ink: '#1b2430', ink2: '#46505e', red: '#e8590c', blue: '#0f8a5f', blueSoft: '#7ee2b8', track: '#e1e5ea', cap: '#e8590c' },
    pattern: 'pontos',
    layout: 'base',
  },
  kraft: {
    palette: { ...PAPEL, paper: '#dcc7a1', grid: 'rgba(80,50,20,0.08)', ink: '#2a1d12', ink2: '#5a4430', ink3: '#8c735a', red: '#b3261e', blue: '#1f3b73', track: '#c9b28a', white: '#fffaf0', cap: '#b3261e' },
    pattern: 'nenhum',
    layout: 'base',
  },
} satisfies Record<string, { palette: Palette; pattern: 'grade' | 'pauta' | 'pontos' | 'nenhum'; layout: 'topo' | 'base' }>;
export type ThemeId = keyof typeof THEMES;
export const THEME_IDS = Object.keys(THEMES) as ThemeId[];

/** Cores do tema atual. Mutável de propósito: `setTheme` troca antes de cada render (sequencial). */
export const P: Palette = { ...PAPEL };
let pattern: (typeof THEMES)[ThemeId]['pattern'] = 'grade';
/** Cena do Reels: título em cima e desenho embaixo ("topo") ou desenho em cima e título centralizado embaixo ("base"). */
let layout: (typeof THEMES)[ThemeId]['layout'] = 'topo';

export function setTheme(id: ThemeId): void {
  Object.assign(P, THEMES[id].palette);
  pattern = THEMES[id].pattern;
  layout = THEMES[id].layout;
}

/** Tema do post: fixo por tema (prévia e publicação, Reels e Shorts saem iguais). Puro. */
export function themeFor(topicId: string): ThemeId {
  let h = 0;
  for (const ch of topicId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return THEME_IDS[h % THEME_IDS.length];
}

export const toneColor = (tone: Scene['tone']) => (tone === 'vermelho' ? P.red : P.blue);

const TITLE = 'Anton';

/**
 * Impede quebra de linha entre número e unidade ("2,5 | mg") e dentro de "mg/ml": espaço vira
 * espaço inseparável e a barra ganha um word joiner (U+2060), que o satori não usa para quebrar.
 */
export function nobreak(text: string): string {
  return text
    .replace(/(\d)\s+(?=(?:mg|mcg|ml|ui|u|unidades?|semanas?|dias?|horas?|kg|%)(?![\p{L}\d]))/giu, '$1 ')
    .replace(/([\p{L}\d])\/(?=[\p{L}\d])/gu, '$1/⁠');
}

/** Tamanho do título pelo comprimento da linha mais longa (Anton é estreita, mas tem limite). */
export function titleSize(a: string, b: string, max: number): number {
  const n = Math.max(a.length, b.length);
  // Anton em caixa alta ocupa ~0,44 em por letra; 0,47 dá folga para acento e M/W. Sem esse teto, a
  // capa (max 150) quebrava a linha de cima, que invadia a de baixo (altura da linha é fixa).
  const fit = Math.floor(TITLE_WIDTH / (0.47 * Math.max(n, 1)));
  const byLength = n <= 14 ? max : n <= 18 ? max * 0.84 : n <= 24 ? max * 0.7 : n <= 32 ? max * 0.58 : max * 0.48;
  return Math.min(Math.round(byLength), fit);
}
/** Largura útil do título: 1080 menos as margens de 70 (carrossel e Reels). */
const TITLE_WIDTH = 940;

/** Fundo creme com a grade fina do caderno (linhas soltas: o gradiente repetido pesa no resvg). */
const GRID = 54;
function Paper({ size, children }: { size: Size; children: React.ReactNode }) {
  const line = (key: string, style: React.CSSProperties) => <div key={key} style={{ position: 'absolute', display: 'flex', background: P.grid, ...style }} />;
  const cols = Math.ceil(size.width / GRID);
  const rows = Math.ceil(size.height / GRID);
  const PAUTA = 64;
  const DOT = 72;
  return (
    <div style={{ width: size.width, height: size.height, display: 'flex', position: 'relative', background: P.paper, color: P.ink, fontFamily: 'Inter' }}>
      {pattern === 'grade' && Array.from({ length: cols }, (_, i) => line(`v${i}`, { left: i * GRID, top: 0, width: 2, height: size.height }))}
      {pattern === 'grade' && Array.from({ length: rows }, (_, i) => line(`h${i}`, { left: 0, top: i * GRID, width: size.width, height: 2 }))}
      {pattern === 'pauta' && Array.from({ length: Math.ceil(size.height / PAUTA) }, (_, i) => line(`p${i}`, { left: 0, top: 40 + i * PAUTA, width: size.width, height: 2 }))}
      {pattern === 'pauta' && <div style={{ position: 'absolute', display: 'flex', left: 44, top: 0, width: 3, height: size.height, background: 'rgba(210,58,42,0.35)' }} />}
      {pattern === 'pontos' &&
        Array.from({ length: Math.ceil(size.height / DOT) }, (_, r) =>
          Array.from({ length: Math.ceil(size.width / DOT) }, (_, c) => line(`d${r}-${c}`, { left: 24 + c * DOT, top: 24 + r * DOT, width: 6, height: 6, borderRadius: 6 })),
        )}
      {children}
    </div>
  );
}

/**
 * Celular com a página real do site rolando devagar (print do navegador headless, sites.ts):
 * imagem de verdade no meio dos desenhos. `ratio` = altura ÷ largura do print.
 */
export function PhoneScreen({ src, ratio, h, clock = STILL }: { src: string; ratio: number; h: number; clock?: Clock }) {
  const bezel = 18;
  const w = Math.round(h * 0.5);
  const sw = w - 2 * bezel;
  const sh = h - 2 * bezel;
  const imgH = Math.round(sw * ratio);
  const enter = easeOut(prog(clock.t, 0.25, 0.5));
  // Rola até 55% do que sobra, devagar e com pausa no começo (como alguém lendo).
  const scroll = Math.max(0, imgH - sh) * 0.55 * easeInOut(prog(clock.t, 1.2, Math.max(1.5, clock.dur - 2)));
  return (
    <div style={{ display: 'flex', width: w, height: h, padding: bezel, borderRadius: 64, background: P.ink, opacity: enter, transform: `translate(0px, ${px(60 * (1 - enter))})` }}>
      <div style={{ display: 'flex', width: sw, height: sh, borderRadius: 48, overflow: 'hidden', background: '#ffffff', position: 'relative' }}>
        <img src={src} width={sw} height={imgH} style={{ position: 'absolute', left: 0, top: -Math.round(scroll) }} />
      </div>
    </div>
  );
}

/** Estado final de tudo (carrossel e capa). */
const STILL: Clock = { t: 1e4, dur: 2e4 };

const px = (n: number) => `${n.toFixed(1)}px`;
/** Entrada com mola: escala `from`→1 e opacidade, a partir de `start`. */
function popStyle(t: number, start: number, len = 0.45, from = 0.6): React.CSSProperties {
  const p = prog(t, start, len);
  if (p >= 1) return {};
  return { opacity: clamp(p * 2.5), transform: `scale(${(from + (1 - from) * easeBack(p)).toFixed(4)})` };
}

/** Selo escuro do topo com a bolinha verde: a seção do vídeo. */
function Chip({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start', padding: '8px 22px 8px 10px', borderRadius: 999, background: P.ink, color: P.white }}>
      <div style={{ display: 'flex', width: 26, height: 26, borderRadius: 26, background: P.green, border: `4px solid ${P.white}` }} />
      <div style={{ display: 'flex', marginLeft: 12, fontSize: 24, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase' }}>{text}</div>
    </div>
  );
}

/** Marca: o logo (gota com check) + DOSE CERTA + selo. */
function Brand({ small = false }: { small?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <DropCheck size={small ? 34 : 40} />
      <div style={{ display: 'flex', marginLeft: 10, fontFamily: TITLE, fontSize: small ? 40 : 46, letterSpacing: 4, color: P.ink }}>DOSE CERTA</div>
      <div style={{ display: 'flex', marginLeft: 16, padding: '6px 14px', borderRadius: 999, background: P.ink, color: P.white, fontSize: 17, fontWeight: 800, letterSpacing: 2 }}>
        SEM ACHISMO
      </div>
    </div>
  );
}

function Kicker({ text, clock = STILL, center = false }: { text: string; clock?: Clock; center?: boolean }) {
  if (!text) return <div style={{ display: 'flex', height: 36 }} />;
  const p = easeOut(prog(clock.t, 0, 0.35));
  return (
    <div style={{ display: 'flex', alignItems: 'center', alignSelf: center ? 'center' : 'flex-start', height: 36, fontSize: 28, color: P.ink2, opacity: p, transform: `translate(${px(-24 * (1 - p))}, 0px)` }}>
      <div style={{ display: 'flex', width: 34, height: 4, background: P.ink2, marginRight: 14 }} />
      {text}
    </div>
  );
}

/** Título de duas linhas; com `clock`, cada linha sobe de trás de uma máscara. */
function Title({ a, b, color, max, clock = STILL, center = false }: { a: string; b: string; color: string; max: number; clock?: Clock; center?: boolean }) {
  const fs = titleSize(a.toUpperCase(), b.toUpperCase(), max);
  const lines = [{ text: nobreak(a).toUpperCase(), color: P.ink }, ...(b ? [{ text: nobreak(b).toUpperCase(), color }] : [])];
  const lh = Math.round(fs * 1.08);
  const pad = Math.round(fs * 0.2); // folga para acento, que passa da altura da linha
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: center ? 'center' : 'flex-start', marginTop: 10 }}>
      {lines.map((l, i) => {
        const { y, opacity } = titleLine(clock, i);
        const moving = y !== 0 || opacity < 1;
        return (
          <div key={i} style={{ display: 'flex', height: lh + pad, marginTop: -pad, paddingTop: pad, overflow: moving ? 'hidden' : 'visible' }}>
            <div style={{ display: 'flex', fontFamily: TITLE, fontSize: fs, lineHeight: 1.08, color: l.color, opacity, transform: `translate(0px, ${px(y * lh * 1.1)})` }}>{l.text}</div>
          </div>
        );
      })}
    </div>
  );
}

// ——— Adereços ———————————————————————————————————————————————————————————————

const STROKE = 6;

/** Frasco plano com tampa, rótulo e líquido. `w` = largura; altura = 1,5 × w. */
export function Vial({ w, label, liquid = 'claro', tag, stamp, tagRot = -8, stampP = 1 }: {
  w: number; label: string; liquid?: VialSpec['liquid']; tag?: string; stamp?: string; tagRot?: number; stampP?: number;
}) {
  const h = Math.round(w * 1.5);
  const fill = liquid === 'amarelo' ? P.yellow : liquid === 'po' ? '#f4efe4' : '#eef2ff';
  const level = liquid === 'po' ? 0.18 : 0.5;
  // Coordenadas num quadro de 100 × 150.
  return (
    <div style={{ display: 'flex', position: 'relative', width: w, height: h }}>
      <svg width={w} height={h} viewBox="0 0 100 150">
        <rect x="26" y="4" width="48" height="24" rx="5" fill={P.cap} stroke={P.ink} strokeWidth={STROKE / 2} />
        <rect x="32" y="26" width="36" height="12" fill={P.white} stroke={P.ink} strokeWidth={STROKE / 2} />
        <rect x="10" y="36" width="80" height="110" rx="14" fill={P.white} stroke={P.ink} strokeWidth={STROKE / 2} />
        <rect x="13" y={36 + 110 * (1 - level)} width="74" height={110 * level - 3} rx="11" fill={fill} />
        {liquid === 'po' && <rect x="13" y={36 + 110 * (1 - level)} width="74" height={6} fill="#e2dccd" />}
        <rect x="10" y="62" width="80" height="34" fill={P.white} stroke={P.ink} strokeWidth={STROKE / 2} />
        <rect x="10" y="62" width="80" height="6" fill={P.red} />
      </svg>
      <div
        style={{
          position: 'absolute', left: 0, top: Math.round(h * 0.47), width: w, height: Math.round(h * 0.17),
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TITLE,
          fontSize: Math.round(w * (label.length > 10 ? 0.1 : 0.13)), color: P.ink,
        }}
      >
        {label.toUpperCase()}
      </div>
      {tag && (
        <div
          style={{
            position: 'absolute', left: Math.round(w * 0.62), top: Math.round(h * 0.14), display: 'flex', padding: '6px 16px',
            background: P.white, border: `4px solid ${P.ink}`, borderRadius: 8, fontFamily: TITLE, fontSize: Math.round(w * 0.1),
            transform: `rotate(${tagRot.toFixed(2)}deg)`, color: P.ink,
          }}
        >
          {tag.toUpperCase()}
        </div>
      )}
      {stamp && stampP > 0 && (
        <div style={{ position: 'absolute', left: -Math.round(w * 0.45), top: Math.round(h * 0.6), display: 'flex' }}>
          <Stamp text={stamp} size={Math.round(w * 0.2)} slam={stampP} />
        </div>
      )}
    </div>
  );
}

/** Carimbo vermelho torto; `slam` (0→1) faz ele bater de cima, grande e girado. */
function Stamp({ text, note, size = 64, slam = 1 }: { text: string; note?: string; size?: number; slam?: number }) {
  const e = easeOut(slam);
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: `${Math.round(size * 0.3)}px ${Math.round(size * 0.6)}px`,
        border: `${Math.max(5, Math.round(size / 9))}px solid ${P.red}`, borderRadius: 14, background: 'rgba(255,240,236,0.92)',
        transform: `scale(${(1 + 0.7 * (1 - e)).toFixed(4)}) rotate(${(-7 - 12 * (1 - e)).toFixed(2)}deg)`, opacity: clamp(slam * 4), color: P.red,
      }}
    >
      <div style={{ display: 'flex', fontFamily: TITLE, fontSize: size, lineHeight: 1.05 }}>{text.toUpperCase()}</div>
      {note && <div style={{ display: 'flex', marginTop: 6, fontSize: Math.round(size * 0.42), fontWeight: 600 }}>{note}</div>}
    </div>
  );
}

function Note({ text, w, p = 1 }: { text?: string; w: number; p?: number }) {
  if (!text) return null;
  const e = easeOut(p);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: w, marginTop: 26, fontSize: 34, fontWeight: 600, color: P.ink2, textAlign: 'center', opacity: e, transform: `translate(0px, ${px(18 * (1 - e))})` }}>
      {nobreak(text)}
    </div>
  );
}

/** Bolinha de marcação: certo (azul), não (vermelho) ou dúvida (amarelo). */
function Mark({ mark, size, p = 1 }: { mark: 'ok' | 'nao' | 'duvida'; size: number; p?: number }) {
  const bg = mark === 'ok' ? P.blue : mark === 'nao' ? P.red : P.yellow;
  return (
    <div style={{ display: 'flex', flexShrink: 0, width: size, height: size, borderRadius: size, background: p >= 1 ? bg : P.track, alignItems: 'center', justifyContent: 'center', transform: p >= 1 ? undefined : `scale(${(0.4 + 0.6 * easeBack(p)).toFixed(4)})` }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 20 20">
        {mark === 'ok' && <path d="M4 10.5 L8.5 15 L16 6" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        {mark === 'nao' && <path d="M5 5 L15 15 M15 5 L5 15" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" />}
        {mark === 'duvida' && (
          <path d="M6.5 7 Q6.5 3.5 10 3.5 Q13.5 3.5 13.5 6.8 Q13.5 9 10.8 10.2 Q10 10.6 10 12.4 M10 16.2 L10 16.4" stroke={P.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
}

/**
 * Desenho da cena. Com `clock` (Reels), as partes entram no ritmo da fala: frasco cai com mola,
 * lista aparece apagada e acende item a item, barras crescem e o número conta. Sem ele, estado final.
 */
export function Visual({ v, w, h, clock = STILL }: { v: SceneVisual; w: number; h: number; clock?: Clock }) {
  const t = clock.t;
  const base = clock.keepIn ? -10 : VISUAL_START;
  const W = pacing(clock.dur);
  const box = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', width: w, height: h };
  switch (v.type) {
    case 'frasco': {
      const p = prog(t, base, 0.6);
      const sway = idle(t).rot;
      const stampAt = clock.keepIn ? -10 : base + W * 0.55;
      return (
        <div style={box}>
          <div style={{ display: 'flex', opacity: clamp(p * 3), transform: `translate(0px, ${px(-110 * (1 - easeBack(p, 1.3)))}) rotate(${sway.toFixed(2)}deg)` }}>
            <Vial
              w={Math.round(Math.min(h / 1.55, w * 0.46))} label={v.label} liquid={v.liquid} tag={v.tag} stamp={v.stamp}
              tagRot={-8 + wobble(t, base + 0.45, 12)} stampP={prog(t, stampAt, 0.28)}
            />
          </div>
        </div>
      );
    }
    case 'frascos': {
      const vw = Math.round(Math.min((h - 120) / 1.5, w * 0.3));
      const [l, sg, r] = [0, 1, 2].map((k) => partStart(clock, k, 3));
      const sway = idle(t).rot;
      const side = (s: VialSpec, start: number, dir: number) => {
        const p = prog(t, start, 0.55);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: Math.round(w * 0.38), opacity: clamp(p * 3), transform: `translate(${px(dir * 80 * (1 - easeOut(p)))}, 0px)` }}>
            <div style={{ display: 'flex', transform: `rotate(${(sway * dir).toFixed(2)}deg)` }}>
              <Vial w={vw} label={s.label} liquid={s.liquid} />
            </div>
            {s.note && <div style={{ display: 'flex', marginTop: 18, fontSize: 30, fontWeight: 700, color: P.ink2, textAlign: 'center' }}>{s.note}</div>}
          </div>
        );
      };
      return (
        <div style={{ ...box, flexDirection: 'row' }}>
          {side(v.left, l, -1)}
          <div style={{ display: 'flex', width: Math.round(w * 0.16), justifyContent: 'center', fontFamily: v.sign === 'vs' ? TITLE : 'Inter', fontWeight: 800, fontSize: v.sign === 'vs' ? 70 : 130, color: P.red, ...popStyle(t, sg, 0.45, 0) }}>
            {v.sign}
          </div>
          {side(v.right, r, 1)}
        </div>
      );
    }
    case 'numero': {
      const p = prog(t, base, 1.0);
      return (
        <div style={box}>
          <div style={{ display: 'flex', fontFamily: TITLE, fontSize: v.value.length > 7 ? 190 : 250, lineHeight: 1, color: P.blue, ...popStyle(t, base, 0.5, 0.7) }}>{countUp(v.value, easeOut(p))}</div>
          <div style={{ display: 'flex', width: Math.round(180 * easeOut(prog(t, base + 0.35, 0.5))), height: 10, marginTop: 24, background: P.ink }} />
          <Note text={v.note} w={w} p={prog(t, base + 0.6, 0.45)} />
        </div>
      );
    }
    case 'barras': {
      const max = Math.max(...v.bars.map((b) => b.value), 1);
      const trackW = w - 40;
      return (
        <div style={box}>
          {v.bars.map((b, i) => {
            const row = easeOut(prog(t, base + i * 0.08, 0.3));
            const g = easeOut(prog(t, partStart(clock, i, v.bars.length) + 0.15, 0.8));
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', width: trackW, marginTop: i ? 44 : 0, opacity: row, transform: `translate(0px, ${px(30 * (1 - row))})` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', fontSize: 32, fontWeight: 700, color: P.ink }}>{b.label}</div>
                  <div style={{ display: 'flex', fontFamily: TITLE, fontSize: 52, color: i === 0 ? P.blue : P.ink2, opacity: clamp(g * 4) }}>{countUp(b.display, g)}</div>
                </div>
                <div style={{ display: 'flex', marginTop: 12, width: trackW, height: 44, borderRadius: 22, background: P.track, border: `4px solid ${P.ink}` }}>
                  <div style={{ display: 'flex', width: Math.max(0, Math.round((trackW - 8) * (b.value / max) * g)), height: 36, borderRadius: 18, background: i === 0 ? P.blue : '#7d829c' }} />
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    case 'pontos': {
      const total = Math.max(1, Math.min(400, Math.round(v.total)));
      const cols = total <= 50 ? 10 : total <= 120 ? 12 : 20;
      const rows = Math.ceil(total / cols);
      const d = Math.min(Math.floor((w - 80) / cols), Math.floor((h - 200) / rows));
      const grid = easeOut(prog(t, base, 0.35));
      const lit = Math.round(Math.min(v.marked, total) * easeInOut(prog(t, base + 0.25, Math.min(1.8, W))));
      return (
        <div style={box}>
          <div style={{ display: 'flex', flexWrap: 'wrap', width: cols * d, padding: 0, opacity: grid, transform: `scale(${(0.92 + 0.08 * grid).toFixed(4)})` }}>
            {Array.from({ length: total }, (_, i) => (
              <div key={i} style={{ display: 'flex', width: d, height: d, alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', width: Math.round(d * 0.72), height: Math.round(d * 0.72), borderRadius: d, background: i < lit ? P.blue : '#cfc8b8' }} />
              </div>
            ))}
          </div>
          <Note text={v.note} w={w} p={prog(t, base + 0.3 + Math.min(1.8, W), 0.45)} />
        </div>
      );
    }
    case 'linha': {
      const n = v.steps.length;
      const seg = Math.floor((w - 60) / n);
      const at = (i: number) => (clock.keepIn ? -10 : base + (n <= 1 ? 0 : (W * i) / (n - 1)));
      const drawn = easeInOut(prog(t, base, W));
      return (
        <div style={box}>
          <div style={{ display: 'flex', position: 'relative', width: seg * n, height: 200 }}>
            <div style={{ position: 'absolute', left: seg / 2, top: 48, width: seg * (n - 1), height: 6, display: 'flex', background: P.track }} />
            <div style={{ position: 'absolute', left: seg / 2, top: 48, width: Math.round(seg * (n - 1) * drawn), height: 6, display: 'flex', background: P.ink }} />
            {v.steps.map((s, i) => {
              const cur = i === v.current;
              const dot = cur ? 66 : 44;
              const p = prog(t, at(i), 0.4);
              const pulse = cur && p >= 1 ? 1 + 0.07 * Math.sin((2 * Math.PI * t) / 1.1) : 1;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: seg, opacity: 0.25 + 0.75 * clamp(p * 2) }}>
                  <div style={{ display: 'flex', height: 100, alignItems: 'center' }}>
                    <div style={{ display: 'flex', width: dot, height: dot, borderRadius: dot, background: cur ? P.blue : P.white, border: `6px solid ${cur ? P.ink : P.blue}`, transform: `scale(${((0.5 + 0.5 * easeBack(p)) * pulse).toFixed(4)})` }} />
                  </div>
                  <div style={{ display: 'flex', marginTop: 4, fontSize: n > 4 ? 24 : 30, fontWeight: cur ? 800 : 600, color: cur ? P.blue : P.ink2, textAlign: 'center' }}>{s}</div>
                </div>
              );
            })}
          </div>
          <Note text={v.note} w={w} p={prog(t, base + W, 0.45)} />
        </div>
      );
    }
    case 'lista': {
      const n = v.items.length;
      return (
        <div style={box}>
          {v.items.map((it, i) => {
            const enter = easeOut(prog(t, base + i * 0.07, 0.35));
            const on = prog(t, partStart(clock, i, n) + 0.1, 0.3);
            const bump = 1 + 0.035 * Math.sin(Math.PI * on);
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', width: w - 40, marginTop: i ? 22 : 0, padding: '22px 28px', borderRadius: 18,
                  background: P.white, border: `4px solid ${on > 0 ? P.ink : P.ink3}`, opacity: enter * (0.3 + 0.7 * easeOut(on)),
                  transform: `translate(${px(-50 * (1 - enter))}, 0px) scale(${bump.toFixed(4)})`,
                }}
              >
                <Mark mark={it.mark} size={58} p={on} />
                <div style={{ display: 'flex', marginLeft: 24, fontSize: n > 3 ? 32 : 36, fontWeight: 700, color: P.ink, lineHeight: 1.2 }}>{nobreak(it.text)}</div>
              </div>
            );
          })}
        </div>
      );
    }
    case 'carimbo': {
      const at = base + 0.1;
      return (
        <div style={box}>
          <div style={{ display: 'flex', transform: `translate(${px(wobble(t, at + 0.28, 9, 38, 9))}, 0px)` }}>
            <Stamp text={v.text} note={v.note} size={v.text.length > 14 ? 74 : 96} slam={prog(t, at, 0.3)} />
          </div>
        </div>
      );
    }
    case 'icone': {
      const s = Math.round(Math.min(h - 140, w * 0.55));
      return (
        <div style={box}>
          <div style={{ display: 'flex', width: s, height: s, borderRadius: 44, background: P.white, border: `6px solid ${P.ink}`, alignItems: 'center', justifyContent: 'center', ...popStyle(t, base, 0.55, 0.4) }}>
            <div style={{ display: 'flex', transform: `rotate(${(idle(t).rot * 2).toFixed(2)}deg)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={illustrationSrc(v.icon)} width={Math.round(s * 0.7)} height={Math.round(s * 0.7)} alt="" />
            </div>
          </div>
          <Note text={v.note} w={w} p={prog(t, base + 0.5, 0.45)} />
        </div>
      );
    }
  }
}

// ——— Reels ———————————————————————————————————————————————————————————————————

/** Posições fixas no quadro do Reels (a interface do Instagram cobre o topo e o rodapé). */
const R = { side: 70, chipY: 130, brandY: 200, kickerY: 320, visualY: 640, visualH: 700, sourceY: 1352, captionY: 1420, baseVisualY: 300, baseVisualH: 640, baseTitleY: 990 };

/** Legenda em pílula escura: as palavras do bloco, a falada em azul-claro; `age` = segundos desde que o bloco entrou (pula de leve). */
export function CaptionPill({ words, active, age = 1 }: { words: string[]; active: number; age?: number }) {
  const p = prog(age, 0, 0.16);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: REEL.width - 2 * R.side, padding: '16px 34px', borderRadius: 26, background: P.ink, opacity: 0.4 + 0.6 * clamp(p * 2), transform: `scale(${(0.9 + 0.1 * easeBack(p)).toFixed(4)})` }}>
      {words.map((w, i) => (
        <div key={i} style={{ display: 'flex', marginLeft: i ? 14 : 0, fontSize: 44, fontWeight: 800, lineHeight: 1.25, color: i === active ? P.blueSoft : P.white }}>
          {w}
        </div>
      ))}
    </div>
  );
}

/** Saída da cena (some subindo) para o título, a linha de cima e a fonte. */
function exitStyle(c: Clock): React.CSSProperties {
  const ex = exitAt(c);
  return ex > 0 ? { opacity: 1 - ex, transform: `translate(0px, ${px(-28 * ex)})` } : {};
}

/**
 * Uma cena do Reels; `caption` = pílula da legenda (ou nada). Com `clock`, o quadro do instante
 * `clock.t`: título entra e sai, desenho entra por partes e flutua; selo e marca ficam parados.
 */
export function ReelScene({ scene, caption, clock }: { scene: Scene; caption?: React.ReactNode; clock?: Clock }) {
  const inner = REEL.width - 2 * R.side;
  const c = clock ?? STILL;
  const float = clock ? idle(c.t).y : 0;
  const visualExit = c.keepOut ? {} : exitStyle(c);
  const src = clock ? easeOut(prog(c.t, 0.55, 0.4)) : 1;
  const base = layout === 'base';
  return (
    <Paper size={REEL}>
      <div style={{ position: 'absolute', left: R.side, top: R.chipY, display: 'flex' }}><Chip text={scene.chip} /></div>
      <div style={{ position: 'absolute', left: 0, top: R.brandY, width: REEL.width, display: 'flex', justifyContent: 'center' }}><Brand /></div>
      <div style={{ position: 'absolute', left: R.side, top: base ? R.baseTitleY : R.kickerY, width: inner, display: 'flex', flexDirection: 'column', ...exitStyle(c) }}>
        <Kicker text={scene.kicker} clock={c} center={base} />
        <Title a={scene.title} b={scene.accent} color={toneColor(scene.tone)} max={base ? 104 : 112} clock={c} center={base} />
      </div>
      <div style={{ position: 'absolute', left: R.side, top: base ? R.baseVisualY : R.visualY, display: 'flex', ...visualExit }}>
        <div style={{ display: 'flex', transform: `translate(0px, ${px(float)})` }}>
          <Visual v={scene.visual} w={inner} h={base ? R.baseVisualH : R.visualH} clock={c} />
        </div>
      </div>
      {scene.source && (
        <div style={{ position: 'absolute', left: R.side, top: R.sourceY, width: inner, display: 'flex', justifyContent: 'flex-end', fontSize: 22, color: P.ink3, opacity: src * (1 - exitAt(c)) }}>
          {`Fonte: ${scene.source}`}
        </div>
      )}
      <div style={{ position: 'absolute', left: 0, top: R.captionY, width: REEL.width, display: 'flex', justifyContent: 'center' }}>{caption}</div>
    </Paper>
  );
}

/** Fechamento do Reels: o guia (ou as calculadoras) e "comenta GUIA"; no Shorts, "link no canal". */
export function ReelCta({ cta, caption, clock, platform = 'instagram', screen }: {
  cta: Cta | null; caption?: React.ReactNode; clock?: Clock; platform?: Platform;
  /** Print da página do assunto no site: sem guia, o fechamento mostra o celular com ela. */
  screen?: { src: string; ratio: number } | null;
}) {
  if (!cta && screen) return <ReelScreenCta screen={screen} caption={caption} clock={clock} platform={platform} />;
  const inner = REEL.width - 2 * R.side;
  const c = clock ?? STILL;
  const card = easeOut(prog(c.t, 0.3, 0.55));
  const pulse = clock && c.t > 1.2 ? 1 + 0.045 * Math.sin((2 * Math.PI * (c.t - 1.2)) / 0.9) : 1;
  return (
    <Paper size={REEL}>
      <div style={{ position: 'absolute', left: R.side, top: R.chipY, display: 'flex' }}><Chip text="pra guardar" /></div>
      <div style={{ position: 'absolute', left: 0, top: R.brandY, width: REEL.width, display: 'flex', justifyContent: 'center' }}><Brand /></div>
      <div style={{ position: 'absolute', left: R.side, top: R.kickerY, width: inner, display: 'flex', flexDirection: 'column' }}>
        <Kicker text={cta ? 'guia em PDF' : 'grátis no site'} clock={c} />
        <Title a={cta ? 'Quer o passo' : 'Faça a conta'} b={cta ? 'a passo?' : 'sem erro'} color={P.blue} max={112} clock={c} />
      </div>
      <div style={{ position: 'absolute', left: R.side, top: R.visualY, width: inner, height: R.visualH, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, opacity: card, transform: `translate(0px, ${px(80 * (1 - card))})` }}>
          {cta ? <GuideCover cta={cta} /> : <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, lineHeight: 1.3, color: P.ink2 }}>Calculadoras grátis de reconstituição, dose e custo.</div>}
          <div style={{ display: 'flex', alignSelf: 'flex-start', marginTop: 30, padding: '18px 34px', borderRadius: 999, background: P.blue, color: P.white, fontSize: 40, fontWeight: 800, ...popStyle(c.t, 0.7, 0.45, 0.5), ...(pulse !== 1 ? { transform: `scale(${pulse.toFixed(4)})` } : {}) }}>
            {platform === 'youtube' ? 'Link no canal' : `Comenta ${DM_KEYWORD}`}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: R.captionY, width: REEL.width, display: 'flex', justifyContent: 'center' }}>{caption}</div>
    </Paper>
  );
}

/** Fechamento sem guia: título curto em cima, o celular com a página real e o botão ao lado. */
function ReelScreenCta({ screen, caption, clock, platform }: {
  screen: { src: string; ratio: number }; caption?: React.ReactNode; clock?: Clock; platform: Platform;
}) {
  const c = clock ?? STILL;
  const inner = REEL.width - 2 * R.side;
  const phoneTop = R.kickerY + 300;
  const phoneH = R.captionY - phoneTop - 40;
  const pulse = clock && c.t > 1.2 ? 1 + 0.045 * Math.sin((2 * Math.PI * (c.t - 1.2)) / 0.9) : 1;
  return (
    <Paper size={REEL}>
      <div style={{ position: 'absolute', left: R.side, top: R.chipY, display: 'flex' }}><Chip text="tá no site" /></div>
      <div style={{ position: 'absolute', left: 0, top: R.brandY, width: REEL.width, display: 'flex', justifyContent: 'center' }}><Brand /></div>
      <div style={{ position: 'absolute', left: R.side, top: R.kickerY, width: inner, display: 'flex', flexDirection: 'column' }}>
        <Title a="Explicado" b="com fonte" color={P.blue} max={104} clock={c} />
      </div>
      <div style={{ position: 'absolute', left: R.side, top: phoneTop, width: inner, height: phoneH, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PhoneScreen src={screen.src} ratio={screen.ratio} h={phoneH} clock={c} />
        <div style={{ display: 'flex', flexDirection: 'column', width: inner - Math.round(phoneH * 0.5) - 40, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 700, lineHeight: 1.3, color: P.ink2 }}>{SITE_HOST}</div>
          <div style={{ display: 'flex', marginTop: 16, fontSize: 32, lineHeight: 1.35, color: P.ink2 }}>Calculadoras grátis de dose, frasco e seringa.</div>
          <div style={{ display: 'flex', marginTop: 30, padding: '18px 30px', borderRadius: 999, background: P.blue, color: P.white, fontSize: 36, fontWeight: 800, ...popStyle(c.t, 0.7, 0.45, 0.5), ...(pulse !== 1 ? { transform: `scale(${pulse.toFixed(4)})` } : {}) }}>
            {platform === 'youtube' ? 'Link no canal' : `Comenta ${DM_KEYWORD}`}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: R.captionY, width: REEL.width, display: 'flex', justifyContent: 'center' }}>{caption}</div>
    </Paper>
  );
}

function GuideCover({ cta }: { cta: Cta }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'stretch', padding: '26px 28px', borderRadius: 18, background: P.ink, color: P.white, border: `6px solid ${P.ink}` }}>
      <div style={{ display: 'flex', fontSize: 18, fontWeight: 800, letterSpacing: 2, color: P.yellow }}>GUIA EM PDF</div>
      <div style={{ display: 'flex', marginTop: 12, fontFamily: TITLE, fontSize: cta.title.length > 40 ? 34 : 40, lineHeight: 1.15 }}>{cta.title.toUpperCase()}</div>
      <div style={{ display: 'flex', marginTop: 16, fontFamily: TITLE, fontSize: 54, color: P.yellow }}>{cta.priceLabel}</div>
    </div>
  );
}

// ——— Carrossel —————————————————————————————————————————————————————————————————

const C = { side: 70, top: 56 };

function CarouselFrame({ chip, page, children }: { chip: string; page?: string; children: React.ReactNode }) {
  const inner = CAROUSEL.width - 2 * C.side;
  return (
    <Paper size={CAROUSEL}>
      <div style={{ position: 'absolute', left: C.side, top: C.top, width: inner, height: CAROUSEL.height - C.top - 50, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Chip text={chip} />
          <Brand small />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, marginTop: 34 }}>{children}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, fontWeight: 600, color: P.ink3 }}>
          <span>{`@${INSTAGRAM_HANDLE} · ${SITE_HOST}`}</span>
          {page && <span>{page}</span>}
        </div>
      </div>
    </Paper>
  );
}

/** Capa do carrossel: gancho no título condensado + desenho + "arraste". */
export function PaperCover({ chip, hook, visual }: { chip: string; hook: string; visual: SceneVisual }) {
  const [a, b] = splitTitle(hook);
  const inner = CAROUSEL.width - 2 * C.side;
  return (
    <CarouselFrame chip={chip}>
      <Title a={a} b={b} color={P.red} max={150} />
      <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Visual v={visual} w={inner} h={560} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
        <div style={{ display: 'flex', padding: '14px 28px', borderRadius: 999, background: P.ink, color: P.white, fontSize: 30, fontWeight: 800 }}>Arraste para o lado »</div>
      </div>
    </CarouselFrame>
  );
}

/** Slide de conteúdo: título de duas linhas, desenho e o texto. */
export function PaperSlide({ chip, title, accent, tone, kicker, visual, body, page, source }: {
  chip: string; title: string; accent: string; tone: Scene['tone']; kicker?: string; visual?: SceneVisual; body?: string; page?: string; source?: string;
}) {
  const inner = CAROUSEL.width - 2 * C.side;
  return (
    <CarouselFrame chip={chip} page={page}>
      {kicker ? <Kicker text={kicker} /> : null}
      <Title a={title} b={accent} color={toneColor(tone)} max={100} />
      {visual && (
        <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Visual v={visual} w={inner} h={body ? 470 : 640} />
        </div>
      )}
      {body && (
        <div style={{ display: 'flex', marginTop: visual ? 0 : 30, marginBottom: 20, fontSize: body.length > 150 ? 34 : 38, lineHeight: 1.36, color: P.ink2, flexGrow: visual ? 0 : 1 }}>
          {nobreak(body)}
        </div>
      )}
      {source && <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14, fontSize: 20, color: P.ink3 }}>{`Fonte: ${source}`}</div>}
    </CarouselFrame>
  );
}

/** Último slide: o guia e "comenta GUIA". */
export function PaperCta({ cta, page }: { cta: Cta | null; page?: string }) {
  return (
    <CarouselFrame chip="pra guardar" page={page}>
      <Title a={cta ? 'Quer o passo' : 'Faça a conta'} b={cta ? 'a passo completo?' : 'sem erro'} color={P.blue} max={100} />
      <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'center' }}>
        {cta ? <GuideCover cta={cta} /> : <div style={{ display: 'flex', fontSize: 42, lineHeight: 1.35, color: P.ink2 }}>Calculadoras grátis de reconstituição, dose e custo.</div>}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 34 }}>
          <div style={{ display: 'flex', padding: '18px 34px', borderRadius: 999, background: P.blue, color: P.white, fontSize: 38, fontWeight: 800 }}>{`Comenta ${DM_KEYWORD}`}</div>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 22, fontSize: 26, fontWeight: 600, color: P.ink2 }}>
            <span>{cta ? 'que eu te mando o guia' : 'que eu te mando as'}</span>
            <span>{cta ? 'no direct, com desconto' : 'calculadoras no direct'}</span>
          </div>
        </div>
      </div>
    </CarouselFrame>
  );
}
