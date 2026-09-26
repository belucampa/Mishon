"use client";

import { clienteNavegador } from "@/lib/supabase/navegador";

export default function CerrarSesion() {
  async function salir() {
    await clienteNavegador().auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={salir}
      className="text-sm font-semibold border-b-2 border-transparent hover:border-negro transition-colors"
    >
      Cerrar sesión
    </button>
  );
}
