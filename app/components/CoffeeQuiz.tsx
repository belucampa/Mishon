"use client";

import { useState } from "react";

type Categoria = "molido" | "grano" | "origen";

type Opcion = { texto: string; valor: Categoria };
type Pregunta = { texto: string; opciones: Opcion[]; emoji?: boolean };

const PREGUNTAS: Pregunta[] = [
  {
    texto: "¿Dónde te irías de vacaciones hoy?",
    opciones: [
      { texto: "Una casita en un lugar frío", valor: "origen" },
      { texto: "Un paraíso tropical", valor: "molido" },
      { texto: "Una selva", valor: "grano" },
    ],
  },
  {
    texto: "¿A quién te llevarías?",
    opciones: [
      { texto: "A mis amigos", valor: "molido" },
      { texto: "A mi familia", valor: "origen" },
      { texto: "A un desconocido", valor: "grano" },
    ],
  },
  {
    texto: "¿Cómo te gustaría tomar tu café?",
    opciones: [
      { texto: "Frío", valor: "grano" },
      { texto: "Caliente", valor: "molido" },
      { texto: "Como venga", valor: "origen" },
    ],
  },
  {
    texto: "Elegí un emoji sin pensar",
    emoji: true,
    opciones: [
      { texto: "🌊", valor: "molido" },
      { texto: "🔥", valor: "origen" },
      { texto: "🌙", valor: "grano" },
    ],
  },
  {
    texto: "Si tuvieras que elegir una playlist ahora, sería...",
    opciones: [
      { texto: "Para bailar en la cocina", valor: "molido" },
      { texto: "Para concentrarte", valor: "grano" },
      { texto: "Para no pensar en nada", valor: "origen" },
    ],
  },
];

const RESULTADOS: Record<
  Categoria,
  { titulo: string; desc: string; clase: string }
> = {
  molido: {
    titulo: "Café molido",
    desc: "Vas directo al grano (literal). Práctico, de todos los días, sin vueltas.",
    clase: "bg-lima text-negro border-negro",
  },
  grano: {
    titulo: "Café en grano",
    desc: "Te gusta el proceso tanto como el resultado. Lo molés vos, a tu manera.",
    clase: "bg-tomate text-crema border-crema",
  },
  origen: {
    titulo: "Origen único",
    desc: "Buscás algo con carácter, no lo de siempre.",
    clase: "bg-azul text-mostaza border-mostaza",
  },
};

export default function CoffeeQuiz() {
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<Categoria[]>([]);

  function elegir(valor: Categoria) {
    const nuevas = [...respuestas, valor];
    setRespuestas(nuevas);
    setPaso(paso + 1);
  }

  function reiniciar() {
    setPaso(0);
    setRespuestas([]);
  }

  function calcularResultado(): Categoria {
    const conteo: Record<Categoria, number> = { molido: 0, grano: 0, origen: 0 };
    respuestas.forEach((r) => conteo[r]++);
    return (Object.keys(conteo) as Categoria[]).reduce((a, b) =>
      conteo[a] >= conteo[b] ? a : b
    );
  }

  const terminado = paso >= PREGUNTAS.length;
  const preguntaActual = PREGUNTAS[paso];

  return (
    <section className="max-w-xl mx-auto px-6 py-16 text-center">
      <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-2">
        No sé cuál elegir
      </h2>
      <p className="text-negro/70 mb-8">
        No te preocupes, así lo solucionamos.
      </p>

      {!terminado ? (
        <div className="border-2 border-negro rounded-3xl p-8">
          <p className="text-sm font-semibold text-negro/50 mb-3">
            Pregunta {paso + 1} de {PREGUNTAS.length}
          </p>
          <h3 className="font-display text-xl font-bold mb-6">
            {preguntaActual.texto}
          </h3>

          {preguntaActual.emoji ? (
            <div className="flex justify-center gap-6">
              {preguntaActual.opciones.map((op) => (
                <button
                  key={op.texto}
                  onClick={() => elegir(op.valor)}
                  aria-label={op.texto}
                  className="text-5xl border-2 border-negro rounded-full w-20 h-20 flex items-center justify-center hover:bg-negro/10 transition-colors"
                >
                  {op.texto}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {preguntaActual.opciones.map((op) => (
                <button
                  key={op.texto}
                  onClick={() => elegir(op.valor)}
                  className="border-2 border-negro rounded-full py-3 px-5 font-semibold hover:bg-negro hover:text-crema transition-colors"
                >
                  {op.texto}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 rounded-3xl p-8 ${RESULTADOS[calcularResultado()].clase}`}
        >
          <p className="text-sm font-semibold opacity-70 mb-2">Tu café es</p>
          <h3 className="font-display text-2xl font-extrabold mb-3">
            {RESULTADOS[calcularResultado()].titulo}
          </h3>
          <p className="mb-6">{RESULTADOS[calcularResultado()].desc}</p>
          <button
            onClick={reiniciar}
            className="border-2 border-current rounded-full py-2 px-5 font-semibold hover:opacity-80 transition-opacity"
          >
            Jugar de nuevo
          </button>
        </div>
      )}
    </section>
  );
}
