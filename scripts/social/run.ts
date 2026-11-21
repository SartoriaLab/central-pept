// Publicação diária do @dosecerta_br. Uso:
//   tsx scripts/social/run.ts carrossel|reels [--dry] [--force]
//   tsx scripts/social/run.ts carrossel|reels --fila      publica o texto pronto de social/fila/ do dia
//   tsx scripts/social/run.ts plano [--dias 30] [--inicio AAAA-MM-DD] [--refazer]   monta a fila (queue.ts)
//   tsx scripts/social/run.ts --check <pasta>              só valida o texto.json da pasta
//   tsx scripts/social/run.ts previa [--formato reels] [--de AAAA-MM-DD] [--ate AAAA-MM-DD]   gera a fila em social/out/ sem publicar
// --dry: escolhe, escreve, valida e renderiza em social/out/, sem publicar nem gravar no banco
// (sem DATABASE_URL usa histórico vazio). SOCIAL_PAUSED=1 desliga tudo.
// Um post por formato por dia: se já saiu, não publica de novo (--force publica mesmo assim).
// --fila sem texto válido para hoje sai com código 3 (agendado.ps1 não publica; com -ComIA escreve na hora).
// Variáveis: DATABASE_URL, IG_USER_ID, IG_ACCESS_TOKEN, BLOB_READ_WRITE_TOKEN e, para o texto,
// ANTHROPIC_API_KEY ou o Claude Code deste computador (write.ts). Lidas do .env.local, se existir.
// Agendado no Windows: scripts/social/agendar.ps1.
import fs from 'node:fs/promises';
import path from 'node:path';
import { buildTopics } from './topics';
import { pickTopic } from './pick';
import { QueuedDraftSchema, SYSTEM, draftJsonSchema, userMessage, writeDraft } from './write';
import { validateDraft } from './validate';
import { hookScore } from './viral';
import { buildCaption } from './caption';
import { ctaFor, fetchActiveEbookSlugs } from './ebook-cta';
import { reelCover, renderCarousel, renderReel } from './render';
import { dateRange, planQueue, queueKey, reservedFrom, type QueueItem } from './queue';
import type { Draft, Format, HistoryEntry, Topic } from './types';

const MAX_TOPICS = 3;
/** Estilo visual atual (papel.tsx). */
// Mudou o visual ou a fala final (ctaSpeech) → troque, senão a publicação reaproveita a prévia antiga.
const VISUAL = 'papel-animado-2';
const REFRESH_BEFORE_DAYS = 15;
/** Código de saída do --fila sem texto pronto e válido para hoje. */
const NO_QUEUE = 3;

function today(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
}

const queueRoot = () => path.join(process.cwd(), 'social', 'fila');
const rel = (p: string) => path.relative(process.cwd(), p).replaceAll('\\', '/');
const tsxCommand = (args: string) => `"${process.execPath.replaceAll('\\', '/')}" node_modules/tsx/dist/cli.mjs scripts/social/run.ts ${args}`;

/** Itens da fila (pastas com brief.json). */
async function readQueue(): Promise<QueueItem[]> {
  const names = await fs.readdir(queueRoot()).catch(() => [] as string[]);
  const items: QueueItem[] = [];
  for (const name of names) {
    const m = /^(\d{4}-\d{2}-\d{2})-(carrossel|reels)$/.exec(name);
    if (!m) continue;
    try {
      const brief = JSON.parse(await fs.readFile(path.join(queueRoot(), name, 'brief.json'), 'utf8')) as { topic: string };
      items.push({ date: m[1], format: m[2] as Format, topicId: brief.topic });
    } catch {
      // Pasta sem brief.json: ignora.
    }
  }
  return items.sort((a, b) => queueKey(a.date, a.format).localeCompare(queueKey(b.date, b.format)));
}

type Checked = { topic: Topic; draft: Draft; problems: [] } | { topic?: Topic; draft?: undefined; problems: string[] };

/** brief.json + texto.json de uma pasta, com a mesma validação da publicação. */
async function checkDir(dir: string, topics: Topic[]): Promise<Checked> {
  let brief: { topic: string };
  try {
    brief = JSON.parse(await fs.readFile(path.join(dir, 'brief.json'), 'utf8'));
  } catch {
    return { problems: [`sem brief.json em ${rel(dir)}`] };
  }
  const topic = topics.find((t) => t.id === brief.topic);
  if (!topic) return { problems: [`tema ${brief.topic} não existe mais`] };
  let raw: unknown;
  try {
    raw = JSON.parse(await fs.readFile(path.join(dir, 'texto.json'), 'utf8'));
  } catch (e) {
    return { topic, problems: [`texto.json ausente ou com JSON inválido: ${(e as Error).message}`] };
  }
  const parsed = QueuedDraftSchema.safeParse(raw);
  if (!parsed.success) return { topic, problems: parsed.error.issues.map((i) => `${i.path.join('.') || 'texto'}: ${i.message}`) };
  const problems = validateDraft(parsed.data as Draft, topic.source);
  return problems.length ? { topic, problems } : { topic, draft: parsed.data as Draft, problems: [] };
}

