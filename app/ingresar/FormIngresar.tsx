"use client";

import { useState, FormEvent } from "react";
import { Aviso, Boton, Campo, traducirError } from "../components/Formulario";
import { clienteNavegador } from "@/lib/supabase/navegador";

export default function FormIngresar({ siguiente, aviso }: { siguiente: string; aviso: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function ingresar(e: FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const { error } = await clienteNavegador().auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Recarga entera para que el servidor vea la sesión nueva.
      window.location.href = siguiente;
    } catch (err) {
      setError(traducirError(err as { code?: string; message: string }));
      setCargando(false);
    }
  }

  return (
    <form onSubmit={ingresar}>
      {aviso && (
        <p className="text-sm mb-5 rounded-2xl bg-amarillo border-2 border-negro px-4 py-3">{aviso}</p>
      )}
      <Campo
        etiqueta="Mail"
        type="email"
        autoComplete="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Campo
        etiqueta="Contraseña"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Boton cargando={cargando}>{cargando ? "Entrando…" : "Entrar"}</Boton>
      {error && <Aviso tipo="error">{error}</Aviso>}
      <p className="text-sm text-center mt-6">
        <a href="/recuperar" className="underline underline-offset-4">
          Me olvidé la contraseña
        </a>
      </p>
      <p className="text-sm text-center mt-2">
        ¿No tenés cuenta?{" "}
        <a
          href={`/registrarme?siguiente=${encodeURIComponent(siguiente)}`}
          className="font-semibold underline underline-offset-4"
        >
          Registrate
        </a>
      </p>
    </form>
  );
}
