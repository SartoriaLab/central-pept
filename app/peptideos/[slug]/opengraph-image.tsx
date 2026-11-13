/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { getPeptideBySlug, getPeptideSlugs, CATEGORY_LABELS, REGULATORY_LABELS } from '@/lib/peptides';

export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export async function generateStaticParams() {
  return getPeptideSlugs().map((slug) => ({ slug }));
}

// Cor de acento por categoria
const CATEGORY_COLOR: Record<string, string> = {
  'healing':     '#22c55e',
  'glp-1':       '#3b82f6',
  'gh':          '#8b5cf6',
  'sexual':      '#ec4899',
  'cosmetic':    '#f59e0b',
  'longevity':   '#14b8a6',
  'weight-loss': '#f97316',
  'cognitive':   '#6366f1',
  'hormone':     '#f43f5e',
};

// No Next 15+ `params` é uma Promise: sem o await o slug vinha indefinido e a
// imagem saía sempre como "Peptídeo não encontrado".
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPeptideBySlug(slug);
  if (!p) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontSize: 48 }}>
          Peptídeo não encontrado
        </div>
      ),
      size
    );
  }

  const accent = (p.category && CATEGORY_COLOR[p.category]) || '#0d9488';
  const categoryLabel = p.category && p.category in CATEGORY_LABELS ? CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS] : '';
  const regLabel = p.regulatoryStatus ? REGULATORY_LABELS[p.regulatoryStatus].label : '';

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
        {/* Header: logo + categoria */}
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
          {categoryLabel && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 16px', borderRadius: 999,
              background: '#f8fafc', border: '1px solid #e2e8f0',
              fontSize: 18, fontWeight: 700, color: '#475569',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: accent }} />
              {categoryLabel}
            </div>
          )}
        </div>

        {/* Main: nome + descrição */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 80, flex: 1, gap: 24 }}>
          <div style={{
            fontSize: p.name.length > 18 ? 68 : p.name.length > 12 ? 84 : 100, fontWeight: 800, color: '#0f172a',
            letterSpacing: -2, lineHeight: 1, display: 'flex',
          }}>
            {p.name}
          </div>
          <div style={{
            fontSize: 28, color: '#475569', lineHeight: 1.35,
            maxWidth: 1000, display: 'flex',
          }}>
            {p.shortDescription}
          </div>
        </div>

        {/* Footer: dados chave */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#94a3b8' }}>Dose típica</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 36, fontWeight: 800, color: '#0f172a' }}>
                <span>{String(p.typicalDose).replace('.', ',')}</span>
                <span style={{ color: '#64748b', fontWeight: 500, fontSize: 24 }}>{p.doseUnit}</span>
              </div>
            </div>
            {p.halfLife && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#94a3b8' }}>Meia-vida</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#0f172a' }}>{p.halfLife}</div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {regLabel && (
              <div style={{
                padding: '10px 18px', borderRadius: 999,
                background: '#0d9488', color: 'white',
                fontSize: 18, fontWeight: 700,
                display: 'flex',
              }}>
                {regLabel}
              </div>
            )}
            {p.wadaProhibited && (
              <div style={{
                padding: '10px 18px', borderRadius: 999,
                background: '#ef4444', color: 'white',
                fontSize: 18, fontWeight: 700,
                display: 'flex',
              }}>
                Proibido WADA
              </div>
            )}
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
