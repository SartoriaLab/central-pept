// Cliente mínimo da Instagram API (graph.instagram.com; token do Facebook vai a graph.facebook.com).
// Fluxo: container(s) → espera FINISHED → media_publish. `fetch` e `sleep` injetáveis (testes).
// Docs: developers.facebook.com/docs/instagram-platform/content-publishing

export const IG_BASE = 'https://graph.instagram.com';
export const FB_BASE = 'https://graph.facebook.com/v27.0';

/**
 * Host da API pelo formato do token: o do login do Instagram começa com "IG"; o do login do
 * Facebook (login unificado pode gerar este) começa com "EAA" e graph.instagram.com não o lê.
 */
export function apiBase(token: string): string {
  return token.startsWith('EAA') ? FB_BASE : IG_BASE;
}

/** Formato do token para log, sem expor o valor: família, tamanho e caracteres estranhos. */
export function tokenShape(token: string): string {
  const kind = token.startsWith('IG') ? 'IG' : token.startsWith('EAA') ? 'EAA' : 'desconhecido';
  const odd = /[^A-Za-z0-9_\-|.]/.test(token) ? ', com caracteres fora do padrão' : '';
  return `token ${kind}, ${token.length} chars${odd}`;
}

type Sleep = (ms: number) => Promise<void>;
/** Tentativas por chamada repetível e espera base entre elas (10 s, 20 s, 30 s...). */
const RETRIES = 4;
const RETRY_MS = 10_000;
const realSleep: Sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** App da Meta "Dose Certa Publicador" (não é segredo; a chave secreta vem de IG_APP_SECRET). */
export const DEFAULT_APP_ID = '1855908455448795';

export type IgOptions = {
  userId: string;
  token: string;
  /** Só para renovar token do Facebook (EAA): ID e chave secreta do app da Meta. */
  appId?: string;
  appSecret?: string;
  fetchFn?: typeof fetch;
  sleep?: Sleep;
  /** Intervalo e limite da espera do processamento (Reels demora). */
  pollMs?: number;
  timeoutMs?: number;
};

export class InstagramClient {
  private readonly fetchFn: typeof fetch;
  private readonly sleep: Sleep;
  private readonly pollMs: number;
  private readonly timeoutMs: number;

  constructor(private readonly opts: IgOptions) {
    this.fetchFn = opts.fetchFn ?? fetch;
    this.sleep = opts.sleep ?? realSleep;
    this.pollMs = opts.pollMs ?? 20_000;
    this.timeoutMs = opts.timeoutMs ?? 10 * 60_000;
  }

