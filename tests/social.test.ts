// Automação do Instagram (scripts/social): escolha de tema, barreira de conteúdo, legenda,
// guia do slide final e o cliente da Graph API. Nada aqui chama rede.
import { describe, expect, it } from 'vitest';
import { bioUrl } from '@/lib/promocao/utm';
import { getEbooks } from '@/lib/ebooks';
import { buildTopics } from '@/scripts/social/topics';
import { COOLDOWN_DAYS, pickTopic } from '@/scripts/social/pick';
import { extractQuantities, validateDraft } from '@/scripts/social/validate';
import { MAX_CAPTION, MAX_HASHTAGS, buildCaption } from '@/scripts/social/caption';
import { ctaFor } from '@/scripts/social/ebook-cta';
import { InstagramClient } from '@/scripts/social/instagram';
import { toSpeech } from '@/scripts/social/render';
import type { Draft, HistoryEntry, Topic } from '@/scripts/social/types';

const DAY = 86_400_000;
const now = new Date('2026-12-01T15:00:00Z');

const topic = (id: string, category = 'glp-1'): Topic => ({
  id, kind: 'peptide', slug: id, title: id, category, peptides: [id], url: `/peptideos/${id}`, source: '',
});

const draft = (over: Partial<Draft> = {}): Draft => ({
  hook: 'Você está diluindo errado?',
  slides: [
    { title: 'Dose', body: 'A dose típica é 2,5 mg por semana.' },
    { title: 'Frasco', body: 'Frascos de 5 mg e 10 mg são os mais comuns.' },
  ],
  narration: ['Primeira fala.', 'Segunda fala.', 'Terceira fala.'],
  caption: 'Texto da legenda.',
  ...over,
});

describe('bioUrl', () => {
  it('marca origem e UTM do Instagram', () => {
    const u = bioUrl('/ebooks/kit-comeco-seguro');
    expect(u).toContain('origem=bio');
    expect(u).toContain('utm_source=instagram');
    expect(u).toContain('utm_medium=bio');
    expect(bioUrl('/blog')).not.toContain('origem=');
  });
});

describe('temas', () => {
  const topics = buildTopics();

  it('ids únicos e fonte não vazia', () => {
    const ids = topics.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of topics) expect(t.source.length, t.id).toBeGreaterThan(40);
  });

  it('sem Melanotan II e sem posts de compra ou preço', () => {
    expect(topics.some((t) => t.peptides.includes('melanotan-ii'))).toBe(false);
    expect(topics.some((t) => /comprar|preco/.test(t.slug))).toBe(false);
  });

  it('fonte do post sem componentes MDX', () => {
    for (const t of topics.filter((x) => x.kind === 'post')) {
      expect(t.source, t.id).not.toMatch(/<Callout|<Guia|<Link/);
    }
  });
});

describe('pickTopic', () => {
  const list = [topic('a'), topic('b', 'healing'), topic('c')];

  it('prefere tema nunca usado', () => {
    const h: HistoryEntry[] = [{ topicId: 'a', format: 'carrossel', category: 'glp-1', at: new Date(now.getTime() - 100 * DAY) }];
    expect(pickTopic(list, h, 'reels', now)?.id).toBe('b');
  });

  it(`não repete antes de ${COOLDOWN_DAYS} dias`, () => {
    const h: HistoryEntry[] = [
      { topicId: 'a', format: 'carrossel', category: 'glp-1', at: new Date(now.getTime() - 3 * DAY) },
      { topicId: 'b', format: 'reels', category: 'healing', at: new Date(now.getTime() - 2 * DAY) },
    ];
    expect(pickTopic(list, h, 'carrossel', now)?.id).toBe('c');
  });

  it('evita a categoria da última publicação', () => {
    const h: HistoryEntry[] = [{ topicId: 'x', format: 'reels', category: 'glp-1', at: new Date(now.getTime() - DAY) }];
    expect(pickTopic(list, h, 'carrossel', now)?.id).toBe('b');
  });

  it('todos em quarentena: volta o de uso mais antigo', () => {
    const h: HistoryEntry[] = ['a', 'b', 'c'].map((id, i) => ({
      topicId: id, format: 'reels' as const, category: 'glp-1', at: new Date(now.getTime() - (10 - i) * DAY),
    }));
    expect(pickTopic(list, h, 'reels', now)?.id).toBe('a');
  });

  it('pula temas excluídos nesta execução', () => {
    expect(pickTopic(list, [], 'reels', now, new Set(['a']))?.id).toBe('b');
  });
});

