import { NextResponse } from "next/server";
import { clienteServidor } from "@/lib/supabase/servidor";
import { rutaSegura } from "@/lib/roles";

export const dynamic = "force-dynamic";

// A dónde vuelven los enlaces de los mails (confirmar cuenta, recuperar contraseña).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const codigo = url.searchParams.get("code");
  const siguiente = rutaSegura(url.searchParams.get("siguiente"));

  if (codigo) {
    const { error } = await clienteServidor().auth.exchangeCodeForSession(codigo);
    if (!error) return NextResponse.redirect(new URL(siguiente, url.origin));
  }
  return NextResponse.redirect(new URL("/ingresar?aviso=enlace", url.origin));
}
