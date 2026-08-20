-- ==========================================
-- MICHI · Esquema de base de datos (Supabase / Postgres)
-- ==========================================
-- Ejecuta este archivo completo en: Supabase Dashboard → SQL Editor → New query

-- ------------------------------------------
-- EXTENSIONES
-- ------------------------------------------
create extension if not exists "pgcrypto";

-- ------------------------------------------
-- HOGARES (households)
-- Un hogar agrupa a los usuarios que comparten gatos y gastos.
-- ------------------------------------------
create table households (
  id uuid primary key default gen_random_uuid(),
  nombre text not null default 'Nuestro hogar',
  created_at timestamptz not null default now()
);

-- Relación usuario <-> hogar (permite más de un miembro por hogar)
create table household_members (
  household_id uuid not null references households(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rol text not null default 'miembro', -- 'admin' | 'miembro'
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

-- Invitaciones pendientes (para que tu pareja se una a tu hogar con un código)
create table household_invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  codigo text not null unique, -- código corto para compartir, ej. "TINTO-CREMA-4F2A"
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  used_at timestamptz,
  used_by uuid references auth.users(id)
);

-- ------------------------------------------
-- CATEGORÍAS (configurables, no hardcodeadas)
-- ------------------------------------------
create table categorias (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  nombre text not null,
  es_consumible boolean not null default false, -- true = entra al cálculo de inventario/agotamiento
  icono text default '🐾',
  created_at timestamptz not null default now(),
  unique (household_id, nombre)
);

-- ------------------------------------------
-- GATOS
-- ------------------------------------------
create type sexo_gato as enum ('macho', 'hembra');
create type contextura_gato as enum ('delgado', 'normal', 'robusto', 'sobrepeso');

create table cats (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  nombre text not null,
  sexo sexo_gato,
  fecha_nacimiento_aprox date,
  contextura contextura_gato default 'normal',
  color_pelaje text, -- clave del preset de color, ej. 'naranja_blanco'
  patron_pelaje text default 'solido', -- 'solido' | 'atigrado' | 'manchado' | 'bicolor'
  avatar_seed text, -- para variaciones deterministas del avatar SVG
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Historial de peso (para la gráfica de evolución)
create table cat_weights (
  id uuid primary key default gen_random_uuid(),
  cat_id uuid not null references cats(id) on delete cascade,
  fecha date not null default current_date,
  peso_kg numeric(4,2) not null,
  nota text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------
-- GASTOS (reemplaza al Google Sheet)
-- ------------------------------------------
create table gastos (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  categoria_id uuid not null references categorias(id),
  cat_id uuid references cats(id), -- opcional: a qué gato aplica (null = ambos/general)
  producto text not null,
  precio numeric(12,2) not null default 0,
  cantidad_total numeric(10,3) not null default 0,
  unidad text not null default 'unidades', -- 'kg' | 'unidades' | etc.
  fecha date not null default current_date,
  notas text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create index idx_gastos_household_fecha on gastos(household_id, fecha);
create index idx_gastos_categoria on gastos(categoria_id);

-- ------------------------------------------
-- RLS: solo miembros del hogar pueden ver/editar sus datos
-- ------------------------------------------
alter table households enable row level security;
alter table household_members enable row level security;
alter table household_invites enable row level security;
alter table categorias enable row level security;
alter table cats enable row level security;
alter table cat_weights enable row level security;
alter table gastos enable row level security;

-- Helper: ¿el usuario actual pertenece a este household?
create or replace function is_household_member(hh_id uuid)
returns boolean as $$
  select exists (
    select 1 from household_members
    where household_id = hh_id and user_id = auth.uid()
  );
$$ language sql security definer stable;

create policy "Ver mi(s) hogar(es)" on households for select
  using (is_household_member(id));
create policy "Crear hogar" on households for insert
  with check (true);

create policy "Ver miembros de mi hogar" on household_members for select
  using (is_household_member(household_id));
create policy "Unirse a un hogar" on household_members for insert
  with check (user_id = auth.uid());

create policy "Ver invitaciones de mi hogar" on household_invites for select
  using (is_household_member(household_id));
create policy "Crear invitación" on household_invites for insert
  with check (is_household_member(household_id));
create policy "Canjear invitación" on household_invites for update
  using (used_at is null);

create policy "CRUD categorías del hogar" on categorias for all
  using (is_household_member(household_id))
  with check (is_household_member(household_id));

create policy "CRUD gatos del hogar" on cats for all
  using (is_household_member(household_id))
  with check (is_household_member(household_id));

create policy "CRUD pesos de gatos del hogar" on cat_weights for all
  using (exists (select 1 from cats where cats.id = cat_id and is_household_member(cats.household_id)))
  with check (exists (select 1 from cats where cats.id = cat_id and is_household_member(cats.household_id)));

create policy "CRUD gastos del hogar" on gastos for all
  using (is_household_member(household_id))
  with check (is_household_member(household_id));

-- ------------------------------------------
-- Crear hogar + membresía admin de forma atómica
-- (evita el problema de RLS con RETURNING antes de ser miembro)
-- ------------------------------------------
create or replace function create_household(nombre_hogar text default 'Nuestro hogar')
returns uuid as $$
declare
  nuevo_id uuid;
begin
  insert into households (nombre) values (nombre_hogar) returning id into nuevo_id;
  insert into household_members (household_id, user_id, rol) values (nuevo_id, auth.uid(), 'admin');
  return nuevo_id;
end;
$$ language plpgsql security definer;

-- ------------------------------------------
-- Categorías por defecto al crear un hogar nuevo
-- ------------------------------------------
create or replace function seed_default_categorias()
returns trigger as $$
begin
  insert into categorias (household_id, nombre, es_consumible, icono) values
    (new.id, 'Alimento', true, '🍖'),
    (new.id, 'Arena', true, '🐾'),
    (new.id, 'Salud', false, '💊'),
    (new.id, 'Juguetes', false, '🧶'),
    (new.id, 'Otros', false, '🧸');
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_seed_categorias
  after insert on households
  for each row execute function seed_default_categorias();
