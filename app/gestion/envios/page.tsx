import { exigirSeccion } from "@/lib/usuario";
import Proximamente from "../Proximamente";

export default async function Envios() {
  await exigirSeccion("/gestion/envios");
  return (
    <Proximamente
      titulo="Envíos"
      texto="Acá van a estar los envíos para repartir: dirección, contacto y estado de cada uno."
    />
  );
}
