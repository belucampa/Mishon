import { exigirSeccion } from "@/lib/usuario";
import Proximamente from "../Proximamente";

export default async function Ventas() {
  await exigirSeccion("/gestion/ventas");
  return (
    <Proximamente
      titulo="Ventas"
      texto="Acá van a estar los productos, los precios, el stock y cuánto se vendió."
    />
  );
}
