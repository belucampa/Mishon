import { redirect } from "next/navigation";
import { exigirRol } from "@/lib/usuario";
import { seccionesPara } from "@/lib/roles";

export default async function Gestion() {
  const perfil = await exigirRol(["logistica", "equipo", "admin"], "/gestion");
  redirect(seccionesPara(perfil.rol)[0].ruta);
}
