"use client";

import { usePathname } from "next/navigation";

export default function Pestanas({ secciones }: { secciones: { ruta: string; nombre: string }[] }) {
  const actual = usePathname();

  return (
    <nav className="max-w-5xl mx-auto flex gap-2 mt-6 overflow-x-auto">
      {secciones.map((s) => {
        const activa = actual.startsWith(s.ruta);
        return (
          <a
            key={s.ruta}
            href={s.ruta}
            aria-current={activa ? "page" : undefined}
            className={`px-5 py-2 rounded-t-2xl border-2 border-b-0 border-negro font-button font-bold text-sm whitespace-nowrap ${
              activa ? "bg-negro text-crema" : "bg-white/60 hover:bg-amarillo"
            }`}
          >
            {s.nombre}
          </a>
        );
      })}
    </nav>
  );
}
