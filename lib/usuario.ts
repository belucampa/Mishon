import { redirect } from "next/navigation";
import { clienteServidor } from "./supabase/servidor";
import { SECCIONES, type Perfil, type Rol } from "./roles";

// Quién inició sesión y con qué rol, o null si nadie.
export async function obtenerPerfil(): Promise<Perfil | null> {
  const supabase = clienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("perfiles")
    .select("id, email, nombre, rol, creado_en")
    .eq("id", user.id)
    .single();
  return (data as Perfil | null) ?? null;
}

// Para el principio de cada página protegida.
export async function exigirRol(permitidos: readonly Rol[], desde: string) {
  const perfil = await obtenerPerfil();
  if (!perfil) redirect(`/ingresar?siguiente=${encodeURIComponent(desde)}`);
  if (!permitidos.includes(perfil.rol)) redirect("/cuenta");
  return perfil;
}

// Igual que exigirRol, con los roles que SECCIONES le da a esa parte del panel.
export async function exigirSeccion(ruta: (typeof SECCIONES)[number]["ruta"]) {
  const seccion = SECCIONES.find((s) => s.ruta === ruta)!;
  return exigirRol(seccion.roles, ruta);
}
