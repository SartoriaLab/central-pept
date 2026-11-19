// Publicação diária do @dosecerta_br. Uso:
//   tsx scripts/social/run.ts carrossel|reels [--dry] [--force]
// --dry: escolhe, escreve, valida e renderiza em social/out/, sem publicar nem gravar no banco
// (sem DATABASE_URL usa histórico vazio). SOCIAL_PAUSED=1 desliga tudo.
// Um post por formato por dia: se já saiu, não publica de novo (--force publica mesmo assim).
// Variáveis: DATABASE_URL, IG_USER_ID, IG_ACCESS_TOKEN, BLOB_READ_WRITE_TOKEN e, para o texto,
// ANTHROPIC_API_KEY ou o Claude Code deste computador (write.ts). Lidas do .env.local, se existir.
// Agendado no Windows: scripts/social/agendar.ps1.
import fs from 'node:fs/promises';
import path from 'node:path';
import { buildTopics } from './topics';
import { pickTopic } from './pick';
import { writeDraft } from './write';
import { validateDraft } from './validate';
import { buildCaption } from './caption';
import { ctaFor, fetchActiveEbookSlugs } from './ebook-cta';
import { renderCarousel, renderReel } from './render';
import type { Draft, Format, HistoryEntry, Topic } from './types';

const MAX_TOPICS = 3;
const REFRESH_BEFORE_DAYS = 15;

function today(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
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

async function main() {
  loadLocalEnv();
  const format = process.argv[2] as Format;
  const dry = process.argv.includes('--dry');
  const force = process.argv.includes('--force');
  if (format !== 'carrossel' && format !== 'reels') throw new Error('uso: run.ts carrossel|reels [--dry] [--force]');
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

  const tried = new Set<string>();
  let chosen: { topic: Topic; draft: Draft } | null = null;
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
  const cta = ctaFor(topic, active);
  const caption = buildCaption(draft, topic, cta);
  const outDir = path.join(process.cwd(), 'social', 'out', `${today()}-${format}`);
  const files = format === 'carrossel' ? await renderCarousel(draft, topic, cta, outDir) : [await renderReel(draft, topic, cta, outDir)];
  await fs.writeFile(path.join(outDir, 'legenda.txt'), caption);
  await fs.writeFile(path.join(outDir, 'rascunho.json'), JSON.stringify({ topic: topic.id, cta: cta?.id ?? null, draft }, null, 2));
  console.log(`Arquivos em ${outDir}`);

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
        const fresh = await new InstagramClient({ userId: 'me', token }).refreshToken();
        await state.saveToken(fresh.token, fresh.expiresAt);
        token = fresh.token;
        console.log(`Token renovado até ${fresh.expiresAt.toISOString().slice(0, 10)}`);
      } catch (e) {
        // Token com menos de 24 h não renova: segue com o atual.
        console.warn(`Não renovou o token: ${(e as Error).message}`);
      }
    }

    const userId = process.env.IG_USER_ID?.trim();
    if (!userId) throw new Error('IG_USER_ID não definido');
    const ig = new InstagramClient({ userId, token });

    const urls = await upload(files, `${today()}-${format}`);
    let mediaId: string;
    try {
      mediaId = format === 'carrossel' ? await ig.publishCarousel(urls, caption) : await ig.publishReel(urls[0], caption);
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
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
