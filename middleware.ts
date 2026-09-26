import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESION, panelConfigurado, sesionValida } from "@/lib/sesion";

// Todo lo de /admin y /api/admin pide sesión, menos la pantalla de login.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const esLogin = pathname === "/admin/login" || pathname === "/api/admin/login";
  if (esLogin) return NextResponse.next();

  const ok = panelConfigurado() && (await sesionValida(req.cookies.get(COOKIE_SESION)?.value));
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
