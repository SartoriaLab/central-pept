// Convite para instalar o site como app (PWA). Regras puras aqui (testadas em
// tests/install.test.ts); o componente é components/pwa/InstallPrompt.tsx.
//
// O Chrome/Android dispara `beforeinstallprompt` logo depois de ler o manifest, às vezes antes
// do React hidratar: um script inline no layout guarda o evento em window.__cpInstall e avisa
// com o evento `cp:install-ready`. O Safari do iPhone não tem esse evento: lá mostramos a
// instrução de "Adicionar à Tela de Início".

export type InstallPlatform = 'ios' | 'android' | 'desktop';

/** Evento do Chrome (não está nos tipos do DOM). */
export type DeferredInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

declare global {
  interface Window {
    __cpInstall?: DeferredInstallPrompt | null;
  }
}

export const INSTALL_READY_EVENT = 'cp:install-ready';
/** Quem fecha o convite só o vê de novo depois disso. */
export const INSTALL_SNOOZE_DAYS = 30;
const DISMISS_KEY = 'cp:instalar-fechado';
const DAY_MS = 24 * 60 * 60 * 1000;

/** Script inline do <head> (app/layout.tsx): captura o evento antes da hidratação. */
export const installCaptureScript = `
window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  window.__cpInstall = e;
  window.dispatchEvent(new Event('${INSTALL_READY_EVENT}'));
});
`.trim();

/** iPadOS se apresenta como Mac: o que denuncia é a tela de toque. */
export function detectPlatform(ua: string, maxTouchPoints = 0): InstallPlatform {
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Macintosh/i.test(ua) && maxTouchPoints > 1) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

/**
 * Navegador interno de rede social (Instagram, Facebook, TikTok, Line): lá não existe
 * "Adicionar à Tela de Início" nem prompt. A pessoa precisa abrir no Safari ou Chrome.
 */
export function isInAppBrowser(ua: string): boolean {
  return /Instagram|FBAN|FBAV|FB_IAB|musical_ly|BytedanceWebview|TikTok|\bLine\//i.test(ua);
}

/**
 * Qual passo a passo mostrar. No iPhone muda com o navegador e a versão: a partir do
 * Safari 26 (iOS 26) o Compartilhar fica dentro do menu "•••" ao lado do endereço; até o
 * iOS 18 é o botão do meio da barra de baixo; no Chrome fica no topo, ao lado do endereço.
 * A versão do iOS no UA está congelada em 18_x: o que vale é o `Version/` do Safari.
 */
export type InstallGuideKind =
  | 'ios-safari26'
  | 'ios-safari'
  | 'ios-chrome'
  | 'ios-outro'
  | 'android'
  | 'in-app'
  | 'desktop';

export function guideKind(ua: string, maxTouchPoints = 0): InstallGuideKind {
  if (isInAppBrowser(ua)) return 'in-app';
  const platform = detectPlatform(ua, maxTouchPoints);
  if (platform === 'android') return 'android';
  if (platform === 'desktop') return 'desktop';
  if (/CriOS/i.test(ua)) return 'ios-chrome';
  if (/FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(ua)) return 'ios-outro';
  const version = Number(/Version\/(\d+)/.exec(ua)?.[1]);
  return version >= 26 ? 'ios-safari26' : 'ios-safari';
}

/**
 * Onde fica o primeiro toque no navegador do iPhone, para o lembrete que continua na tela
 * depois da janela (InstallGuide) apontar para lá. `null`: sem lembrete (Android instala em
 * um toque; no navegador de rede social o primeiro passo é sair dele). No iPad a barra do
 * Safari fica em cima.
 */
export type HintSpot = 'bottom-right' | 'bottom-center' | 'top-right' | 'none';

export function hintSpot(kind: InstallGuideKind, ua = ''): HintSpot | null {
  if (!kind.startsWith('ios-')) return null;
  if (kind === 'ios-outro') return 'none';
  if (/iPad|Macintosh/i.test(ua) || kind === 'ios-chrome') return 'top-right';
  return kind === 'ios-safari26' ? 'bottom-right' : 'bottom-center';
}

