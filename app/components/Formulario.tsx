import type { InputHTMLAttributes, ReactNode } from "react";

// Piezas compartidas por las pantallas de ingresar, registrarse y cuenta.

export function Tarjeta({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-crema text-negro flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm rounded-3xl border-2 border-negro bg-white/60 p-8">
        <a href="/" className="block">
          <img src="/mishon-negro.png" alt="Mishón" className="h-10 w-auto mx-auto mb-6" />
        </a>
        <h1 className="font-display font-extrabold text-2xl mb-6 text-center">{titulo}</h1>
        {children}
      </div>
    </main>
  );
}

export function Campo({
  etiqueta,
  ...props
}: { etiqueta: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-semibold mb-1 ml-2">{etiqueta}</span>
      <input
        {...props}
        className="w-full px-5 py-3 rounded-full border-2 border-negro bg-crema focus-visible:outline focus-visible:outline-2 focus-visible:outline-negro"
      />
    </label>
  );
}

export function Boton({ cargando, children }: { cargando: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={cargando}
      className="mt-2 w-full px-6 py-3 rounded-full border-2 border-negro bg-rojo text-crema font-button font-bold hover:bg-negro transition-colors disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function Aviso({ tipo, children }: { tipo: "error" | "ok"; children: ReactNode }) {
  return (
    <p
      role={tipo === "error" ? "alert" : "status"}
      className={`text-sm font-semibold mt-3 ${tipo === "error" ? "text-rojo" : "text-negro"}`}
    >
      {children}
    </p>
  );
}

// Los errores de Supabase vienen en inglés; los que puede ver un cliente, en castellano.
export function traducirError(error: { code?: string; message: string } | null) {
  if (!error) return "";
  switch (error.code) {
    case "invalid_credentials":
      return "El mail o la contraseña no coinciden.";
    case "email_not_confirmed":
      return "Todavía no confirmaste tu mail. Buscá el correo que te mandamos.";
    case "user_already_exists":
    case "email_exists":
      return "Ya hay una cuenta con ese mail. Probá ingresar.";
    case "weak_password":
      return "La contraseña es muy débil. Usá al menos 8 caracteres.";
    case "same_password":
      return "La contraseña nueva tiene que ser distinta de la anterior.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Hubo muchos intentos seguidos. Esperá unos minutos y probá de nuevo.";
    default:
      return "Algo salió mal. Probá de nuevo en un rato.";
  }
}
