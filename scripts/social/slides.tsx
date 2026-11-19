// Slides do @dosecerta_br em JSX para o satori (subconjunto de CSS: todo nó com mais de um
// filho precisa de display flex). Mesmo visual para carrossel (1080×1350) e Reels (1080×1920).
// O cenário (themes.ts) muda fundo e cores; o tipo de slide (layouts.ts) muda a composição.
import { CATEGORY_HEX } from '@/lib/category-style';
import { INSTAGRAM_HANDLE, INSTAGRAM_NAME, SITE_HOST } from '@/lib/site';
import type { Cta } from './types';
import { illustrationSrc, type Illustration } from './illustrations';
import DropCheck from '@/components/brand/DropCheck';
import Gotinha, { GOTINHA_RATIO } from './mascot';
import type { Pose } from './poses';
import { BORDAO_FECHAMENTO } from './caption';
import { DM_KEYWORD } from '@/lib/instagram-dm';
import { THEMES, accentOn, type Theme } from './themes';
import { lines, sides, type SlideLayout } from './layouts';

export type Size = { width: number; height: number };
export const CAROUSEL: Size = { width: 1080, height: 1350 };
export const REEL: Size = { width: 1080, height: 1920 };

/** Cenário padrão (o azul-escuro de sempre). */
export const DEFAULT_THEME: Theme = THEMES.noite('#14b8a6');

const MYTH = '#ef4444';
const TRUTH = '#16a34a';

export function accentFor(category: string): string {
  return CATEGORY_HEX[category] ?? '#14b8a6';
}

/** Reels: a interface do app cobre o topo e o rodapé; o conteúdo fica na faixa do meio. */
function pad(size: Size) {
  return size.height > 1500 ? { top: 260, bottom: 420, side: 80 } : { top: 72, bottom: 72, side: 80 };
}

const HEADER_H = 62;

/** Caixa translúcida que funciona em fundo claro e escuro. */
const panel = (t: Theme) => (t.light ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.07)');

type Look = { theme: Theme; accent: string };

