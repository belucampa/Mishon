import datos from "@/content/sitio.json";

export const COLORES = ["crema", "rojo", "verde", "negro", "amarillo", "mostaza"] as const;
export type Color = (typeof COLORES)[number];

export const CATEGORIAS = ["molido", "grano", "origen"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

// Tailwind necesita ver las clases escritas enteras, por eso el mapa.
export const FONDO: Record<Color, string> = {
  crema: "bg-crema",
  rojo: "bg-rojo",
  verde: "bg-verde",
  negro: "bg-negro",
  amarillo: "bg-amarillo",
  mostaza: "bg-mostaza",
};

export const TEXTO: Record<Color, string> = {
  crema: "text-crema",
  rojo: "text-rojo",
  verde: "text-verde",
  negro: "text-negro",
  amarillo: "text-amarillo",
  mostaza: "text-mostaza",
};

export function esOscuro(c: Color) {
  return c === "rojo" || c === "negro";
}

// Color de texto que se lee bien sobre un fondo.
export function textoSobre(c: Color) {
  return esOscuro(c) ? "text-crema" : "text-negro";
}

export type Sitio = {
  general: { tituloPestana: string; descripcion: string };
  colores: Record<Color, string>;
  encabezado: { logo: string; link: string };
  inicio: {
    fondo: Color;
    imagen: string;
    eslogan: string;
    colorEslogan: Color;
    texto: string;
    placeholderEmail: string;
    boton: string;
    gracias: string;
    nota: string;
  };
  comoFunciona: { titulo: string; pasos: { titulo: string; desc: string }[] };
  historias: {
    fondo: Color;
    logo: string;
    titulo: string;
    texto: string;
    items: { fondo: Color; gato: string; foto: string }[];
  };
  tienda: {
    titulo: string;
    texto: string;
    items: { nombre: string; desc: string; fondo: Color; gato: string }[];
  };
  quiz: {
    titulo: string;
    subtitulo: string;
    preguntas: {
      texto: string;
      emoji: boolean;
      opciones: { texto: string; valor: Categoria }[];
    }[];
    resultados: Record<Categoria, { titulo: string; desc: string; fondo: Color }>;
  };
  packaging: {
    titulo: string;
    nota: string;
    slides: { nombre: string; desc: string; fondo: Color; sticker: string }[];
  };
  contacto: { fondo: Color; titulo: string; email: string; instagram: string };
  pie: { logo: string; texto: string };
};

export const sitio = datos as Sitio;

// Revisa que el contenido que llega del panel tenga la forma esperada.
// Devuelve el primer problema encontrado, o null si está todo bien.
export function validarSitio(s: unknown): string | null {
  const modelo = datos as unknown;
  const imagen = /^(\/[\w\-./]+\.(png|jpe?g|webp|gif|svg)|)$/i;

  function revisar(valor: unknown, ejemplo: unknown, ruta: string, clave: string): string | null {
    if (Array.isArray(ejemplo)) {
      if (!Array.isArray(valor)) return `${ruta} tendría que ser una lista`;
      if (valor.length > 50) return `${ruta} tiene demasiados elementos`;
      const molde = ejemplo[0];
      for (let i = 0; i < valor.length; i++) {
        const error = revisar(valor[i], molde, `${ruta}[${i + 1}]`, clave);
        if (error) return error;
      }
      return null;
    }
    if (ejemplo !== null && typeof ejemplo === "object") {
      if (valor === null || typeof valor !== "object" || Array.isArray(valor)) {
        return `${ruta} está mal armado`;
      }
      for (const k of Object.keys(ejemplo)) {
        const error = revisar(
          (valor as Record<string, unknown>)[k],
          (ejemplo as Record<string, unknown>)[k],
          ruta ? `${ruta}.${k}` : k,
          k
        );
        if (error) return error;
      }
      return null;
    }
    if (typeof valor !== typeof ejemplo) return `${ruta} tiene un valor inválido`;
    if (typeof valor === "string") {
      if (valor.length > 2000) return `${ruta} es demasiado largo`;
      if (["fondo", "colorEslogan"].includes(clave) && !COLORES.includes(valor as Color)) {
        return `${ruta}: color desconocido`;
      }
      if (clave === "valor" && !CATEGORIAS.includes(valor as Categoria)) {
        return `${ruta}: categoría desconocida`;
      }
      if (["logo", "imagen", "gato", "foto", "sticker"].includes(clave) && !imagen.test(valor)) {
        return `${ruta}: la imagen tiene que ser una ruta como /carpeta/foto.png`;
      }
      if (ruta.startsWith("colores.") && !/^#[0-9a-f]{6}$/i.test(valor)) {
        return `${ruta}: el color tiene que ser como #F7F3EC`;
      }
      if (clave === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
        return `${ruta}: el mail no es válido`;
      }
      if (clave === "instagram" && !/^[A-Za-z0-9._]{1,30}$/.test(valor)) {
        return `${ruta}: el usuario de Instagram va sin @ ni espacios`;
      }
    }
    return null;
  }

  return revisar(s, modelo, "", "");
}
