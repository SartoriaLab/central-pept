// Gotinha: mascote do Dose Certa (@dosecerta_br). A gota do logo (components/brand/DropCheck)
// com rosto, bracinhos e pés. SVG puro: serve no satori (slides e Reels) e, se um dia for o caso,
// no site. Spec: docs/superpowers/specs/2026-11-18-gotinha-mascote-design.md
//
// Sistema de coordenadas: viewBox -20 0 240 250 (o corpo ocupa 28..172 em x; as mãos passam disso).

import type { Mouth, Pose } from './poses';

export { MOUTHS, POSES, isPose, type Mouth, type Pose } from './poses';

/** Proporção altura/largura do desenho (para reservar espaço no layout). */
export const GOTINHA_RATIO = 250 / 240;

const NAVY = '#0b1220';
const LINE = '#5b2a06';
const ARM = '#eeb00c';
const HAND = '#fcd34d';
const EDGE = '#c98a06';

type Arm = { d: string; hand: [number, number]; front?: boolean; finger?: [number, number] };
type Eye = 'normal' | 'wide' | 'closed' | 'wink';
type PoseDef = {
  armL: Arm;
  armR: Arm;
  look: [number, number];
  eyeL: Eye;
  eyeR: Eye;
  /** Sobrancelhas: path de cada lado. */
  browL: string;
  browR: string;
  /** Boca em repouso (path de traço) quando `mouth` é "fechada". */
  rest: string;
};

const SMILE = 'M86 174 Q100 190 114 174';
const BROW_L = 'M61 124 Q72 118 84 122';
const BROW_R = 'M116 122 Q128 118 139 124';
const DOWN_L: Arm = { d: 'M40 164 Q24 172 18 190', hand: [17, 192] };
const HIP_L: Arm = { d: 'M40 162 Q10 176 34 196', hand: [36, 197], front: true };

const DEFS: Record<Pose, PoseDef> = {
  feliz: {
    armL: DOWN_L,
    armR: { d: 'M160 160 Q180 152 190 130', hand: [191, 127] },
    look: [0, 0], eyeL: 'normal', eyeR: 'normal', browL: BROW_L, browR: BROW_R, rest: SMILE,
  },
  explicando: {
    armL: HIP_L,
    armR: { d: 'M160 158 Q182 146 186 112', hand: [186, 109], finger: [188, 88] },
    look: [1, -1], eyeL: 'normal', eyeR: 'normal', browL: BROW_L, browR: 'M116 119 Q128 113 139 119', rest: SMILE,
  },
  pensando: {
    armL: DOWN_L,
    armR: { d: 'M160 170 Q160 212 126 204', hand: [122, 202], front: true },
    look: [4, -6], eyeL: 'normal', eyeR: 'normal', browL: 'M59 124 Q72 119 86 123', browR: 'M114 113 Q128 106 141 114',
    rest: 'M90 180 Q97 174 105 177',
  },
  alerta: {
    armL: { d: 'M40 160 Q20 150 14 128', hand: [13, 125] },
    armR: { d: 'M160 160 Q180 150 186 128', hand: [187, 125] },
    look: [0, 0], eyeL: 'wide', eyeR: 'wide', browL: 'M59 115 Q72 108 86 114', browR: 'M114 114 Q128 108 141 115',
    rest: 'M93 181 Q100 176 107 181',
  },
  piscadinha: {
    armL: HIP_L,
    armR: { d: 'M160 160 Q180 154 188 136', hand: [189, 133] },
    look: [1, 0], eyeL: 'normal', eyeR: 'wink', browL: BROW_L, browR: 'M116 124 Q128 120 139 126',
    rest: 'M86 173 Q102 192 115 172',
  },
  comemorando: {
    armL: { d: 'M42 152 Q18 138 10 104', hand: [9, 101] },
    armR: { d: 'M158 152 Q182 138 190 104', hand: [191, 101] },
    look: [0, -1], eyeL: 'closed', eyeR: 'closed', browL: 'M61 121 Q72 114 84 119', browR: 'M116 119 Q128 114 139 121',
    rest: SMILE,
  },
  apontando: {
    armL: HIP_L,
    armR: { d: 'M160 166 Q180 172 192 196', hand: [193, 198], finger: [203, 214] },
    look: [4, 4], eyeL: 'normal', eyeR: 'normal', browL: BROW_L, browR: BROW_R, rest: SMILE,
  },
  ih: {
    armL: { d: 'M40 160 Q18 156 10 136', hand: [9, 133] },
    armR: { d: 'M160 162 Q190 176 166 196', hand: [164, 197], front: true },
    look: [-4, 1], eyeL: 'normal', eyeR: 'normal', browL: 'M60 125 L86 130', browR: 'M114 119 Q127 110 140 118',
    rest: 'M88 182 Q98 174 114 179',
  },
};

