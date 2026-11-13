import { ImageResponse } from 'next/og';

// Ícones PNG do site (favicon, Apple e PWA), gerados no build a partir do mesmo desenho
// de public/favicon.svg. "maskable" deixa margem para o recorte do Android.
const VARIANTS = {
  '32': { size: 32, pad: 0, radius: 7 },
  '180': { size: 180, pad: 0, radius: 0 },
  '192': { size: 192, pad: 0, radius: 42 },
  '512': { size: 512, pad: 0, radius: 112 },
  maskable: { size: 512, pad: 0.2, radius: 0 },
} as const;

type Variant = keyof typeof VARIANTS;

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(VARIANTS).map((variante) => ({ variante }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ variante: string }> }) {
  const { variante } = await params;
  const v = VARIANTS[variante as Variant] ?? VARIANTS['512'];
  const inner = Math.round(v.size * (1 - v.pad * 2));
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f766e', borderRadius: v.radius }}>
        <svg width={inner} height={inner} viewBox="0 0 64 64">
          <path d="M19 44 32 33 45 42M32 33 46 20" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" fill="none" />
          <circle cx="19" cy="44" r="8" fill="#fff" />
          <circle cx="32" cy="33" r="6" fill="#fff" />
          <circle cx="45" cy="42" r="5.5" fill="#fff" />
          <circle cx="46" cy="20" r="6" fill="#f59e0b" />
        </svg>
      </div>
    ),
    { width: v.size, height: v.size },
  );
}
