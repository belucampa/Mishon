import type { Metadata } from "next";
import { Tarjeta } from "../components/Formulario";
import BotonBaja from "./BotonBaja";

export const metadata: Metadata = {
  title: "Dejar de recibir mails · Mishón",
  robots: { index: false, follow: false },
};

export default function Baja({ searchParams }: { searchParams: { t?: string } }) {
  return (
    <Tarjeta titulo="Dejar de recibir mails">
      <BotonBaja token={searchParams.t ?? ""} />
    </Tarjeta>
  );
}
