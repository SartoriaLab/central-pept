import { NextRequest, NextResponse } from 'next/server';

/**
 * Redirect de afiliado desativado. Links antigos (páginas em cache, buscadores,
 * mensagens compartilhadas) caem na home em vez de irem para o WhatsApp do parceiro.
 * 302 de propósito: redirect permanente ficaria preso no cache do navegador.
 */
export function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/', req.url), { status: 302 });
}
