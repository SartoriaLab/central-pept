// Oferta da página atual, para o pop-up de saída (ExitOffer, montado no layout) saber o que
// oferecer sem cada página ter de passar a oferta duas vezes. EbookOffer registra ao montar.
//
// Também guarda os sinais de "a pessoa já decidiu" que valem para toda a visita:
// clicou numa oferta ou fechou a barra → o pop-up não aparece.

import type { EbookOffer } from '@/lib/ebooks';

let current: EbookOffer | null = null;
const listeners = new Set<() => void>();

export function setPageOffer(offer: EbookOffer | null): void {
  if (current?.id === offer?.id) return;
  current = offer;
  listeners.forEach((l) => l());
}

export function clearPageOffer(offer: EbookOffer): void {
  if (current?.id !== offer.id) return;
  current = null;
  listeners.forEach((l) => l());
}

export function getPageOffer(): EbookOffer | null {
  return current;
}

export function subscribePageOffer(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const CLICKED = 'cp:oferta-clicada';
const BAR_OFF = 'cp:barra-oferta-fechada';

function session(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function markOfferClicked(): void {
  try {
    session()?.setItem(CLICKED, '1');
  } catch {
    // modo privado: sem memória, sem problema
  }
}

export function offerClicked(): boolean {
  try {
    return session()?.getItem(CLICKED) === '1';
  } catch {
    return false;
  }
}

export function closeOfferBar(): void {
  try {
    session()?.setItem(BAR_OFF, '1');
  } catch {
    // idem
  }
}

export function offerBarClosed(): boolean {
  try {
    return session()?.getItem(BAR_OFF) === '1';
  } catch {
    return false;
  }
}
