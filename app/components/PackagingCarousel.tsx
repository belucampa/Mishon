"use client";

import { useEffect, useState } from "react";

const INTERVALO_MS = 4000;

// Cuando estén las fotos reales del packaging, ponelas en /public
// y cargá la ruta en "foto" (por ejemplo "/packaging-molido.jpg").
const SLIDES: {
  nombre: string;
  desc: string;
  fondo: string;
  gato: string;
  foto?: string;
}[] = [
  {
    nombre: "Molido",
    desc: "Molido a pedido para tu cafetera.",
    fondo: "bg-verde",
    gato: "/gatotaza-negro.png",
  },
  {
    nombre: "En grano",
    desc: "Lo molés vos, al toque, como más te guste.",
    fondo: "bg-rojo",
    gato: "/gatotaza-crema.png",
  },
  {
    nombre: "Origen único",
    desc: "Un solo origen, perfil bien marcado.",
    fondo: "bg-mostaza",
    gato: "/gatotaza-amarillo.png",
  },
];

export default function PackagingCarousel() {
  const [index, setIndex] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = SLIDES.length;

  useEffect(() => {
    if (pausado) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), INTERVALO_MS);
    return () => clearInterval(id);
  }, [pausado, total]);

  function anterior() {
    setIndex((i) => (i - 1 + total) % total);
  }

  function siguiente() {
    setIndex((i) => (i + 1) % total);
  }

  return (
    <div
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      aria-roledescription="carrusel"
    >
      <div className="relative overflow-hidden rounded-3xl border-2 border-negro">
        <ul
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((s, i) => (
            <li
              key={s.nombre}
              aria-hidden={i !== index}
              className={`relative w-full shrink-0 h-[320px] md:h-[420px] ${s.fondo}`}
            >
              {s.foto ? (
                <img
                  src={s.foto}
                  alt={`Packaging de Mishón ${s.nombre}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <img
                  src={s.gato}
                  alt=""
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 md:w-44"
                />
              )}
              <div className="absolute top-6 left-6 md:top-10 md:left-10 text-left">
                <h3 className="font-display font-extrabold uppercase text-2xl md:text-4xl text-negro">
                  {s.nombre}
                </h3>
                <p className="text-negro/80 text-sm md:text-base mt-1 max-w-xs">
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={anterior}
          aria-label="Producto anterior"
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-crema/80 flex items-center justify-center text-3xl text-negro hover:bg-crema transition-colors"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={siguiente}
          aria-label="Producto siguiente"
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-crema/80 flex items-center justify-center text-3xl text-negro hover:bg-crema transition-colors"
        >
          ›
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-5">
        {SLIDES.map((s, i) => (
          <button
            key={s.nombre}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ver ${s.nombre}`}
            aria-current={i === index}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === index ? "bg-rojo" : "bg-negro/20"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-negro/50 mt-3">
        Fotos del packaging real, próximamente.
      </p>
    </div>
  );
}