  private async call<T>(method: 'GET' | 'POST', path: string, params: Record<string, string>, auth = true): Promise<T> {
    const qs = new URLSearchParams(auth ? { ...params, access_token: this.opts.token } : params);
    const base = apiBase(this.opts.token);
    const res =
      method === 'GET'
        ? await this.fetchFn(`${base}${path}?${qs}`)
        : await this.fetchFn(`${base}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: qs.toString(),
          });
    const json = (await res.json().catch(() => ({}))) as T & { error?: { message?: string; code?: number; is_transient?: boolean } };
    if (!res.ok || json.error) {
      const code = json.error?.code;
      // 190 = token inválido: o formato (nunca o valor) diz se é token errado ou host errado.
      const shape = code === 190 ? `; ${tokenShape(this.opts.token)}, host ${base}` : '';
      const err = new Error(`Instagram ${path}: ${json.error?.message ?? res.status} (código ${code ?? '?'})${shape}`);
      // -2/1/2 = timeout ou falha passageira da Meta (vista no carrossel de 22/11); 5xx idem.
      (err as Error & { transient?: boolean }).transient =
        json.error?.is_transient === true || [-2, -1, 1, 2].includes(code ?? 0) || res.status >= 500;
      throw err;
    }
    return json;
  }

  /**
   * `call` que tenta de novo erro passageiro: conexão caída (fetch failed/ECONNRESET, como em 21/11)
   * ou timeout da Meta. Só para chamadas sem efeito duplicado (criar container, ler status):
   * media_publish não passa por aqui, para não sair post repetido.
   */
  private async retrying<T>(method: 'GET' | 'POST', path: string, params: Record<string, string>): Promise<T> {
    for (let attempt = 1; ; attempt++) {
      try {
        return await this.call<T>(method, path, params);
      } catch (e) {
        const transient = e instanceof TypeError || (e as { transient?: boolean }).transient === true;
        if (!transient || attempt >= RETRIES) throw e;
        console.warn(`Instagram ${path}: ${(e as Error).message}; tentando de novo (${attempt}/${RETRIES - 1})`);
        await this.sleep(RETRY_MS * attempt);
      }
    }
  }

  private async container(params: Record<string, string>): Promise<string> {
    const { id } = await this.retrying<{ id: string }>('POST', `/${this.opts.userId}/media`, params);
    return id;
  }

  /** Espera o container ficar pronto. ERROR/EXPIRED ou estouro do tempo viram exceção. */
  async waitFinished(id: string): Promise<void> {
    const deadline = Date.now() + this.timeoutMs;
    for (;;) {
      const { status_code, status } = await this.retrying<{ status_code: string; status?: string }>('GET', `/${id}`, {
        fields: 'status_code,status',
      });
      if (status_code === 'FINISHED' || status_code === 'PUBLISHED') return;
      if (status_code === 'ERROR' || status_code === 'EXPIRED') {
        throw new Error(`container ${id} ${status_code}${status ? `: ${status}` : ''}`);
      }
      if (Date.now() >= deadline) throw new Error(`container ${id} não ficou pronto a tempo (${status_code})`);
      await this.sleep(this.pollMs);
    }
  }

  private async publish(creationId: string): Promise<string> {
    const { id } = await this.call<{ id: string }>('POST', `/${this.opts.userId}/media_publish`, { creation_id: creationId });
    return id;
  }

  /** Carrossel de 2 a 20 imagens JPEG (URLs públicas). Devolve o id do post. */
  async publishCarousel(imageUrls: string[], caption: string): Promise<string> {
    if (imageUrls.length < 2 || imageUrls.length > 20) throw new Error(`carrossel com ${imageUrls.length} imagens`);
    const children: string[] = [];
    for (const url of imageUrls) {
      children.push(await this.container({ image_url: url, is_carousel_item: 'true' }));
    }
    for (const id of children) await this.waitFinished(id);
    const carousel = await this.container({ media_type: 'CAROUSEL', children: children.join(','), caption });
    await this.waitFinished(carousel);
    return this.publish(carousel);
  }

  /** Reels a partir de um MP4 público, com a capa (JPEG público) quando houver. Devolve o id do post. */
  async publishReel(videoUrl: string, caption: string, coverUrl?: string): Promise<string> {
    const params: Record<string, string> = { media_type: 'REELS', video_url: videoUrl, caption, share_to_feed: 'true' };
    if (coverUrl) params.cover_url = coverUrl;
    const id = await this.container(params);
    await this.waitFinished(id);
    return this.publish(id);
  }

  /** Legenda de um post (o webhook do direct acha o guia por ela). */
  async mediaCaption(mediaId: string): Promise<string> {
    const { caption } = await this.call<{ caption?: string }>('GET', `/${mediaId}`, { fields: 'caption' });
    return caption ?? '';
  }

  /**
   * Resposta privada (direct) a um comentário: uma mensagem por comentário, até 7 dias depois
   * dele. Precisa da permissão instagram_business_manage_messages. `userId` = conta que envia.
   */
  async privateReply(commentId: string, text: string): Promise<void> {
    await this.call('POST', `/${this.opts.userId}/messages`, {
      recipient: JSON.stringify({ comment_id: commentId }),
      message: JSON.stringify({ text }),
    });
  }

  /** Resposta pública no comentário (permissão instagram_business_manage_comments). */
  async replyComment(commentId: string, text: string): Promise<void> {
    await this.call('POST', `/${commentId}/replies`, { message: text });
  }

  /**
   * Renova o token de longa duração. Token do Instagram (IG...): refresh_access_token, precisa ter
   * mais de 24 h. Token do Facebook (EAA..., do login unificado): troca fb_exchange_token, que pede
   * o ID e a chave secreta do app; a validade vem da resposta ou do debug_token.
   */
  async refreshToken(): Promise<{ token: string; expiresAt: Date }> {
    if (this.opts.token.startsWith('EAA')) return this.refreshFacebookToken();
    const json = await this.call<{ access_token: string; expires_in: number }>('GET', '/refresh_access_token', {
      grant_type: 'ig_refresh_token',
    });
    return { token: json.access_token, expiresAt: new Date(Date.now() + json.expires_in * 1000) };
  }

  private async refreshFacebookToken(): Promise<{ token: string; expiresAt: Date }> {
    const appId = this.opts.appId?.trim() || DEFAULT_APP_ID;
    const secret = this.opts.appSecret?.trim();
    if (!secret) throw new Error('IG_APP_SECRET não definido: sem a chave secreta do app o token do Facebook não renova');
    const json = await this.call<{ access_token: string; expires_in?: number }>(
      'GET',
      '/oauth/access_token',
      { grant_type: 'fb_exchange_token', client_id: appId, client_secret: secret, fb_exchange_token: this.opts.token },
      false,
    );
    if (json.expires_in) return { token: json.access_token, expiresAt: new Date(Date.now() + json.expires_in * 1000) };
    // Sem expires_in na resposta: pergunta a validade ao debug_token (0 = não expira).
    const debug = await this.call<{ data: { expires_at?: number; data_access_expires_at?: number } }>(
      'GET',
      '/debug_token',
      { input_token: json.access_token, access_token: `${appId}|${secret}` },
      false,
    );
    const at = debug.data.expires_at || 0;
    // Não expira: anota 60 dias para conferir de novo lá na frente.
    const expiresAt = at > 0 ? new Date(at * 1000) : new Date(Date.now() + 60 * 86_400_000);
    return { token: json.access_token, expiresAt };
  }
}
