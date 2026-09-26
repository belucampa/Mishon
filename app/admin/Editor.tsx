"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CATEGORIAS, COLORES, type Categoria, type Color, type Sitio } from "@/lib/sitio";

const IMAGENES_MARCA = [
  "/mishon-negro.png",
  "/mishon-crema.png",
  "/mishon-rojo.png",
  "/mishon-verde.png",
  "/mishon-amarillo.png",
  "/mishon-mostaza.png",
  "/gatotaza-negro.png",
  "/gatotaza-crema.png",
  "/gatotaza-rojo.png",
  "/gatotaza-verdelima.png",
  "/gatotaza-amarillo.png",
  "/gatotaza-mostaza.png",
  "/packaging/molido.png",
  "/packaging/en-grano.png",
  "/packaging/origen-unico.png",
];

const NOMBRE_CATEGORIA: Record<Categoria, string> = {
  molido: "Café molido",
  grano: "Café en grano",
  origen: "Origen único",
};

type Estado = { tipo: "ok" | "error" | "info"; texto: string } | null;

// ---------- Piezas del formulario ----------

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <details className="group rounded-3xl border-2 border-negro bg-white/60 open:bg-white/80">
      <summary className="cursor-pointer list-none px-6 py-4 font-display font-extrabold text-xl flex items-center justify-between">
        {titulo}
        <span className="text-base transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="px-6 pb-6 flex flex-col gap-4">{children}</div>
    </details>
  );
}

function Texto({
  label,
  value,
  onChange,
  largo,
  ayuda,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  largo?: boolean;
  ayuda?: string;
}) {
  const clase =
    "w-full px-4 py-2.5 rounded-xl border-2 border-negro/30 bg-white focus:border-negro focus:outline-none";
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {largo ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={`${clase} mt-1`} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={`${clase} mt-1`} />
      )}
      {ayuda && <span className="block text-xs text-negro/60 mt-1">{ayuda}</span>}
    </label>
  );
}

