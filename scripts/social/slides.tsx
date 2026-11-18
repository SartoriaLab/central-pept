// Slides do @dosecerta_br em JSX para o satori (subconjunto de CSS: todo nó com mais de um
// filho precisa de display flex). Mesmo visual para carrossel (1080×1350) e Reels (1080×1920).
import { CATEGORY_HEX } from '@/lib/category-style';
import { INSTAGRAM_HANDLE, INSTAGRAM_NAME, SITE_HOST } from '@/lib/site';
import type { Cta } from './types';
import { illustrationSrc, type Illustration } from './illustrations';
import DropCheck from '@/components/brand/DropCheck';
import Gotinha, { GOTINHA_RATIO } from './mascot';
import type { Pose } from './poses';
import { BORDAO_FECHAMENTO } from './caption';
import { DM_KEYWORD } from '@/lib/instagram-dm';

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

const HEADER_H = 62;

/** `align="start"`: conteúdo a partir do topo (cenas do Reels, onde a Gotinha entra por cima em posição fixa). */
// Sem faixa colorida na lateral: no Reels ela aparecia como uma linha azul nas transições.
function Frame({
  size, page, align = 'center', children,
}: { size: Size; accent: string; page?: string; align?: 'center' | 'start'; children: React.ReactNode }) {
  const p = pad(size);
  const inner = size.width - 2 * p.side;
  return (
    <div
      style={{
        width: size.width, height: size.height, display: 'flex',
        background: BG, color: INK, fontFamily: 'Inter', position: 'relative',
      }}
    >
      {/* Área útil com posição e tamanho fixos: com padding no pai o satori estoura a altura. */}
      <div
        style={{
          position: 'absolute', left: p.side, top: p.top, width: inner, height: size.height - p.top - p.bottom,
          display: 'flex', flexDirection: 'column',
        }}
      >
      <div style={{ display: 'flex', flexShrink: 0, width: inner, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', width: 48, height: HEADER_H, alignItems: 'center', justifyContent: 'center' }}>
            <DropCheck size={48} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1 }}>{INSTAGRAM_NAME.toUpperCase()}</div>
        </div>
        {page && <div style={{ fontSize: 26, fontWeight: 600, color: INK_3 }}>{page}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, width: inner, justifyContent: align === 'start' ? 'flex-start' : 'center' }}>{children}</div>
      <div style={{ display: 'flex', flexShrink: 0, height: 40, alignItems: 'flex-end', width: inner, justifyContent: 'space-between', fontSize: 24, color: INK_3, fontWeight: 600 }}>
        <span>{`@${INSTAGRAM_HANDLE}`}</span>
        <span>{SITE_HOST}</span>
      </div>
      </div>
    </div>
  );
}

/**
 * Impede quebra de linha entre número e unidade ("2,5 | mg") e dentro de "mg/ml": espaço vira
 * espaço inseparável e a barra ganha um word joiner (U+2060), que o satori não usa para quebrar.
 */
export function nobreak(text: string): string {
  return text
    .replace(/(\d)\s+(?=(?:mg|mcg|ml|ui|u|unidades?|semanas?|dias?|horas?|kg|%)(?![\p{L}\d]))/giu, '$1 ')
    .replace(/([\p{L}\d])\/(?=[\p{L}\d])/gu, '$1/⁠');
}

function fit(text: string, big: number, small: number, limit: number): number {
  return text.length > limit ? small : big;
}