/** Regras e schema comuns a toda a fila (cada brief.md aponta para cá). */
function rulesText(): string {
  return `# Regras dos textos da fila

Cada pasta \`social/fila/<data>-<formato>/\` tem um brief.md com o TEMA e a FONTE. Escreva o
rascunho seguindo as REGRAS e salve como JSON puro (sem markdown) em \`texto.json\` na mesma pasta,
no formato do SCHEMA. Um rascunho serve para carrossel e Reels: preencha todos os campos.

## REGRAS

${SYSTEM}

## SCHEMA

\`\`\`json
${JSON.stringify(draftJsonSchema(), null, 2)}
\`\`\`
`;
}

function queueBriefText(topic: Topic, item: QueueItem, dir: string): string {
  const focus =
    item.format === 'reels'
      ? 'Sai como Reels: capriche no gancho e nas cenas (scenes): uma frase por cena, com título e desenho.'
      : 'Sai como carrossel: capriche na capa (hook) e nos slides.';
  return `# ${item.format} de ${item.date}

Regras e schema: \`social/fila/REGRAS.md\`. ${focus}
Salve o texto em \`${rel(dir)}/texto.json\` e confira com:

    ${tsxCommand(`--check ${rel(dir)}`)}

Se sair "REPROVADO", corrija só o que a lista aponta e rode de novo.

## PEDIDO

${userMessage(topic, [])}
`;
}

async function draftFor(topic: Topic): Promise<{ draft: Draft; problems: string[] }> {
  let draft = await writeDraft(topic);
  let problems = validateDraft(draft, topic.source);
  if (problems.length) {
    console.warn(`[${topic.id}] 1ª tentativa reprovada:\n- ${problems.join('\n- ')}`);
    draft = await writeDraft(topic, problems);
    problems = validateDraft(draft, topic.source);
  }
  return { draft, problems };
}

function argValue(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

/** Instruções da etapa 1 para o Claude da conversa agendada: as mesmas regras da API. */
function briefText(topic: Topic, outDir: string, format: Format, dry: boolean): string {
  const dir = rel(outDir);
  const flags = `${dry ? ' --dry' : ''}`;
  return `# Texto do ${format} de hoje

Escreva o rascunho abaixo seguindo as REGRAS e salve como JSON puro (sem markdown) em
\`${dir}/texto.json\`, no formato do SCHEMA. Depois rode:

    ${tsxCommand(`${format} --draft ${dir}${flags}`)}

Se sair "REPROVADO", corrija só o que a lista aponta e rode de novo (até 3 vezes). Se não passar,
rode a etapa 1 de novo com \`--skip ${topic.id}\` para trocar de tema.

## REGRAS

${SYSTEM}

## SCHEMA

\`\`\`json
${JSON.stringify(draftJsonSchema(), null, 2)}
\`\`\`

## PEDIDO

${userMessage(topic, [])}
`;
}

/** .env.local do projeto (rodando neste computador). Variável já definida no ambiente prevalece. */
function loadLocalEnv(): void {
  const file = path.join(process.cwd(), '.env.local');
  const load = (process as { loadEnvFile?: (p: string) => void }).loadEnvFile;
  try {
    load?.(file);
  } catch {
    // Sem .env.local (GitHub Actions): segue com o ambiente.
  }
}

/** `run.ts plano`: escolhe o tema de cada horário dos próximos dias e cria as pastas da fila. */
async function plan(): Promise<void> {
  const days = Number(argValue('--dias') ?? 30);
  const tomorrow = dateRange(today(), 2)[1];
  const start = argValue('--inicio') ?? tomorrow;
  const state = process.env.DATABASE_URL ? await import('./state') : null;
  const history: HistoryEntry[] = state ? await state.getHistory() : [];
  if (!state) console.warn('Sem DATABASE_URL: plano sem o histórico do que já saiu.');
  const topics = buildTopics();
  // --refazer: escolhe de novo o tema dos horários que ainda não têm texto escrito.
  const hasText = (i: QueueItem) =>
    fs.stat(path.join(queueRoot(), queueKey(i.date, i.format), 'texto.json')).then(() => true, () => false);
  let existing = await readQueue();
  if (process.argv.includes('--refazer')) {
    const keep = await Promise.all(existing.map(hasText));
    existing = existing.filter((_, i) => keep[i]);
  }
  const items = planQueue(topics, history, start, days, existing);

  await fs.mkdir(queueRoot(), { recursive: true });
  await fs.writeFile(path.join(queueRoot(), 'REGRAS.md'), rulesText());
  const known = new Set(existing.map((e) => queueKey(e.date, e.format)));
  let created = 0;
  for (const item of items) {
    const dir = path.join(queueRoot(), queueKey(item.date, item.format));
    if (known.has(queueKey(item.date, item.format))) continue;
    const topic = topics.find((t) => t.id === item.topicId)!;
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'brief.json'), JSON.stringify({ topic: topic.id, format: item.format, date: item.date }, null, 2));
    await fs.writeFile(path.join(dir, 'brief.md'), queueBriefText(topic, item, dir));
    created++;
  }

  const all = await readQueue();
  const rows: string[] = [];
  for (const item of all) {
    const dir = path.join(queueRoot(), queueKey(item.date, item.format));
    const done = await fs.stat(path.join(dir, 'texto.json')).then(() => true, () => false);
    const title = topics.find((t) => t.id === item.topicId)?.title ?? '(tema removido)';
    rows.push(`| ${item.date} | ${item.format} | ${title} | \`${item.topicId}\` | ${done ? 'pronto' : 'falta texto'} |`);
  }
  await fs.writeFile(
    path.join(queueRoot(), 'PLANO.md'),
    `# Fila do @dosecerta_br\n\nGerado por \`run.ts plano\`. A tarefa do dia publica o texto.json da pasta; sem ele, escreve na hora.\n\n| Data | Formato | Tema | Id | Texto |\n| --- | --- | --- | --- | --- |\n${rows.join('\n')}\n`,
  );
  console.log(`Fila: ${items.length} horários de ${start} em diante, ${created} pastas novas em ${rel(queueRoot())}.`);
}