function ArmShape({ arm }: { arm: Arm }) {
  return (
    <g>
      {/* Contorno mais escuro por baixo: sem ele o braço some quando passa na frente do corpo. */}
      <path d={arm.d} fill="none" stroke={EDGE} strokeWidth="16.5" strokeLinecap="round" />
      <path d={arm.d} fill="none" stroke={ARM} strokeWidth="13" strokeLinecap="round" />
      {arm.finger && (
        <path d={`M${arm.hand[0]} ${arm.hand[1]} L${arm.finger[0]} ${arm.finger[1]}`} stroke={EDGE} strokeWidth="10" strokeLinecap="round" />
      )}
      {arm.finger && (
        <path d={`M${arm.hand[0]} ${arm.hand[1]} L${arm.finger[0]} ${arm.finger[1]}`} stroke={HAND} strokeWidth="7" strokeLinecap="round" />
      )}
      <circle cx={arm.hand[0]} cy={arm.hand[1]} r="10.5" fill={HAND} stroke={EDGE} strokeWidth="1.8" />
      <circle cx={arm.hand[0] - 3} cy={arm.hand[1] - 3} r="3" fill="#ffffff" opacity="0.45" />
    </g>
  );
}

/** Olho centrado em (cx, 146). `side` = -1 para o esquerdo (cílios para fora). */
function EyeShape({ cx, side, kind, look }: { cx: number; side: -1 | 1; kind: Eye; look: [number, number] }) {
  const lash = (x1: number, y1: number, x2: number, y2: number) => (
    <path d={`M${cx + side * x1} ${y1} L${cx + side * x2} ${y2}`} stroke={NAVY} strokeWidth="2.6" strokeLinecap="round" />
  );
  if (kind === 'closed') {
    // Olho fechado sorrindo (arco para cima).
    return (
      <g>
        <path d={`M${cx - 13} 150 Q${cx} 136 ${cx + 13} 150`} fill="none" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
        {lash(13, 149, 18, 145)}
      </g>
    );
  }
  if (kind === 'wink') {
    return (
      <g>
        <path d={`M${cx - 13} 147 Q${cx} 157 ${cx + 13} 145`} fill="none" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
        {lash(12, 147, 18, 150)}
        {lash(8, 151, 12, 156)}
      </g>
    );
  }
  const wide = kind === 'wide';
  const rx = wide ? 15.5 : 15;
  const ry = wide ? 21 : 18;
  const r = wide ? 8 : 11.5;
  const ix = cx + look[0];
  const iy = 147 + look[1];
  return (
    <g>
      {lash(12, 133, 19, 126)}
      {lash(7, 129, 11, 121)}
      <ellipse cx={cx} cy="146" rx={rx} ry={ry} fill="#ffffff" />
      <circle cx={ix} cy={iy} r={r} fill={NAVY} />
      <circle cx={ix - 3.2} cy={iy - 4} r={r * 0.36} fill="#ffffff" />
      <circle cx={ix + 3.6} cy={iy + 3.6} r={r * 0.17} fill="#ffffff" />
    </g>
  );
}

/** Piscada (olho fechado para baixo), usada na animação. */
function BlinkShape({ cx, side }: { cx: number; side: -1 | 1 }) {
  return (
    <g>
      <path d={`M${cx - 13} 146 Q${cx} 156 ${cx + 13} 146`} fill="none" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />
      <path d={`M${cx + side * 12} 148 L${cx + side * 18} 152`} stroke={NAVY} strokeWidth="2.6" strokeLinecap="round" />
    </g>
  );
}

