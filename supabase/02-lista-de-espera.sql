-- Lista de espera: la gente que quiere enterarse cuando abra la tienda.
-- Se corre una sola vez en Supabase, después de 01-usuarios-y-roles.sql.

create table public.lista_espera (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  -- landing: dejó el mail en "Avisame primero". cuenta: se registró y confirmó su mail.
  origen text not null default 'landing' check (origen in ('landing', 'cuenta')),
  token_baja uuid not null unique default gen_random_uuid(),
  dado_de_baja boolean not null default false,
  lanzamiento_enviado_en timestamptz,
  creado_en timestamptz not null default now()
);

alter table public.lista_espera enable row level security;

-- Desde la página solo se entra por las funciones de abajo.
revoke all on public.lista_espera from anon, authenticated;
grant select on public.lista_espera to authenticated;

create policy "admin y equipo ven la lista"
  on public.lista_espera for select to authenticated
  using (public.mi_rol() in ('admin', 'equipo'));

-- Anota un mail. Devuelve el token de baja si es nuevo, o null si ya estaba
-- (así no se le manda la bienvenida dos veces ni se filtra el token de otro).
create or replace function public.anotar_en_lista(correo text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  limpio text := lower(trim(correo));
  token uuid;
begin
  if length(limpio) > 254 or limpio !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Mail inválido';
  end if;
  insert into public.lista_espera (email) values (limpio)
  on conflict (email) do nothing
  returning token_baja into token;
  return token;
end
$$;

-- Para el link "dejar de recibir mails". Devuelve false si el link no es válido.
create or replace function public.dar_de_baja(token uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.lista_espera set dado_de_baja = true where token_baja = token;
  return found;
end
$$;

-- Marca a quiénes ya les llegó el mail de lanzamiento, para no mandarlo dos veces.
create or replace function public.marcar_lanzamiento_enviado(ids uuid[])
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.mi_rol() not in ('admin', 'equipo') or public.mi_rol() is null then
    raise exception 'Solo admin o equipo pueden enviar el lanzamiento';
  end if;
  update public.lista_espera set lanzamiento_enviado_en = now() where id = any (ids);
end
$$;

revoke execute on function public.anotar_en_lista(text) from public;
revoke execute on function public.dar_de_baja(uuid) from public;
revoke execute on function public.marcar_lanzamiento_enviado(uuid[]) from public, anon;
grant execute on function public.anotar_en_lista(text) to anon, authenticated;
grant execute on function public.dar_de_baja(uuid) to anon, authenticated;
grant execute on function public.marcar_lanzamiento_enviado(uuid[]) to authenticated;

-- Quien crea una cuenta y confirma su mail también entra a la lista.
create or replace function public.anotar_cuenta_confirmada()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email_confirmed_at is not null and new.email is not null then
    insert into public.lista_espera (email, origen) values (lower(new.email), 'cuenta')
    on conflict (email) do nothing;
  end if;
  return new;
end
$$;

create trigger al_confirmar_mail
  after insert or update of email_confirmed_at on auth.users
  for each row execute function public.anotar_cuenta_confirmada();

-- Las cuentas que ya existían.
insert into public.lista_espera (email, origen)
select lower(email), 'cuenta' from auth.users
where email_confirmed_at is not null and email is not null
on conflict (email) do nothing;
