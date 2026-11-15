// Slides do @dosecerta_br em JSX para o satori (subconjunto de CSS: todo nó com mais de um
// filho precisa de display flex). Mesmo visual para carrossel (1080×1350) e Reels (1080×1920).
import { CATEGORY_HEX } from '@/lib/category-style';
import { INSTAGRAM_HANDLE, INSTAGRAM_NAME, SITE_HOST } from '@/lib/site';
import type { Cta } from './types';

export type Size = { width: number; height: number };
export const CAROUSEL: Size = { width: 1080, height: 1350 };
export const REEL: Size = { width: 1080, height: 1920 };

const BG = '#0b1220';
const INK = '#f8fafc';
const INK_2 = '#cbd5e1';
const INK_3 = '#64748b';

export function accentFor(category: string): string {
  return CATEGORY_HEX[category] ?? '#14b8a6';
}

/** Reels: a interface do app cobre o topo e o rodapé; o conteúdo fica na faixa do meio. */
function pad(size: Size) {
  return size.height > 1500 ? { top: 260, bottom: 420, side: 80 } : { top: 72, bottom: 72, side: 80 };
}

function Frame({ size, accent, page, children }: { size: Size; accent: string; page?: string; children: React.ReactNode }) {
  const p = pad(size);
  const inner = size.width - 2 * p.side;
  return (
    <div
      style={{
        width: size.width, height: size.height, display: 'flex',
        background: BG, color: INK, fontFamily: 'Inter', position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, width: 16, height: size.height, background: accent, display: 'flex' }} />
      {/* Área útil com posição e tamanho fixos: com padding no pai o satori estoura a altura. */}
      <div
        style={{
          position: 'absolute', left: p.side, top: p.top, width: inner, height: size.height - p.top - p.bottom,
          display: 'flex', flexDirection: 'column',
        }}
      >
      <div style={{ display: 'flex', flexShrink: 0, width: inner, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 14, background: accent, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: BG,
            }}
          >
            DC
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1 }}>{INSTAGRAM_NAME.toUpperCase()}</div>
        </div>
        {page && <div style={{ fontSize: 26, fontWeight: 600, color: INK_3 }}>{page}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, width: inner, justifyContent: 'center' }}>{children}</div>
      <div style={{ display: 'flex', flexShrink: 0, height: 40, alignItems: 'flex-end', width: inner, justifyContent: 'space-between', fontSize: 24, color: INK_3, fontWeight: 600 }}>
        <span>{`@${INSTAGRAM_HANDLE}`}</span>
        <span>{SITE_HOST}</span>
      </div>
      </div>
    </div>
  );
}

function fit(text: string, big: number, small: number, limit: number): number {
  return text.length > limit ? small : big;
}

export function CoverSlide({ size, accent, hook, label, swipe }: { size: Size; accent: string; hook: string; label: string; swipe: boolean }) {
  return (
    <Frame size={size} accent={accent}>
      <div style={{ display: 'flex', fontSize: 30, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 3 }}>{label}</div>
      <div style={{ display: 'flex', marginTop: 28, fontSize: fit(hook, 92, 76, 55), fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
        {hook}
      </div>
      {swipe && (
        <div style={{ display: 'flex', marginTop: 56, fontSize: 32, fontWeight: 600, color: INK_2 }}>Arraste para o lado »</div>
      )}
    </Frame>
  );
}

export function ContentSlide({ size, accent, title, body, page }: { size: Size; accent: string; title: string; body: string; page?: string }) {
  return (
    <Frame size={size} accent={accent} page={page}>
      <div style={{ display: 'flex', width: 96, height: 10, borderRadius: 5, background: accent }} />
      <div style={{ display: 'flex', marginTop: 36, fontSize: fit(title, 68, 58, 40), fontWeight: 800, lineHeight: 1.12, letterSpacing: -1 }}>
        {title}
      </div>
      <div style={{ display: 'flex', marginTop: 32, fontSize: fit(body, 46, 40, 160), lineHeight: 1.38, color: INK_2 }}>{body}</div>
    </Frame>
  );
}

export function CtaSlide({ size, accent, cta, page }: { size: Size; accent: string; cta: Cta | null; page?: string }) {
  return (
    <Frame size={size} accent={accent} page={page}>
      <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1 }}>
        {cta ? 'Quer o passo a passo completo?' : 'Faça a conta sem erro'}
      </div>
      {cta ? (
        <div style={{ display: 'flex', marginTop: 44, gap: 36, alignItems: 'center' }}>
          <div
            style={{
              width: 300, height: 420, borderRadius: 20, display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between', padding: 28, color: BG,
              background: `linear-gradient(135deg, ${accent}, #e2e8f0)`,
            }}
          >
            <div style={{ display: 'flex', fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>CENTRAL PEPTÍDEOS</div>
            <div style={{ display: 'flex', width: 244, fontSize: cta.title.length > 40 ? 30 : 36, fontWeight: 800, lineHeight: 1.15 }}>{cta.title}</div>
            <div style={{ display: 'flex', fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>GUIA EM PDF</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, color: INK_2 }}>Guia em PDF</div>
            <div style={{ display: 'flex', marginTop: 8, fontSize: 64, fontWeight: 800, color: accent }}>{cta.priceLabel}</div>
            {cta.others > 0 && (
              <div style={{ display: 'flex', marginTop: 12, fontSize: 30, color: INK_2 }}>
                {`e mais ${cta.others} ${cta.others === 1 ? 'guia' : 'guias'} no site`}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', marginTop: 32, fontSize: 44, lineHeight: 1.38, color: INK_2 }}>
          Calculadoras grátis de reconstituição, dose e custo.
        </div>
      )}
      <div
        style={{
          display: 'flex', marginTop: 56, alignSelf: 'flex-start', padding: '22px 40px', borderRadius: 999,
          background: accent, color: BG, fontSize: 38, fontWeight: 800,
        }}
      >
        {`Link na bio · @${INSTAGRAM_HANDLE}`}
      </div>
    </Frame>
  );
}
