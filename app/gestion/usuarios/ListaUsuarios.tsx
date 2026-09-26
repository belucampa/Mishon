"use client";

import { useState } from "react";
import { clienteNavegador } from "@/lib/supabase/navegador";
import { NOMBRE_ROL, ROLES, type Perfil, type Rol } from "@/lib/roles";

export default function ListaUsuarios({
  usuarios: iniciales,
  miId,
  editable,
}: {
  usuarios: Perfil[];
  miId: string;
  editable: boolean;
}) {
  const [usuarios, setUsuarios] = useState(iniciales);
  const [busqueda, setBusqueda] = useState("");
  const [guardando, setGuardando] = useState<string | null>(null);
  const [error, setError] = useState("");

  const texto = busqueda.trim().toLowerCase();
  const visibles = texto
    ? usuarios.filter((u) => `${u.nombre} ${u.email}`.toLowerCase().includes(texto))
    : usuarios;

  async function cambiarRol(usuario: Perfil, nuevo: Rol) {
    if (nuevo === "admin" && !confirm(`¿Hacer admin a ${usuario.email}? Va a poder cambiar roles, incluido el tuyo.`)) {
      return;
    }
    setGuardando(usuario.id);
    setError("");
    const { error } = await clienteNavegador().rpc("cambiar_rol", {
      usuario: usuario.id,
      nuevo_rol: nuevo,
    });
    if (error) {
      setError(`No pude cambiar el rol de ${usuario.email}: ${error.message}`);
    } else {
      setUsuarios((lista) => lista.map((u) => (u.id === usuario.id ? { ...u, rol: nuevo } : u)));
    }
    setGuardando(null);
  }

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-negro/70">
          {usuarios.length} {usuarios.length === 1 ? "cuenta" : "cuentas"}
        </p>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o mail"
          aria-label="Buscar usuarios"
          className="w-full sm:w-72 px-5 py-2 rounded-full border-2 border-negro bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-negro"
        />
      </div>

      {error && <p role="alert" className="text-rojo font-semibold text-sm mb-4">{error}</p>}

      <ul className="rounded-3xl border-2 border-negro bg-white/60 divide-y-2 divide-negro/10 overflow-hidden">
        {visibles.map((u) => {
          const soyYo = u.id === miId;
          return (
            <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="font-semibold truncate">
                  {u.nombre || "Sin nombre"}
                  {soyYo && <span className="ml-2 text-xs font-normal text-negro/60">(vos)</span>}
                </p>
                <p className="text-sm text-negro/70 truncate">{u.email}</p>
              </div>
              {editable && !soyYo ? (
                <select
                  value={u.rol}
                  disabled={guardando === u.id}
                  onChange={(e) => cambiarRol(u, e.target.value as Rol)}
                  aria-label={`Rol de ${u.email}`}
                  className="px-4 py-2 rounded-full border-2 border-negro bg-crema font-semibold text-sm disabled:opacity-60"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {NOMBRE_ROL[r]}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="px-4 py-2 rounded-full border-2 border-negro/30 text-sm font-semibold">
                  {NOMBRE_ROL[u.rol]}
                </span>
              )}
            </li>
          );
        })}
        {visibles.length === 0 && (
          <li className="px-5 py-6 text-center text-negro/60">No hay nadie con ese nombre o mail.</li>
        )}
      </ul>
    </div>
  );
}
