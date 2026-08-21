-- ==========================================
-- MICHI · Migración 003: pestaña de Configuración
-- ==========================================
-- Requiere que ya hayas corrido 001 y 002 antes.
-- Segura de re-ejecutar: columnas con IF NOT EXISTS, funciones con
-- CREATE OR REPLACE.

-- 1. Nueva columna: hogar activo del usuario (permite pertenecer a varios
-- hogares y elegir cuál estás viendo)
alter table profiles add column if not exists hogar_activo_id uuid references households(id);

-- 2. Permitir borrar la cuenta sin perder el historial de gastos del hogar
-- (si ya está en null, este comando no hace nada — no falla)
alter table gastos alter column created_by drop not null;

-- 3. Unirse a un hogar por código, incluso después de ya tener uno.
-- (De paso arregla un bug de RLS del flujo de invitación original: alguien
-- que aún no era miembro de ningún hogar no podía leer el código porque las
-- políticas de seguridad se lo bloqueaban.)
create or replace function join_household_by_code(codigo_invitacion text)
returns uuid as $$
declare
  inv record;
begin
  select * into inv from household_invites
    where codigo = codigo_invitacion and used_at is null and expires_at > now();

  if inv is null then
    raise exception 'Código de invitación inválido o expirado';
  end if;

  insert into household_members (household_id, user_id, rol)
    values (inv.household_id, auth.uid(), 'miembro')
    on conflict do nothing;

  update household_invites set used_at = now(), used_by = auth.uid() where id = inv.id;
  update profiles set hogar_activo_id = inv.household_id where id = auth.uid();

  return inv.household_id;
end;
$$ language plpgsql security definer set search_path = public;

-- 4. Eliminar cuenta permanentemente
create or replace function delete_my_account()
returns void as $$
declare
  uid uuid := auth.uid();
begin
  update gastos set created_by = null where created_by = uid;
  delete from household_invites where created_by = uid or used_by = uid;
  delete from household_members where user_id = uid;
  delete from profiles where id = uid;
  delete from auth.users where id = uid;
end;
$$ language plpgsql security definer set search_path = public, auth;

grant execute on function join_household_by_code(text) to authenticated;
grant execute on function delete_my_account() to authenticated;

-- 5. Que crear un hogar también lo marque como "activo" (reemplaza la
-- versión de la migración 001, agregándole esta línea extra)
create or replace function create_household(nombre_hogar text default 'Nuestro hogar')
returns uuid as $$
declare
  nuevo_id uuid;
begin
  insert into households (nombre) values (nombre_hogar) returning id into nuevo_id;
  insert into household_members (household_id, user_id, rol) values (nuevo_id, auth.uid(), 'admin');
  update profiles set hogar_activo_id = nuevo_id where id = auth.uid();
  return nuevo_id;
end;
$$ language plpgsql security definer set search_path = public;
