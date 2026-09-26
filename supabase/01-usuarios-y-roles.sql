-- Usuarios y roles de Mishón.
-- Se corre una sola vez en Supabase: SQL Editor → New query → pegar todo → Run.

-- cliente:   el que compra (todos arrancan así).
-- logistica: ve pedidos y envíos, sin precios ni datos de ventas.
-- equipo:    maneja todo lo del negocio, pero no cambia roles.
-- admin:     todo, incluido cambiar roles.
create type public.rol as enum ('cliente', 'logistica', 'equipo', 'admin');

create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  nombre text not null default '',
  rol public.rol not null default 'cliente',
  creado_en timestamptz not null default now()
);

alter table public.perfiles enable row level security;

-- El rol de quien está haciendo la consulta. "security definer" para poder
-- leerlo desde las reglas sin que la regla se llame a sí misma.
create or replace function public.mi_rol()
returns public.rol
language sql
stable
security definer
set search_path = ''
as $$
  select rol from public.perfiles where id = auth.uid()
$$;

create policy "cada uno ve su perfil"
  on public.perfiles for select to authenticated
  using (id = auth.uid());

create policy "admin y equipo ven todos los perfiles"
  on public.perfiles for select to authenticated
  using (public.mi_rol() in ('admin', 'equipo'));

create policy "cada uno edita su perfil"
  on public.perfiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Nadie puede tocar su propio rol ni su mail desde la página: solo el nombre.
revoke insert, update, delete on public.perfiles from anon, authenticated;
grant update (nombre) on public.perfiles to authenticated;

-- Cada cuenta nueva recibe su perfil de cliente.
create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, email, nombre)
  values (new.id, new.email, coalesce(left(new.raw_user_meta_data ->> 'nombre', 100), ''));
  return new;
end
$$;

create trigger al_registrarse
  after insert on auth.users
  for each row execute function public.crear_perfil();

-- La única forma de cambiar un rol. Solo un admin, y nunca el propio
-- (así siempre queda al menos un admin).
create or replace function public.cambiar_rol(usuario uuid, nuevo_rol public.rol)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.mi_rol() is distinct from 'admin'::public.rol then
    raise exception 'Solo un admin puede cambiar roles';
  end if;
  if usuario = auth.uid() then
    raise exception 'No podés cambiar tu propio rol';
  end if;
  update public.perfiles set rol = nuevo_rol where id = usuario;
  if not found then
    raise exception 'No encontré ese usuario';
  end if;
end
$$;

revoke execute on function public.cambiar_rol(uuid, public.rol) from public, anon;
grant execute on function public.cambiar_rol(uuid, public.rol) to authenticated;

-- Después de registrarte en la página, corré esto con tu mail para ser admin:
-- update public.perfiles set rol = 'admin' where email = 'TU_MAIL';
