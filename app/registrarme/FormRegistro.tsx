"use client";

import { useState, FormEvent } from "react";
import { Aviso, Boton, Campo, traducirError } from "../components/Formulario";
import { clienteNavegador } from "@/lib/supabase/navegador";

export default function FormRegistro({ siguiente }: { siguiente: string }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [listo, setListo] = useState(false);

  async function registrarme(e: FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const { data, error } = await clienteNavegador().auth.signUp({
        email,
        password,
        options: {
          data: { nombre: nombre.trim() },
          emailRedirectTo: `${window.location.origin}/auth/confirmar?siguiente=${encodeURIComponent(siguiente)}`,
        },
      });
      if (error) throw error;
      // Si Supabase no pide confirmar el mail, la sesión ya está abierta.
      if (data.session) {
        window.location.href = siguiente;
        return;
      }
      setListo(true);
    } catch (err) {
      setError(traducirError(err as { code?: string; message: string }));
    }
    setCargando(false);
  }

  if (listo) {
    return (
      <div className="text-center">
        <p className="font-semibold">¡Casi! Te mandamos un mail a {email}.</p>
        <p className="text-sm mt-3">Abrí el enlace del correo para confirmar tu cuenta.</p>
      </div>
    );
  }

  return (
    <form onSubmit={registrarme}>
      <p className="text-sm text-center mb-6">
        Creá tu cuenta y te avisamos por mail apenas abra la tienda.
      </p>
      <Campo
        etiqueta="Nombre"
        autoComplete="name"
        required
        autoFocus
        maxLength={100}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <Campo
        etiqueta="Mail"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Campo
        etiqueta="Contraseña (mínimo 8 caracteres)"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Boton cargando={cargando}>{cargando ? "Creando…" : "Crear cuenta"}</Boton>
      {error && <Aviso tipo="error">{error}</Aviso>}
      <p className="text-sm text-center mt-6">
        ¿Ya tenés cuenta?{" "}
        <a
          href={`/ingresar?siguiente=${encodeURIComponent(siguiente)}`}
          className="font-semibold underline underline-offset-4"
        >
          Ingresá
        </a>
      </p>
    </form>
  );
}
