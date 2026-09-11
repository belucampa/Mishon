"use client";

import { useState, FormEvent } from "react";
import CoffeeQuiz from "./components/CoffeeQuiz";

const TIENDA = [
  {
    nombre: "Café molido",
    desc: "Para cafetera, prensa francesa, lo que tengas.",
    clase: "bg-lima text-negro border-crema",
  },
  {
    nombre: "Café en grano",
    desc: "Lo molés vos, al toque, como más te guste.",
    clase: "bg-tomate text-crema border-crema",
  },
  {
    nombre: "Origen único",
    desc: "Un solo origen, perfil bien marcado.",
    clase: "bg-azul text-crema border-crema",
  },
];

const PACKAGING = ["Molido", "En granos", "Origen único"];

function Estrella({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Estrella mascota de Molida, con cara de pocos amigos"
    >
      <polygon
        points="60,6 74,42 112,42 81,64 93,102 60,79 27,102 39,64 8,42 46,42"
        fill="#F7F3EC"
        stroke="#1A1A1A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="49" cy="56" r="4.5" fill="#1A1A1A" />
      <circle cx="73" cy="56" r="4.5" fill="#1A1A1A" />
      <line x1="46" y1="75" x2="66" y2="75" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: conectar a Supabase (tabla de waitlist) cuando esté el esquema listo.
    setEnviado(true);
    setEmail("");
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-14 py-7">
        <span className="font-display font-extrabold text-xl">Molida</span>
        <nav>
          <a
            href="#tienda"
            className="text-sm font-semibold border-b-2 border-transparent hover:border-negro transition-colors"
          >
            Cómo va a ser la tienda
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-lima px-6 md:px-14 pt-6 pb-16 text-center">
        <Estrella className="w-28 md:w-36 mx-auto animate-wobble" />
        <p className="max-w-xl mx-auto mt-6 text-lg md:text-xl">
          Molida es café de especialidad argentino, en grano y molido,
          pensado para la gente que se prepara su café en casa.
        </p>

        {!enviado ? (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-wrap justify-center gap-3 max-w-md mx-auto"
          >
            <label htmlFor="email" className="sr-only">
              Tu email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 min-w-[220px] px-5 py-3 rounded-full border-2 border-negro bg-crema placeholder:text-negro/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-negro"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full border-2 border-negro bg-tomate text-crema font-bold hover:bg-negro transition-colors"
            >
              Avisame primero
            </button>
          </form>
        ) : (
          <p className="mt-8 font-semibold">
            Listo, quedaste anotada/o. Te avisamos apenas abramos.
          </p>
        )}
        <p className="mt-3 text-sm text-negro/70">
          Sin spam. Te escribimos una sola vez, cuando esté lista para comprar.
        </p>
      </section>

      {/* Sección Mona */}
      <section className="bg-tomate text-crema px-6 md:px-14 py-16">
        <p className="text-xs font-bold tracking-widest uppercase mb-6">
          Molida
        </p>
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
          <div className="aspect-[3/4] max-w-[260px] mx-auto w-full rounded-3xl border-2 border-dashed border-crema/60 flex items-center justify-center text-center text-sm text-crema/70 p-6">
            Acá va la ilustración de Mona — exportala de Canva como PNG
            (fondo transparente) a /public/mona.png y reemplazá este bloque
            por &lt;Image src=&quot;/mona.png&quot; /&gt;
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-4xl leading-tight text-left">
            Molida arranca con dos formatos — molido y en grano — y un solo
            objetivo: que tomes un café bueno en tu casa, sin vueltas.
          </h2>
        </div>
      </section>

      {/* Tienda / categorías */}
      <section id="tienda" className="max-w-5xl mx-auto px-6 md:px-14 pt-20 pb-4">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-2">
          Así va a ser la tienda
        </h2>
        <p className="text-negro/70 max-w-md mb-10">
          La landing es el primer paso. Esto es lo que se viene cuando
          abramos la tienda completa.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {TIENDA.map((item) => (
            <div
              key={item.nombre}
              className={`rounded-3xl border-2 p-6 min-h-[170px] flex flex-col justify-between ${item.clase}`}
            >
              <Estrella className="w-10 h-10 mb-4 opacity-90" />
              <div>
                <h3 className="font-display font-bold text-lg mb-1">
                  {item.nombre}
                </h3>
                <p className="text-sm opacity-90">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz */}
      <CoffeeQuiz />

      {/* Preview de packaging */}
      <section className="max-w-4xl mx-auto px-6 md:px-14 pb-20 text-center">
        <h2 className="font-display font-extrabold text-2xl md:text-3xl mb-10">
          Para que veas cómo se ven
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {PACKAGING.map((nombre) => (
            <div
              key={nombre}
              className="rounded-3xl border-2 border-tomate overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-b from-sky-200 to-lima/60 flex items-center justify-center text-xs text-negro/60 px-4 text-center">
                packaging real pendiente — reemplazar por foto del producto
              </div>
              <p className="bg-tomate text-crema font-semibold py-3">
                {nombre}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section className="relative bg-azul text-crema px-6 md:px-14 py-20 overflow-hidden">
        <Estrella className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-72 opacity-10" />
        <div className="relative max-w-md mx-auto bg-crema text-negro rounded-3xl p-8 text-center">
          <h2 className="font-display font-extrabold text-2xl mb-3">
            Preguntanos lo que quieras
          </h2>
          <a
            href="mailto:hola@molida.com.ar"
            className="text-tomate font-semibold"
          >
            hola@molida.com.ar
          </a>
          <p className="text-xs text-negro/50 mt-2">
            (mail de ejemplo — reemplazar por el real cuando esté)
          </p>
        </div>
      </section>

      <footer className="bg-negro text-crema px-6 md:px-14 py-8 flex flex-wrap justify-between gap-3 text-sm">
        <span className="font-display font-extrabold">Molida</span>
        <span>Café de especialidad — próximamente.</span>
      </footer>
    </>
  );
}
