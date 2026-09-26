import { NextResponse } from "next/server";
import { clienteServidor } from "@/lib/supabase/servidor";
import { supabaseConfigurado } from "@/lib/supabase/config";
import { enviarMail, mailsConfigurados } from "@/lib/mails/enviar";
import { mailBienvenida } from "@/lib/mails/contenidos";

export const dynamic = "force-dynamic";

// El formulario "Avisame primero" de la landing.
export async function POST(req: Request) {
  if (!supabaseConfigurado()) {
    return NextResponse.json({ error: "La lista todavía no está conectada." }, { status: 503 });
  }
  const { email } = await req.json().catch(() => ({ email: "" }));
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: "Revisá que el mail esté bien escrito." }, { status: 400 });
  }

  const { data: token, error } = await clienteServidor().rpc("anotar_en_lista", { correo: email });
  if (error) {
    console.error("anotar_en_lista:", error.message);
    return NextResponse.json({ error: "No pudimos anotarte. Probá de nuevo en un rato." }, { status: 500 });
  }

  // Solo la primera vez. Si falla el mail, igual quedó anotada/o.
  if (token && mailsConfigurados()) {
    try {
      await enviarMail(mailBienvenida(email.trim().toLowerCase(), token));
    } catch (e) {
      console.error("Mail de bienvenida:", (e as Error).message);
    }
  }
  return NextResponse.json({ ok: true });
}
