"use client";

import { useState } from "react";
import { htmlLanzamiento, type ContenidoLanzamiento } from "@/lib/mails/contenidos";

const CAMPOS: { clave: keyof ContenidoLanzamiento; etiqueta: string; largo?: boolean }[] = [
  { clave: "asunto", etiqueta: "Asunto" },
  { clave: "titulo", etiqueta: "Título" },
  { clave: "texto", etiqueta: "Texto (una línea en blanco separa párrafos)", largo: true },
  { clave: "boton", etiqueta: "Texto del botón" },
  { clave: "enlace", etiqueta: "A dónde lleva el botón" },
];

export default function EditorLanzamiento({
  inicial,
  pendientes: pendientesIniciales,
}: {
  inicial: ContenidoLanzamiento;
  pendientes: number;
}) {
  const [c, setC] = useState(inicial);
  const [pendientes, setPendientes] = useState(pendientesIniciales);
  const [ocupado, setOcupado] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  async function llamar(modo: "prueba" | "todos") {
    const res = await fetch("/api/gestion/lanzamiento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modo, contenido: c }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "No se pudo enviar");
    return json as { enviados: number; faltan: number };
  }

  async function probar() {
    setOcupado(true);
    setMensaje(null);
    try {
      await llamar("prueba");
      setMensaje({ tipo: "ok", texto: "Listo, fijate en tu mail." });
    } catch (e) {
      setMensaje({ tipo: "error", texto: (e as Error).message });
    }
    setOcupado(false);
  }

  async function enviarATodos() {
    if (!confirm(`¿Mandar el mail de lanzamiento a ${pendientes} personas? No se puede deshacer.`)) return;
    setOcupado(true);
    setMensaje(null);
    let total = 0;
    try {
      // Cada llamada manda lo que le da el tiempo; seguimos hasta que no falte nadie.
      for (;;) {
        const r = await llamar("todos");
        total += r.enviados;
        setPendientes(r.faltan);
        setMensaje({ tipo: "ok", texto: `Enviados: ${total}. Faltan: ${r.faltan}.` });
        if (r.faltan === 0 || r.enviados === 0) break;
      }
      setMensaje({ tipo: "ok", texto: `¡Listo! Se mandaron ${total} mails.` });
    } catch (e) {
      setMensaje({
        tipo: "error",
        texto: `Se cortó después de ${total} mails: ${(e as Error).message}. Podés volver a apretar para seguir con los que faltan.`,
      });
    }
    setOcupado(false);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-6">
      <div>
        {CAMPOS.map(({ clave, etiqueta, largo }) => (
          <label key={clave} className="block mb-4">
            <span className="block text-sm font-semibold mb-1 ml-2">{etiqueta}</span>
            {largo ? (
              <textarea
                rows={8}
                value={c[clave]}
                onChange={(e) => setC({ ...c, [clave]: e.target.value })}
                className="w-full px-5 py-3 rounded-3xl border-2 border-negro bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-negro"
              />
            ) : (
              <input
                value={c[clave]}
                onChange={(e) => setC({ ...c, [clave]: e.target.value })}
                className="w-full px-5 py-3 rounded-full border-2 border-negro bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-negro"
              />
            )}
          </label>
        ))}

        <div className="flex flex-wrap gap-3 mt-2">
          <button
            onClick={probar}
            disabled={ocupado}
            className="px-6 py-3 rounded-full border-2 border-negro bg-white/60 font-button font-bold hover:bg-amarillo transition-colors disabled:opacity-60"
          >
            Mandarme una prueba
          </button>
          <button
            onClick={enviarATodos}
            disabled={ocupado || pendientes === 0}
            className="px-6 py-3 rounded-full border-2 border-negro bg-rojo text-crema font-button font-bold hover:bg-negro transition-colors disabled:opacity-60"
          >
            {pendientes === 0 ? "No queda nadie por mandar" : `Enviar a ${pendientes} personas`}
          </button>
        </div>
        {mensaje && (
          <p
            role={mensaje.tipo === "error" ? "alert" : "status"}
            className={`mt-4 text-sm font-semibold ${mensaje.tipo === "error" ? "text-rojo" : ""}`}
          >
            {mensaje.texto}
          </p>
        )}
      </div>

      <iframe
        title="Vista previa del mail de lanzamiento"
        srcDoc={htmlLanzamiento(c, "#")}
        className="w-full h-[640px] rounded-3xl border-2 border-negro bg-white"
      />
    </div>
  );
}
