import { sitio } from "@/lib/sitio";

// Las imágenes y los links de los mails tienen que ser direcciones completas.
export const SITIO_URL = (process.env.SITIO_URL || "https://mishon.com.ar").replace(/\/$/, "");

const C = sitio.colores;
const LETRA = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export function escapar(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Texto plano a párrafos: una línea en blanco separa párrafos.
export function parrafos(texto: string) {
  return texto
    .trim()
    .split(/\n\s*\n/)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${C.negro};">${escapar(p.trim()).replace(/\n/g, "<br>")}</p>`
    )
    .join("");
}

// El marco de todos los mails: logo, tarjeta, botón opcional y pie.
// Los mails se arman con tablas y estilos en línea porque es lo único que respetan todos los correos.
export function plantilla({
  vistaPrevia,
  titulo,
  cuerpo,
  boton,
  gato = "/gatotaza-mostaza.png",
  baja,
}: {
  vistaPrevia: string;
  titulo: string;
  cuerpo: string;
  boton?: { texto: string; enlace: string };
  gato?: string;
  baja?: string;
}) {
  const botonHtml = boton
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px auto 0;">
        <tr><td style="border-radius:999px;background:${C.rojo};border:2px solid ${C.negro};">
          <a href="${escapar(boton.enlace)}" style="display:inline-block;padding:14px 28px;font-family:${LETRA};font-size:16px;font-weight:bold;color:${C.crema};text-decoration:none;">${escapar(boton.texto)}</a>
        </td></tr>
      </table>`
    : "";

  const bajaHtml = baja
    ? `<br><a href="${escapar(baja)}" style="color:${C.negro};">No quiero recibir más mails</a>`
    : "";

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escapar(titulo)}</title>
</head>
<body style="margin:0;padding:0;background:${C.amarillo};color-scheme:light only;">
<div style="display:none;max-height:0;overflow:hidden;">${escapar(vistaPrevia)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.amarillo};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
      <tr><td align="center" style="padding-bottom:16px;">
        <img src="${SITIO_URL}/mail-encabezado.png" alt="Mishón" width="520" style="display:block;width:100%;max-width:520px;height:auto;border:0;">
      </td></tr>
      <tr><td style="background:${C.crema};border:2px solid ${C.negro};border-radius:24px;padding:32px 28px;font-family:${LETRA};text-align:center;">
        <img src="${SITIO_URL}${gato}" alt="" width="120" style="width:120px;height:auto;border:0;margin:0 auto 16px;display:block;">
        <h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;line-height:1.25;color:${C.negro};">${escapar(titulo)}</h1>
        ${cuerpo}
        ${botonHtml}
      </td></tr>
      <tr><td align="center" style="padding-top:24px;font-family:${LETRA};font-size:12px;line-height:1.6;color:${C.negro};">
        Mishón · café de especialidad argentino<br>
        <a href="https://instagram.com/${sitio.contacto.instagram}" style="color:${C.negro};">@${sitio.contacto.instagram}</a> · <a href="${SITIO_URL}" style="color:${C.negro};">mishon.com.ar</a>
        ${bajaHtml}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
