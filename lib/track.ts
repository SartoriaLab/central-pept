// Eventos personalizados do Plausible. Sem o script carregado (NEXT_PUBLIC_PLAUSIBLE_DOMAIN
// ausente, bloqueador de anúncios) as chamadas não fazem nada.
//
// Cada evento precisa existir como "Goal" no painel do Plausible para aparecer nos relatórios.
// Nunca envie dado pessoal ou de saúde nas props: só o slug do peptídeo/ferramenta.

type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: EventProps }) => void;
  }
}

export const EVENTS = {
  reconstitution: 'Calculo Reconstituicao',
  cost: 'Calculo Custo GLP1',
  icsDownload: 'Download ICS',
  print: 'Imprimir',
  copyResult: 'Copiar Resultado',
  share: 'Compartilhar Calculo',
  embedCopy: 'Embed Copiado',
} as const;

export function track(event: string, props?: EventProps): void {
  if (typeof window === 'undefined') return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // métrica nunca pode quebrar a página
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
