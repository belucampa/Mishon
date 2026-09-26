import type { Metadata } from "next";
import { exigirRol } from "@/lib/usuario";
import { NOMBRE_ROL, seccionesPara } from "@/lib/roles";
import Pestanas from "./Pestanas";

export const metadata: Metadata = {
  title: "Gestión · Mishón",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function GestionLayout({ children }: { children: React.ReactNode }) {
  const perfil = await exigirRol(["logistica", "equipo", "admin"], "/gestion");

  return (
    <div className="min-h-screen bg-crema text-negro">
      <header className="border-b-2 border-negro px-6 md:px-14 pt-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <a href="/">
            <img src="/mishon-negro.png" alt="Mishón" className="h-8 w-auto" />
          </a>
          <a href="/cuenta" className="text-sm font-semibold text-right">
            {perfil.nombre || perfil.email}
            <span className="block text-xs font-normal text-negro/60">{NOMBRE_ROL[perfil.rol]}</span>
          </a>
        </div>
        <Pestanas secciones={seccionesPara(perfil.rol).map(({ ruta, nombre }) => ({ ruta, nombre }))} />
      </header>
      <main className="max-w-5xl mx-auto px-6 md:px-14 py-10">{children}</main>
    </div>
  );
}
