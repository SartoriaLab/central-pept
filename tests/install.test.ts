import { describe, expect, it } from 'vitest';
import {
  INSTALL_SNOOZE_DAYS,
  addVisitDay,
  detectPlatform,
  dismissedRecently,
  guideKind,
  hintSpot,
  isInAppBrowser,
  shouldOfferInstall,
  type InstallState,
} from '@/lib/install';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const WINDOWS = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15';

describe('plataforma do convite de instalação', () => {
  it('reconhece iPhone, Android e computador', () => {
    expect(detectPlatform(IPHONE)).toBe('ios');
    expect(detectPlatform(ANDROID)).toBe('android');
    expect(detectPlatform(WINDOWS)).toBe('desktop');
    expect(detectPlatform(MAC)).toBe('desktop');
  });

  it('iPad que se apresenta como Mac é iOS', () => {
    expect(detectPlatform(MAC, 5)).toBe('ios');
  });

  it('escolhe o passo a passo certo para cada navegador', () => {
    const IOS26 = IPHONE.replace('Version/18.1', 'Version/26.1').replace('OS 18_1', 'OS 18_6');
    const CHROME_IOS = IPHONE.replace('Version/18.1', 'CriOS/130.0.0.0');
    expect(guideKind(IPHONE)).toBe('ios-safari');
    expect(guideKind(IOS26)).toBe('ios-safari26'); // iOS congelado em 18_x no UA: vale o Version/
    expect(guideKind(CHROME_IOS)).toBe('ios-chrome');
    expect(guideKind(IPHONE.replace('Version/18.1', 'FxiOS/130.0'))).toBe('ios-outro');
    expect(guideKind(ANDROID)).toBe('android');
    expect(guideKind(WINDOWS)).toBe('desktop');
    expect(guideKind(`${IOS26} Instagram 300.0.0.0`)).toBe('in-app');
  });

  it('aponta o lembrete para o botão certo do navegador do iPhone', () => {
    expect(hintSpot('ios-safari26', IPHONE)).toBe('bottom-right');
    expect(hintSpot('ios-safari', IPHONE)).toBe('bottom-center');
    expect(hintSpot('ios-chrome', IPHONE)).toBe('top-right');
    expect(hintSpot('ios-safari', MAC)).toBe('top-right'); // iPad: barra em cima
    expect(hintSpot('ios-outro', IPHONE)).toBe('none');
    expect(hintSpot('android', ANDROID)).toBeNull();
    expect(hintSpot('in-app', IPHONE)).toBeNull();
  });

  it('reconhece o navegador interno do Instagram e do Facebook', () => {
    expect(isInAppBrowser(`${IPHONE} Instagram 300.0.0.0 (iPhone15,2; iOS 18_1; pt_BR)`)).toBe(true);
    expect(isInAppBrowser(`${ANDROID} [FB_IAB/FB4A;FBAV/480.0.0.0;]`)).toBe(true);
    expect(isInAppBrowser(IPHONE)).toBe(false);
    expect(isInAppBrowser(ANDROID)).toBe(false);
  });
});

describe('quando mostrar o convite', () => {
  const base: InstallState = { platform: 'android', standalone: false, dismissed: false, hasPrompt: true, inIframe: false, inApp: false };

  it('Android e computador só com o evento do navegador', () => {
    expect(shouldOfferInstall(base)).toBe(true);
    expect(shouldOfferInstall({ ...base, hasPrompt: false })).toBe(false);
    expect(shouldOfferInstall({ ...base, platform: 'desktop', hasPrompt: false })).toBe(false);
  });

  it('iPhone mostra a instrução mesmo sem evento', () => {
    expect(shouldOfferInstall({ ...base, platform: 'ios', hasPrompt: false })).toBe(true);
  });

  it('nunca no embed, já instalado ou fechado há pouco', () => {
    expect(shouldOfferInstall({ ...base, inIframe: true })).toBe(false);
    expect(shouldOfferInstall({ ...base, standalone: true })).toBe(false);
    expect(shouldOfferInstall({ ...base, platform: 'ios', dismissed: true })).toBe(false);
  });

  it('nunca no navegador de rede social, onde não dá para instalar', () => {
    expect(shouldOfferInstall({ ...base, platform: 'ios', hasPrompt: false, inApp: true })).toBe(false);
  });

  it('conta dias distintos de uso, sem repetir', () => {
    expect(addVisitDay([], '2026-11-16')).toEqual(['2026-11-16']);
    expect(addVisitDay(['2026-11-16'], '2026-11-16')).toEqual(['2026-11-16']);
    expect(addVisitDay(['2026-11-15'], '2026-11-16')).toEqual(['2026-11-15', '2026-11-16']);
    const many = Array.from({ length: 30 }, (_, i) => `2026-10-${String(i + 1).padStart(2, '0')}`);
    expect(addVisitDay(many, '2026-11-16')).toHaveLength(30);
  });

  it('volta a aparecer depois do prazo', () => {
    const day = 24 * 60 * 60 * 1000;
    const now = Date.UTC(2026, 10, 16);
    expect(dismissedRecently(null, now)).toBe(false);
    expect(dismissedRecently(now - day, now)).toBe(true);
    expect(dismissedRecently(now - (INSTALL_SNOOZE_DAYS + 1) * day, now)).toBe(false);
  });
});