/** `align="start"`: conteúdo a partir do topo (cenas do Reels, onde a Gotinha entra por cima em posição fixa). */
// Sem faixa colorida na lateral: no Reels ela aparecia como uma linha azul nas transições.
function Frame({
  size, theme, page, align = 'center', children,
}: { size: Size; theme: Theme; page?: string; align?: 'center' | 'start'; children: React.ReactNode }) {
  const p = pad(size);
  const inner = size.width - 2 * p.side;
  return (
    <div
      style={{
        width: size.width, height: size.height, display: 'flex',
        background: theme.bg, color: theme.ink, fontFamily: 'Inter', position: 'relative',
      }}
    >
      {theme.pattern && (
        <div
          style={{
            position: 'absolute', left: 0, top: 0, width: size.width, height: size.height, display: 'flex',
            backgroundImage: theme.pattern.image, backgroundSize: theme.pattern.size,
          }}
        />
      )}
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
        {page && <div style={{ fontSize: 26, fontWeight: 600, color: theme.ink3 }}>{page}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, width: inner, justifyContent: align === 'start' ? 'flex-start' : 'center' }}>{children}</div>
      <div style={{ display: 'flex', flexShrink: 0, height: 40, alignItems: 'flex-end', width: inner, justifyContent: 'space-between', fontSize: 24, color: theme.ink3, fontWeight: 600 }}>
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

/** Gotinha e ilustração lado a lado; `flip` troca os lados. */
function Duo({ theme, pose, icon, accent, mascot, art, align = 'flex-end' }: {
  theme: Theme; pose: Pose; icon?: Illustration; accent: string; mascot: number; art: number; align?: 'flex-end' | 'center';
}) {
  const items = [
    <Gotinha key="g" pose={pose} size={mascot} />,
    icon ? <Art key="a" icon={icon} size={art} accent={accent} /> : <div key="a" style={{ display: 'flex' }} />,
  ];
  return (
    <div style={{ display: 'flex', alignItems: align, justifyContent: 'space-between' }}>
      {theme.flip ? items.reverse() : items}
    </div>
  );
}

/** Selo (MITO, VERDADE, PASSO A PASSO...). */
function Tag({ text, color, ink }: { text: string; color: string; ink: string }) {
  return (
    <div style={{ display: 'flex', alignSelf: 'flex-start', padding: '10px 22px', borderRadius: 999, background: color, color: ink, fontSize: 26, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>
      {text}
    </div>
  );
}

const LAYOUT_TAG: Partial<Record<SlideLayout, string>> = {
  mito: 'Mito ou verdade?', passos: 'Passo a passo', lado: 'Lado a lado', numero: 'Guarda esse número', pergunta: 'Pergunta que eu recebo',
};

/** Capa: a Gotinha fala o gancho num balão. Serve ao carrossel e à capa do Reels. */
export function CoverSlide({
  size, accent: base, hook, label, swipe, icon, pose = 'ih', theme = DEFAULT_THEME,
}: { size: Size; accent: string; hook: string; label: string; swipe: boolean; icon?: Illustration; pose?: Pose; theme?: Theme }) {
  const reel = size.height > 1500;
  const accent = accentOn(theme, base);
  const inner = size.width - 2 * pad(size).side;
  const row = [
    <Gotinha key="g" pose={pose} mouth="aberta" size={reel ? 480 : 380} />,
    <div key="a" style={{ display: 'flex', flexDirection: 'column', alignItems: theme.flip ? 'flex-start' : 'flex-end' }}>
      {icon && <Art icon={icon} size={reel ? 280 : 230} accent={accent} />}
      {swipe && <div style={{ display: 'flex', marginTop: 20, fontSize: 32, fontWeight: 600, color: theme.ink2 }}>Arraste para o lado »</div>}
    </div>,
  ];
  return (
    <Frame size={size} theme={theme}>
      <div style={{ display: 'flex', fontSize: 30, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 3 }}>{label}</div>
      <div
        style={{
          display: 'flex', marginTop: 28, padding: '40px 48px', borderRadius: 44, background: theme.card, color: theme.cardInk,
          fontSize: fit(hook, 84, 70, 45), fontWeight: 800, lineHeight: 1.1, letterSpacing: -2,
        }}
      >
        {nobreak(hook)}
      </div>
      {/* Rabicho do balão, apontando para a Gotinha. */}
      <div style={{ display: 'flex', width: 56, height: 56, marginTop: -30, marginLeft: theme.flip ? inner - 206 : 150, background: theme.card, transform: 'rotate(45deg)' }} />
      <div style={{ display: 'flex', marginTop: 12, alignItems: 'flex-end', justifyContent: 'space-between' }}>
        {theme.flip ? row.reverse() : row}
      </div>
    </Frame>
  );
}

export function ContentSlide({
  size, accent: base, title, body, page, icon, pose = 'explicando', layout = 'padrao', theme = DEFAULT_THEME,
}: {
  size: Size; accent: string; title: string; body: string; page?: string; icon?: Illustration; pose?: Pose;
  layout?: SlideLayout; theme?: Theme;
}) {
  const look: Look = { theme, accent: accentOn(theme, base) };
  const content = (() => {
    switch (layout) {
      case 'mito': return <MythBody look={look} title={title} body={body} pose={pose} icon={icon} />;
      case 'passos': return <StepsBody look={look} title={title} body={body} pose={pose} icon={icon} />;
      case 'lado': return <SidesBody look={look} title={title} body={body} pose={pose} icon={icon} />;
      case 'numero': return <NumberBody look={look} title={title} body={body} pose={pose} icon={icon} />;
      case 'pergunta': return <QuestionBody look={look} title={title} body={body} pose={pose} icon={icon} />;
      default: return <PlainBody look={look} title={title} body={body} pose={pose} icon={icon} />;
    }
  })();
  return (
    <Frame size={size} theme={theme} page={page}>
      {content}
    </Frame>
  );
}

type BodyProps = { look: Look; title: string; body: string; pose: Pose; icon?: Illustration };

function PlainBody({ look: { theme, accent }, title, body, pose, icon }: BodyProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Duo theme={theme} pose={pose} icon={icon} accent={accent} mascot={300} art={220} />
      <div style={{ display: 'flex', marginTop: 20, width: 96, height: 10, borderRadius: 5, background: accent }} />
      <div style={{ display: 'flex', marginTop: 36, fontSize: fit(title, 68, 58, 40), fontWeight: 800, lineHeight: 1.12, letterSpacing: -1 }}>
        {nobreak(title)}
      </div>
      <div style={{ display: 'flex', marginTop: 32, fontSize: fit(body, 46, 40, 160), lineHeight: 1.38, color: theme.ink2 }}>{nobreak(body)}</div>
    </div>
  );
}

function MythBody({ look: { theme, accent }, title, body, pose, icon }: BodyProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Duo theme={theme} pose={pose} icon={icon} accent={accent} mascot={240} art={180} />
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 24, padding: '28px 34px', borderRadius: 28, background: panel(theme), borderLeft: `10px solid ${MYTH}` }}>
        <Tag text="Mito" color={MYTH} ink="#ffffff" />
        <div style={{ display: 'flex', marginTop: 18, fontSize: fit(title, 50, 42, 50), fontWeight: 800, lineHeight: 1.15, color: theme.ink2 }}>
          {`“${nobreak(title)}”`}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 24, padding: '28px 34px', borderRadius: 28, background: panel(theme), borderLeft: `10px solid ${TRUTH}` }}>
        <Tag text="Verdade" color={TRUTH} ink="#ffffff" />
        <div style={{ display: 'flex', marginTop: 18, fontSize: fit(body, 42, 36, 150), fontWeight: 600, lineHeight: 1.32 }}>{nobreak(body)}</div>
      </div>
    </div>
  );
}

