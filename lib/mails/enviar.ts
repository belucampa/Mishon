// Envío de mails con Resend (resend.com). Sin RESEND_API_KEY no se manda nada.

const CLAVE = process.env.RESEND_API_KEY;
const REMITENTE = process.env.MAIL_REMITENTE || "Mishón <hola@mishon.com.ar>";
// mishon.com.ar no recibe mails: si alguien contesta, que le llegue a esta casilla.
const RESPONDER_A = process.env.MAIL_RESPONDER_A || "mishoncafe@gmail.com";

export type Mail = { para: string; asunto: string; html: string; baja?: string };

export function mailsConfigurados() {
  return Boolean(CLAVE);
}

function aResend(m: Mail) {
  return {
    from: REMITENTE,
    to: [m.para],
    reply_to: RESPONDER_A,
    subject: m.asunto,
    html: m.html,
    // Gmail y otros muestran un botón "desuscribirse" con este encabezado.
    ...(m.baja ? { headers: { "List-Unsubscribe": `<${m.baja}>` } } : {}),
  };
}

async function resend(ruta: string, cuerpo: unknown) {
  const res = await fetch(`https://api.resend.com${ruta}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${CLAVE}`, "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(`Resend rechazó el envío (${res.status}): ${json.message || "sin detalle"}`);
  }
}

export async function enviarMail(m: Mail) {
  await resend("/emails", aResend(m));
}

// Hasta 100 mails por llamada.
export async function enviarTanda(mails: Mail[]) {
  if (mails.length > 100) throw new Error("Resend acepta hasta 100 mails por tanda");
  await resend("/emails/batch", mails.map(aResend));
}