describe('validateDraft', () => {
  const source = 'Dose típica: 2.5 mg por semana. Frascos comuns: 5 mg, 10 mg. Faixa: 200-500 mcg/dia.';

  it('extrai quantidades com vírgula, faixa e plural', () => {
    expect([...extractQuantities('de 2,5 mg a 15 mg; 200-500 mcg; 4 semanas; 30 U')]).toEqual(
      expect.arrayContaining(['2.5 mg', '15 mg', '200 mcg', '500 mcg', '4 semana', '30 u']),
    );
  });

  it('aprova números que estão na fonte', () => {
    expect(validateDraft(draft(), source)).toEqual([]);
  });

  it('aceita ponta de faixa da fonte', () => {
    const d = draft({ slides: [{ title: 'Faixa', body: 'Começa em 200 mcg.' }, { title: 'B', body: 'Texto.' }] });
    expect(validateDraft(d, source)).toEqual([]);
  });

  it('barra número inventado', () => {
    const d = draft({ hook: 'Suba para 7,5 mg já?' });
    expect(validateDraft(d, source).join()).toContain('7.5 mg');
  });

  it('barra venda e promessa', () => {
    expect(validateDraft(draft({ caption: 'Compre já com frete grátis' }), source).length).toBeGreaterThan(0);
    expect(validateDraft(draft({ caption: 'Perca 10 kg em um mês' }), source).length).toBeGreaterThan(0);
    expect(validateDraft(draft({ caption: 'Resultado garantido' }), source).length).toBeGreaterThan(0);
  });

  it('barra quantidade de slides e falas fora do limite', () => {
    expect(validateDraft(draft({ slides: [{ title: 'a', body: 'b' }] }), source).length).toBeGreaterThan(0);
    expect(validateDraft(draft({ narration: ['só uma'] }), source).length).toBeGreaterThan(0);
  });
});

