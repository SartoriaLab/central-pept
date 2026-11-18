// Folha de poses da Gotinha, para conferir o desenho depois de mexer em mascot.tsx.
// Uso: npm run social:gotinha → social/out/mascote/folha.png e gotinha.png
import fs from 'node:fs/promises';
import path from 'node:path';
import { renderPng } from './render';
import Gotinha, { MOUTHS, POSES } from './mascot';

const W = 1600;
const H = 1380;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 380 }}>
      {children}
      <div style={{ display: 'flex', marginTop: 8, fontSize: 28, fontWeight: 600, color: '#cbd5e1' }}>{label}</div>
    </div>
  );
}

function Sheet() {
  return (
    <div style={{ width: W, height: H, display: 'flex', flexDirection: 'column', background: '#0b1220', fontFamily: 'Inter', padding: 40 }}>
      <div style={{ display: 'flex', fontSize: 40, fontWeight: 800, color: '#f8fafc' }}>Gotinha: poses</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 24, gap: '28px 0' }}>
        {POSES.map((pose) => (
          <Cell key={pose} label={pose}>
            <Gotinha pose={pose} size={320} />
          </Cell>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: 36, fontSize: 40, fontWeight: 800, color: '#f8fafc' }}>Boca falando e piscada</div>
      <div style={{ display: 'flex', marginTop: 24 }}>
        {MOUTHS.map((mouth) => (
          <Cell key={mouth} label={mouth === 'meia' ? 'meia + piscada' : mouth}>
            <Gotinha pose="explicando" mouth={mouth} blink={mouth === 'meia'} size={300} />
          </Cell>
        ))}
      </div>
    </div>
  );
}

async function main() {
  const out = path.join(process.cwd(), 'social', 'out', 'mascote');
  await fs.mkdir(out, { recursive: true });
  await fs.writeFile(path.join(out, 'folha.png'), await renderPng(<Sheet />, { width: W, height: H }));
  const big = { width: 900, height: 940 };
  await fs.writeFile(
    path.join(out, 'gotinha.png'),
    await renderPng(
      <div style={{ ...big, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b1220' }}>
        <Gotinha pose="feliz" size={800} />
      </div>,
      big,
    ),
  );
  console.log(out);
}

main();
