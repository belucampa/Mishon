"use client";

import { useState, FormEvent } from "react";
import { Aviso, Boton, Campo, Tarjeta, traducirError } from "../components/Formulario";
import { clienteNavegador } from "@/lib/supabase/navegador";

export default function Recuperar() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [listo, setListo] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const { error } = await clienteNavegador().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/confirmar?siguiente=/cuenta/clave`,
      });
      if (error) throw error;
      setListo(true);
    } catch (err) {
      setError(traducirError(err as { code?: string; message: string }));
    }
    setCargando(false);
  }

  return (
    <Tarjeta titulo="Recuperar contraseña">
      {listo ? (
        <p className="text-center">
          Si hay una cuenta con ese mail, te llega un enlace para elegir una contraseña nueva.
        </p>
      ) : (
        <form onSubmit={enviar}>
          <Campo
            etiqueta="Tu mail"
            type="email"
            autoComplete="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Boton cargando={cargando}>{cargando ? "Enviando…" : "Mandame el enlace"}</Boton>
          {error && <Aviso tipo="error">{error}</Aviso>}
        </form>
      )}
      <p className="text-sm text-center mt-6">
        <a href="/ingresar" className="underline underline-offset-4">
          Volver a ingresar
        </a>
      </p>
    </Tarjeta>
  );
}
