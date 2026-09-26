import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigurado } from "./config";

// Renueva la sesión si está por vencer y manda a /ingresar a quien no inició sesión.
export async function exigirSesion(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  if (!supabaseConfigurado()) return res;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll(lista, encabezados) {
        lista.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        lista.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        Object.entries(encabezados).forEach(([k, v]) => res.headers.set(k, v));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return res;

  const url = req.nextUrl.clone();
  url.pathname = "/ingresar";
  url.search = `?siguiente=${encodeURIComponent(req.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}
