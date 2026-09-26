export const ROLES = ["cliente", "logistica", "equipo", "admin"] as const;
export type Rol = (typeof ROLES)[number];

export const NOMBRE_ROL: Record<Rol, string> = {
  cliente: "Cliente",
  logistica: "Logística",
  equipo: "Equipo",
  admin: "Admin",
};

export const DESCRIPCION_ROL: Record<Rol, string> = {
  cliente: "Compra en la tienda y ve sus pedidos.",
  logistica: "Ve pedidos y envíos, sin precios ni ventas.",
  equipo: "Maneja todo el negocio, pero no cambia roles.",
  admin: "Todo, incluido cambiar roles.",
};

export type Perfil = {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  creado_en: string;
};

// Secciones del panel de gestión y quién entra a cada una.
export const SECCIONES = [
  { ruta: "/gestion/pedidos", nombre: "Pedidos", roles: ["logistica", "equipo", "admin"] },
  { ruta: "/gestion/envios", nombre: "Envíos", roles: ["logistica", "equipo", "admin"] },
  { ruta: "/gestion/ventas", nombre: "Ventas", roles: ["equipo", "admin"] },
  { ruta: "/gestion/mails", nombre: "Mails", roles: ["equipo", "admin"] },
  { ruta: "/gestion/usuarios", nombre: "Usuarios", roles: ["equipo", "admin"] },
] as const satisfies readonly { ruta: string; nombre: string; roles: readonly Rol[] }[];

export function seccionesPara(rol: Rol) {
  return SECCIONES.filter((s) => (s.roles as readonly Rol[]).includes(rol));
}

export function entraAGestion(rol: Rol) {
  return rol !== "cliente";
}

export function puedeCambiarRoles(rol: Rol) {
  return rol === "admin";
}

// Solo acepta rutas internas, para que nadie arme un link que te mande a otro sitio.
export function rutaSegura(ruta: string | null | undefined, porDefecto = "/cuenta") {
  return ruta && ruta.startsWith("/") && !ruta.startsWith("//") && !ruta.startsWith("/\\")
    ? ruta
    : porDefecto;
}
