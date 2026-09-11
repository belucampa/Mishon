"use client";

import { useState, FormEvent } from "react";

const TIENDA = [
  {
    nombre: "Inicio",
    desc: "Todo lo nuevo, arriba de todo.",
    color: "crema",
  },
  {
    nombre: "Café molido",
    desc: "Para cafetera, prensa francesa, lo que tengas.",
    color: "lima",
  },
  {
    nombre: "Café en grano",
    desc: "Lo molés vos, al toque, como más te guste.",
    color: "tomate",
  },
  {
    nombre: "Origen único",
    desc: "Un solo origen, perfil bien marcado.",
    color: "negro",
  },
  {
    nombre: "Sobre Molida",
    desc: "Quiénes somos y por qué armamos esto.",
    color: "crema",
  },
  {
    nombre: "Ayuda",
    desc: "Envíos, pagos, y cualquier otra duda.",
    color: "crema",
  },
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
      <header>
        <span className="wordmark">Molida</span>
        <nav>
          <a href="#tienda">Cómo va a ser la tienda</a>
        </nav>
      </header>

      <section className="hero">
        <svg
          className="mascota"
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
          <line
            x1="46"
            y1="75"
            x2="66"
            y2="75"
            stroke="#1A1A1A"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <div className="hero-inner">
          <h1>
            Ya <span>llega.</span>
          </h1>
          <p>
            Molida es café de especialidad argentino, en grano y molido,
            pensado para la gente que se prepara su café en casa.
          </p>

          {!enviado ? (
            <>
              <form className="signup" onSubmit={handleSubmit}>
                <label
                  htmlFor="email"
                  style={{ position: "absolute", left: "-9999px" }}
                >
                  Tu email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Avisame primero</button>
              </form>
              <p className="form-note">
                Sin spam. Te escribimos una sola vez, cuando esté lista para
                comprar.
              </p>
            </>
          ) : (
            <p className="form-success">
              Listo, quedaste anotada/o. Te avisamos apenas abramos.
            </p>
          )}
        </div>
      </section>

      <section className="intro">
        <p>
          Nada de paleta marrón ni cafetería de barrio. <strong>Molida</strong>{" "}
          arranca con dos formatos — molido y en grano — y un solo objetivo:
          que tomes un café bueno en tu casa, sin vueltas.
        </p>
      </section>

      <section className="tienda" id="tienda">
        <h2>Así va a ser la tienda</h2>
        <p>
          La landing es el primer paso. Esto es lo que se viene cuando
          abramos la tienda completa.
        </p>
        <div className="grid">
          {TIENDA.map((item) => (
            <div key={item.nombre} className={`card ${item.color}`}>
              <h3>{item.nombre}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <span className="wordmark">Molida</span>
        <span>Café de especialidad — próximamente.</span>
      </footer>
    </>
  );
}