describe('legenda', () => {
  const t: Topic = { ...topic('tirzepatida'), peptides: ['tirzepatida'] };
  const cta = { id: 'KIT', slug: 'kit', title: 'Kit Começo Seguro', priceLabel: 'R$ 69,90', cover: '', others: 4 };

  it('tem chamada da bio, aviso e até 5 hashtags', () => {
    const c = buildCaption(draft(), t, cta);
    expect(c).toContain('Link na bio');
    expect(c).toContain('Kit Começo Seguro');
    expect(c).toContain('Não substitui orientação médica');
    expect((c.match(/#\w+/g) ?? []).length).toBeLessThanOrEqual(MAX_HASHTAGS);
    expect(c).toContain('#tirzepatida');
  });

  it('corta o corpo para caber no limite do Instagram', () => {
    const c = buildCaption(draft({ caption: 'x'.repeat(5000) }), t, cta);
    expect(c.length).toBeLessThanOrEqual(MAX_CAPTION);
    expect(c).toContain('#tirzepatida');
  });
});

describe('ctaFor', () => {
  const all = new Set(getEbooks().map((e) => e.slug));
  const pep = (slug: string): Topic => ({ ...topic(slug), peptides: [slug] });

  it('usa o guia do peptídeo quando ativo', () => {
    const cta = ctaFor(pep('tirzepatida'), all);
    expect(cta?.slug).toBe('tirzepatida-antes-de-subir-a-dose');
    expect(cta?.others).toBeGreaterThan(0);
  });

  it('guia inativo cai para o kit', () => {
    const cta = ctaFor(pep('tirzepatida'), new Set(['kit-comeco-seguro', 'semaglutida-manual']));
    expect(cta?.slug).toBe('kit-comeco-seguro');
  });

  it('nenhum guia ativo: sem CTA de guia', () => {
    expect(ctaFor(pep('tirzepatida'), new Set())).toBeNull();
  });

  it('nunca usa a tabela personalizada como guia', () => {
    const cta = ctaFor(pep('tirzepatida'), new Set(['tabela-personalizada']));
    expect(cta).toBeNull();
  });
});

describe('InstagramClient', () => {
  type Call = { url: string; body?: string };

  /** fetch falso: responde em ordem e guarda as chamadas. */
  function fakeFetch(responses: unknown[]) {
    const calls: Call[] = [];
    const fn = (async (url: string, init?: RequestInit) => {
      calls.push({ url, body: init?.body as string | undefined });
      const json = responses.shift();
      return new Response(JSON.stringify(json), { status: (json as { error?: unknown })?.error ? 400 : 200 });
    }) as unknown as typeof fetch;
    return { fn, calls };
  }

  const opts = { userId: '17841', token: 'IGtok', sleep: async () => {}, pollMs: 1, timeoutMs: 1000 };

  it('carrossel: itens, espera, container e publicação, nessa ordem', async () => {
    const { fn, calls } = fakeFetch([
      { id: 'c1' }, { id: 'c2' },
      { status_code: 'FINISHED' }, { status_code: 'FINISHED' },
      { id: 'car' }, { status_code: 'FINISHED' },
      { id: 'post1' },
    ]);
    const ig = new InstagramClient({ ...opts, fetchFn: fn });
    expect(await ig.publishCarousel(['https://x/1.jpg', 'https://x/2.jpg'], 'legenda')).toBe('post1');
    expect(calls[0].body).toContain('is_carousel_item=true');
    expect(calls[4].body).toContain('media_type=CAROUSEL');
    expect(calls[4].body).toContain('children=c1%2Cc2');
    expect(calls[6].url).toContain('/17841/media_publish');
    expect(calls[6].body).toContain('creation_id=car');
    expect(calls.every((c) => (c.body ?? c.url).includes('access_token=IGtok'))).toBe(true);
  });

  it('reels espera sair de IN_PROGRESS antes de publicar', async () => {
    const { fn, calls } = fakeFetch([
      { id: 'r1' }, { status_code: 'IN_PROGRESS' }, { status_code: 'IN_PROGRESS' }, { status_code: 'FINISHED' }, { id: 'post2' },
    ]);
    const ig = new InstagramClient({ ...opts, fetchFn: fn });
    expect(await ig.publishReel('https://x/r.mp4', 'legenda')).toBe('post2');
    expect(calls[0].body).toContain('media_type=REELS');
    expect(calls).toHaveLength(5);
  });

  it('container com ERROR não publica', async () => {
    const { fn, calls } = fakeFetch([{ id: 'r1' }, { status_code: 'ERROR', status: 'formato inválido' }]);
    const ig = new InstagramClient({ ...opts, fetchFn: fn });
    await expect(ig.publishReel('https://x/r.mp4', 'l')).rejects.toThrow('ERROR');
    expect(calls.some((c) => c.url.includes('media_publish'))).toBe(false);
  });

  it('erro da API vira exceção com a mensagem da Meta', async () => {
    const { fn } = fakeFetch([{ error: { message: 'Invalid OAuth access token', code: 190 } }]);
    const ig = new InstagramClient({ ...opts, fetchFn: fn });
    await expect(ig.publishReel('https://x/r.mp4', 'l')).rejects.toThrow('Invalid OAuth access token');
  });

  it('renova o token', async () => {
    const { fn, calls } = fakeFetch([{ access_token: 'novo', token_type: 'bearer', expires_in: 5_184_000 }]);
    const r = await new InstagramClient({ ...opts, fetchFn: fn }).refreshToken();
    expect(r.token).toBe('novo');
    expect(calls[0].url).toContain('/refresh_access_token?grant_type=ig_refresh_token');
  });
});

describe('voz', () => {
  it('unidades por extenso', () => {
    expect(toSpeech('Comece com 2,5 mg e 250 mcg, 10 U, 5%')).toBe(
      'Comece com 2,5 miligramas e 250 microgramas, 10 unidades, 5 por cento',
    );
  });
});
