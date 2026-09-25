"use client";

import { useEffect, useState } from "react";

const INTERVALO_MS = 4000;

const SLIDES = [
  {
    nombre: "Molido",
    desc: "Nos decís qué cafetera usás y lo molemos a pedido.",
    fondo: "bg-verde",
    sticker: "/packaging/molido.png",
  },
  {
    nombre: "En grano",
    desc: "Lo molés vos, al toque, como más te guste.",
    fondo: "bg-rojo",
    sticker: "/packaging/en-grano.png",
  },
  {
    nombre: "Origen único",
    desc: "Un solo origen, perfil bien marcado.",
    fondo: "bg-mostaza",
    sticker: "/packaging/origen-unico.png",
  },
];

// Bolsa negra con cierre zip y el sticker pegado adelante.
function Bolsa({ sticker, nombre }: { sticker: string; nombre: string }) {
  return (
    <div className="relative w-48 md:w-60 aspect-[3/4.2] rounded-t-2xl rounded-b-[2rem] bg-[#141414] shadow-[0_24px_40px_-12px_rgba(0,0,0,0.55)] overflow-hidden">
      {/* Sellado de arriba */}
      <div className="absolute inset-x-0 top-0 h-4 bg-[repeating-linear-gradient(90deg,#1c1c1c_0_3px,#141414_3px_6px)]" />
      {/* Cierre zip */}
      <div className="absolute inset-x-3 top-7 h-1.5 rounded-full bg-[#262626] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
      {/* Sticker */}
      <img
        src={sticker}
        alt={`Sticker de Mishón ${nombre}`}
        className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[74%] rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
      />
      {/* Brillo del plástico */}
      <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_25%,rgba(255,255,255,0.07)_38%,transparent_52%)] pointer-events-none" />
      {/* Fuelle de abajo */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}

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
              className={`w-full shrink-0 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-14 px-14 py-10 min-h-[460px] ${s.fondo}`}
            >
              <div className="text-center md:text-left max-w-xs">
                <h3 className="font-display font-extrabold uppercase text-2xl md:text-4xl text-negro">
                  {s.nombre}
                </h3>
                <p className="text-negro/80 text-sm md:text-base mt-1">
                  {s.desc}
                </p>
              </div>
              <Bolsa sticker={s.sticker} nombre={s.nombre} />
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
      <p className="text-sm text-negro/60 mt-3">
        Bolsas negras con cierre zip, y un sticker distinto para cada café.
      </p>
    </div>
  );
}
