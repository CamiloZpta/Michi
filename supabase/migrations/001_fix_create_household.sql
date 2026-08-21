-- ==========================================
-- MICHI · Migración 001: crear hogar de forma atómica
-- ==========================================
-- Arregla el error "No se pudo crear el hogar" causado por una condición
-- de carrera con RLS (el usuario intentaba leer la fila del hogar antes de
-- ser miembro). Segura de re-ejecutar aunque ya la hayas corrido antes.

create or replace function create_household(nombre_hogar text default 'Nuestro hogar')
returns uuid as $$
declare
  nuevo_id uuid;
begin
  insert into households (nombre) values (nombre_hogar) returning id into nuevo_id;
  insert into household_members (household_id, user_id, rol) values (nuevo_id, auth.uid(), 'admin');
  return nuevo_id;
end;
$$ language plpgsql security definer set search_path = public;