/** Ilustração 3D com um halo da cor da categoria atrás. */
function Art({ icon, size, accent }: { icon: Illustration; size: number; accent: string }) {
  return (
    <div style={{ display: 'flex', width: size, height: size, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div
        style={{
          position: 'absolute', left: 0, top: 0, width: size, height: size, borderRadius: size,
          background: `radial-gradient(circle, ${accent}55 0%, ${accent}00 68%)`, display: 'flex',
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={illustrationSrc(icon)} width={Math.round(size * 0.78)} height={Math.round(size * 0.78)} alt="" />
    </div>
  );
}

/** Capa: a Gotinha fala o gancho num balão. Serve ao carrossel e à capa do Reels. */
export function CoverSlide({
  size, accent, hook, label, swipe, icon, pose = 'ih',
}: { size: Size; accent: string; hook: string; label: string; swipe: boolean; icon?: Illustration; pose?: Pose }) {
  const reel = size.height > 1500;
  return (
    <Frame size={size} accent={accent}>
      <div style={{ display: 'flex', fontSize: 30, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 3 }}>{label}</div>
      <div
        style={{
          display: 'flex', marginTop: 28, padding: '40px 48px', borderRadius: 44, background: INK, color: BG,
          fontSize: fit(hook, 84, 70, 45), fontWeight: 800, lineHeight: 1.1, letterSpacing: -2,
        }}
      >
        {nobreak(hook)}
      </div>
      {/* Rabicho do balão, apontando para a Gotinha. */}
      <div style={{ display: 'flex', width: 56, height: 56, marginTop: -30, marginLeft: 150, background: INK, transform: 'rotate(45deg)' }} />
      <div style={{ display: 'flex', marginTop: 12, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Gotinha pose={pose} mouth="aberta" size={reel ? 480 : 380} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          {icon && <Art icon={icon} size={reel ? 280 : 230} accent={accent} />}
          {swipe && <div style={{ display: 'flex', marginTop: 20, fontSize: 32, fontWeight: 600, color: INK_2 }}>Arraste para o lado »</div>}
        </div>
      </div>
    </Frame>
  );
}

export function ContentSlide({
  size, accent, title, body, page, icon, pose = 'explicando',
}: { size: Size; accent: string; title: string; body: string; page?: string; icon?: Illustration; pose?: Pose }) {
  return (
    <Frame size={size} accent={accent} page={page}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Gotinha pose={pose} size={300} />
        {icon && <Art icon={icon} size={220} accent={accent} />}
      </div>
      <div style={{ display: 'flex', marginTop: 20, width: 96, height: 10, borderRadius: 5, background: accent }} />
      <div style={{ display: 'flex', marginTop: 36, fontSize: fit(title, 68, 58, 40), fontWeight: 800, lineHeight: 1.12, letterSpacing: -1 }}>
        {nobreak(title)}
      </div>
      <div style={{ display: 'flex', marginTop: 32, fontSize: fit(body, 46, 40, 160), lineHeight: 1.38, color: INK_2 }}>{nobreak(body)}</div>
    </Frame>
  );
}

const HIGHLIGHT = '#facc15';

/** Legenda do Reels: bloco curto em caixa alta, palavra falada em destaque; `pop` = entrada maior. */
export function Caption({ words, active, pop, big = false }: { words: string[]; active: number; pop: boolean; big?: boolean }) {
  const base = big ? 96 : 80;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px 18px', width: '100%' }}>
      {words.map((w, i) => (
        <div
          key={i}
          style={{
            display: 'flex', padding: '2px 16px', borderRadius: 16, lineHeight: 1.15,
            fontSize: pop ? Math.round(base * 1.08) : base, fontWeight: 800, textTransform: 'uppercase', letterSpacing: -1,
            background: i === active ? HIGHLIGHT : 'transparent', color: i === active ? BG : INK,
          }}
        >
          {w}
        </div>
      ))}
    </div>
  );
}

// Reels: a Gotinha não é desenhada nos quadros. O render (render.ts) a sobrepõe animada, numa
// camada própria, no espaço que estas cenas deixam vazio. As medidas abaixo dizem onde.
const SCENE_TITLE_H = 210;
const SCENE_SLOT_H = 580;
const SCENE_MASCOT_W = 540;
const CTA_TITLE_H = 190;
const CTA_ROW_GAP = 30;
const CTA_ROW_H = 440;
const CTA_MASCOT_W = 400;

export type MascotBox = { x: number; y: number; w: number };

/** Posição da Gotinha (canto superior esquerdo e largura, em px do vídeo) em cada tipo de cena. */
export const REEL_MASCOT: { scene: MascotBox; cta: MascotBox } = {
  scene: {
    w: SCENE_MASCOT_W,
    x: (REEL.width - SCENE_MASCOT_W) / 2,
    y: pad(REEL).top + HEADER_H + SCENE_TITLE_H + Math.round((SCENE_SLOT_H - SCENE_MASCOT_W * GOTINHA_RATIO) / 2),
  },
  cta: {
    w: CTA_MASCOT_W,
    x: pad(REEL).side,
    y: pad(REEL).top + HEADER_H + CTA_TITLE_H + CTA_ROW_GAP + Math.round((CTA_ROW_H - CTA_MASCOT_W * GOTINHA_RATIO) / 2),
  },
};

/**
 * Cena do Reels: título do slide no alto (ou o selo, na abertura), o espaço da Gotinha no meio
 * (com a ilustração do tema ao lado, como objeto de cena) e a legenda falada embaixo.
 */
export function ReelScene({
  size, accent, label, title, headline, caption, icon,
}: {
  size: Size; accent: string; label?: string; title?: string;
  /** Gancho escrito inteiro, em destaque (abertura): no lugar do selo e do título. */
  headline?: string;
  caption: React.ReactNode; icon?: Illustration;
}) {
  return (
    <Frame size={size} accent={accent} align="start">
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, height: SCENE_TITLE_H, justifyContent: 'flex-end' }}>
        {headline && (
          <div style={{ display: 'flex', fontSize: fit(headline, 64, 52, 40), fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5, color: INK }}>
            {nobreak(headline)}
          </div>
        )}
        {!headline && label && (
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 3 }}>{label}</div>
        )}
        {!headline && title && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', width: 96, height: 10, borderRadius: 5, background: accent }} />
            <div style={{ display: 'flex', marginTop: 28, fontSize: fit(title, 60, 48, 30), fontWeight: 800, lineHeight: 1.12, letterSpacing: -1, color: INK_2 }}>
              {nobreak(title)}
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexShrink: 0, height: SCENE_SLOT_H, justifyContent: 'flex-end', alignItems: 'flex-start' }}>
        {icon && <Art icon={icon} size={210} accent={accent} />}
      </div>
      <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>{caption}</div>
    </Frame>
  );
}

