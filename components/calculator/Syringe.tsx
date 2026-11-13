import { useId } from 'react';
import { fmt } from './calc';

type Props = {
  units: number;
  maxUnits: 30 | 50 | 100;
};

// Desenho em 520 de largura que encolhe para ~300 px no celular (escala ~0,58):
// por isso as fontes são grandes no viewBox (18 e 16 → ~10 e ~9 px reais no menor caso).
export default function Syringe({ units, maxUnits }: Props) {
  const uid = useId().replace(/:/g, '');
  const gradId = `syringe-lg-${uid}`;
  const clipId = `syringe-clip-${uid}`;

  const safeU = Math.max(0, Math.min(units, maxUnits));
  const W = 520, H = 112;
  const bx = 60, bw = 360, by = 32, bh = 30;
  const majorEvery = maxUnits <= 30 ? 5 : 10;

  const fillW = (safeU / maxUnits) * bw;
  const markX = bx + fillW;
  const rodX = 10;
  const rodW = bx - 6;
  const label = `${fmt(safeU, 1)} U`;
  const labelW = Math.max(48, label.length * 9 + 14);

  const ticks = [];
  for (let i = 0; i <= maxUnits; i++) {
    const x = bx + (i / maxUnits) * bw;
    const big = i % majorEvery === 0;
    const th = big ? 11 : 5;
    ticks.push(
      <line
        key={`t${i}`}
        x1={x.toFixed(1)}
        y1={by + bh}
        x2={x.toFixed(1)}
        y2={(by + bh + th).toFixed(1)}
        stroke="var(--text-3)"
        strokeWidth={big ? 1.4 : 0.8}
      />
    );
    if (big) {
      ticks.push(
        <text
          key={`l${i}`}
          x={x.toFixed(1)}
          y={by + bh + th + 18}
          textAnchor="middle"
          fontSize={18}
          fontWeight={600}
          fill="var(--text-2)"
          fontFamily="Inter,sans-serif"
        >
          {i}
        </text>
      );
    }
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" aria-label={`Seringa de ${maxUnits} U mostrando ${fmt(safeU, 1)} unidades`} role="img">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x={bx} y={by} width={bw} height={bh} rx={3} />
        </clipPath>
      </defs>

      {/* agulha */}
      <line x1={bx + bw + 12} y1={by + bh / 2} x2={bx + bw + 52} y2={by + bh / 2} stroke="var(--text-3)" strokeWidth={2} strokeLinecap="round" />
      <rect x={bx + bw} y={by + bh / 2 - 4} width={14} height={8} fill="var(--border-2)" rx={1} />

      {/* corpo */}
      <rect x={bx} y={by} width={bw} height={bh} fill="var(--bg)" stroke="var(--border-2)" strokeWidth={1.5} rx={3} />

      {/* líquido */}
      <g clipPath={`url(#${clipId})`}>
        <rect
          x={bx}
          y={by}
          width={fillW.toFixed(1)}
          height={bh}
          fill={`url(#${gradId})`}
          opacity={0.8}
          style={{ transition: 'width 0.3s ease' }}
        />
      </g>

      {/* ticks */}
      {ticks}

      {/* borda por cima do líquido */}
      <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke="var(--border-2)" strokeWidth={1.5} rx={3} />

      {/* marcador: teal-700 com texto na cor do fundo (contraste nos dois temas) */}
      <line x1={markX.toFixed(1)} y1={by - 4} x2={markX.toFixed(1)} y2={by + bh + 3} stroke="var(--teal-700)" strokeWidth={1.8} strokeDasharray="3 2" />
      <rect x={(markX - labelW / 2).toFixed(1)} y={(by - 29).toFixed(1)} width={labelW} height={25} rx={6} fill="var(--teal-700)" />
      <text x={markX.toFixed(1)} y={(by - 10).toFixed(1)} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--bg)" fontFamily="Inter,sans-serif">
        {label}
      </text>

      {/* êmbolo */}
      <rect x={rodX} y={by + bh / 2 - 3} width={rodW} height={6} fill="var(--text-3)" rx={2} />
      <rect x={rodX - 8} y={by + bh / 2 - 12} width={10} height={24} fill="var(--text-2)" rx={2} />
      <rect x={bx - 6} y={by - 2} width={7} height={bh + 4} fill="var(--border)" rx={1} />
      <rect x={bx - 1} y={by - 5} width={2} height={bh + 10} fill="var(--text-3)" />
    </svg>
  );
}
