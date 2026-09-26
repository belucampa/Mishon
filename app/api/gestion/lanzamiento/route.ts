import { NextResponse } from "next/server";
import { obtenerPerfil } from "@/lib/usuario";
import { clienteServidor } from "@/lib/supabase/servidor";
import { enviarMail, enviarTanda, mailsConfigurados } from "@/lib/mails/enviar";
import { mailLanzamiento, validarLanzamiento, type ContenidoLanzamiento } from "@/lib/mails/contenidos";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TANDA = 100;
// Cortamos antes del límite de Vercel; el panel vuelve a llamar hasta terminar.
const TIEMPO_MAX_MS = 45_000;

// modo "prueba": te lo manda solo a vos. modo "todos": a la lista, de a tandas.
export async function POST(req: Request) {
  const perfil = await obtenerPerfil();
  if (!perfil || !["admin", "equipo"].includes(perfil.rol)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  if (!mailsConfigurados()) {
    return NextResponse.json({ error: "Falta configurar Resend (RESEND_API_KEY)." }, { status: 503 });
  }

  const { modo, contenido } = await req.json().catch(() => ({}));
  const problema = validarLanzamiento(contenido);
  if (problema) return NextResponse.json({ error: problema }, { status: 400 });
  const c = contenido as ContenidoLanzamiento;

  try {
    if (modo === "prueba") {
      const mail = mailLanzamiento(perfil.email, "00000000-0000-0000-0000-000000000000", c);
      await enviarMail({ ...mail, asunto: `[Prueba] ${mail.asunto}` });
      return NextResponse.json({ ok: true, enviados: 1, faltan: 0 });
    }
    if (modo !== "todos") return NextResponse.json({ error: "Modo desconocido" }, { status: 400 });

    const supabase = clienteServidor();
    const inicio = Date.now();
    let enviados = 0;

    while (Date.now() - inicio < TIEMPO_MAX_MS) {
      const { data, error } = await supabase
        .from("lista_espera")
        .select("id, email, token_baja")
        .eq("dado_de_baja", false)
        .is("lanzamiento_enviado_en", null)
        .order("creado_en")
        .limit(TANDA);
      if (error) throw new Error(error.message);
      if (!data.length) break;

      await enviarTanda(data.map((p) => mailLanzamiento(p.email, p.token_baja, c)));
      const marca = await supabase.rpc("marcar_lanzamiento_enviado", { ids: data.map((p) => p.id) });
      if (marca.error) throw new Error(marca.error.message);
      enviados += data.length;
    }

    const { count } = await supabase
      .from("lista_espera")
      .select("id", { count: "exact", head: true })
      .eq("dado_de_baja", false)
      .is("lanzamiento_enviado_en", null);
    return NextResponse.json({ ok: true, enviados, faltan: count ?? 0 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