function MouthShape({ mouth, rest }: { mouth: Mouth; rest: string }) {
  if (mouth === 'fechada') return <path d={rest} fill="none" stroke={LINE} strokeWidth="4.5" strokeLinecap="round" />;
  if (mouth === 'o') return <ellipse cx="100" cy="182" rx="7.5" ry="9.5" fill="#7c1d1d" />;
  if (mouth === 'meia') {
    return (
      <g>
        <path d="M87 174 Q100 179 113 174 Q111 189 100 190 Q89 189 87 174 Z" fill="#7c1d1d" />
        <ellipse cx="100" cy="186.5" rx="6.5" ry="3" fill="#fb7185" />
      </g>
    );
  }
  return (
    <g>
      <path d="M83 172 Q100 178 117 172 Q116 199 100 200 Q84 199 83 172 Z" fill="#7c1d1d" />
      <path d="M89 174.6 Q100 178.4 111 174.6 L110 179.5 Q100 182.5 90 179.5 Z" fill="#ffffff" />
      <ellipse cx="100" cy="193.5" rx="9.5" ry="5" fill="#fb7185" />
    </g>
  );
}

export default function Gotinha({
  pose = 'feliz', mouth = 'fechada', blink = false, size, id = 'gotinha',
}: { pose?: Pose; mouth?: Mouth; blink?: boolean; size: number; id?: string }) {
  const p = DEFS[pose];
  const eye = (cx: number, side: -1 | 1, kind: Eye) =>
    blink && kind !== 'wink' && kind !== 'closed' ? <BlinkShape cx={cx} side={side} /> : <EyeShape cx={cx} side={side} kind={kind} look={p.look} />;
  return (
    <svg width={size} height={Math.round(size * GOTINHA_RATIO)} viewBox="-20 0 240 250" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="0.36" cy="0.4" r="0.78">
          <stop offset="0" stopColor="#fff3a8" />
          <stop offset="0.32" stopColor="#fde047" />
          <stop offset="0.72" stopColor="#facc15" />
          <stop offset="1" stopColor="#dd9a08" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="238" rx="54" ry="8" fill="#000000" opacity="0.28" />
      <ellipse cx="78" cy="226" rx="17" ry="9.5" fill="#e0a106" />
      <ellipse cx="122" cy="226" rx="17" ry="9.5" fill="#e0a106" />
      {!p.armL.front && <ArmShape arm={p.armL} />}
      {!p.armR.front && <ArmShape arm={p.armR} />}
      <path d="M108 8 C96 44 28 96 28 150 A72 72 0 0 0 172 150 C172 104 128 62 108 8 Z" fill={`url(#${id})`} />
      <ellipse cx="66" cy="110" rx="7" ry="17" fill="#ffffff" opacity="0.6" transform="rotate(26 66 110)" />
      {/* Selo da marca: o check do logo, como um adesivo na testa. */}
      <g transform="rotate(12 133 88)">
        <circle cx="133" cy="88" r="12" fill={NAVY} />
        <path d="M127 88.5 L131.5 93 L139.5 83.5" fill="none" stroke="#facc15" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <ellipse cx="52" cy="172" rx="10" ry="6.5" fill="#ff8fa3" opacity="0.6" />
      <ellipse cx="148" cy="172" rx="10" ry="6.5" fill="#ff8fa3" opacity="0.6" />
      <path d={p.browL} fill="none" stroke={LINE} strokeWidth="3.6" strokeLinecap="round" />
      <path d={p.browR} fill="none" stroke={LINE} strokeWidth="3.6" strokeLinecap="round" />
      {eye(74, -1, p.eyeL)}
      {eye(126, 1, p.eyeR)}
      <MouthShape mouth={pose === 'alerta' && mouth !== 'fechada' ? 'o' : mouth} rest={p.rest} />
      {p.armL.front && <ArmShape arm={p.armL} />}
      {p.armR.front && <ArmShape arm={p.armR} />}
    </svg>
  );
}
