// Foto de perfil do @dosecerta_br. Uso: npx tsx scripts/social/avatar.tsx
// Gera em social/out/perfil/ as opções em 1080×1080 (o que o Instagram pede) e uma folha
// com todas recortadas em círculo e pequenas (como aparecem no feed), para comparar.
// Escolhida em 2026-11-16: "1-gota" (gota amarela com check sobre azul-marinho).
import fs from 'node:fs/promises';
import path from 'node:path';
import { renderPng } from './render';
import { illustrationSrc } from './illustrations';
import DropCheck from '@/components/brand/DropCheck';

const SIZE = 1080;
const NAVY = '#0b1220';
const TEAL = '#14b8a6';
const YELLOW = '#facc15';

type Option = { id: string; name: string; el: (s: number) => React.ReactElement };

const OPTIONS: Option[] = [
  {
    id: '1-gota',
    name: 'Gota com check (azul-marinho)',
    el: (s) => (
      <div
        style={{
          width: s, height: s, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundImage: `radial-gradient(circle at 50% 45%, #1e3a5f 0%, ${NAVY} 70%)`,
        }}
      >
        <div style={{ display: 'flex', marginTop: -0.04 * s }}>
          <DropCheck size={0.46 * s} />
        </div>
      </div>
    ),
  },
  {
    id: '2-gota-verde',
    name: 'Gota com check (verde-azulado)',
    el: (s) => (
      <div
        style={{
          width: s, height: s, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundImage: `linear-gradient(135deg, #2dd4bf 0%, ${TEAL} 45%, #0f766e 100%)`,
        }}
      >
        <div style={{ display: 'flex', marginTop: -0.04 * s }}>
          <DropCheck size={0.46 * s} />
        </div>
      </div>
    ),
  },
  {
    id: '3-seringa',
    name: 'Seringa 3D',
    el: (s) => (
      <div
        style={{
          width: s, height: s, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundImage: `radial-gradient(circle at 50% 50%, ${TEAL}66 0%, ${NAVY} 62%)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={illustrationSrc('seringa')} width={0.62 * s} height={0.62 * s} alt="" />
      </div>
    ),
  },
  {
    id: '4-dc',
    name: 'DC no estilo da legenda',
    el: (s) => (
      <div style={{ width: s, height: s, display: 'flex', alignItems: 'center', justifyContent: 'center', background: NAVY }}>
        <div
          style={{
            display: 'flex', padding: `${0.02 * s}px ${0.07 * s}px`, borderRadius: 0.07 * s, background: YELLOW, color: NAVY,
            fontFamily: 'Inter', fontWeight: 800, fontSize: 0.36 * s, letterSpacing: -0.015 * s, lineHeight: 1.1,
          }}
        >
          DC
        </div>
      </div>
    ),
  },
];

const THUMB = 180;

function Sheet() {
  return (
    <div style={{ width: 1000, height: 330, display: 'flex', background: '#ffffff', justifyContent: 'space-around', alignItems: 'center', fontFamily: 'Inter' }}>
      {OPTIONS.map((o) => (
        <div key={o.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 220 }}>
          <div style={{ display: 'flex', width: THUMB, height: THUMB, borderRadius: THUMB, overflow: 'hidden' }}>{o.el(THUMB)}</div>
          <div style={{ display: 'flex', marginTop: 16, fontSize: 18, fontWeight: 600, color: '#0f172a', textAlign: 'center' }}>{o.name}</div>
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
  await fs.writeFile(path.join(out, 'comparar.png'), await renderPng(<Sheet />, { width: 1000, height: 330 }));
  console.log(`Gerado em ${out}`);
}

main();
