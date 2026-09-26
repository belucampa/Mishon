"use client";

import { useEffect, useState } from "react";
import { clienteNavegador } from "@/lib/supabase/navegador";
import { supabaseConfigurado } from "@/lib/supabase/config";

// "Ingresar" o "Mi cuenta" según haya sesión abierta.
export default function EnlaceCuenta() {
  const [conSesion, setConSesion] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supabaseConfigurado()) return;
    clienteNavegador()
      .auth.getSession()
      .then(({ data }) => setConSesion(Boolean(data.session)));
  }, []);

  // Hasta saberlo no mostramos nada, para que no parpadee.
  if (conSesion === null) return null;

  return (
    <a
      href={conSesion ? "/cuenta" : "/ingresar"}
      className="px-4 py-2 rounded-full border-2 border-negro text-sm font-button font-bold hover:bg-negro hover:text-crema transition-colors"
    >
      {conSesion ? "Mi cuenta" : "Ingresar"}
    </a>
  );
}
