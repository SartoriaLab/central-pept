import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PROTECTED = ['/admin/assistente', '/admin/afiliados', '/api/assistente'];
const BLOCKED_CRAWLERS = [
  'mj12bot',
  'ahrefsbot',
  'semrushbot',
  'dotbot',
  'bytespider',
  'dataforseobot',
  'blexbot',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent')?.toLowerCase() ?? '';

  if (BLOCKED_CRAWLERS.some((crawler) => userAgent.includes(crawler))) {
    return new NextResponse('Rastreador bloqueado', { status: 403 });
  }

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
  matcher: '/:path*',
};
