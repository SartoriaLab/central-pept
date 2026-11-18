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
import { nobreak } from '@/scripts/social/slides';
import { beatsFor, chunkWords } from '@/scripts/social/captions';
import { wordsFromChars } from '@/scripts/social/voice';
import { ILLUSTRATION_KEYS } from '@/scripts/social/illustrations';
import { MOUTHS, POSES, POSE_HINTS } from '@/scripts/social/poses';
import { BLINK, BLINK_GAP, blinkTrack, mascotTimeline, mouthTrack } from '@/scripts/social/lipsync';
import { existsSync } from 'node:fs';
import path from 'node:path';
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
  narration: [{ text: 'Primeira fala.' }, { text: 'Segunda fala.', pose: 'explicando' }, { text: 'Terceira fala.' }],
  caption: 'Texto da legenda.',
  question: 'Qual frasco você usa?',
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

  it('barra ilustração fora da lista', () => {
    const d = draft({ slides: [{ title: 'a', body: 'b', icon: 'unicornio' as never }, { title: 'c', body: 'd', icon: 'seringa' }] });
    expect(validateDraft(d, source).join()).toContain('unicornio');
  });

  it('exige pergunta curta terminando em "?"', () => {
    expect(validateDraft(draft({ question: 'Conta pra gente' }), source).join()).toContain('?');
    expect(validateDraft(draft({ question: `${'x'.repeat(130)}?` }), source).length).toBeGreaterThan(0);
  });

  it('barra quantidade de slides e falas fora do limite', () => {
    expect(validateDraft(draft({ slides: [{ title: 'a', body: 'b' }] }), source).length).toBeGreaterThan(0);
    expect(validateDraft(draft({ narration: [{ text: 'só uma' }] }), source).length).toBeGreaterThan(0);
  });

  it('barra pose fora da lista', () => {
    expect(validateDraft(draft({ hookPose: 'voando' as never }), source).join()).toContain('voando');
    const d = draft({ narration: [{ text: 'Um.' }, { text: 'Dois.', pose: 'dançando' as never }, { text: 'Três.' }] });
    expect(validateDraft(d, source).join()).toContain('dançando');
  });

  it('gancho curto e sem cumprimento', () => {
    expect(validateDraft(draft({ hook: 'Oi, amiga! Você dilui errado?' }), source).join()).toContain('cumprimento');
    const d = draft({ narration: [{ text: 'Olá, tudo bem com você?' }, { text: 'Dois.' }, { text: 'Três.' }] });
    expect(validateDraft(d, source).join()).toContain('cumprimento');
    expect(validateDraft(draft({ hook: `Você ${'faz isso '.repeat(9)}?` }), source).join()).toContain('gancho com');
    expect(validateDraft(draft({ hook: 'Oito em cada dez erram a diluição' }), source)).toEqual([]);
  });

  it('barra bordão escrito pelo Claude (o código já acrescenta)', () => {
    const d = draft({ narration: [{ text: 'Um.' }, { text: 'Senta que a Gotinha te explica tudo.' }, { text: 'Três.' }] });
    expect(validateDraft(d, source).join()).toContain('bordão');
    expect(validateDraft(draft({ caption: 'Gotinha falou, tá falado!' }), source).join()).toContain('bordão');
  });
});

