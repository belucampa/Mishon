"use client";

import { useState, FormEvent } from "react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/admin";
      return;
    }
    const json = await res.json().catch(() => ({}));
    setError(json.error || "No se pudo entrar");
    setCargando(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-3xl border-2 border-negro bg-white/60 p-8 text-center"
      >
        <img src="/mishon-negro.png" alt="Mishón" className="h-10 w-auto mx-auto mb-6" />
        <h1 className="font-display font-extrabold text-2xl mb-6">Panel de administración</h1>
        <label htmlFor="password" className="sr-only">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full px-5 py-3 rounded-full border-2 border-negro bg-crema focus-visible:outline focus-visible:outline-2 focus-visible:outline-negro"
        />
        {error && <p className="text-rojo font-semibold text-sm mt-3">{error}</p>}
        <button
          type="submit"
          disabled={cargando}
          className="mt-5 w-full px-6 py-3 rounded-full border-2 border-negro bg-rojo text-crema font-button font-bold hover:bg-negro transition-colors disabled:opacity-60"
        >
          {cargando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
