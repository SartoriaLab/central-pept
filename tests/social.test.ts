// Automação do Instagram (scripts/social): escolha de tema, barreira de conteúdo, legenda,
// guia do slide final e o cliente da Graph API. Nada aqui chama rede.
import { describe, expect, it } from 'vitest';
import { bioUrl } from '@/lib/promocao/utm';
import { getEbooks } from '@/lib/ebooks';
import { buildTopics } from '@/scripts/social/topics';
import { COOLDOWN_DAYS, PEPTIDE_GAP_DAYS, pickTopic, topicPriority, VIRAL_RANK } from '@/scripts/social/pick';
import { dateRange, formatsOn, planQueue, reservedFrom, slotTime } from '@/scripts/social/queue';
import { extractQuantities, validateDraft } from '@/scripts/social/validate';
import { MAX_CAPTION, MAX_HASHTAGS, SHARE_FALLBACK, buildCaption, ctaLine, ctaSpeech, shareLine } from '@/scripts/social/caption';
import {
  DM_KEYWORD, PUBLIC_REPLIES, dmText, ebookFromCaption, fallbackEbook, guideRequests, guideUrl, publicReply, validSignature, wantsGuide,
} from '@/lib/instagram-dm';
import { EXIT_COUPON } from '@/lib/ebooks';
import crypto from 'node:crypto';
import { ctaFor } from '@/scripts/social/ebook-cta';
import { FB_BASE, IG_BASE, InstagramClient, tokenShape } from '@/scripts/social/instagram';
import { cliEnv, parseCliOutput } from '@/scripts/social/write';
import { captionAt, carouselSlide, toSpeech } from '@/scripts/social/render';
import { relabel, speechPlan } from '@/scripts/social/pronuncia';
import { countUp, exitAt, partStart, titleLine } from '@/scripts/social/motion';
import { layoutProblems, sides } from '@/scripts/social/layouts';
import { nobreak, titleSize } from '@/scripts/social/papel';
import { scenesFor, sentences, splitTitle } from '@/scripts/social/scenes';
import { beatsFor, chunkWords } from '@/scripts/social/captions';
import { wordsFromChars } from '@/scripts/social/voice';
import { ILLUSTRATION_KEYS } from '@/scripts/social/illustrations';
import { hookScore } from '@/scripts/social/viral';
import { existsSync } from 'node:fs';
import path from 'node:path';
import type { Draft, HistoryEntry, Scene, Topic } from '@/scripts/social/types';

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
  narration: [{ text: 'Primeira fala.' }, { text: 'Segunda fala.' }, { text: 'Terceira fala.' }],
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
  // Mesma prioridade (0) para testar as outras regras isoladas.
  const list = [topic('a', 'gh'), topic('b', 'healing'), topic('c', 'gh')];

  it('prefere tema nunca usado', () => {
    const h: HistoryEntry[] = [{ topicId: 'a', format: 'carrossel', category: 'gh', at: new Date(now.getTime() - 100 * DAY) }];
    expect(pickTopic(list, h, 'reels', now)?.id).toBe('b');
  });

  it(`não repete antes de ${COOLDOWN_DAYS} dias`, () => {
    const h: HistoryEntry[] = [
      { topicId: 'a', format: 'carrossel', category: 'gh', at: new Date(now.getTime() - 3 * DAY) },
      { topicId: 'b', format: 'reels', category: 'healing', at: new Date(now.getTime() - 2 * DAY) },
    ];
    expect(pickTopic(list, h, 'carrossel', now)?.id).toBe('c');
  });

  it('evita a categoria da última publicação', () => {
    const h: HistoryEntry[] = [{ topicId: 'x', format: 'reels', category: 'gh', at: new Date(now.getTime() - DAY) }];
    expect(pickTopic(list, h, 'carrossel', now)?.id).toBe('b');
  });

  it('todos em quarentena: volta o de uso mais antigo', () => {
    const h: HistoryEntry[] = ['a', 'b', 'c'].map((id, i) => ({
      topicId: id, format: 'reels' as const, category: 'gh', at: new Date(now.getTime() - (10 - i) * DAY),
    }));
    expect(pickTopic(list, h, 'reels', now)?.id).toBe('a');
  });

  it('prioriza dúvida prática de GLP-1, depois GLP-1, depois o resto', () => {
    const mix = [topic('peptide:kpv', 'healing'), topic('peptide:tirzepatida'), topic('post:nausea-ozempic-como-lidar')];
    expect(mix.map((t) => topicPriority(t))).toEqual([0, 1, 2]);
    expect(pickTopic(mix, [], 'carrossel', now)?.id).toBe('post:nausea-ozempic-como-lidar');
    const h: HistoryEntry[] = [{ topicId: 'post:nausea-ozempic-como-lidar', format: 'carrossel', category: 'glp-1', at: new Date(now.getTime() - DAY) }];
    expect(pickTopic(mix, h, 'carrossel', now)?.id).toBe('peptide:tirzepatida');
  });

  it('os do ranking viral saem primeiro e na ordem dele', () => {
    const [v1, v2] = VIRAL_RANK;
    const mix = [topic('post:nausea-ozempic-como-lidar'), topic(v2, 'gh'), topic(v1)];
    expect(topicPriority(mix[2])).toBe(3);
    expect(pickTopic(mix, [], 'reels', now)?.id).toBe(v1);
    // Mesmo com a categoria da última publicação, o ranking manda.
    const h: HistoryEntry[] = [{ topicId: 'x', format: 'reels', category: 'glp-1', at: new Date(now.getTime() - DAY) }];
    expect(pickTopic(mix, h, 'reels', now)?.id).toBe(v1);
    const used: HistoryEntry[] = [{ topicId: v1, format: 'reels', category: 'glp-1', at: new Date(now.getTime() - DAY) }];
    expect(pickTopic(mix, used, 'reels', now)?.id).toBe(v2);
    // O ranking é do Reels: o carrossel fica com a outra dúvida prática.
    expect(pickTopic(mix, [], 'carrossel', now)?.id).toBe('post:nausea-ozempic-como-lidar');
  });

  it('pula temas excluídos nesta execução', () => {
    expect(pickTopic(list, [], 'reels', now, new Set(['a']))?.id).toBe('b');
  });

  it(`post e ficha do mesmo peptídeo de nicho ficam ${PEPTIDE_GAP_DAYS} dias separados`, () => {
    const post = { ...topic('post:tb-500-guia', 'healing'), kind: 'post' as const, peptides: ['tb-500'] };
    const ficha = { ...topic('peptide:tb-500', 'healing'), peptides: ['tb-500'] };
    const outro = topic('peptide:kpv', 'healing');
    const pool = [post, ficha, outro];
    const h = (days: number): HistoryEntry[] => [{ topicId: post.id, format: 'reels', category: 'healing', at: new Date(now.getTime() - days * DAY) }];
    expect(pickTopic(pool, h(3), 'carrossel', now)?.id).toBe('peptide:kpv');
    expect(pickTopic([post, ficha], h(3), 'carrossel', now)?.id).toBe('peptide:tb-500');
    expect(pickTopic([ficha, outro], h(PEPTIDE_GAP_DAYS + 1), 'carrossel', now)?.id).toBe('peptide:tb-500');
  });
});

