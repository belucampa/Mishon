// Sesión del panel: una cookie firmada con HMAC que vence sola.
// Usa Web Crypto para que funcione igual en el middleware y en las rutas.

export const COOKIE_SESION = "mishon_admin";
export const DURACION_SESION_S = 60 * 60 * 24 * 7; // 7 días

const codificador = new TextEncoder();

function aHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function clave() {
  const secreto = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secreto) return null;
  return crypto.subtle.importKey(
    "raw",
    codificador.encode(`mishon-admin:${secreto}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function firmar(texto: string) {
  const k = await clave();
  if (!k) return null;
  return aHex(await crypto.subtle.sign("HMAC", k, codificador.encode(texto)));
}

// Compara sin cortar antes, para no filtrar información por el tiempo de respuesta.
export function igualesSeguro(a: string, b: string) {
  const largo = Math.max(a.length, b.length);
  let diferencia = a.length ^ b.length;
  for (let i = 0; i < largo; i++) {
    diferencia |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diferencia === 0;
}

export function panelConfigurado() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export async function crearSesion() {
  const vence = Math.floor(Date.now() / 1000) + DURACION_SESION_S;
  const firma = await firmar(`admin:${vence}`);
  return firma ? `${vence}.${firma}` : null;
}

export async function sesionValida(token: string | undefined) {
  if (!token) return false;
  const [vence, firma] = token.split(".");
  if (!vence || !firma || Number(vence) < Date.now() / 1000) return false;
  const esperada = await firmar(`admin:${vence}`);
  return esperada !== null && igualesSeguro(firma, esperada);
}

export function passwordCorrecta(intento: string) {
  const real = process.env.ADMIN_PASSWORD;
  return Boolean(real) && igualesSeguro(intento, real as string);
}
