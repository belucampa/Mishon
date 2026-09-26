import type { Metadata } from "next";
import { exigirRol } from "@/lib/usuario";
import { NOMBRE_ROL, ROLES, entraAGestion } from "@/lib/roles";
import CerrarSesion from "./CerrarSesion";

export const metadata: Metadata = {
  title: "Mi cuenta · Mishón",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Cuenta() {
  const perfil = await exigirRol(ROLES, "/cuenta");

  return (
    <main className="min-h-screen bg-crema text-negro px-6 md:px-14 py-10">
      <header className="flex items-center justify-between max-w-3xl mx-auto mb-10">
        <a href="/">
          <img src="/mishon-negro.png" alt="Mishón" className="h-8 md:h-10 w-auto" />
        </a>
        <CerrarSesion />
      </header>

      <section className="max-w-3xl mx-auto">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl">
          Hola{perfil.nombre ? `, ${perfil.nombre}` : ""}
        </h1>
        <p className="mt-2 text-negro/70">{perfil.email}</p>
        {perfil.rol !== "cliente" && (
          <p className="mt-3 inline-block rounded-full bg-mostaza border-2 border-negro px-4 py-1 text-sm font-semibold">
            {NOMBRE_ROL[perfil.rol]}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-5 mt-10">
          {entraAGestion(perfil.rol) && (
            <a
              href="/gestion"
              className="rounded-3xl border-2 border-negro bg-verde p-6 hover:-translate-y-0.5 transition-transform"
            >
              <h2 className="font-display font-bold text-xl">Panel de gestión</h2>
              <p className="text-sm mt-1">Pedidos, envíos, ventas y usuarios.</p>
            </a>
          )}
          <div className="rounded-3xl border-2 border-negro bg-amarillo p-6">
            <h2 className="font-display font-bold text-xl">Ya estás en la lista</h2>
            <p className="text-sm mt-1">Te avisamos a {perfil.email} apenas abra la tienda.</p>
          </div>
          <a
            href="/cuenta/clave"
            className="rounded-3xl border-2 border-negro bg-white/60 p-6 hover:-translate-y-0.5 transition-transform"
          >
            <h2 className="font-display font-bold text-xl">Cambiar contraseña</h2>
          </a>
        </div>
      </section>
    </main>
  );
}