/** "Comenta GUIA": o comentário vira direct com o guia (app/api/instagram/webhook). */
function CommentAsk({ accent, cta, marginTop }: { accent: string; cta: Cta | null; marginTop: number }) {
  return (
    <div style={{ display: 'flex', flexShrink: 0, marginTop, alignItems: 'center' }}>
      <div style={{ display: 'flex', padding: '22px 40px', borderRadius: 999, background: accent, color: BG, fontSize: 40, fontWeight: 800 }}>
        {`Comenta ${DM_KEYWORD}`}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 24, fontSize: 28, fontWeight: 600, lineHeight: 1.25, color: INK_2 }}>
        <span>{cta ? 'que eu te mando o guia' : 'que eu te mando as'}</span>
        <span>{cta ? 'no direct, com desconto' : 'calculadoras no direct'}</span>
      </div>
    </div>
  );
}

/** Chamada do guia no Reels: a Gotinha (camada do render) à esquerda, apontando para o guia. */
export function ReelCta({ size, accent, cta, caption }: { size: Size; accent: string; cta: Cta | null; caption: React.ReactNode }) {
  return (
    <Frame size={size} accent={accent} align="start">
      <div style={{ display: 'flex', flexShrink: 0, height: CTA_TITLE_H, alignItems: 'flex-end', fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1 }}>
        {cta ? 'Quer o passo a passo completo?' : 'Faça a conta sem erro'}
      </div>
      <div style={{ display: 'flex', flexShrink: 0, height: CTA_ROW_H, marginTop: CTA_ROW_GAP, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexShrink: 0, width: CTA_MASCOT_W }} />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: 36 }}>
          {cta ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 2 }}>Guia em PDF</div>
              <div style={{ display: 'flex', marginTop: 12, fontSize: cta.title.length > 40 ? 38 : 44, fontWeight: 800, lineHeight: 1.15 }}>{cta.title}</div>
              <div style={{ display: 'flex', marginTop: 16, fontSize: 64, fontWeight: 800, color: accent }}>{cta.priceLabel}</div>
              {cta.others > 0 && (
                <div style={{ display: 'flex', marginTop: 8, fontSize: 28, color: INK_2 }}>
                  {`e mais ${cta.others} ${cta.others === 1 ? 'guia' : 'guias'} no site`}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', fontSize: 44, lineHeight: 1.3, color: INK_2 }}>Calculadoras grátis de reconstituição, dose e custo.</div>
          )}
        </div>
      </div>
      <CommentAsk accent={accent} cta={cta} marginTop={30} />
      <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>{caption}</div>
    </Frame>
  );
}

/** Último slide do carrossel: o guia, o link e a Gotinha fechando com o bordão. */
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
      <CommentAsk accent={accent} cta={cta} marginTop={48} />
      <div style={{ display: 'flex', marginTop: 36, alignItems: 'center' }}>
        <Gotinha pose="comemorando" size={210} />
        <div style={{ display: 'flex', marginLeft: 28, fontSize: 44, fontWeight: 800, lineHeight: 1.15 }}>{BORDAO_FECHAMENTO}</div>
      </div>
    </Frame>
  );
}
