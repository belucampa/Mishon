// Lugar reservado para las secciones que se arman cuando esté la tienda.
export default function Proximamente({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <section>
      <h1 className="font-display font-extrabold text-3xl">{titulo}</h1>
      <div className="mt-6 rounded-3xl border-2 border-dashed border-negro/40 p-10 text-center text-negro/70">
        {texto}
      </div>
    </section>
  );
}