type Rendered = { files: string[]; caption: string };

/**
 * Imagens/vídeo e legenda em `outDir`. Se a prévia (`run.ts previa`) já gerou ali o mesmo texto
 * com o mesmo guia, reaproveita: o Reels não é renderizado (nem a voz paga) duas vezes.
 */
async function renderTo(
  draft: Draft, topic: Topic, format: Format, outDir: string, active: Set<string>,
): Promise<Rendered & { reused: boolean }> {
  const cta = ctaFor(topic, active);
  const caption = buildCaption(draft, topic, cta);
  // `visual` muda quando o estilo muda: a prévia feita no estilo antigo é renderizada de novo.
  const record = { topic: topic.id, cta: cta?.id ?? null, visual: VISUAL, draft };
  try {
    const saved = JSON.parse(await fs.readFile(path.join(outDir, 'rascunho.json'), 'utf8')) as typeof record & { files?: string[] };
    const files = (saved.files ?? []).map((f) => path.join(outDir, f));
    const same = JSON.stringify({ topic: saved.topic, cta: saved.cta, visual: saved.visual, draft: saved.draft }) === JSON.stringify(record);
    if (same && files.length && (await Promise.all(files.map((f) => fs.stat(f).then(() => true, () => false)))).every(Boolean)) {
      await fs.writeFile(path.join(outDir, 'legenda.txt'), caption);
      return { files, caption, reused: true };
    }
  } catch {
    // Sem prévia: renderiza.
  }
  await fs.mkdir(outDir, { recursive: true });
  const files =
    format === 'carrossel' ? await renderCarousel(draft, topic, cta, outDir) : [await renderReel(draft, topic, cta, outDir)];
  await fs.writeFile(path.join(outDir, 'legenda.txt'), caption);
  await fs.writeFile(
    path.join(outDir, 'rascunho.json'),
    JSON.stringify({ ...record, files: files.map((f) => path.relative(outDir, f)) }, null, 2),
  );
  return { files, caption, reused: false };
}

/**
 * `run.ts previa [--formato carrossel|reels] [--de AAAA-MM-DD] [--ate AAAA-MM-DD]`: gera em social/out/
 * os posts da fila, sem publicar. Faixas de datas diferentes podem rodar em paralelo.
 */
