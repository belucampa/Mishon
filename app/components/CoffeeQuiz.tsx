"use client";

import { useState } from "react";
import { FONDO, esOscuro, textoSobre, type Categoria, type Sitio } from "@/lib/sitio";

export default function CoffeeQuiz({ quiz }: { quiz: Sitio["quiz"] }) {
  const PREGUNTAS = quiz.preguntas.filter((p) => p.opciones.length > 0);
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
  const resultado = quiz.resultados[calcularResultado()];
  const preguntaActual = PREGUNTAS[paso];

  return (
    <section className="max-w-xl mx-auto px-6 py-16 text-center">
      <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-2">
        {quiz.titulo}
      </h2>
      <p className="text-negro/70 mb-8">
        {quiz.subtitulo}
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
              {preguntaActual.opciones.map((op, i) => (
                <button
                  key={i}
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
              {preguntaActual.opciones.map((op, i) => (
                <button
                  key={i}
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
          className={`border-2 rounded-3xl p-8 ${FONDO[resultado.fondo]} ${textoSobre(resultado.fondo)} ${esOscuro(resultado.fondo) ? "border-crema" : "border-negro"}`}
        >
          <p className="text-sm font-semibold opacity-70 mb-2">Tu café es</p>
          <h3 className="font-display text-2xl font-extrabold mb-3">
            {resultado.titulo}
          </h3>
          <p className="mb-6">{resultado.desc}</p>
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
