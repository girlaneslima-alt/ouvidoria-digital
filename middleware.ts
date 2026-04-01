import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que exigem autenticação (nova-manifestacao é pública — aceita anônimos)
const ROTAS_PROTEGIDAS = ["/dashboard", "/minhas-manifestacoes", "/settings", "/manifestacao"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const eRotaProtegida = ROTAS_PROTEGIDAS.some((r) => pathname.startsWith(r));
  if (!eRotaProtegida) return NextResponse.next();

  // Verifica cookie de sessão do Auth.js v5 (leve, sem importar Prisma)
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/minhas-manifestacoes/:path*", "/settings/:path*", "/manifestacao/:path*"],
};
