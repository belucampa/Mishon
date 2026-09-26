import { exigirSeccion } from "@/lib/usuario";
import { clienteServidor } from "@/lib/supabase/servidor";
import { mailsConfigurados } from "@/lib/mails/enviar";
import { LANZAMIENTO_POR_DEFECTO, mailBienvenida } from "@/lib/mails/contenidos";
import EditorLanzamiento from "./EditorLanzamiento";

export default async function Mails() {
  await exigirSeccion("/gestion/mails");
  const { data, error } = await clienteServidor()
    .from("lista_espera")
    .select("email, origen, dado_de_baja, lanzamiento_enviado_en, creado_en")
    .order("creado_en", { ascending: false });
  const lista = data ?? [];

  const activos = lista.filter((p) => !p.dado_de_baja);
  const numeros = [
    { nombre: "En la lista", valor: activos.length },
    { nombre: "Desde la landing", valor: activos.filter((p) => p.origen === "landing").length },
    { nombre: "Con cuenta", valor: activos.filter((p) => p.origen === "cuenta").length },
    { nombre: "Se dieron de baja", valor: lista.length - activos.length },
  ];
  const pendientes = activos.filter((p) => !p.lanzamiento_enviado_en).length;

  return (
    <section>
      <h1 className="font-display font-extrabold text-3xl">Mails</h1>

      {!mailsConfigurados() && (
        <p className="mt-6 rounded-2xl bg-amarillo border-2 border-negro px-4 py-3 text-sm">
          Los mails todavía no salen: falta configurar Resend (<code>RESEND_API_KEY</code>). Los mails de
          la lista se guardan igual.
        </p>
      )}
      {error && <p className="mt-6 text-rojo font-semibold">No pude traer la lista. Probá recargar.</p>}

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {numeros.map((n) => (
          <div key={n.nombre} className="rounded-2xl border-2 border-negro bg-white/60 px-4 py-3">
            <dt className="text-xs text-negro/70">{n.nombre}</dt>
            <dd className="font-display font-extrabold text-2xl">{n.valor}</dd>
          </div>
        ))}
      </dl>

      <h2 className="font-display font-bold text-2xl mt-12">Mail de lanzamiento</h2>
      <p className="text-sm text-negro/70 mt-1">
        Se manda una sola vez a cada persona de la lista. Si lo cortás a la mitad, la próxima vez sigue
        con los que faltan.
      </p>
      <EditorLanzamiento inicial={LANZAMIENTO_POR_DEFECTO} pendientes={pendientes} />

      <h2 className="font-display font-bold text-2xl mt-12">Mail de bienvenida</h2>
      <p className="text-sm text-negro/70 mt-1">
        Le llega a quien deja su mail en &quot;Avisame primero&quot;. Así se ve:
      </p>
      <iframe
        title="Vista previa del mail de bienvenida"
        srcDoc={mailBienvenida("ejemplo@mail.com", "00000000-0000-0000-0000-000000000000").html}
        className="mt-4 w-full h-[640px] rounded-3xl border-2 border-negro bg-white"
      />

      <details className="mt-12">
        <summary className="font-display font-bold text-2xl cursor-pointer">
          Ver la lista ({lista.length})
        </summary>
        <ul className="mt-4 rounded-3xl border-2 border-negro bg-white/60 divide-y-2 divide-negro/10 text-sm">
          {lista.map((p) => (
            <li key={p.email} className="flex flex-wrap justify-between gap-2 px-5 py-3">
              <span className={p.dado_de_baja ? "line-through text-negro/50" : ""}>{p.email}</span>
              <span className="text-negro/60">
                {p.origen === "cuenta" ? "Cuenta" : "Landing"} ·{" "}
                {new Date(p.creado_en).toLocaleDateString("es-AR")}
                {p.lanzamiento_enviado_en && " · lanzamiento enviado"}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
