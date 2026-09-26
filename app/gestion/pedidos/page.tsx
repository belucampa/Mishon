import { exigirSeccion } from "@/lib/usuario";
import Proximamente from "../Proximamente";

export default async function Pedidos() {
  await exigirSeccion("/gestion/pedidos");
  return (
    <Proximamente
      titulo="Pedidos"
      texto="Acá van a aparecer los pedidos, con la cafetera de cada uno para saber cómo molerlo."
    />
  );
}