/** Abre a janela com o passo a passo (components/pwa/InstallGuide.tsx, montada no layout). */
export const INSTALL_GUIDE_EVENT = 'cp:install-guide';
export function openInstallGuide(): void {
  window.dispatchEvent(new Event(INSTALL_GUIDE_EVENT));
}

// Instalação contada uma vez por aparelho. No Android o Chrome avisa (`appinstalled`); no
// iPhone não existe aviso, então conta na primeira vez que o site abre pelo ícone.
const INSTALLED_KEY = 'cp:app-instalado';

/** Marca a instalação como contada. Devolve false se já tinha sido contada neste aparelho. */
export function markInstalledOnce(): boolean {
  try {
    if (window.localStorage.getItem(INSTALLED_KEY)) return false;
    window.localStorage.setItem(INSTALLED_KEY, String(Date.now()));
    return true;
  } catch {
    return false;
  }
}

/** Aberto pelo ícone da tela inicial (já instalado). */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.matchMedia?.('(display-mode: standalone)').matches) return true;
  } catch {
    // navegador antigo
  }
  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** Fechou o convite há menos de INSTALL_SNOOZE_DAYS? */
export function dismissedRecently(dismissedAt: number | null, now: number): boolean {
  return dismissedAt != null && now - dismissedAt < INSTALL_SNOOZE_DAYS * DAY_MS;
}

export function readDismissedAt(): number | null {
  try {
    const n = Number(window.localStorage.getItem(DISMISS_KEY));
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function dismissInstall(now = Date.now()): void {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(now));
  } catch {
    // modo privado: o convite volta na próxima visita, sem problema
  }
}

// Banner flutuante (todas as páginas): fechado no X, volta depois de FLOAT_SNOOZE_DAYS.
// Chave própria: fechar o banner não esconde o cartão da calculadora, e vice-versa.
export const FLOAT_SNOOZE_DAYS = 7;
const FLOAT_KEY = 'cp:banner-app-fechado';

export function floatDismissed(now = Date.now()): boolean {
  try {
    const at = Number(window.localStorage.getItem(FLOAT_KEY));
    return Number.isFinite(at) && at > 0 && now - at < FLOAT_SNOOZE_DAYS * DAY_MS;
  } catch {
    return false;
  }
}

export function dismissFloat(now = Date.now()): void {
  try {
    window.localStorage.setItem(FLOAT_KEY, String(now));
  } catch {
    // modo privado: volta na próxima página
  }
}

export type InstallState = {
  platform: InstallPlatform;
  standalone: boolean;
  dismissed: boolean;
  hasPrompt: boolean;
  inIframe: boolean;
  inApp: boolean;
};

/**
 * Mostrar o convite? Nunca no embed, no navegador de rede social, para quem já instalou
 * ou fechou há pouco. iPhone sempre (instrução manual); Android e computador só quando o
 * navegador ofereceu a instalação (sem o evento, o botão não teria o que fazer).
 */
export function shouldOfferInstall(s: InstallState): boolean {
  if (s.inIframe || s.inApp || s.standalone || s.dismissed) return false;
  if (s.platform === 'ios') return true;
  return s.hasPrompt;
}

// Dias distintos de uso: quem volta em outro dia é quem mais ganha com o ícone.
const VISIT_DAYS_KEY = 'cp:dias-uso';
const MAX_VISIT_DAYS = 30;

/** Acrescenta `today` (AAAA-MM-DD) à lista, sem repetir, guardando os últimos MAX_VISIT_DAYS. */
export function addVisitDay(days: string[], today: string): string[] {
  if (days.includes(today)) return days;
  return [...days, today].slice(-MAX_VISIT_DAYS);
}

/** Registra o dia de hoje e devolve em quantos dias distintos a pessoa já usou o site. */
export function countVisitDay(now = new Date()): number {
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  try {
    const raw = window.localStorage.getItem(VISIT_DAYS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const days = Array.isArray(parsed) ? parsed.filter((d): d is string => typeof d === 'string') : [];
    const next = addVisitDay(days, today);
    if (next !== days) window.localStorage.setItem(VISIT_DAYS_KEY, JSON.stringify(next));
    return next.length;
  } catch {
    return 1;
  }
}