async function preview(): Promise<void> {
  const only = argValue('--formato') as Format | undefined;
  const from = [argValue('--de') ?? '', today()].sort()[1];
  const until = argValue('--ate') ?? '9999-12-31';
  const topics = buildTopics();
  const active = await fetchActiveEbookSlugs();
  const items = (await readQueue()).filter((i) => i.date >= from && i.date <= until && (!only || i.format === only));
  let ok = 0;
  for (const item of items) {
    const key = queueKey(item.date, item.format);
    const checked = await checkDir(path.join(queueRoot(), key), topics);
    if (!checked.draft) {
      console.log(`${key}: sem texto válido (${checked.problems[0]})`);
      continue;
    }
    try {
      const r = await renderTo(checked.draft, checked.topic, item.format, path.join(process.cwd(), 'social', 'out', key), active);
      console.log(`${key}: ${r.reused ? 'já gerado' : 'gerado'} (${r.files.length} arquivo${r.files.length > 1 ? 's' : ''})`);
      ok++;
    } catch (e) {
      console.log(`${key}: ERRO ${(e as Error).message}`);
    }
  }
  console.log(`Prévia: ${ok} de ${items.length} em social/out/.`);
}

async function main() {
  loadLocalEnv();
  if (process.argv[2] === 'plano') return plan();
  if (process.argv[2] === 'previa') return preview();
  const checkOnly = argValue('--check');
  if (checkOnly) {
    const { problems, topic } = await checkDir(path.resolve(checkOnly), buildTopics());
    if (problems.length) {
      console.log(`REPROVADO. Corrija em texto.json e rode de novo:\n- ${problems.join('\n- ')}`);
      process.exitCode = 2;
    } else {
      console.log(`OK: ${topic!.id} passou na validação.`);
    }
    // Nota do gancho (viral.ts): só aviso, não reprova.
    const draft = JSON.parse(await fs.readFile(path.join(path.resolve(checkOnly), 'texto.json'), 'utf8'));
    const hook = (draft.draft ?? draft).hook;
    if (typeof hook === 'string') {
      const { score, hits, tips } = hookScore(hook);
      console.log(`Gancho ${score}/100 (${hits.join(', ') || 'sem padrão viral'})${tips.length ? `. Dica: ${tips.join('; ')}` : ''}`);
    }
    return;
  }

  const format = process.argv[2] as Format;
  const dry = process.argv.includes('--dry');
  const force = process.argv.includes('--force');
  if (format !== 'carrossel' && format !== 'reels') throw new Error('uso: run.ts carrossel|reels [--dry] [--force] [--fila]');
  if (process.env.SOCIAL_PAUSED === '1') {
    console.log('SOCIAL_PAUSED=1: nada a fazer.');
    return;
  }

  if (!dry) {
    // Confere antes de gastar o Claude com o texto: sem estas não há como publicar.
    const missing = ['DATABASE_URL', 'IG_USER_ID', 'IG_ACCESS_TOKEN', 'BLOB_READ_WRITE_TOKEN'].filter((k) => !process.env[k]?.trim());
    if (missing.length) throw new Error(`faltam variáveis para publicar (.env.local): ${missing.join(', ')}`);
  }

  const useDb = !dry || !!process.env.DATABASE_URL;
  const state = useDb ? await import('./state') : null;
  if (state) await state.ensureTables();
  if (state && !dry && !force && (await state.publishedOn(format, today()))) {
    console.log(`Já saiu ${format} hoje (${today()}): nada a fazer. Use --force para publicar outro.`);
    return;
  }
  const history: HistoryEntry[] = state ? await state.getHistory() : [];
  const topics = buildTopics();
  const active = await fetchActiveEbookSlugs();
  const outDir = path.join(process.cwd(), 'social', 'out', `${today()}-${format}`);

  // Etapa 1 da conversa agendada: escolhe o tema e deixa as instruções para o Claude da conversa.
  if (process.argv.includes('--brief')) {
    const skip = new Set((argValue('--skip') ?? '').split(',').filter(Boolean));
    // Temas que a fila ainda vai publicar ficam de fora (se sobrar algum), para não sair repetido.
    const reserved = reservedFrom(await readQueue(), today());
    const topic =
      pickTopic(topics, history, format, new Date(), new Set([...skip, ...reserved])) ??
      pickTopic(topics, history, format, new Date(), skip);
    if (!topic) throw new Error('nenhum tema disponível');
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, 'brief.json'), JSON.stringify({ topic: topic.id, format }, null, 2));
    await fs.writeFile(path.join(outDir, 'brief.md'), briefText(topic, outDir, format, dry));
    console.log(`Tema: ${topic.id} (${topic.category})`);
    console.log(`Instruções em ${path.join(outDir, 'brief.md')}`);
    return;
  }

  let chosen: { topic: Topic; draft: Draft } | null = null;

  // Etapa 2: o texto escrito pelo Claude da conversa (texto.json) passa pela mesma validação.
  const draftDir = argValue('--draft');
  if (draftDir) {
    const checked = await checkDir(draftDir, topics);
    if (!checked.draft) {
      console.log(`REPROVADO. Corrija em texto.json e rode de novo:\n- ${checked.problems.join('\n- ')}`);
      process.exitCode = 2;
      return;
    }
    chosen = { topic: checked.topic, draft: checked.draft };
  }

  // Texto pronto da fila para hoje. Sem ele (ou reprovado), código 3: a tarefa escreve na hora.
  if (process.argv.includes('--fila')) {
    const dir = path.join(queueRoot(), queueKey(today(), format));
    const checked = await checkDir(dir, topics);
    if (!checked.draft) {
      console.log(`SEM FILA para ${queueKey(today(), format)}:\n- ${checked.problems.join('\n- ')}`);
      process.exitCode = NO_QUEUE;
      return;
    }
    console.log(`Fila: ${checked.topic.id} (${checked.topic.category})`);
    chosen = { topic: checked.topic, draft: checked.draft };
  }

  const tried = new Set<string>();
  while (!chosen && tried.size < MAX_TOPICS) {
    const topic = pickTopic(topics, history, format, new Date(), tried);
    if (!topic) break;
    tried.add(topic.id);
    console.log(`Tema: ${topic.id} (${topic.category})`);
    const { draft, problems } = await draftFor(topic);
    if (problems.length === 0) {
      chosen = { topic, draft };
      break;
    }
    console.warn(`[${topic.id}] reprovado de novo, trocando de tema:\n- ${problems.join('\n- ')}`);
    if (state && !dry) {
      await state.record({ format, topicId: topic.id, category: topic.category, status: 'invalido', error: problems.join('\n') });
    }
  }
  if (!chosen) throw new Error(`nenhum rascunho passou na validação (${[...tried].join(', ')})`);

  const { topic, draft } = chosen;
  const { files, caption, reused } = await renderTo(draft, topic, format, outDir, active);
  console.log(`Arquivos em ${outDir}${reused ? ' (da prévia)' : ''}`);

  if (dry || !state) {
    console.log('--dry: não publicado.');
    return;
  }

  try {
    const { InstagramClient } = await import('./instagram');
    const { upload, remove } = await import('./blob');

    const saved = await state.getToken();
    const { expiresAt } = saved;
    let { token } = saved;
    if (!expiresAt || expiresAt.getTime() - Date.now() < REFRESH_BEFORE_DAYS * 86_400_000) {
      try {
        const fresh = await new InstagramClient({
          userId: 'me',
          token,
          appId: process.env.IG_APP_ID,
          appSecret: process.env.IG_APP_SECRET,
        }).refreshToken();
        await state.saveToken(fresh.token, fresh.expiresAt);
        token = fresh.token;
        console.log(`Token renovado até ${fresh.expiresAt.toISOString().slice(0, 10)}`);
      } catch (e) {
        // Token do Instagram com menos de 24 h, ou do Facebook sem IG_APP_SECRET: segue com o atual.
        console.warn(`Não renovou o token: ${(e as Error).message}`);
      }
    }

    const userId = process.env.IG_USER_ID?.trim();
    if (!userId) throw new Error('IG_USER_ID não definido');
    const ig = new InstagramClient({ userId, token });

    // Reels vai com a capa (capa.jpg, título da 1ª cena): sem ela o Instagram usa um quadro qualquer.
    const cover = format === 'reels' ? await reelCover(outDir) : null;
    const urls = await upload(cover ? [...files, cover] : files, `${today()}-${format}`);
    let mediaId: string;
    try {
      mediaId = format === 'carrossel' ? await ig.publishCarousel(urls, caption) : await ig.publishReel(urls[0], caption, cover ? urls.at(-1) : undefined);
    } finally {
      await remove(urls).catch((e) => console.warn(`Blob não removido: ${(e as Error).message}`));
    }
    await state.record({ format, topicId: topic.id, category: topic.category, status: 'publicado', igMediaId: mediaId, caption });
    console.log(`Publicado: ${mediaId} (${topic.id})`);
  } catch (e) {
    await state.record({ format, topicId: topic.id, category: topic.category, status: 'erro', caption, error: (e as Error).stack ?? String(e) });
    throw e;
  }
}

main()
  // exitCode guarda os códigos 2 (--draft reprovado) e 3 (--fila sem texto).
  .then(() => process.exit(process.exitCode ?? 0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
