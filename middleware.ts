import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PROTECTED = ['/admin/assistente', '/admin/afiliados', '/api/assistente'];
// Bloqueio de crawlers fica no robots.ts (e, se preciso, no Firewall da Vercel):
// rodar middleware em toda requisição só para devolver 403 consome CPU.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  const user = process.env.ASSISTENTE_USER;
  const pass = process.env.ASSISTENTE_PASS;
  if (!user || !pass) {
    // Sem credenciais configuradas → bloqueia com 503
    return new NextResponse('Configure ASSISTENTE_USER e ASSISTENTE_PASS', { status: 503 });
  }

  const auth = request.headers.get('authorization') ?? '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic' || !encoded) return unauthorized();

  const [u, p] = Buffer.from(encoded, 'base64').toString().split(':');
  if (u !== user || p !== pass) return unauthorized();

  return NextResponse.next();
}

function unauthorized() {
  return new NextResponse('Acesso negado', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Assistente"' },
  });
}

export const config = {
  // Só as rotas protegidas — páginas e assets estáticos não invocam o middleware.
  matcher: ['/admin/assistente/:path*', '/admin/afiliados/:path*', '/api/assistente/:path*'],
};
