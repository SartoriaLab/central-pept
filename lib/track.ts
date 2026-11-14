// Eventos de métrica. As ações de STORED_EVENTS (lib/site-events.ts) vão para o banco via
// /api/evento (relatório em /admin/assistente/eventos). Se o Plausible estiver ligado
// (NEXT_PUBLIC_PLAUSIBLE_DOMAIN), todos os eventos também vão para ele, como "Goal".
// Nunca envie dado pessoal ou de saúde nas props: só o slug do peptídeo/ferramenta.

type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: EventProps }) => void;
  }
}

export { EVENTS } from './event-names';
import { STORED_EVENTS } from './site-events';

export function track(event: string, props?: EventProps): void {
  if (typeof window === 'undefined') return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // métrica nunca pode quebrar a página
  }
  if (!STORED_EVENTS.has(event)) return;
  try {
    const body = JSON.stringify({ e: event, p: props ?? {}, u: window.location.pathname });
    if (!navigator.sendBeacon?.('/api/evento', body)) {
      void fetch('/api/evento', { method: 'POST', body, keepalive: true }).catch(() => {});
    }
  } catch {
    // idem
  }
}

const sent = new Set<string>();

/** Dispara no máximo uma vez por carregamento de página para a mesma combinação evento + props. */
export function trackOnce(event: string, props?: EventProps): void {
  const key = `${event}|${JSON.stringify(props ?? {})}`;
  if (sent.has(key)) return;
  sent.add(key);
  track(event, props);
}
