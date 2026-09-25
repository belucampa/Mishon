"use client";

import { useState, FormEvent } from "react";
import CoffeeQuiz from "./components/CoffeeQuiz";
import PackagingCarousel from "./components/PackagingCarousel";

const TIENDA = [
  {
    nombre: "Café molido",
    desc: "Nos decís qué cafetera usás y lo molemos a pedido.",
    clase: "bg-verde text-negro border-crema",
    gato: "/gatotaza-negro.png",
  },
  {
    nombre: "Café en grano",
    desc: "Lo molés vos, al toque, como más te guste.",
    clase: "bg-rojo text-crema border-crema",
    gato: "/gatotaza-crema.png",
  },
  {
    nombre: "Origen único",
    desc: "Un solo origen, perfil bien marcado.",
    clase: "bg-mostaza text-negro border-crema",
    gato: "/gatotaza-amarillo.png",
  },
];

const PASOS = [
  {
    titulo: "Elegís tu café",
    desc: "En grano, molido u origen único.",
  },
  {
    titulo: "Nos decís tu cafetera",
    desc: "Italiana, prensa francesa, filtro, espresso… la que tengas.",
  },
  {
    titulo: "Lo molemos a pedido",
    desc: "Recién molido, justo para tu cafetera, y te lo mandamos.",
  },
];

// Historias de ejemplo. Cuando la gente empiece a subir las suyas,
// poné la captura en /public y cargá la ruta en "foto".
const HISTORIAS: { fondo: string; gato: string; foto?: string }[] = [
  { fondo: "bg-verde", gato: "/gatotaza-negro.png" },
  { fondo: "bg-amarillo", gato: "/gatotaza-rojo.png" },
  { fondo: "bg-mostaza", gato: "/gatotaza-crema.png" },
  { fondo: "bg-crema", gato: "/gatotaza-verdelima.png" },
];

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
        <img src="/mishon-negro.png" alt="Mishón" className="h-8 md:h-10 w-auto" />
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
      <section className="bg-amarillo px-6 md:px-14 pt-6 pb-16 text-center">
        <img
          src="/gatotaza-mostaza.png"
          alt="GatoTaza, la mascota de Mishón"
          className="w-32 md:w-40 mx-auto animate-wobble"
        />
        <h1 className="font-display font-extrabold text-3xl md:text-5xl mt-6">
          El café para tu cafetera
        </h1>
        <p className="max-w-xl mx-auto mt-4 text-lg md:text-xl">
          Mishón es café de especialidad argentino. Vos lo comprás, nos
          decís para qué cafetera lo querés y nosotros lo molemos a pedido.
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
              className="px-6 py-3 rounded-full border-2 border-negro bg-rojo text-crema font-button font-bold hover:bg-negro transition-colors"
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

      {/* Cómo funciona */}
      <section className="max-w-5xl mx-auto px-6 md:px-14 py-16">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-10 text-center">
          Molido a pedido, para tu cafetera
        </h2>
        <ol className="grid sm:grid-cols-3 gap-6">
          {PASOS.map((paso, i) => (
            <li
              key={paso.titulo}
              className="rounded-3xl border-2 border-negro bg-crema p-6"
            >
              <span className="w-10 h-10 rounded-full bg-mostaza text-negro font-display font-extrabold text-xl flex items-center justify-center mb-4">
                {i + 1}
              </span>
              <h3 className="font-display font-bold text-lg mb-1">
                {paso.titulo}
              </h3>
              <p className="text-sm text-negro/80">{paso.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Historias de Instagram */}
      <section className="bg-rojo text-crema px-6 md:px-14 py-16">
        <div className="max-w-5xl mx-auto">
          <img src="/mishon-crema.png" alt="Mishón" className="h-10 md:h-12 w-auto mb-6" />
          <h2 className="font-display font-extrabold text-2xl md:text-4xl leading-tight max-w-3xl">
            Mishón arranca con dos formatos — molido y en grano — y un solo
            objetivo: que tomes un café bueno en tu casa, sin vueltas.
          </h2>
          <p className="mt-6 max-w-xl text-crema/90">
            ¿Ya tenés tu Mishón? Subí una historia con tu café y etiquetanos en{" "}
            <a
              href="https://instagram.com/mishoncafe"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-4"
            >
              @mishoncafe
            </a>
            . Las mejores aparecen acá.
          </p>

          <ul className="mt-10 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
            {HISTORIAS.map((h, i) => (
              <li
                key={i}
                className={`relative shrink-0 w-44 md:w-auto aspect-[9/16] snap-start rounded-2xl overflow-hidden border-2 border-crema text-negro ${h.fondo}`}
              >
                {h.foto ? (
                  <img src={h.foto} alt="Historia de Instagram con café Mishón" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                    <img src={h.gato} alt="" className="w-20" />
                    <span className="text-xs font-semibold">Tu historia acá</span>
                  </div>
                )}
                {/* Barra de progreso y usuario, como en una historia */}
                <div className="absolute inset-x-0 top-0 p-2.5 bg-gradient-to-b from-negro/40 to-transparent">
                  <div className="h-0.5 rounded-full bg-crema/50 overflow-hidden">
                    <div className="h-full w-2/3 bg-crema" />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-crema text-[11px] font-semibold">
                    <span className="w-5 h-5 rounded-full bg-crema border border-crema overflow-hidden">
                      <img src="/gatotaza-negro.png" alt="" className="w-full h-full object-contain" />
                    </span>
                    tu_usuario
                  </div>
                </div>
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-crema text-negro text-[11px] font-bold px-2 py-1 shadow">
                  @mishoncafe
                </span>
              </li>
            ))}
          </ul>
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
              <img src={item.gato} alt="" className="w-14 h-14 mb-4" />
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
        <PackagingCarousel />
      </section>

      {/* Contacto */}
      <section className="relative bg-amarillo text-negro px-6 md:px-14 py-20 overflow-hidden">
        <img
          src="/gatotaza-negro.png"
          alt=""
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-72 opacity-10"
        />
        <div className="relative max-w-md mx-auto bg-crema text-negro rounded-3xl p-8 text-center">
          <h2 className="font-display font-extrabold text-2xl mb-3">
            Preguntanos lo que quieras
          </h2>
          <a
            href="mailto:mishoncafe@gmail.com"
            className="text-rojo font-semibold"
          >
            mishoncafe@gmail.com
          </a>
          <a
            href="https://instagram.com/mishoncafe"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-rojo font-semibold mt-2"
          >
            @mishoncafe
          </a>
        </div>
      </section>

      <footer className="bg-negro text-crema px-6 md:px-14 py-8 flex flex-wrap justify-between gap-3 text-sm">
        <img src="/mishon-crema.png" alt="Mishón" className="h-7 w-auto" />
        <span>Café de especialidad — próximamente.</span>
      </footer>
    </>
  );
}
