// Dónde se guardan los cambios del panel.
// - Publicado (con GITHUB_TOKEN): hace un commit en el repo y Vercel vuelve a publicar solo.
// - En tu compu (sin GITHUB_TOKEN): escribe los archivos directamente.
import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export const RUTA_CONTENIDO = "content/sitio.json";

const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPO || "belucampa/Mishon";
const rama = process.env.GITHUB_BRANCH || "main";

export const usaGithub = Boolean(token);

export class ErrorAlmacen extends Error {
  constructor(
    message: string,
    public estado = 500
  ) {
    super(message);
  }
}

function urlGithub(ruta: string) {
  const segmentos = ruta.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${repo}/contents/${segmentos}`;
}

async function github(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
  });
  if (res.status === 401 || res.status === 403) {
    throw new ErrorAlmacen("GitHub rechazó el token. Revisá GITHUB_TOKEN en Vercel.");
  }
  return res;
}

function version(texto: string) {
  return createHash("sha1").update(texto).digest("hex");
}

// Devuelve el contenido actual y una "versión" para detectar si alguien guardó en el medio.
export async function leerContenido(): Promise<{ texto: string; version: string }> {
  if (usaGithub) {
    const res = await github(`${urlGithub(RUTA_CONTENIDO)}?ref=${rama}`);
    if (!res.ok) throw new ErrorAlmacen(`No pude leer el contenido de GitHub (${res.status}).`);
    const json = await res.json();
    return {
      texto: Buffer.from(json.content, "base64").toString("utf8"),
      version: json.sha,
    };
  }
  const texto = await fs.readFile(path.join(process.cwd(), RUTA_CONTENIDO), "utf8");
  return { texto, version: version(texto) };
}

async function escribirGithub(ruta: string, base64: string, mensaje: string, sha?: string) {
  const res = await github(urlGithub(ruta), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: mensaje, content: base64, branch: rama, ...(sha ? { sha } : {}) }),
  });
  if (res.status === 409 || res.status === 422) {
    throw new ErrorAlmacen(
      "Alguien guardó cambios mientras editabas. Recargá el panel para traer la última versión.",
      409
    );
  }
  if (!res.ok) throw new ErrorAlmacen(`GitHub no aceptó el cambio (${res.status}).`);
}

export async function guardarContenido(texto: string, versionBase: string) {
  if (usaGithub) {
    await escribirGithub(
      RUTA_CONTENIDO,
      Buffer.from(texto, "utf8").toString("base64"),
      "Actualizar contenido desde el panel",
      versionBase
    );
    return;
  }
  const actual = await leerContenido();
  if (actual.version !== versionBase) {
    throw new ErrorAlmacen(
      "El contenido cambió mientras editabas. Recargá el panel para traer la última versión.",
      409
    );
  }
  await fs.writeFile(path.join(process.cwd(), RUTA_CONTENIDO), texto, "utf8");
}

// Guarda una imagen en public/subidas y devuelve la ruta para usar en la página.
export async function guardarImagen(nombre: string, datos: Buffer) {
  const ruta = `public/subidas/${nombre}`;
  if (usaGithub) {
    await escribirGithub(ruta, datos.toString("base64"), `Subir imagen ${nombre} desde el panel`);
  } else {
    await fs.mkdir(path.join(process.cwd(), "public/subidas"), { recursive: true });
    await fs.writeFile(path.join(process.cwd(), ruta), datos);
  }
  return `/subidas/${nombre}`;
}

export function puedeGuardar() {
  // En Vercel el disco es de solo lectura: sin token no hay dónde guardar.
  return usaGithub || !process.env.VERCEL;
}