function ElegirColor({
  label,
  value,
  onChange,
  colores,
}: {
  label: string;
  value: Color;
  onChange: (v: Color) => void;
  colores: Record<Color, string>;
}) {
  return (
    <div>
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex flex-wrap gap-2 mt-1">
        {COLORES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            aria-pressed={value === c}
            className={`flex items-center gap-2 rounded-full border-2 pl-1 pr-3 py-1 text-sm capitalize ${
              value === c ? "border-negro font-bold" : "border-negro/20"
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-negro/30" style={{ background: colores[c] }} />
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function Imagen({
  label,
  value,
  onChange,
  opcional,
  avisar,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  opcional?: boolean;
  avisar: (e: Estado) => void;
}) {
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const opciones = IMAGENES_MARCA.includes(value) || !value ? IMAGENES_MARCA : [value, ...IMAGENES_MARCA];

  async function subir(archivo: File) {
    setSubiendo(true);
    const form = new FormData();
    form.append("archivo", archivo);
    const res = await fetch("/api/admin/imagen", { method: "POST", body: form });
    const json = await res.json().catch(() => ({}));
    setSubiendo(false);
    if (!res.ok) {
      avisar({ tipo: "error", texto: json.error || "No se pudo subir la imagen" });
      return;
    }
    setVistaPrevia(URL.createObjectURL(archivo));
    onChange(json.ruta);
    avisar({ tipo: "info", texto: "Imagen subida. Acordate de guardar los cambios." });
  }

  const src = vistaPrevia && value.startsWith("/subidas/") ? vistaPrevia : value;

  return (
    <div>
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex items-center gap-3 mt-1">
        <div className="w-16 h-16 shrink-0 rounded-xl border-2 border-negro/20 bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:12px_12px] flex items-center justify-center overflow-hidden">
          {src ? <img src={src} alt="" className="max-w-full max-h-full object-contain" /> : <span className="text-xs text-negro/40">—</span>}
        </div>
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <select
            value={value}
            onChange={(e) => {
              setVistaPrevia(null);
              onChange(e.target.value);
            }}
            className="w-full px-3 py-2 rounded-xl border-2 border-negro/30 bg-white text-sm"
          >
            {opcional && <option value="">(sin imagen)</option>}
            {opciones.map((o) => (
              <option key={o} value={o}>
                {o.replace(/^\//, "")}
              </option>
            ))}
          </select>
          <label className="self-start cursor-pointer text-sm font-semibold text-rojo hover:underline">
            {subiendo ? "Subiendo…" : "Subir otra imagen"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              disabled={subiendo}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) subir(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function Lista<T>({
  items,
  onChange,
  nuevo,
  titulo,
  render,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  nuevo: () => T;
  titulo: (item: T, i: number) => string;
  render: (item: T, cambiar: (fn: (item: T) => void) => void, i: number) => ReactNode;
}) {
  function mover(i: number, delta: number) {
    const copia = [...items];
    const [x] = copia.splice(i, 1);
    copia.splice(i + delta, 0, x);
    onChange(copia);
  }
  const boton = "w-8 h-8 rounded-full border-2 border-negro/20 hover:border-negro disabled:opacity-30 text-sm";
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border-2 border-negro/15 bg-crema/60 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold truncate">{titulo(item, i)}</span>
            <div className="flex gap-1 shrink-0">
              <button type="button" className={boton} disabled={i === 0} onClick={() => mover(i, -1)} aria-label="Subir">
                ↑
              </button>
              <button type="button" className={boton} disabled={i === items.length - 1} onClick={() => mover(i, 1)} aria-label="Bajar">
                ↓
              </button>
              <button
                type="button"
                className={`${boton} hover:border-rojo hover:text-rojo`}
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                aria-label="Borrar"
              >
                ✕
              </button>
            </div>
          </div>
          {render(
            item,
            (fn) => {
              const copia = structuredClone(items);
              fn(copia[i]);
              onChange(copia);
            },
            i
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, nuevo()])}
        className="self-start rounded-full border-2 border-dashed border-negro/40 px-4 py-2 text-sm font-semibold hover:border-negro"
      >
        + Agregar
      </button>
    </div>
  );
}

// ---------- Editor ----------

export default function Editor() {
  const [sitio, setSitio] = useState<Sitio | null>(null);
  const [version, setVersion] = useState("");
  const [modo, setModo] = useState<"github" | "local">("local");
  const [puedeGuardar, setPuedeGuardar] = useState(true);
  const [cambios, setCambios] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [estado, setEstado] = useState<Estado>(null);

  async function cargar() {
    const res = await fetch("/api/admin/contenido", { cache: "no-store" });
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    const json = await res.json();
    if (!res.ok) {
      setEstado({ tipo: "error", texto: json.error || "No se pudo cargar el contenido" });
      return;
    }
    setSitio(json.sitio);
    setVersion(json.version);
    setModo(json.modo);
    setPuedeGuardar(json.puedeGuardar);
    setCambios(false);
  }

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    if (!cambios) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [cambios]);

  function editar(fn: (s: Sitio) => void) {
    setSitio((prev) => {
      if (!prev) return prev;
      const copia = structuredClone(prev);
      fn(copia);
      return copia;
    });
    setCambios(true);
  }

  async function guardar() {
    if (!sitio) return;
    setGuardando(true);
    setEstado(null);
    const res = await fetch("/api/admin/contenido", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sitio, version }),
    });
    const json = await res.json().catch(() => ({}));
    setGuardando(false);
    if (!res.ok) {
      setEstado({ tipo: "error", texto: json.error || "No se pudo guardar" });
      return;
    }
    setVersion(json.version);
    setCambios(false);
    setEstado({
      tipo: "ok",
      texto:
        modo === "github"
          ? "¡Guardado! La página se actualiza sola en 1 o 2 minutos."
          : "¡Guardado! Recargá la página para verlo.",
    });
  }

  async function salir() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (!sitio) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        {estado ? <p className="text-rojo font-semibold">{estado.texto}</p> : <p>Cargando…</p>}
      </main>
    );
  }

  const { colores } = sitio;
  const avisar = setEstado;

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 pt-8 pb-36">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <img src="/mishon-negro.png" alt="Mishón" className="h-8 w-auto" />
          <span className="font-display font-extrabold text-xl">Panel</span>
        </div>
        <div className="flex gap-4 text-sm font-semibold">
          <a href="/" target="_blank" className="hover:underline">
            Ver la página ↗
          </a>
          <button type="button" onClick={salir} className="hover:underline">
            Salir
          </button>
        </div>
      </header>

      {!puedeGuardar && (
        <p className="mb-6 rounded-2xl bg-rojo text-crema p-4 text-sm font-semibold">
          Podés mirar el contenido, pero para guardar falta configurar GITHUB_TOKEN en Vercel.
        </p>
      )}

      <div className="flex flex-col gap-4">
        <Seccion titulo="Inicio">
          <ElegirColor label="Color de fondo" value={sitio.inicio.fondo} colores={colores} onChange={(v) => editar((s) => void (s.inicio.fondo = v))} />
          <Imagen label="Imagen principal" value={sitio.inicio.imagen} avisar={avisar} onChange={(v) => editar((s) => void (s.inicio.imagen = v))} />
          <Texto label="Eslogan" value={sitio.inicio.eslogan} onChange={(v) => editar((s) => void (s.inicio.eslogan = v))} />
          <ElegirColor label="Color del eslogan" value={sitio.inicio.colorEslogan} colores={colores} onChange={(v) => editar((s) => void (s.inicio.colorEslogan = v))} />
          <Texto label="Texto" largo value={sitio.inicio.texto} onChange={(v) => editar((s) => void (s.inicio.texto = v))} />
          <Texto label="Texto del botón" value={sitio.inicio.boton} onChange={(v) => editar((s) => void (s.inicio.boton = v))} />
          <Texto label="Ejemplo dentro del campo de mail" value={sitio.inicio.placeholderEmail} onChange={(v) => editar((s) => void (s.inicio.placeholderEmail = v))} />
          <Texto label="Mensaje después de anotarse" value={sitio.inicio.gracias} onChange={(v) => editar((s) => void (s.inicio.gracias = v))} />
          <Texto label="Nota chiquita de abajo" value={sitio.inicio.nota} onChange={(v) => editar((s) => void (s.inicio.nota = v))} />
        </Seccion>

        <Seccion titulo="Molido a pedido (pasos)">
          <Texto label="Título" value={sitio.comoFunciona.titulo} onChange={(v) => editar((s) => void (s.comoFunciona.titulo = v))} />
          <Lista
            items={sitio.comoFunciona.pasos}
            onChange={(v) => editar((s) => void (s.comoFunciona.pasos = v))}
            nuevo={() => ({ titulo: "Nuevo paso", desc: "" })}
            titulo={(p, i) => `${i + 1}. ${p.titulo}`}
            render={(p, cambiar) => (
              <>
                <Texto label="Título" value={p.titulo} onChange={(v) => cambiar((x) => void (x.titulo = v))} />
                <Texto label="Descripción" value={p.desc} onChange={(v) => cambiar((x) => void (x.desc = v))} />
              </>
            )}
          />
        </Seccion>

        <Seccion titulo="Historias de Instagram">
          <ElegirColor label="Color de fondo" value={sitio.historias.fondo} colores={colores} onChange={(v) => editar((s) => void (s.historias.fondo = v))} />
          <Imagen label="Logo" value={sitio.historias.logo} avisar={avisar} onChange={(v) => editar((s) => void (s.historias.logo = v))} />
          <Texto label="Título" largo value={sitio.historias.titulo} onChange={(v) => editar((s) => void (s.historias.titulo = v))} />
          <Texto
            label="Texto"
            largo
            value={sitio.historias.texto}
            onChange={(v) => editar((s) => void (s.historias.texto = v))}
            ayuda={`Donde escribas @${sitio.contacto.instagram} se convierte en link a tu Instagram.`}
          />
          <Lista
            items={sitio.historias.items}
            onChange={(v) => editar((s) => void (s.historias.items = v))}
            nuevo={() => ({ fondo: "crema" as Color, gato: "/gatotaza-negro.png", foto: "" })}
            titulo={(h, i) => `Historia ${i + 1}${h.foto ? "" : " (de ejemplo)"}`}
            render={(h, cambiar) => (
              <>
                <Imagen label="Captura de la historia" opcional value={h.foto} avisar={avisar} onChange={(v) => cambiar((x) => void (x.foto = v))} />
                {!h.foto && (
                  <>
                    <ElegirColor label="Fondo del recuadro de ejemplo" value={h.fondo} colores={colores} onChange={(v) => cambiar((x) => void (x.fondo = v))} />
                    <Imagen label="GatoTaza del recuadro de ejemplo" value={h.gato} avisar={avisar} onChange={(v) => cambiar((x) => void (x.gato = v))} />
                  </>
                )}
              </>
            )}
          />
        </Seccion>

        <Seccion titulo="Así va a ser la tienda">
          <Texto label="Título" value={sitio.tienda.titulo} onChange={(v) => editar((s) => void (s.tienda.titulo = v))} />
          <Texto label="Texto" largo value={sitio.tienda.texto} onChange={(v) => editar((s) => void (s.tienda.texto = v))} />
          <Lista
            items={sitio.tienda.items}
            onChange={(v) => editar((s) => void (s.tienda.items = v))}
            nuevo={() => ({ nombre: "Nuevo café", desc: "", fondo: "crema" as Color, gato: "/gatotaza-negro.png" })}
            titulo={(t) => t.nombre}
            render={(t, cambiar) => (
              <>
                <Texto label="Nombre" value={t.nombre} onChange={(v) => cambiar((x) => void (x.nombre = v))} />
                <Texto label="Descripción" value={t.desc} onChange={(v) => cambiar((x) => void (x.desc = v))} />
                <ElegirColor label="Fondo" value={t.fondo} colores={colores} onChange={(v) => cambiar((x) => void (x.fondo = v))} />
                <Imagen label="Imagen" value={t.gato} avisar={avisar} onChange={(v) => cambiar((x) => void (x.gato = v))} />
              </>
            )}
          />
        </Seccion>

        <Seccion titulo="Quiz">
          <Texto label="Título" value={sitio.quiz.titulo} onChange={(v) => editar((s) => void (s.quiz.titulo = v))} />
          <Texto label="Subtítulo" value={sitio.quiz.subtitulo} onChange={(v) => editar((s) => void (s.quiz.subtitulo = v))} />
          <h3 className="font-bold mt-2">Preguntas</h3>
          <Lista
            items={sitio.quiz.preguntas}
            onChange={(v) => editar((s) => void (s.quiz.preguntas = v))}
            nuevo={() => ({
              texto: "Nueva pregunta",
              emoji: false,
              opciones: CATEGORIAS.map((c) => ({ texto: "", valor: c })),
            })}
            titulo={(p, i) => `${i + 1}. ${p.texto}`}
            render={(p, cambiar) => (
              <>
                <Texto label="Pregunta" value={p.texto} onChange={(v) => cambiar((x) => void (x.texto = v))} />
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={p.emoji} onChange={(e) => cambiar((x) => void (x.emoji = e.target.checked))} />
                  Las respuestas son emojis (se muestran grandes y redondos)
                </label>
                <Lista
                  items={p.opciones}
                  onChange={(v) => cambiar((x) => void (x.opciones = v))}
                  nuevo={() => ({ texto: "", valor: "molido" as Categoria })}
                  titulo={(o) => o.texto || "Respuesta"}
                  render={(o, cambiarOpcion) => (
                    <>
                      <Texto label="Respuesta" value={o.texto} onChange={(v) => cambiarOpcion((x) => void (x.texto = v))} />
                      <label className="block text-sm font-semibold">
                        Suma para
                        <select
                          value={o.valor}
                          onChange={(e) => cambiarOpcion((x) => void (x.valor = e.target.value as Categoria))}
                          className="block mt-1 px-3 py-2 rounded-xl border-2 border-negro/30 bg-white font-normal"
                        >
                          {CATEGORIAS.map((c) => (
                            <option key={c} value={c}>
                              {NOMBRE_CATEGORIA[c]}
                            </option>
                          ))}
                        </select>
                      </label>
                    </>
                  )}
                />
              </>
            )}
          />
          <h3 className="font-bold mt-2">Resultados</h3>
          {CATEGORIAS.map((c) => (
            <div key={c} className="rounded-2xl border-2 border-negro/15 bg-crema/60 p-4 flex flex-col gap-3">
              <span className="font-semibold">{NOMBRE_CATEGORIA[c]}</span>
              <Texto label="Título" value={sitio.quiz.resultados[c].titulo} onChange={(v) => editar((s) => void (s.quiz.resultados[c].titulo = v))} />
              <Texto label="Descripción" largo value={sitio.quiz.resultados[c].desc} onChange={(v) => editar((s) => void (s.quiz.resultados[c].desc = v))} />
              <ElegirColor label="Fondo" value={sitio.quiz.resultados[c].fondo} colores={colores} onChange={(v) => editar((s) => void (s.quiz.resultados[c].fondo = v))} />
            </div>
          ))}
        </Seccion>

        <Seccion titulo="Packaging (carrusel)">
          <Texto label="Título" value={sitio.packaging.titulo} onChange={(v) => editar((s) => void (s.packaging.titulo = v))} />
          <Texto label="Nota de abajo" value={sitio.packaging.nota} onChange={(v) => editar((s) => void (s.packaging.nota = v))} />
          <Lista
            items={sitio.packaging.slides}
            onChange={(v) => editar((s) => void (s.packaging.slides = v))}
            nuevo={() => ({ nombre: "Nuevo", desc: "", fondo: "crema" as Color, sticker: "/packaging/molido.png" })}
            titulo={(p) => p.nombre}
            render={(p, cambiar) => (
              <>
                <Texto label="Nombre" value={p.nombre} onChange={(v) => cambiar((x) => void (x.nombre = v))} />
                <Texto label="Descripción" value={p.desc} onChange={(v) => cambiar((x) => void (x.desc = v))} />
                <ElegirColor label="Fondo" value={p.fondo} colores={colores} onChange={(v) => cambiar((x) => void (x.fondo = v))} />
                <Imagen label="Sticker de la bolsa" value={p.sticker} avisar={avisar} onChange={(v) => cambiar((x) => void (x.sticker = v))} />
              </>
            )}
          />
        </Seccion>

        <Seccion titulo="Contacto">
          <ElegirColor label="Color de fondo" value={sitio.contacto.fondo} colores={colores} onChange={(v) => editar((s) => void (s.contacto.fondo = v))} />
          <Texto label="Título" value={sitio.contacto.titulo} onChange={(v) => editar((s) => void (s.contacto.titulo = v))} />
          <Texto label="Mail" value={sitio.contacto.email} onChange={(v) => editar((s) => void (s.contacto.email = v))} />
          <Texto
            label="Usuario de Instagram"
            value={sitio.contacto.instagram}
            onChange={(v) => editar((s) => void (s.contacto.instagram = v.replace(/^@/, "").trim()))}
            ayuda="Sin el @. Se usa en toda la página."
          />
        </Seccion>

        <Seccion titulo="Encabezado y pie">
          <Imagen label="Logo del encabezado" value={sitio.encabezado.logo} avisar={avisar} onChange={(v) => editar((s) => void (s.encabezado.logo = v))} />
          <Texto label="Link del encabezado" value={sitio.encabezado.link} onChange={(v) => editar((s) => void (s.encabezado.link = v))} />
          <Imagen label="Logo del pie" value={sitio.pie.logo} avisar={avisar} onChange={(v) => editar((s) => void (s.pie.logo = v))} />
          <Texto label="Texto del pie" value={sitio.pie.texto} onChange={(v) => editar((s) => void (s.pie.texto = v))} />
        </Seccion>

        <Seccion titulo="Colores de la marca">
          <p className="text-sm text-negro/70">Cambian el color en toda la página.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {COLORES.map((c) => (
              <label key={c} className="flex items-center gap-3 rounded-2xl border-2 border-negro/15 bg-white p-3">
                <input
                  type="color"
                  value={colores[c]}
                  onChange={(e) => editar((s) => void (s.colores[c] = e.target.value.toUpperCase()))}
                  className="w-12 h-10 rounded cursor-pointer bg-transparent"
                />
                <span className="flex-1">
                  <span className="block font-semibold capitalize">{c}</span>
                  <input
                    value={colores[c]}
                    onChange={(e) => editar((s) => void (s.colores[c] = e.target.value))}
                    className="w-28 text-sm font-mono border-b border-negro/30 bg-transparent focus:outline-none"
                  />
                </span>
              </label>
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Pestaña del navegador y Google">
          <Texto label="Título de la pestaña" value={sitio.general.tituloPestana} onChange={(v) => editar((s) => void (s.general.tituloPestana = v))} />
          <Texto
            label="Descripción"
            largo
            value={sitio.general.descripcion}
            onChange={(v) => editar((s) => void (s.general.descripcion = v))}
            ayuda="Es el texto que aparece debajo del título en los resultados de Google."
          />
        </Seccion>
      </div>

      {/* Barra para guardar */}
      <div className="fixed inset-x-0 bottom-0 border-t-2 border-negro bg-crema/95 backdrop-blur px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <p
            className={`text-sm font-semibold ${
              estado?.tipo === "error" ? "text-rojo" : estado?.tipo === "ok" ? "text-negro" : "text-negro/70"
            }`}
            role="status"
          >
            {estado?.texto || (cambios ? "Tenés cambios sin guardar." : "Todo guardado.")}
          </p>
          <div className="flex gap-2">
            {cambios && (
              <button
                type="button"
                onClick={() => {
                  setEstado(null);
                  cargar();
                }}
                className="px-4 py-2.5 rounded-full border-2 border-negro font-semibold text-sm hover:bg-negro/5"
              >
                Descartar
              </button>
            )}
            <button
              type="button"
              onClick={guardar}
              disabled={!cambios || guardando || !puedeGuardar}
              className="px-6 py-2.5 rounded-full border-2 border-negro bg-rojo text-crema font-button font-bold hover:bg-negro transition-colors disabled:opacity-50 disabled:hover:bg-rojo"
            >
              {guardando ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