describe('legenda', () => {
  const t: Topic = { ...topic('tirzepatida'), peptides: ['tirzepatida'] };
  const cta = { id: 'KIT', slug: 'kit', title: 'Kit Começo Seguro', priceLabel: 'R$ 69,90', cover: '', others: 4 };

  it('ordem: gancho e salvar, corpo, pergunta, seguir, guia, aviso, hashtags', () => {
    const c = buildCaption(draft(), t, cta);
    const order = ['Você está diluindo errado? 📌 Salve', 'Texto da legenda.', '💬 Qual frasco você usa?', 'Siga @dosecerta_br', 'Kit Começo Seguro', 'Não substitui orientação médica', '#tirzepatida'];
    const at = order.map((s) => c.indexOf(s));
    expect(at.every((i) => i >= 0)).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
    expect(c).toContain('link da bio');
    expect(c.split('\n')[0]).toContain('Salve');
  });

  it('gancho sem pontuação ganha ponto antes do pedido para salvar', () => {
    expect(buildCaption(draft({ hook: 'Isso ajuda de verdade' }), t, cta).split('\n')[0]).toBe('Isso ajuda de verdade. 📌 Salve para consultar depois.');
  });

  it('até 5 hashtags, com o nome comercial', () => {
    const c = buildCaption(draft(), t, cta);
    expect((c.match(/#\w+/g) ?? []).length).toBeLessThanOrEqual(MAX_HASHTAGS);
    expect(c).toContain('#mounjaro');
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

describe('slides', () => {
  it('não quebra linha entre número e unidade nem em mg/ml', () => {
    expect(nobreak('2,5 mg e 50 unidades, 5 mg/ml, 4 semanas, 2 mgx')).toBe(
      '2,5 mg e 50 unidades, 5 mg/⁠ml, 4 semanas, 2 mgx',
    );
  });
});

describe('ilustrações', () => {
  it('toda chave tem o PNG na pasta', () => {
    for (const k of ILLUSTRATION_KEYS) {
      expect(existsSync(path.join(process.cwd(), 'scripts', 'social', 'illustrations', `${k}.png`)), k).toBe(true);
    }
  });
});

describe('legenda do Reels', () => {
  const w = (text: string, start: number, end = start + 0.2) => ({ text, start, end });

  it('junta caracteres da ElevenLabs em palavras', () => {
    const chars = [...'Oi, você?'];
    const t = chars.map((_, i) => i * 0.1);
    expect(wordsFromChars(chars, t, t.map((x) => x + 0.1))).toEqual([
      { text: 'Oi,', start: 0, end: expect.closeTo(0.3) },
      { text: 'você?', start: expect.closeTo(0.4), end: expect.closeTo(0.9) },
    ]);
  });

  it('blocos de até 3 palavras, quebrando na pontuação e na pausa', () => {
    const words = [w('Mounjaro', 0), w('dando', 0.3), w('enjoo?', 0.6), w('Isso', 1.2), w('aqui', 1.4), w('ajuda', 1.6), w('de', 1.8), w('verdade.', 2)];
    expect(chunkWords(words).map((c) => c.words.join(' '))).toEqual(['Mounjaro dando', 'enjoo?', 'Isso aqui ajuda', 'de verdade']);
  });

  it('quadros cobrem a cena inteira, sem buraco, com salto na entrada de cada bloco', () => {
    const chunks = chunkWords([w('um', 0.2), w('dois', 0.5), w('três.', 0.8), w('quatro', 1.4)]);
    const beats = beatsFor(chunks, 2);
    expect(beats[0].start).toBe(0);
    expect(beats.at(-1)?.end).toBe(2);
    beats.slice(1).forEach((b, i) => expect(b.start).toBeCloseTo(beats[i].end));
    expect(beats.filter((b) => b.pop)).toHaveLength(2);
  });
});

describe('voz', () => {
  it('unidades por extenso', () => {
    expect(toSpeech('Comece com 2,5 mg e 250 mcg, 10 U, 5%')).toBe(
      'Comece com 2,5 miligramas e 250 microgramas, 10 unidades, 5 por cento',
    );
  });
});

describe('Gotinha', () => {
  const w = (text: string, start: number, end: number) => ({ text, start, end });
  const words = [w('Você', 0.3, 0.6), w('guarda', 0.62, 1.0), w('errado?', 1.4, 1.9)];

  it('toda pose tem dica para o Claude', () => {
    expect(POSES.length).toBe(8);
    for (const p of POSES) expect(POSE_HINTS[p].length, p).toBeGreaterThan(10);
  });

  it('boca cobre a cena sem buraco, fechada nas pausas e mexendo nas palavras', () => {
    const segs = mouthTrack(words, 2.4);
    expect(segs[0].start).toBe(0);
    expect(segs.at(-1)?.end).toBe(2.4);
    segs.slice(1).forEach((s, i) => expect(s.start).toBeCloseTo(segs[i].end));
    const at = (t: number) => segs.find((s) => t >= s.start && t < s.end)?.mouth;
    expect(at(0.1)).toBe('fechada'); // antes da fala
    expect(at(1.2)).toBe('fechada'); // pausa entre "guarda" e "errado?"
    expect(at(2.2)).toBe('fechada'); // depois da fala
    expect(at(0.31)).toBe('aberta');
    expect(at(0.61)).not.toBe('fechada'); // 0,02 s entre palavras não fecha a boca
    expect(new Set(segs.filter((s) => s.start >= 1.4 && s.end <= 1.9).map((s) => s.mouth)).size).toBeGreaterThan(1);
    expect(at(1.89)).toBe('o'); // "errado?" termina em o
  });

  it('piscadas determinísticas, curtas e espaçadas', () => {
    const a = blinkTrack(20, 3);
    expect(a).toEqual(blinkTrack(20, 3));
    expect(a).not.toEqual(blinkTrack(20, 4));
    expect(a.length).toBeGreaterThanOrEqual(4);
    a.forEach((b) => expect(b.end - b.start).toBeCloseTo(BLINK));
    a.slice(1).forEach((b, i) => {
      const gap = b.start - a[i].end;
      expect(gap).toBeGreaterThanOrEqual(BLINK_GAP[0]);
      expect(gap).toBeLessThanOrEqual(BLINK_GAP[1]);
    });
    expect(a.at(-1)!.end).toBeLessThan(20);
  });

  it('linha do tempo junta boca e piscada, contígua de 0 ao fim', () => {
    const tl = mascotTimeline(words, 6, 1);
    expect(tl[0].start).toBe(0);
    expect(tl.at(-1)?.end).toBe(6);
    tl.slice(1).forEach((s, i) => expect(s.start).toBeCloseTo(tl[i].end));
    expect(tl.some((s) => s.blink)).toBe(true);
    expect(tl.some((s) => s.mouth === 'aberta')).toBe(true);
  });

  it('toda pose e toda boca desenham sem erro', async () => {
    const { renderPng } = await import('@/scripts/social/render');
    const { default: Gotinha } = await import('@/scripts/social/mascot');
    const { createElement } = await import('react');
    const size = { width: 120, height: 125 };
    for (const pose of POSES) {
      for (const mouth of MOUTHS) {
        const el = createElement('div', { style: { display: 'flex', ...size } }, createElement(Gotinha, { pose, mouth, blink: mouth === 'meia', size: 120 }));
        expect((await renderPng(el, size)).length, `${pose}/${mouth}`).toBeGreaterThan(500);
      }
    }
  }, 60_000);
});