function StepsBody({ look: { theme, accent }, title, body, pose, icon }: BodyProps) {
  const steps = lines(body);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Duo theme={theme} pose={pose} icon={icon} accent={accent} mascot={230} art={170} />
      <div style={{ display: 'flex', marginTop: 16 }}><Tag text={LAYOUT_TAG.passos!} color={accent} ink={theme.onAccent} /></div>
      <div style={{ display: 'flex', marginTop: 22, fontSize: fit(title, 60, 50, 40), fontWeight: 800, lineHeight: 1.12, letterSpacing: -1 }}>{nobreak(title)}</div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 26 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', marginTop: i ? 18 : 0 }}>
            <div style={{ display: 'flex', flexShrink: 0, width: 68, height: 68, borderRadius: 68, background: accent, color: theme.onAccent, alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800 }}>
              {String(i + 1)}
            </div>
            <div style={{ display: 'flex', marginLeft: 24, fontSize: steps.length > 3 ? 36 : 40, lineHeight: 1.3, color: theme.ink2 }}>{nobreak(s)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidesBody({ look: { theme, accent }, title, body, pose, icon }: BodyProps) {
  const sd = sides(body);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Duo theme={theme} pose={pose} icon={icon} accent={accent} mascot={240} art={180} />
      <div style={{ display: 'flex', marginTop: 16 }}><Tag text={LAYOUT_TAG.lado!} color={accent} ink={theme.onAccent} /></div>
      <div style={{ display: 'flex', marginTop: 22, fontSize: fit(title, 58, 48, 40), fontWeight: 800, lineHeight: 1.12, letterSpacing: -1 }}>{nobreak(title)}</div>
      <div style={{ display: 'flex', marginTop: 28, gap: 24 }}>
        {sd.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '28px 28px', borderRadius: 28, background: panel(theme), borderTop: `10px solid ${i ? theme.ink3 : accent}` }}>
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 800, color: i ? theme.ink : accent, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
            <div style={{ display: 'flex', marginTop: 14, fontSize: 34, lineHeight: 1.32, color: theme.ink2 }}>{nobreak(s.text)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NumberBody({ look: { theme, accent }, title, body, pose, icon }: BodyProps) {
  const row = [
    <div key="n" style={{ display: 'flex', flexDirection: 'column' }}>
      <Tag text={LAYOUT_TAG.numero!} color={accent} ink={theme.onAccent} />
      <div style={{ display: 'flex', marginTop: 10, fontSize: title.length > 9 ? 130 : 170, fontWeight: 800, letterSpacing: -6, color: accent, lineHeight: 1 }}>{nobreak(title)}</div>
    </div>,
    <Gotinha key="g" pose={pose} size={260} />,
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {icon && <div style={{ display: 'flex', justifyContent: theme.flip ? 'flex-start' : 'flex-end' }}><Art icon={icon} size={170} accent={accent} /></div>}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 10 }}>{theme.flip ? row.reverse() : row}</div>
      <div style={{ display: 'flex', marginTop: 24, width: 96, height: 10, borderRadius: 5, background: accent }} />
      <div style={{ display: 'flex', marginTop: 28, fontSize: fit(body, 46, 40, 150), lineHeight: 1.36, color: theme.ink2 }}>{nobreak(body)}</div>
    </div>
  );
}

function QuestionBody({ look: { theme, accent }, title, body, pose, icon }: BodyProps) {
  const inner = CAROUSEL.width - 2 * pad(CAROUSEL).side;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Tag text={LAYOUT_TAG.pergunta!} color={accent} ink={theme.onAccent} />
      <div style={{ display: 'flex', marginTop: 22, padding: '30px 38px', borderRadius: 36, background: theme.card, color: theme.cardInk, fontSize: fit(title, 54, 46, 50), fontWeight: 800, lineHeight: 1.14, letterSpacing: -1 }}>
        {nobreak(title)}
      </div>
      <div style={{ display: 'flex', width: 44, height: 44, marginTop: -24, marginLeft: theme.flip ? 120 : inner - 164, background: theme.card, transform: 'rotate(45deg)' }} />
      <div style={{ display: 'flex', marginTop: 18, alignItems: 'center', justifyContent: 'space-between' }}>
        {(() => {
          const row = [
            <div key="r" style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: theme.flip ? 0 : 24, paddingLeft: theme.flip ? 24 : 0 }}>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 2 }}>Resposta</div>
              <div style={{ display: 'flex', marginTop: 12, fontSize: fit(body, 42, 36, 150), lineHeight: 1.34, color: theme.ink2 }}>{nobreak(body)}</div>
            </div>,
            <div key="g" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {icon && <Art icon={icon} size={150} accent={accent} />}
              <Gotinha pose={pose} size={230} />
            </div>,
          ];
          return theme.flip ? row.reverse() : row;
        })()}
      </div>
    </div>
  );
}

