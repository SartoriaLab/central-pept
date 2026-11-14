import { describe, expect, it } from 'vitest';
import { EVENTS } from '@/lib/event-names';
import { STORED_EVENTS, parseSiteEvent } from '@/lib/site-events';

describe('eventos gravados no banco', () => {
  it('aceita clique na oferta e separa página, guia e formato', () => {
    const row = parseSiteEvent({
      e: EVENTS.ebookClick,
      p: { ebook: 'T1', posicao: 'result', pagina: '/ferramentas/reconstituicao/tirzepatida', extra: 'x' },
      u: '/outra',
    });
    expect(row).toEqual({
      name: EVENTS.ebookClick,
      page: '/ferramentas/reconstituicao/tirzepatida',
      ebook: 'T1',
      position: 'result',
      props: { extra: 'x' },
    });
  });

  it('usa o caminho enviado quando não há pagina nas props', () => {
    const row = parseSiteEvent({ e: EVENTS.whatsapp, p: { ferramenta: 'reconstituicao' }, u: '/ferramentas/reconstituicao' });
    expect(row?.page).toBe('/ferramentas/reconstituicao');
    expect(row?.props).toEqual({ ferramenta: 'reconstituicao' });
  });

  it('recusa evento fora da lista, "visto" e lixo', () => {
    expect(parseSiteEvent({ e: EVENTS.ebookView, p: {} })).toBeNull();
    expect(parseSiteEvent({ e: EVENTS.reconstitution, p: {} })).toBeNull();
    expect(parseSiteEvent({ e: 'Qualquer Coisa' })).toBeNull();
    expect(parseSiteEvent(null)).toBeNull();
    expect(parseSiteEvent('texto')).toBeNull();
  });

  it('descarta página externa, chave estranha e valor não primitivo', () => {
    const row = parseSiteEvent({
      e: EVENTS.share,
      p: { 'chave-ruim': 'a', obj: { a: 1 }, via: 'copiar', n: 3 },
      u: 'https://outro.site/x',
    });
    expect(row?.page).toBeNull();
    expect(row?.position).toBe('copiar');
    expect(row?.props).toEqual({ via: 'copiar', n: 3 });
  });

  it('todos os eventos gravados existem em EVENTS', () => {
    const names = new Set<string>(Object.values(EVENTS));
    for (const e of STORED_EVENTS) expect(names.has(e), e).toBe(true);
  });
});
