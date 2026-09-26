import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_KEY, SUPABASE_URL } from "./config";

// Para usar en páginas del servidor y rutas. Hay que crear uno por pedido.
export function clienteServidor() {
  const almacen = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll(lista) {
        try {
          lista.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          // Las páginas no pueden escribir cookies; de renovarlas se encarga el middleware.
        }
      },
    },
  });
}