const HIGHLIGHT = '#facc15';

/** Legenda do Reels: bloco curto em caixa alta, palavra falada em destaque; `pop` = entrada maior. */
export function Caption({ words, active, pop, big = false, theme = DEFAULT_THEME }: { words: string[]; active: number; pop: boolean; big?: boolean; theme?: Theme }) {
  const base = big ? 96 : 80;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px 18px', width: '100%' }}>
      {words.map((w, i) => (
        <div
          key={i}
          style={{
            display: 'flex', padding: '2px 16px', borderRadius: 16, lineHeight: 1.15,
            fontSize: pop ? Math.round(base * 1.08) : base, fontWeight: 800, textTransform: 'uppercase', letterSpacing: -1,
            background: i === active ? HIGHLIGHT : 'transparent', color: i === active ? '#0b1220' : theme.ink,
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
const SIDE_MASCOT_W = 470;
const CTA_TITLE_H = 190;
const CTA_ROW_GAP = 30;
const CTA_ROW_H = 440;
const CTA_MASCOT_W = 400;

export type MascotBox = { x: number; y: number; w: number };
/** Onde a Gotinha fica na cena do Reels; a ilustração vai para o outro lado. */
export type SceneSide = 'center' | 'left' | 'right';

function sceneBox(side: SceneSide): MascotBox {
  const w = side === 'center' ? SCENE_MASCOT_W : SIDE_MASCOT_W;
  const p = pad(REEL);
  const x = side === 'center' ? (REEL.width - w) / 2 : side === 'left' ? p.side : REEL.width - p.side - w;
  return { w, x, y: p.top + HEADER_H + SCENE_TITLE_H + Math.round((SCENE_SLOT_H - w * GOTINHA_RATIO) / 2) };
}

/** Posição da Gotinha (canto superior esquerdo e largura, em px do vídeo) em cada tipo de cena. */
export const REEL_MASCOT: { scene: MascotBox; left: MascotBox; right: MascotBox; cta: MascotBox } = {
  scene: sceneBox('center'),
  left: sceneBox('left'),
  right: sceneBox('right'),
  cta: {
    w: CTA_MASCOT_W,
    x: pad(REEL).side,
    y: pad(REEL).top + HEADER_H + CTA_TITLE_H + CTA_ROW_GAP + Math.round((CTA_ROW_H - CTA_MASCOT_W * GOTINHA_RATIO) / 2),
  },
};

/**
 * Cena do Reels: título do slide no alto (ou o selo, na abertura), o espaço da Gotinha no meio
 * (com a ilustração do tema do outro lado, como objeto de cena) e a legenda falada embaixo.
 */
export function ReelScene({
  size, accent: base, label, title, headline, caption, icon, theme = DEFAULT_THEME, side = 'center', layout,
}: {
  size: Size; accent: string; label?: string; title?: string;
  /** Gancho escrito inteiro, em destaque (abertura): no lugar do selo e do título. */
  headline?: string;
  caption: React.ReactNode; icon?: Illustration; theme?: Theme; side?: SceneSide; layout?: SlideLayout;
}) {
  const accent = accentOn(theme, base);
  const tag = layout ? LAYOUT_TAG[layout] : undefined;
  return (
    <Frame size={size} theme={theme} align="start">
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, height: SCENE_TITLE_H, justifyContent: 'flex-end' }}>
        {headline && (
          <div style={{ display: 'flex', fontSize: fit(headline, 64, 52, 40), fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5, color: theme.ink }}>
            {nobreak(headline)}
          </div>
        )}
        {!headline && label && (
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 3 }}>{label}</div>
        )}
        {!headline && title && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tag ? <Tag text={layout === 'mito' ? 'Mito' : tag} color={layout === 'mito' ? MYTH : accent} ink={layout === 'mito' ? '#ffffff' : theme.onAccent} />
              : <div style={{ display: 'flex', width: 96, height: 10, borderRadius: 5, background: accent }} />}
            <div
              style={{
                display: 'flex', marginTop: 24, fontSize: fit(title, 60, 48, 30), fontWeight: 800, lineHeight: 1.12, letterSpacing: -1,
                color: layout === 'numero' ? accent : theme.ink2,
              }}
            >
              {layout === 'mito' ? `“${nobreak(title)}”` : nobreak(title)}
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexShrink: 0, height: SCENE_SLOT_H, justifyContent: side === 'right' ? 'flex-start' : 'flex-end', alignItems: side === 'center' ? 'flex-start' : 'center' }}>
        {icon && <Art icon={icon} size={side === 'center' ? 210 : 260} accent={accent} />}
      </div>
      <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>{caption}</div>
    </Frame>
  );
}

