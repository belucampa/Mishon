import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_SESION, sesionValida } from "@/lib/sesion";
import { ErrorAlmacen, guardarContenido, leerContenido, puedeGuardar, usaGithub } from "@/lib/almacen";
import { validarSitio } from "@/lib/sitio";

export const dynamic = "force-dynamic";

async function autorizado() {
  return sesionValida(cookies().get(COOKIE_SESION)?.value);
}

function error(e: unknown) {
  const estado = e instanceof ErrorAlmacen ? e.estado : 500;
  const mensaje = e instanceof Error ? e.message : "Error desconocido";
  return NextResponse.json({ error: mensaje }, { status: estado });
}

export async function GET() {
  if (!(await autorizado())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  try {
    const { texto, version } = await leerContenido();
    return NextResponse.json({
      sitio: JSON.parse(texto),
      version,
      modo: usaGithub ? "github" : "local",
      puedeGuardar: puedeGuardar(),
    });
  } catch (e) {
    return error(e);
  }
}

export async function PUT(req: Request) {
  if (!(await autorizado())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!puedeGuardar()) {
    return NextResponse.json(
      { error: "Falta configurar GITHUB_TOKEN en Vercel para poder guardar." },
      { status: 503 }
    );
  }
  try {
    const { sitio, version } = await req.json();
    const problema = validarSitio(sitio);
    if (problema) return NextResponse.json({ error: problema }, { status: 400 });
    if (typeof version !== "string") {
      return NextResponse.json({ error: "Falta la versión" }, { status: 400 });
    }
    await guardarContenido(JSON.stringify(sitio, null, 2) + "\n", version);
    const nuevo = await leerContenido();
    return NextResponse.json({ ok: true, version: nuevo.version });
  } catch (e) {
    return error(e);
  }
}
