import type { Metadata } from "next";
import { Tarjeta } from "../components/Formulario";
import FormIngresar from "./FormIngresar";
import { rutaSegura } from "@/lib/roles";

export const metadata: Metadata = { title: "Ingresar · Mishón" };

const AVISOS: Record<string, string> = {
  enlace:
    "Ese enlace ya no sirve o se abrió en otro navegador. Si estabas confirmando tu mail, ya podés ingresar.",
};

export default function Ingresar({
  searchParams,
}: {
  searchParams: { siguiente?: string; aviso?: string };
}) {
  return (
    <Tarjeta titulo="Ingresar">
      <FormIngresar
        siguiente={rutaSegura(searchParams.siguiente)}
        aviso={AVISOS[searchParams.aviso ?? ""] ?? ""}
      />
    </Tarjeta>
  );
}
