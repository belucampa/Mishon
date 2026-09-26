import { SITIO_URL, parrafos, plantilla } from "./plantilla";

export function enlaceBaja(token: string) {
  return `${SITIO_URL}/baja?t=${encodeURIComponent(token)}`;
}

// Le llega a quien deja su mail en "Avisame primero".
export function mailBienvenida(para: string, token: string) {
  const baja = enlaceBaja(token);
  return {
    para,
    baja,
    asunto: "Ya estás en la lista de Mishón ☕",
    html: plantilla({
      vistaPrevia: "Te avisamos apenas abra la tienda.",
      titulo: "¡Ya estás en la lista!",
      cuerpo: parrafos(
        "Gracias por sumarte. Mishón es café de especialidad argentino: vos lo elegís, nos decís qué cafetera usás y lo molemos a pedido.\n\n" +
          "Estamos terminando de armar la tienda. Apenas abra, te llega un mail para que seas de las primeras personas en probarlo."
      ),
      boton: { texto: "Conocé Mishón", enlace: SITIO_URL },
      baja,
    }),
  };
}

export type ContenidoLanzamiento = {
  asunto: string;
  titulo: string;
  texto: string;
  boton: string;
  enlace: string;
};

export const LANZAMIENTO_POR_DEFECTO: ContenidoLanzamiento = {
  asunto: "¡Abrió la tienda de Mishón! ☕",
  titulo: "Ya podés pedir tu Mishón",
  texto:
    "Llegó el día: la tienda está abierta.\n\n" +
    "Elegí tu café, contanos qué cafetera usás y lo molemos a pedido para que te llegue recién molido.\n\n" +
    "Gracias por esperarnos desde el principio.",
  boton: "Ir a la tienda",
  enlace: SITIO_URL,
};

// Revisa lo que llega del panel. Devuelve el primer problema, o null.
export function validarLanzamiento(c: unknown): string | null {
  if (!c || typeof c !== "object") return "Falta el contenido del mail";
  const campos: (keyof ContenidoLanzamiento)[] = ["asunto", "titulo", "texto", "boton", "enlace"];
  for (const k of campos) {
    const v = (c as Record<string, unknown>)[k];
    if (typeof v !== "string" || !v.trim()) return `Falta completar: ${k}`;
    if (v.length > 5000) return `Es demasiado largo: ${k}`;
  }
  if (!/^https:\/\/\S+$/.test((c as ContenidoLanzamiento).enlace)) {
    return "El enlace del botón tiene que empezar con https://";
  }
  return null;
}

export function mailLanzamiento(para: string, token: string, c: ContenidoLanzamiento) {
  const baja = enlaceBaja(token);
  return {
    para,
    baja,
    asunto: c.asunto,
    html: htmlLanzamiento(c, baja),
  };
}

export function htmlLanzamiento(c: ContenidoLanzamiento, baja?: string) {
  return plantilla({
    vistaPrevia: c.titulo,
    titulo: c.titulo,
    cuerpo: parrafos(c.texto),
    boton: { texto: c.boton, enlace: c.enlace },
    gato: "/gatotaza-rojo.png",
    baja,
  });
}
