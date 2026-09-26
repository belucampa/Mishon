"use client";

import { useState, FormEvent } from "react";
import { Aviso, Boton } from "../components/Formulario";
import { clienteNavegador } from "@/lib/supabase/navegador";

// Pide confirmar con un botón: algunos correos abren los links solos para revisarlos,
// y eso no tiene que dar de baja a nadie.
export default function BotonBaja({ token }: { token: string }) {
  const [estado, setEstado] = useState<"inicio" | "cargando" | "listo" | "error">("inicio");
  const valido = /^[0-9a-f-]{36}$/i.test(token);

  async function confirmar(e: FormEvent) {
    e.preventDefault();
    setEstado("cargando");
    const { data, error } = await clienteNavegador().rpc("dar_de_baja", { token });
    setEstado(!error && data ? "listo" : "error");
  }

  if (!valido) {
    return <p className="text-center">Este link no es válido. Usá el que viene al pie de nuestros mails.</p>;
  }
  if (estado === "listo") {
    return <p className="text-center">Listo, no te vamos a mandar más mails. ¡Gracias por el tiempo!</p>;
  }
  return (
    <form onSubmit={confirmar} className="text-center">
      <p className="mb-6">¿Querés dejar de recibir mails de Mishón, incluido el aviso de cuando abra la tienda?</p>
      <Boton cargando={estado === "cargando"}>Sí, no me manden más</Boton>
      {estado === "error" && (
        <Aviso tipo="error">No pudimos darte de baja. Probá de nuevo o escribinos.</Aviso>
      )}
    </form>
  );
}
