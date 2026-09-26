"use client";

import { useState, FormEvent } from "react";
import { Aviso, Boton, Campo, Tarjeta, traducirError } from "../../components/Formulario";
import { clienteNavegador } from "@/lib/supabase/navegador";

export default function NuevaClave() {
  const [password, setPassword] = useState("");
  const [repetida, setRepetida] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [listo, setListo] = useState(false);

  async function guardar(e: FormEvent) {
    e.preventDefault();
    if (password !== repetida) {
      setError("Las dos contraseñas no coinciden.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const { error } = await clienteNavegador().auth.updateUser({ password });
      if (error) throw error;
      setListo(true);
    } catch (err) {
      setError(traducirError(err as { code?: string; message: string }));
    }
    setCargando(false);
  }

  return (
    <Tarjeta titulo="Contraseña nueva">
      {listo ? (
        <p className="text-center">Listo, ya cambiaste tu contraseña.</p>
      ) : (
        <form onSubmit={guardar}>
          <Campo
            etiqueta="Contraseña nueva (mínimo 8 caracteres)"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Campo
            etiqueta="Repetila"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={repetida}
            onChange={(e) => setRepetida(e.target.value)}
          />
          <Boton cargando={cargando}>{cargando ? "Guardando…" : "Guardar"}</Boton>
          {error && <Aviso tipo="error">{error}</Aviso>}
        </form>
      )}
      <p className="text-sm text-center mt-6">
        <a href="/cuenta" className="underline underline-offset-4">
          Volver a mi cuenta
        </a>
      </p>
    </Tarjeta>
  );
}
