-- ==========================================
-- MICHI · Migración 002: color de ojos del avatar + perfiles de usuario
-- ==========================================
-- Segura de re-ejecutar: usa IF NOT EXISTS y DROP POLICY IF EXISTS antes de
-- recrear, así que no falla aunque ya la hayas corrido.

-- 1. Color de ojos configurable en el avatar del gato
alter table cats add column if not exists ojos text default 'cafe';

-- 2. Tabla de perfiles (nombre visible de cada persona del hogar)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;

drop policy if exists "Ver mi perfil y el de mi hogar" on profiles;
create policy "Ver mi perfil y el de mi hogar" on profiles for select
  using (
    id = auth.uid()
    or exists (
      select 1 from household_members hm1
      join household_members hm2 on hm1.household_id = hm2.household_id
      where hm1.user_id = auth.uid() and hm2.user_id = profiles.id
    )
  );

drop policy if exists "Crear mi perfil" on profiles;
create policy "Crear mi perfil" on profiles for insert
  with check (id = auth.uid());

drop policy if exists "Editar mi perfil" on profiles;
create policy "Editar mi perfil" on profiles for update
  using (id = auth.uid());
