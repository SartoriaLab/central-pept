// Gera o YT_REFRESH_TOKEN uma vez (login do Google no navegador, com a conta dona do canal).
//   tsx scripts/social/youtube-auth.ts
// Precisa de YT_CLIENT_ID e YT_CLIENT_SECRET no .env.local (cliente OAuth "App para computador").
// Abre um servidor em 127.0.0.1 só para receber o código do Google e imprime o refresh token.
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { TOKEN_URL, YT_SCOPE } from './youtube';

function loadLocalEnv(): void {
  const load = (process as { loadEnvFile?: (p: string) => void }).loadEnvFile;
  try {
    load?.(path.join(process.cwd(), '.env.local'));
  } catch {
    // Sem .env.local: segue com o ambiente.
  }
}

async function main() {
  loadLocalEnv();
  const clientId = process.env.YT_CLIENT_ID?.trim();
  const clientSecret = process.env.YT_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) throw new Error('faltam YT_CLIENT_ID e YT_CLIENT_SECRET no .env.local');

  const server = http.createServer();
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const port = (server.address() as { port: number }).port;
  const redirect = `http://127.0.0.1:${port}`;
  const auth = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirect,
    response_type: 'code',
    scope: YT_SCOPE,
    // offline + consent: o Google só devolve refresh token assim.
    access_type: 'offline',
    prompt: 'consent',
  })}`;

  console.log(`Abrindo o login do Google. Se não abrir, cole no navegador:\n${auth}\n`);
  spawn('cmd', ['/c', 'start', '', auth.replaceAll('&', '^&')], { stdio: 'ignore', detached: true }).unref();

  const code = await new Promise<string>((resolve, reject) => {
    server.on('request', (req, res) => {
      const url = new URL(req.url ?? '/', redirect);
      const c = url.searchParams.get('code');
      const err = url.searchParams.get('error');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(c ? '<p>Pronto. Pode fechar esta aba e voltar ao terminal.</p>' : `<p>Erro: ${err ?? 'sem código'}</p>`);
      if (c) resolve(c);
      else if (err) reject(new Error(`Google recusou: ${err}`));
    });
  });
  server.close();

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirect, grant_type: 'authorization_code' }).toString(),
  });
  const json = (await res.json()) as { refresh_token?: string; error_description?: string; error?: string };
  if (!json.refresh_token) throw new Error(`sem refresh token: ${json.error_description ?? json.error ?? res.status}`);
  console.log('Ponha no .env.local (não commite):\n');
  console.log(`YT_REFRESH_TOKEN=${json.refresh_token}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
