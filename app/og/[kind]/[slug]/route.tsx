/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const size = { width: 1200, height: 630 };

// Aceita só hex #rrggbb — evita injeção de valor arbitrário no style.
function sanitizeHex(v: string | null): string | null {
  return v && /^#[0-9a-fA-F]{6}$/.test(v) ? v : null;
}

// GET /api/og?title=...&eyebrow=...&accent=#rrggbb
// Imagem 1200x630 para OpenGraph/Twitter dos posts (e outras páginas sem OG própria).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || 'Central Peptídeos').slice(0, 140);
  const eyebrow = (searchParams.get('eyebrow') || 'Blog').slice(0, 40);
  const accent = sanitizeHex(searchParams.get('accent')) || '#0d9488';

  const titleSize = title.length > 78 ? 58 : title.length > 48 ? 68 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          padding: 60,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header: logo + eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 22, fontWeight: 800,
            }}>
              CP
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Central Peptídeos</div>
              <div style={{ fontSize: 15, color: '#64748b' }}>centralpeptideos.com.br</div>
            </div>
          </div>
          {eyebrow && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 16px', borderRadius: 999,
              background: '#f8fafc', border: '1px solid #e2e8f0',
              fontSize: 18, fontWeight: 700, color: '#475569',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: accent }} />
              {eyebrow}
            </div>
          )}
        </div>

        {/* Main: título */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 64, flex: 1, justifyContent: 'center' }}>
          <div style={{
            fontSize: titleSize, fontWeight: 800, color: '#0f172a',
            letterSpacing: -1.5, lineHeight: 1.08, maxWidth: 1040, display: 'flex',
          }}>
            {title}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 22, color: '#64748b', display: 'flex' }}>
            Calculadoras · Enciclopédia · Guias
          </div>
        </div>

        {/* Barra colorida no rodapé */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: 12, background: accent,
        }} />
      </div>
    ),
    size
  );
}
