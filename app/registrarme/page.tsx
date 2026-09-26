import type { Metadata } from "next";
import { Tarjeta } from "../components/Formulario";
import FormRegistro from "./FormRegistro";
import { rutaSegura } from "@/lib/roles";

export const metadata: Metadata = { title: "Crear cuenta · Mishón" };

export default function Registrarme({ searchParams }: { searchParams: { siguiente?: string } }) {
  return (
    <Tarjeta titulo="Crear cuenta">
      <FormRegistro siguiente={rutaSegura(searchParams.siguiente)} />
    </Tarjeta>
  );
}