/** "Comenta GUIA": o comentário vira direct com o guia (app/api/instagram/webhook). */
function CommentAsk({ look: { theme, accent }, cta, marginTop }: { look: Look; cta: Cta | null; marginTop: number }) {
  return (
    <div style={{ display: 'flex', flexShrink: 0, marginTop, alignItems: 'center' }}>
      <div style={{ display: 'flex', padding: '22px 40px', borderRadius: 999, background: accent, color: theme.onAccent, fontSize: 40, fontWeight: 800 }}>
        {`Comenta ${DM_KEYWORD}`}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 24, fontSize: 28, fontWeight: 600, lineHeight: 1.25, color: theme.ink2 }}>
        <span>{cta ? 'que eu te mando o guia' : 'que eu te mando as'}</span>
        <span>{cta ? 'no direct, com desconto' : 'calculadoras no direct'}</span>
      </div>
    </div>
  );
}

/** Chamada do guia no Reels: a Gotinha (camada do render) à esquerda, apontando para o guia. */
export function ReelCta({ size, accent: base, cta, caption, theme = DEFAULT_THEME }: { size: Size; accent: string; cta: Cta | null; caption: React.ReactNode; theme?: Theme }) {
  const look: Look = { theme, accent: accentOn(theme, base) };
  const { accent } = look;
  return (
    <Frame size={size} theme={theme} align="start">
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
                <div style={{ display: 'flex', marginTop: 8, fontSize: 28, color: theme.ink2 }}>
                  {`e mais ${cta.others} ${cta.others === 1 ? 'guia' : 'guias'} no site`}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', fontSize: 44, lineHeight: 1.3, color: theme.ink2 }}>Calculadoras grátis de reconstituição, dose e custo.</div>
          )}
        </div>
      </div>
      <CommentAsk look={look} cta={cta} marginTop={30} />
      <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>{caption}</div>
    </Frame>
  );
}

