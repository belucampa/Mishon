import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_SESION, sesionValida } from "@/lib/sesion";
import { ErrorAlmacen, guardarImagen, puedeGuardar } from "@/lib/almacen";

export const dynamic = "force-dynamic";

const TIPOS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 3 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await sesionValida(cookies().get(COOKIE_SESION)?.value))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!puedeGuardar()) {
    return NextResponse.json(
      { error: "Falta configurar GITHUB_TOKEN en Vercel para poder subir imágenes." },
      { status: 503 }
    );
  }
  const form = await req.formData();
  const archivo = form.get("archivo");
  if (!(archivo instanceof File)) {
    return NextResponse.json({ error: "No llegó ninguna imagen" }, { status: 400 });
  }
  const extension = TIPOS[archivo.type];
  if (!extension) {
    return NextResponse.json({ error: "Solo se aceptan PNG, JPG, WEBP o GIF" }, { status: 400 });
  }
  if (archivo.size > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen pesa más de 3 MB" }, { status: 400 });
  }
  const base = archivo.name
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "imagen";
  const nombre = `${Date.now()}-${base}.${extension}`;
  try {
    const ruta = await guardarImagen(nombre, Buffer.from(await archivo.arrayBuffer()));
    return NextResponse.json({ ruta });
  } catch (e) {
    const estado = e instanceof ErrorAlmacen ? e.estado : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: estado });
  }
}