describe('fila (planQueue)', () => {
  const list = ['a', 'b', 'c', 'd', 'e', 'f'].map((id, i) => topic(id, i % 2 ? 'healing' : 'glp-1'));

  it('Reels e carrossel todo dia, Reels no horário de pico de cada dia', () => {
    // 2026-11-20 é sexta.
    expect(formatsOn('2026-11-20')).toEqual(['reels', 'carrossel']);
    expect(formatsOn('2026-11-24')).toEqual(['reels', 'carrossel']);
    expect(slotTime('2026-11-20', 'reels').toISOString()).toBe('2026-11-20T21:00:00.000Z'); // sexta 18h
    expect(slotTime('2026-11-21', 'reels').toISOString()).toBe('2026-11-21T13:00:00.000Z'); // sábado 10h
    expect(slotTime('2026-11-22', 'reels').toISOString()).toBe('2026-11-22T22:00:00.000Z'); // domingo 19h
    expect(slotTime('2026-11-22', 'carrossel').toISOString()).toBe('2026-11-22T15:00:00.000Z');
    expect(dateRange('2026-11-30', 2)).toEqual(['2026-11-30', '2026-12-01']);
  });

  it('não repete tema dentro da quarentena e conta o histórico real', () => {
    const h: HistoryEntry[] = [{ topicId: 'a', format: 'carrossel', category: 'glp-1', at: new Date('2026-11-19T15:00:00Z') }];
    const items = planQueue(list, h, '2026-11-20', 2);
    expect(items.map((i) => `${i.date}-${i.format}`)).toEqual([
      '2026-11-20-reels', '2026-11-20-carrossel', '2026-11-21-reels', '2026-11-21-carrossel',
    ]);
    const ids = items.map((i) => i.topicId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain('a');
  });

  it('mantém itens existentes e não reusa o tema deles', () => {
    const existing = [{ date: '2026-11-21', format: 'carrossel' as const, topicId: 'b' }];
    const items = planQueue(list, [], '2026-11-20', 2, existing);
    expect(items.find((i) => i.date === '2026-11-21' && i.format === 'carrossel')?.topicId).toBe('b');
    expect(items.filter((i) => i.topicId === 'b')).toHaveLength(1);
  });

  it('tema da fila de antes volta depois da quarentena', () => {
    const one = [topic('a')];
    const before = [{ date: '2026-11-20', format: 'carrossel' as const, topicId: 'a' }];
    // Dentro da quarentena: só há 'a', então volta mesmo assim (fallback), mas um tema novo ganharia.
    const two = [topic('a'), topic('b', 'gh')];
    expect(planQueue(two, [], '2026-11-25', 1, before)[0].topicId).toBe('b');
    // Depois de COOLDOWN_DAYS, 'a' (prioridade maior) volta.
    expect(planQueue(two, [], '2027-01-10', 1, before)[0].topicId).toBe('a');
    expect(planQueue(one, [], '2026-11-25', 1, before)[0].topicId).toBe('a');
  });

  it('reservedFrom: só o que ainda vai sair', () => {
    const items = [
      { date: '2026-11-19', format: 'carrossel' as const, topicId: 'x' },
      { date: '2026-11-20', format: 'reels' as const, topicId: 'y' },
    ];
    expect([...reservedFrom(items, '2026-11-20')]).toEqual(['y']);
  });
});

describe('tipos de slide', () => {
  it('confere a forma de cada tipo', () => {
    expect(layoutProblems(1, { layout: 'passos', title: 'Faça', body: 'Um\nDois' })).toEqual([]);
    expect(layoutProblems(1, { layout: 'passos', title: 'Faça', body: 'Um só' })).toHaveLength(1);
    expect(layoutProblems(1, { layout: 'lado', title: 'X', body: 'A: um\nB: dois' })).toEqual([]);
    expect(layoutProblems(1, { layout: 'lado', title: 'X', body: 'A: um' })).toHaveLength(1);
    expect(layoutProblems(1, { layout: 'numero', title: '28 dias', body: 'x' })).toEqual([]);
    expect(layoutProblems(1, { layout: 'numero', title: 'Um título comprido demais', body: 'x' })).toHaveLength(1);
    expect(layoutProblems(1, { layout: 'pergunta', title: 'Posso?', body: 'x' })).toEqual([]);
    expect(layoutProblems(1, { layout: 'mito', title: 'Mito: tal coisa', body: 'x' })).toHaveLength(1);
    expect(sides('Com 2 ml: 50 unidades\nCom 1 ml: 25 unidades')).toEqual([
      { label: 'Com 2 ml', text: '50 unidades' }, { label: 'Com 1 ml', text: '25 unidades' },
    ]);
  });

  it('carrossel de 4+ slides precisa de um tipo fora do padrão', () => {
    const four = Array.from({ length: 4 }, () => ({ title: 'Título', body: 'Texto curto.' }));
    expect(validateDraft(draft({ slides: four }), '')).toContainEqual(expect.stringContaining('padrao'));
    const mixed = four.map((s, i) => (i === 3 ? { ...s, layout: 'pergunta' as const, title: 'Posso?' } : s));
    expect(validateDraft(draft({ slides: mixed }), '').some((p) => p.includes('padrao'))).toBe(false);
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
    expect(validateDraft(draft({ caption: 'Para secar 5 kg' }), source).join()).toContain('perda de peso');
    // "boca seca" no fim da linha seguida de item numerado não é promessa.
    expect(validateDraft(draft({ caption: 'Boca muito seca\n3 sinais de alerta' }), source).join()).not.toContain('perda de peso');
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

  it('gancho curto e sem cumprimento', () => {
    expect(validateDraft(draft({ hook: 'Oi, amiga! Você dilui errado?' }), source).join()).toContain('cumprimento');
    const d = draft({ narration: [{ text: 'Olá, tudo bem com você?' }, { text: 'Dois.' }, { text: 'Três.' }] });
    expect(validateDraft(d, source).join()).toContain('cumprimento');
    expect(validateDraft(draft({ hook: `Você ${'faz isso '.repeat(9)}?` }), source).join()).toContain('gancho com');
    expect(validateDraft(draft({ hook: 'Oito em cada dez erram a diluição' }), source)).toEqual([]);
  });

  it('barra os bordões da antiga mascote', () => {
    const d = draft({ narration: [{ text: 'Um.' }, { text: 'Senta aí, que a Gotinha te explica.' }, { text: 'Três.' }] });
    expect(validateDraft(d, source).join()).toContain('bordão');
    expect(validateDraft(draft({ caption: 'Tá falado!' }), source).join()).toContain('bordão');
  });
});

describe('legenda', () => {
  const t: Topic = { ...topic('tirzepatida'), peptides: ['tirzepatida'] };
  const cta = { id: 'KIT', slug: 'kit', title: 'Kit Começo Seguro', priceLabel: 'R$ 69,90', cover: '', others: 4 };

  it('ordem: gancho e salvar, corpo, pergunta, compartilhar, seguir, guia, aviso, hashtags', () => {
    const c = buildCaption(draft({ share: 'aquela amiga que também dilui no olho' }), t, cta);
    const order = [
      'Você está diluindo errado? 📌 Salva', 'Texto da legenda.', '💬 Qual frasco você usa?', '👯‍♀️ Manda pra aquela amiga que também dilui no olho.',
      'Segue o @dosecerta_br', 'Kit Começo Seguro', 'Não substitui orientação médica', '#tirzepatida',
    ];
    const at = order.map((s) => c.indexOf(s));
    expect(at.every((i) => i >= 0)).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
    expect(c).toContain('link da bio');
    expect(c.split('\n')[0]).toContain('Salva');
  });

  it('gancho sem pontuação ganha ponto antes do pedido para salvar', () => {
    expect(buildCaption(draft({ hook: 'Isso ajuda de verdade' }), t, cta).split('\n')[0]).toBe('Isso ajuda de verdade. 📌 Salva pra não esquecer.');
  });

  it('convite para compartilhar: tira o "Manda pra" repetido e tem um padrão', () => {
    expect(shareLine('Manda pra quem guarda a caneta na porta.')).toBe('👯‍♀️ Manda pra quem guarda a caneta na porta.');
    expect(shareLine()).toBe(`👯‍♀️ Manda pra ${SHARE_FALLBACK}.`);
    expect(shareLine('  ')).toBe(`👯‍♀️ Manda pra ${SHARE_FALLBACK}.`);
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
    expect(calls[0].body).not.toContain('cover_url');
    expect(calls).toHaveLength(5);
  });

  it('reels manda a capa no cover_url', async () => {
    const { fn, calls } = fakeFetch([{ id: 'r1' }, { status_code: 'FINISHED' }, { id: 'post3' }]);
    const ig = new InstagramClient({ ...opts, fetchFn: fn });
    expect(await ig.publishReel('https://x/r.mp4', 'legenda', 'https://x/capa.jpg')).toBe('post3');
    expect(calls[0].body).toContain('cover_url=https%3A%2F%2Fx%2Fcapa.jpg');
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

  it('direct de resposta ao comentário e resposta pública', async () => {
    const { fn, calls } = fakeFetch([{ recipient_id: 'u1', message_id: 'm1' }, { id: 'rep1' }]);
    const ig = new InstagramClient({ ...opts, fetchFn: fn });
    await ig.privateReply('c99', 'Oi! Aqui está o guia');
    await ig.replyComment('c99', 'Te mandei no direct!');
    expect(calls[0].url).toContain('/17841/messages');
    const body = new URLSearchParams(calls[0].body);
    expect(JSON.parse(body.get('recipient')!)).toEqual({ comment_id: 'c99' });
    expect(JSON.parse(body.get('message')!)).toEqual({ text: 'Oi! Aqui está o guia' });
    expect(calls[1].url).toContain('/c99/replies');
    expect(new URLSearchParams(calls[1].body).get('message')).toBe('Te mandei no direct!');
  });

  it('token do Facebook (EAA) vai a graph.facebook.com; o do Instagram fica em graph.instagram.com', async () => {
    const { fn, calls } = fakeFetch([{ caption: 'a' }, { caption: 'b' }]);
    await new InstagramClient({ ...opts, token: 'EAAxyz', fetchFn: fn }).mediaCaption('m1');
    await new InstagramClient({ ...opts, fetchFn: fn }).mediaCaption('m1');
    expect(calls[0].url.startsWith(`${FB_BASE}/m1?`)).toBe(true);
    expect(calls[1].url.startsWith(`${IG_BASE}/m1?`)).toBe(true);
  });

  it('renova token do Facebook (EAA) com fb_exchange_token, sem mandar o token como access_token', async () => {
    const { fn, calls } = fakeFetch([{ access_token: 'EAAnovo', token_type: 'bearer', expires_in: 5_183_944 }]);
    const r = await new InstagramClient({ ...opts, token: 'EAAvelho', appSecret: 'chave', fetchFn: fn }).refreshToken();
    expect(r.token).toBe('EAAnovo');
    expect(r.expiresAt.getTime()).toBeGreaterThan(Date.now() + 59 * 86_400_000);
    const url = new URL(calls[0].url);
    expect(`${url.origin}${url.pathname}`).toBe(`${FB_BASE}/oauth/access_token`);
    expect(url.searchParams.get('grant_type')).toBe('fb_exchange_token');
    expect(url.searchParams.get('client_id')).toBe('1855908455448795');
    expect(url.searchParams.get('fb_exchange_token')).toBe('EAAvelho');
    expect(url.searchParams.has('access_token')).toBe(false);
  });

  it('sem expires_in, a validade vem do debug_token', async () => {
    const exp = Math.floor(Date.now() / 1000) + 50 * 86_400;
    const { fn, calls } = fakeFetch([{ access_token: 'EAAnovo' }, { data: { expires_at: exp } }]);
    const r = await new InstagramClient({ ...opts, token: 'EAAvelho', appSecret: 'chave', fetchFn: fn }).refreshToken();
    expect(r.expiresAt.getTime()).toBe(exp * 1000);
    const debug = new URL(calls[1].url);
    expect(debug.pathname).toContain('/debug_token');
    expect(debug.searchParams.get('input_token')).toBe('EAAnovo');
  });

  it('token do Facebook sem IG_APP_SECRET não tenta renovar', async () => {
    const { fn, calls } = fakeFetch([]);
    await expect(new InstagramClient({ ...opts, token: 'EAAvelho', fetchFn: fn }).refreshToken()).rejects.toThrow('IG_APP_SECRET');
    expect(calls).toHaveLength(0);
  });

  it('token inválido (190) mostra o formato do token, nunca o valor', async () => {
    const { fn } = fakeFetch([{ error: { message: 'Cannot parse access token', code: 190 } }]);
    const ig = new InstagramClient({ ...opts, token: 'segredo com espaço', fetchFn: fn });
    const err = await ig.privateReply('c1', 'oi').catch((e: Error) => e.message);
    expect(err).toContain('token desconhecido, 18 chars, com caracteres fora do padrão');
    expect(err).not.toContain('segredo');
    expect(tokenShape('IGAAabc')).toBe('token IG, 7 chars');
  });
});

describe('texto pelo Claude Code (sem chave de API)', () => {
  it('usa a saída estruturada do claude -p', () => {
    const out = JSON.stringify({ type: 'result', is_error: false, result: '', structured_output: { hook: 'Oi?' } });
    expect(parseCliOutput(out, 't1')).toEqual({ hook: 'Oi?' });
  });

  it('cai para o JSON do campo result quando não há saída estruturada', () => {
    const out = JSON.stringify({ is_error: false, result: '{"hook":"Oi?"}' });
    expect(parseCliOutput(out, 't1')).toEqual({ hook: 'Oi?' });
  });

  it('erro de login explica como resolver', () => {
    const out = JSON.stringify({ is_error: true, result: 'Failed to authenticate: OAuth session expired' });
    expect(() => parseCliOutput(out, 't1')).toThrow(/claude setup-token/);
  });

  it('saída que não é JSON vira erro claro', () => {
    expect(() => parseCliOutput('Error: boom', 't1')).toThrow('não é JSON');
  });

  it('tira do ambiente as variáveis de sessão do Claude, mas mantém o token de longa duração', () => {
    const env = cliEnv({ PATH: 'p', ANTHROPIC_BASE_URL: 'x', CLAUDE_CODE_SIMPLE: '1', CLAUDECODE: '1', CLAUDE_CODE_OAUTH_TOKEN: 't' });
    expect(env).toEqual({ PATH: 'p', CLAUDE_CODE_OAUTH_TOKEN: 't' });
  });
});

describe('comenta GUIA (direct)', () => {
  const all = getEbooks();
  const tirze = all.find((e) => e.id === 'I2')!;
  const payload = (text: string, from = 'u1', account = 'acc') => ({
    object: 'instagram',
    entry: [{ id: account, changes: [{ field: 'comments', value: { id: 'c1', text, from: { id: from, username: 'ana' }, media: { id: 'm1' } } }] }],
  });

  it('reconhece a palavra, sem acento nem caixa, só como palavra inteira', () => {
    for (const t of ['GUIA', 'guia', 'Quero o guia 🙏', 'Guía!!', 'manda o GUIA pra mim']) expect(wantsGuide(t), t).toBe(true);
    for (const t of ['guias', 'guiar', 'aguia', 'amei o vídeo', '']) expect(wantsGuide(t), t).toBe(false);
  });

  it('assinatura da Meta: aceita a certa e recusa a errada ou ausente', () => {
    const body = JSON.stringify(payload('guia'));
    const sig = `sha256=${crypto.createHmac('sha256', 'segredo').update(body).digest('hex')}`;
    expect(validSignature(body, sig, 'segredo')).toBe(true);
    expect(validSignature(body, sig, 'outro')).toBe(false);
    expect(validSignature(`${body} `, sig, 'segredo')).toBe(false);
    expect(validSignature(body, null, 'segredo')).toBe(false);
  });

  it('só pega comentário com a palavra e ignora os da própria conta', () => {
    expect(guideRequests(payload('GUIA'))).toEqual([{ accountId: 'acc', commentId: 'c1', mediaId: 'm1', userId: 'u1', username: 'ana' }]);
    expect(guideRequests(payload('lindo vídeo'))).toEqual([]);
    expect(guideRequests(payload('Te mandei o guia no direct', 'acc', 'acc'))).toEqual([]);
    expect(guideRequests({ object: 'page', entry: [] })).toEqual([]);
    expect(guideRequests(null)).toEqual([]);
  });

  it('acha o guia pelo título da linha 📘 da legenda (robô e legenda à mão)', () => {
    const t: Topic = { ...topic('tirzepatida'), peptides: ['tirzepatida'] };
    const robot = buildCaption(draft(), t, { id: 'I2', slug: tirze.slug, title: tirze.title, priceLabel: 'R$ 29,90', cover: '', others: 6 });
    expect(ebookFromCaption(robot, all)?.id).toBe('I2');
    expect(ebookFromCaption(`📘 Guia "${tirze.title}" (R$ 29,90) e calculadoras grátis no link da bio.`, all)?.id).toBe('I2');
    expect(ebookFromCaption('sem guia aqui', all)).toBeNull();
    expect(ebookFromCaption(`📘 Guia "${tirze.title}"`, [])).toBeNull(); // guia sem checkout ativo
    expect(fallbackEbook(all)?.id).toBe('KIT');
    expect(fallbackEbook([])).toBeNull();
  });

  it('direct leva a página do guia com o cupom e a origem; sem guia, as calculadoras', () => {
    const url = new URL(guideUrl(tirze));
    expect(url.pathname).toBe(`/ebooks/${tirze.slug}`);
    expect(url.searchParams.get('cupom')).toBe(EXIT_COUPON?.code ?? null);
    expect(url.searchParams.get('utm_medium')).toBe('direct');
    const text = dmText(tirze);
    expect(text).toContain(tirze.title);
    expect(text).toContain(guideUrl(tirze));
    expect(text).not.toMatch(/gotinha|falado/i);
    expect(dmText(null)).toContain('/ferramentas');
  });

  it('resposta pública varia e é estável por comentário', () => {
    const replies = new Set(['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'].map(publicReply));
    expect(replies.size).toBeGreaterThan(1);
    expect(publicReply('c1')).toBe(publicReply('c1'));
    for (const r of replies) expect(PUBLIC_REPLIES).toContain(r);
  });

  it('vídeo e legenda pedem o comentário e o envio', () => {
    const cta = { id: 'I2', slug: tirze.slug, title: tirze.title, priceLabel: 'R$ 29,90', cover: '', others: 6 };
    const speech = ctaSpeech(cta, 'aquela amiga que come correndo');
    expect(speech).toContain('Comenta a palavra guia');
    expect(speech).toContain('manda esse vídeo pra aquela amiga que come correndo');
    expect(speech).not.toMatch(/gotinha|falado/i);
    expect(ctaLine(cta)).toContain(`Comenta ${DM_KEYWORD}`);
    expect(ctaLine(null)).toContain('calculadoras');
    // Preço e desconto na legenda tiram o post da recomendação: só no direct.
    expect(ctaLine(cta)).not.toMatch(/R\$|desconto|%/);
    expect(ctaLine(cta)).toContain(`"${tirze.title}"`);
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

  it('pronúncia de marca, estudo, sigla e seringa; singular abaixo de 2', () => {
    expect(toSpeech('Parou o Mounjaro? No SURMOUNT-4, a ANVISA e o GLP-1.')).toBe(
      'Parou o Munjáro? No Sarmáunt 4, a Anvisa e o gê éle pê um.',
    );
    expect(toSpeech('Na U-100, 1 unidade é 0,01 ml; 0,5 ml, 1 ml e 2 ml. Não é mg, NEM CNPJ.')).toBe(
      'Na u 100, 1 unidade é 0,01 mililitro; 0,5 mililitro, 1 mililitro e 2 mililitros. Não é miligrama, nem CNPJ.',
    );
    expect(toSpeech('BPC-157 e TB-500 vs GHK-Cu: 14% e 5mg')).toBe(
      'bê pê cê cento e cinquenta e sete e tê bê quinhentos versus gê agá cá cobre: 14 por cento e 5 miligramas',
    );
  });

  it('legenda volta à palavra original', () => {
    const { spoken, segments } = speechPlan('No SURMOUNT-4, 14% voltou.');
    // A voz marca as palavras faladas; a legenda junta as de cada trecho.
    const said = ['No', 'Sarmáunt', '4', '14', 'por', 'cento', 'voltou'].map((text, i) => ({ text, start: i, end: i + 0.5 }));
    expect(relabel(said, spoken, segments)).toEqual([
      { text: 'No', start: 0, end: 0.5 },
      { text: 'SURMOUNT-4', start: 1, end: 2.5 },
      { text: '14%', start: 3, end: 5.5 },
      { text: 'voltou', start: 6, end: 6.5 },
    ]);
  });
});

describe('visual papel (cenas)', () => {
  const scene = (over: Partial<Scene> = {}): Scene => ({
    chip: 'os estudos', kicker: 'no maior estudo', title: 'Perda média', accent: 'de 2.5 mg', tone: 'azul',
    speech: 'No estudo, a dose foi de 2.5 mg por semana.', visual: { type: 'numero', value: '2.5 mg', note: 'dose do estudo' }, ...over,
  });
  const withScenes = (scenes: Scene[]) => draft({ narration: undefined, scenes });
  const source = 'Dose típica: 2.5 mg por semana. Frascos de 5 mg e 10 mg.';

  it('divide o título em duas linhas equilibradas, sem quebrar palavra', () => {
    expect(splitTitle('Mata a gordura da barriga?')).toEqual(['Mata a gordura', 'da barriga?']);
    expect(splitTitle('Retatrutida')).toEqual(['Retatrutida', '']);
    expect(titleSize('CURTO', '', 100)).toBe(100);
    expect(titleSize('UM TÍTULO BEM MAIS COMPRIDO QUE O NORMAL', '', 100)).toBeLessThan(60);
  });

  it('frases da narração antiga, juntando as muito curtas', () => {
    expect(sentences('Primeira frase bem completa aqui. Curta. Outra frase completa que segue.')).toEqual([
      'Primeira frase bem completa aqui. Curta.', 'Outra frase completa que segue.',
    ]);
  });

  it('texto antigo (só narration) vira uma cena por frase; o novo usa as cenas dele', () => {
    const old = scenesFor(draft(), topic('x'));
    expect(old.length).toBeGreaterThanOrEqual(1);
    expect(old[0].tone).toBe('vermelho');
    const novo = [scene(), scene({ title: 'Outra' })];
    expect(scenesFor(withScenes(novo), topic('x'))).toBe(novo);
  });

  it('valida cenas: número fora da fonte, limites e forma do desenho', () => {
    const ok = Array.from({ length: 8 }, () => scene());
    expect(validateDraft(withScenes(ok), source)).toEqual([]);
    expect(validateDraft(withScenes(ok.slice(0, 3)), source)).toContainEqual(expect.stringContaining('3 cenas'));
    const fora = [...ok.slice(1), scene({ visual: { type: 'numero', value: '9 mg', note: 'x' } })];
    expect(validateDraft(withScenes(fora), source)).toContainEqual(expect.stringContaining('9 mg'));
    const ruim = [...ok.slice(1), scene({ visual: { type: 'linha', steps: ['a'], current: 3 } })];
    const p = validateDraft(withScenes(ruim), source);
    expect(p).toContainEqual(expect.stringContaining('1 etapas'));
    expect(p).toContainEqual(expect.stringContaining('current'));
    expect(validateDraft(draft({ narration: undefined }), source)).toContainEqual(expect.stringContaining('sem cenas'));
  });

  it('animação: título entra, partes do desenho seguem a fala, cena sai no fim', () => {
    expect(titleLine({ t: 0, dur: 5 }, 0)).toEqual({ y: 1, opacity: 0 });
    expect(titleLine({ t: 1, dur: 5 }, 1)).toEqual({ y: 0, opacity: 1 });
    expect(titleLine({ t: 0.2, dur: 5 }, 0).y).toBeLessThan(titleLine({ t: 0.2, dur: 5 }, 1).y);
    const starts = [0, 1, 2].map((k) => partStart({ t: 0, dur: 5 }, k, 3));
    starts.slice(1).forEach((s, i) => expect(s).toBeGreaterThan(starts[i]));
    expect(starts[2]).toBeLessThan(5 * 0.7);
    expect(partStart({ t: 0, dur: 5, keepIn: true }, 2, 3)).toBeLessThan(0);
    expect(exitAt({ t: 1, dur: 5 })).toBe(0);
    expect(exitAt({ t: 5, dur: 5 })).toBe(1);
  });

  it('número conta mantendo casas e separador', () => {
    expect(countUp('28,3%', 1)).toBe('28,3%');
    expect(countUp('28,3%', 0.5)).toBe('14,2%');
    expect(countUp('2.339', 0.5)).toBe('1.170');
    expect(countUp('365 dias', 0)).toBe('0 dias');
    expect(countUp('Não aprovado', 0.3)).toBe('Não aprovado');
  });

  it('legenda: bloco certo e idade do bloco', () => {
    const beats = [{ chunk: 0, active: 0, start: 0, end: 0.4 }, { chunk: 0, active: 1, start: 0.4, end: 1 }, { chunk: 1, active: 0, start: 1, end: 2 }];
    expect(captionAt(beats, 0.5)).toEqual({ chunk: 0, active: 1, age: 0.5 });
    expect(captionAt(beats, 1.25)?.age).toBeCloseTo(0.25);
    expect(captionAt(beats, 3)).toBeNull();
  });

  it('slide do carrossel por tipo', () => {
    expect(carouselSlide({ title: '28 dias', body: 'x', layout: 'numero' }, 0, 'x').visual).toEqual({ type: 'numero', value: '28 dias', note: '' });
    expect(carouselSlide({ title: 'Faça', body: 'Um\nDois', layout: 'passos' }, 0, 'x').visual?.type).toBe('lista');
    expect(carouselSlide({ title: 'Crença', body: 'Verdade.', layout: 'mito' }, 0, 'x').tone).toBe('vermelho');
  });

  it('todo tipo de desenho renderiza no quadro do Reels', async () => {
    const { renderPng } = await import('@/scripts/social/render');
    const { ReelScene, REEL } = await import('@/scripts/social/papel');
    const { createElement } = await import('react');
    const visuals: Scene['visual'][] = [
      { type: 'frasco', label: 'Retatrutida', liquid: 'amarelo', tag: 'sem registro', stamp: 'Não aprovado' },
      { type: 'frascos', left: { label: 'Estudo', note: 'controlado' }, right: { label: '???', liquid: 'po', note: 'sem laudo' }, sign: '≠' },
      { type: 'numero', value: '28,3%', note: 'perda média' },
      { type: 'barras', bars: [{ label: 'A', value: 28.3, display: '28,3%' }, { label: 'B', value: 2, display: '2%' }] },
      { type: 'pontos', total: 100, marked: 11, note: 'de cada 100' },
      { type: 'linha', steps: ['fase 3', 'FDA', 'ANVISA'], current: 0, note: 'hoje' },
      { type: 'lista', items: [{ text: 'Um', mark: 'ok' }, { text: 'Dois', mark: 'nao' }, { text: 'Três', mark: 'duvida' }] },
      { type: 'icone', icon: 'lupa', note: 'confira' },
      { type: 'carimbo', text: 'Mito', note: 'não é bem assim' },
    ];
    for (const v of visuals) {
      for (const t of [0, 0.4, 1.2, 4.95]) {
        const png = await renderPng(createElement(ReelScene, { scene: scene({ visual: v }), clock: { t, dur: 5 } }), REEL);
        expect(png.length, `${v.type} t=${t}`).toBeGreaterThan(5000);
      }
    }
  }, 120_000);
});

describe('nota do gancho (viral.ts)', () => {
  it('marca + pergunta curta vence molécula sem pergunta', () => {
    const brand = hookScore('Seu Mounjaro não fez efeito no primeiro mês?');
    const mol = hookScore('A tirzepatida tem efeito gradual ao longo das primeiras semanas de uso contínuo');
    expect(brand.score).toBeGreaterThan(mol.score);
    expect(brand.hits).toEqual(expect.arrayContaining(['marca', 'pergunta', 'curto']));
    expect(mol.tips.join(' ')).toMatch(/marca/);
    expect(mol.tips.join(' ')).toMatch(/10 palavras/);
  });

  it('cumprimento derruba a nota', () => {
    expect(hookScore('Oi gente, hoje vou falar do Mounjaro?').score).toBeLessThan(hookScore('Mounjaro faz mal?').score);
  });

  it('fica entre 0 e 100', () => {
    const { score } = hookScore('Mounjaro ou Ozempic? Não é erro seu, você não sabe?');
    expect(score).toBeLessThanOrEqual(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

describe('nota do gancho: acentos', () => {
  it('"você" e "não é" contam mesmo com acento no fim', () => {
    expect(hookScore('Você aplica o Mounjaro sempre no mesmo ponto?').hits).toContain('fala com a pessoa');
    expect(hookScore('Frasco não é Mounjaro.').hits).toContain('erro/não');
  });
});
