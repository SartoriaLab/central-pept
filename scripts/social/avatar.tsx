// Foto de perfil do @dosecerta_br. Uso: npx tsx scripts/social/avatar.tsx
// Gera social/out/perfil.png (1080×1080, o que o Instagram pede) e uma prévia recortada
// em círculo e pequena (como aparece no feed) para conferir a leitura.
import fs from 'node:fs/promises';
import path from 'node:path';
import { renderPng } from './render';

const SIZE = 1080;
const TICKS = 11;

function Avatar({ size, round = false }: { size: number; round?: boolean }) {
  const k = size / SIZE;
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
        borderRadius: round ? size / 2 : 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'Inter',
          fontWeight: 800,
          fontSize: 430 * k,
          letterSpacing: -24 * k,
          lineHeight: 1,
          color: '#ffffff',
          marginTop: 40 * k,
        }}
      >
        DC
      </div>
      {/* Escala de seringa: marcas finas e uma marca da dose em destaque. */}
      <div style={{ display: 'flex', alignItems: 'flex-end', width: 460 * k, height: 70 * k, marginTop: 36 * k, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: 460 * k, height: 10 * k, borderRadius: 5 * k, backgroundColor: '#ffffff' }} />
        {Array.from({ length: TICKS }, (_, i) => {
          const dose = i === 7;
          const tall = i % 5 === 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: (i * (460 - 10)) / (TICKS - 1) * k,
                bottom: 0,
                width: (dose ? 14 : 10) * k,
                height: (dose ? 70 : tall ? 46 : 30) * k,
                borderRadius: 5 * k,
                backgroundColor: dose ? '#fde68a' : '#ffffff',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

async function main() {
  const out = path.join(process.cwd(), 'social', 'out');
  await fs.mkdir(out, { recursive: true });
  await fs.writeFile(path.join(out, 'perfil.png'), await renderPng(<Avatar size={SIZE} />, { width: SIZE, height: SIZE }));
  await fs.writeFile(path.join(out, 'perfil-previa.png'), await renderPng(<Avatar size={160} round />, { width: 160, height: 160 }));
  console.log(`Gerado em ${out}`);
}

main();
