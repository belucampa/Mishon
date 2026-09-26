import { NextResponse } from "next/server";
import {
  COOKIE_SESION,
  DURACION_SESION_S,
  crearSesion,
  panelConfigurado,
  passwordCorrecta,
} from "@/lib/sesion";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!panelConfigurado()) {
    return NextResponse.json(
      { error: "El panel no tiene contraseña configurada (falta ADMIN_PASSWORD)." },
      { status: 503 }
    );
  }
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !passwordCorrecta(password)) {
    // Una pequeña espera hace más lento probar contraseñas al azar.
    await new Promise((r) => setTimeout(r, 1000));
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }
  const token = await crearSesion();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESION, token as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: DURACION_SESION_S,
  });
  return res;
}
