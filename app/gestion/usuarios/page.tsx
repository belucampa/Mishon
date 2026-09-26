import { exigirSeccion } from "@/lib/usuario";
import { clienteServidor } from "@/lib/supabase/servidor";
import { DESCRIPCION_ROL, NOMBRE_ROL, ROLES, puedeCambiarRoles, type Perfil } from "@/lib/roles";
import ListaUsuarios from "./ListaUsuarios";

export default async function Usuarios() {
  const yo = await exigirSeccion("/gestion/usuarios");
  const { data, error } = await clienteServidor()
    .from("perfiles")
    .select("id, email, nombre, rol, creado_en")
    .order("creado_en", { ascending: false });

  return (
    <section>
      <h1 className="font-display font-extrabold text-3xl">Usuarios</h1>

      <dl className="grid sm:grid-cols-2 gap-3 mt-6 text-sm">
        {ROLES.map((rol) => (
          <div key={rol} className="rounded-2xl border-2 border-negro bg-white/60 px-4 py-3">
            <dt className="font-semibold">{NOMBRE_ROL[rol]}</dt>
            <dd className="text-negro/70">{DESCRIPCION_ROL[rol]}</dd>
          </div>
        ))}
      </dl>

      {error ? (
        <p className="mt-8 text-rojo font-semibold">No pude traer los usuarios. Probá recargar.</p>
      ) : (
        <ListaUsuarios
          usuarios={(data ?? []) as Perfil[]}
          miId={yo.id}
          editable={puedeCambiarRoles(yo.rol)}
        />
      )}
    </section>
  );
}
