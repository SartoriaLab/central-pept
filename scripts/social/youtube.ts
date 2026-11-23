// Cliente mínimo da YouTube Data API v3 para publicar o Shorts (o mesmo vídeo vertical do Reels,
// com o fechamento "link no canal"). Vídeo vertical de até 3 min vira Shorts sozinho.
// Fluxo: refresh token → access token (1 h) → upload retomável (POST com os metadados, PUT com o MP4).
// Docs: developers.google.com/youtube/v3/docs/videos/insert e /guides/using_resumable_upload_protocol
// `fetch` e `sleep` injetáveis (testes). Setup do Google Cloud: docs/instagram-setup.md, Parte 9.
import fs from 'node:fs/promises';

export const TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const UPLOAD_URL = 'https://www.googleapis.com/upload/youtube/v3/videos';
/** Só subir vídeo: o robô não lê nem apaga nada do canal. */
export const YT_SCOPE = 'https://www.googleapis.com/auth/youtube.upload';
/** Categoria "Educação" (videoCategories do YouTube). */
export const EDUCATION_CATEGORY = '27';

export type Privacy = 'public' | 'unlisted' | 'private';

export type YtOptions = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  fetchFn?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
};

export type ShortMeta = {
  title: string;
  description: string;
  tags: string[];
  privacy?: Privacy;
};

/** Variáveis do YouTube no .env.local. Sem as três, o Shorts não sai (o Reels segue normal). */
export function youtubeEnv(env: Record<string, string | undefined> = process.env): YtOptions | null {
  const clientId = env.YT_CLIENT_ID?.trim();
  const clientSecret = env.YT_CLIENT_SECRET?.trim();
  const refreshToken = env.YT_REFRESH_TOKEN?.trim();
  return clientId && clientSecret && refreshToken ? { clientId, clientSecret, refreshToken } : null;
}

/** YT_PRIVACY (public, unlisted ou private); padrão público. */
export function privacyFrom(value: string | undefined): Privacy {
  const v = value?.trim().toLowerCase();
  return v === 'private' || v === 'unlisted' ? v : 'public';
}

/** Corpo do videos.insert. Voz sintética: o YouTube pede o aviso de conteúdo alterado ou gerado. */
export function insertBody(meta: ShortMeta) {
  return {
    snippet: {
      title: meta.title,
      description: meta.description,
      tags: meta.tags,
      categoryId: EDUCATION_CATEGORY,
      defaultLanguage: 'pt-BR',
      defaultAudioLanguage: 'pt-BR',
    },
    status: {
      privacyStatus: meta.privacy ?? 'public',
      selfDeclaredMadeForKids: false,
      containsSyntheticMedia: true,
      embeddable: true,
    },
  };
}

const RETRIES = 3;
const RETRY_MS = 10_000;

export class YouTubeClient {
  private readonly fetchFn: typeof fetch;
  private readonly sleep: (ms: number) => Promise<void>;

  constructor(private readonly opts: YtOptions) {
    this.fetchFn = opts.fetchFn ?? fetch;
    this.sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  }

  /** Access token novo a cada execução (vale 1 h; o refresh token não muda). */
  async accessToken(): Promise<string> {
    const res = await this.fetchFn(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.opts.clientId,
        client_secret: this.opts.clientSecret,
        refresh_token: this.opts.refreshToken,
        grant_type: 'refresh_token',
      }).toString(),
    });
    const json = (await res.json().catch(() => ({}))) as { access_token?: string; error?: string; error_description?: string };
    if (!res.ok || !json.access_token) {
      // invalid_grant = refresh token revogado ou vencido (app em "teste" no Google Cloud vence em 7 dias).
      const hint = json.error === 'invalid_grant' ? '; gere outro com `tsx scripts/social/youtube-auth.ts` e confira se o app está "Em produção"' : '';
      throw new Error(`YouTube token: ${json.error_description ?? json.error ?? res.status}${hint}`);
    }
    return json.access_token;
  }

  /** Sobe o MP4 e devolve o id do vídeo (youtube.com/shorts/<id>). */
  async uploadShort(file: string, meta: ShortMeta): Promise<string> {
    const video = await fs.readFile(file);
    const token = await this.accessToken();
    const session = await this.startSession(token, meta, video.length);
    // Só o PUT do arquivo é repetido: a sessão retomável aceita o mesmo envio de novo sem duplicar.
    for (let attempt = 1; ; attempt++) {
      try {
        const res = await this.fetchFn(session, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'video/mp4', 'Content-Length': String(video.length) },
          body: video,
        });
        const json = (await res.json().catch(() => ({}))) as { id?: string; error?: { message?: string } };
        if (res.ok && json.id) return json.id;
        const err = new Error(`YouTube upload: ${json.error?.message ?? res.status}`);
        (err as Error & { transient?: boolean }).transient = res.status >= 500;
        throw err;
      } catch (e) {
        const transient = e instanceof TypeError || (e as { transient?: boolean }).transient === true;
        if (!transient || attempt >= RETRIES) throw e;
        console.warn(`${(e as Error).message}; tentando de novo (${attempt}/${RETRIES - 1})`);
        await this.sleep(RETRY_MS * attempt);
      }
    }
  }

  private async startSession(token: string, meta: ShortMeta, size: number): Promise<string> {
    const qs = new URLSearchParams({ uploadType: 'resumable', part: 'snippet,status' });
    const res = await this.fetchFn(`${UPLOAD_URL}?${qs}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': String(size),
        'X-Upload-Content-Type': 'video/mp4',
      },
      body: JSON.stringify(insertBody(meta)),
    });
    const location = res.headers.get('location');
    if (!res.ok || !location) {
      const json = (await res.json().catch(() => ({}))) as { error?: { message?: string; errors?: { reason?: string }[] } };
      const reason = json.error?.errors?.[0]?.reason;
      // quotaExceeded / uploadLimitExceeded: limite do dia; o próximo horário tenta de novo.
      throw new Error(`YouTube videos.insert: ${json.error?.message ?? res.status}${reason ? ` (${reason})` : ''}`);
    }
    return location;
  }
}