/** Último slide do carrossel: o guia, o link e a Gotinha fechando com o bordão. */
export function CtaSlide({ size, accent: base, cta, page, theme = DEFAULT_THEME }: { size: Size; accent: string; cta: Cta | null; page?: string; theme?: Theme }) {
  const look: Look = { theme, accent: accentOn(theme, base) };
  const { accent } = look;
  return (
    <Frame size={size} theme={theme} page={page}>
      <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1 }}>
        {cta ? 'Quer o passo a passo completo?' : 'Faça a conta sem erro'}
      </div>
      {cta ? (
        <div style={{ display: 'flex', marginTop: 44, gap: 36, alignItems: 'center' }}>
          <div
            style={{
              width: 300, height: 420, borderRadius: 20, display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between', padding: 28, color: '#0b1220',
              background: `linear-gradient(135deg, ${base}, #e2e8f0)`,
            }}
          >
            <div style={{ display: 'flex', fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>CENTRAL PEPTÍDEOS</div>
            <div style={{ display: 'flex', width: 244, fontSize: cta.title.length > 40 ? 30 : 36, fontWeight: 800, lineHeight: 1.15 }}>{cta.title}</div>
            <div style={{ display: 'flex', fontSize: 16, fontWeight: 800, letterSpacing: 2 }}>GUIA EM PDF</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, color: theme.ink2 }}>Guia em PDF</div>
            <div style={{ display: 'flex', marginTop: 8, fontSize: 64, fontWeight: 800, color: accent }}>{cta.priceLabel}</div>
            {cta.others > 0 && (
              <div style={{ display: 'flex', marginTop: 12, fontSize: 30, color: theme.ink2 }}>
                {`e mais ${cta.others} ${cta.others === 1 ? 'guia' : 'guias'} no site`}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', marginTop: 32, fontSize: 44, lineHeight: 1.38, color: theme.ink2 }}>
          Calculadoras grátis de reconstituição, dose e custo.
        </div>
      )}
      <CommentAsk look={look} cta={cta} marginTop={48} />
      <div style={{ display: 'flex', marginTop: 36, alignItems: 'center' }}>
        <Gotinha pose="comemorando" size={210} />
        <div style={{ display: 'flex', marginLeft: 28, fontSize: 44, fontWeight: 800, lineHeight: 1.15 }}>{BORDAO_FECHAMENTO}</div>
      </div>
    </Frame>
  );
}
