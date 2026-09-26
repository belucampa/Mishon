import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESION, panelConfigurado, sesionValida } from "@/lib/sesion";
import { exigirSesion } from "@/lib/supabase/middleware";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return panelDeEdicion(req);
  }
  // /cuenta y /gestion piden haber iniciado sesión. El rol lo revisa cada página.
  return exigirSesion(req);
}

// Todo lo de /admin y /api/admin pide la contraseña del panel, menos la pantalla de login.
async function panelDeEdicion(req: NextRequest) {
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
  matcher: ["/admin/:path*", "/api/admin/:path*", "/cuenta/:path*", "/gestion/:path*"],
};
