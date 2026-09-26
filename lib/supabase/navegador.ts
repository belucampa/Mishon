import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL } from "./config";

// Para usar en componentes "use client".
export function clienteNavegador() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
