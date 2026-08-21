-- ==========================================
-- MICHI · Migración 004: Recordatorios
-- ==========================================
-- Corre esto UNA vez en el SQL Editor de Supabase. Segura de re-ejecutar
-- (create table if not exists + policy con drop previo).

create table if not exists recordatorios (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  nombre text not null,
  descripcion text,
  fecha date not null,
  hora time,
  lugar text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table recordatorios enable row level security;

drop policy if exists "CRUD recordatorios del hogar" on recordatorios;
create policy "CRUD recordatorios del hogar" on recordatorios for all
  using (is_household_member(household_id))
  with check (is_household_member(household_id));
