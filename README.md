# 🐾 Michi — Gastos y cuidado de gatos

App para llevar el control de gastos y cuidado de los gatos de la casa.
Reemplaza el flujo anterior (Streamlit + Google Sheets/Forms) por
**Next.js + Supabase**, lista para desplegar en **Vercel** desde **GitHub**.

## Qué incluye esta primera versión

- **Auth por hogar**: cada persona crea su propia cuenta; con un código de
  invitación se unen al mismo "hogar" y comparten todos los datos de los gatos.
- **Resumen**: gasto del mes, costo diario por gato (ahora configurable, no
  hardcodeado), acumulado del año, distribución por categoría.
- **Medidor de huellitas**: estimación de cuándo se acaba el alimento/arena,
  visualizada como huellas que se van llenando (en vez de una barra genérica).
- **Tendencia de precios**: evolución del precio por kg/unidad, por categoría.
- **Gastos**: formulario para registrar compras (reemplaza el Google Form) +
  historial completo.
- **Perfiles de gato**: nombre, sexo, edad calculada desde fecha de
  nacimiento aproximada, contextura, color/patrón de pelaje con avatar SVG
  generado, e historial de peso con gráfica de evolución.
- **Categorías configurables**: Alimento y Arena vienen marcadas como
  "consumibles" (entran al cálculo de inventario) pero puedes agregar más
  categorías consumibles sin tocar código.

## 1. Crear el proyecto en Supabase

**¿Proyecto nuevo desde cero?** Ve a [supabase.com](https://supabase.com) →
*New project*. Una vez creado, entra a **SQL Editor** → *New query*, pega el
contenido completo de [`supabase/schema.sql`](./supabase/schema.sql) y
ejecútalo. Ya incluye todo (tablas, RLS, funciones) — no necesitas correr
nada de la carpeta `supabase/migrations/`.

**¿Ya tienes una base de datos de Michi corriendo?** No vuelvas a correr
`schema.sql` completo. En vez de eso, ve a `supabase/migrations/` y corre
cada archivo **en orden** (001, 002, 003…) en el SQL Editor, uno a la vez.
Cada uno describe qué arregla o agrega, y son seguros de re-ejecutar aunque
ya hayas corrido alguno antes (no van a fallar por duplicado).

Cualquiera de los dos caminos, después:

1. Ve a **Project Settings → API** y copia:
   - `Project URL` → será tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. (Opcional pero recomendado) En **Authentication → Providers**, desactiva
   la confirmación por correo si quieren entrar de inmediato sin verificar
   email, o déjala activa para más seguridad.

## 2. Correr localmente

```bash
npm install
cp .env.local.example .env.local
# pega tus credenciales de Supabase en .env.local
npm run dev
```

Abre `http://localhost:3000`. El primer usuario que se registre (sin código
de invitación) crea el hogar automáticamente. Genera un código en la pestaña
**Hogar y miembros** y compártelo con tu novia para que se una al crear su
cuenta.

## 3. Subir a GitHub

```bash
git init
git add .
git commit -m "Michi: primera versión"
gh repo create michi --private --source=. --push
# o crea el repo manualmente en github.com y haz git remote add origin ...
```

`credenciales.json` de la app vieja **no** debe subirse jamás a este repo —
ya no se necesita para nada (Supabase reemplaza el service account de
Google). El `.gitignore` ya protege `.env.local`.

## 4. Desplegar en Vercel

1. Entra a [vercel.com](https://vercel.com) → *Add New Project* → importa el
   repo de GitHub.
2. En **Environment Variables**, agrega `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` con los mismos valores de tu `.env.local`.
3. Deploy. Cada push a `main` vuelve a desplegar automáticamente.

## 5. Migrar los datos del Google Sheet actual

Los ~37 registros del Excel/Sheet actual se pueden importar directamente a
la tabla `gastos` de Supabase (Table Editor → Import data from CSV), mapeando
`Categoría` al `id` correspondiente en la tabla `categorias` de tu hogar.
Cuando tengas tu `household_id` (visible en la URL o pidiéndomelo), te genero
un CSV ya listo para importar con los datos del Excel que me compartiste.

## Pendiente / siguientes pasos

- Página de edición/borrado de gastos y gatos (por ahora solo alta).
- Notificaciones (ej. email o push) cuando el medidor de huellitas entra en
  zona crítica.
- Costo diario por gato ya lee la cantidad real de gatos activos del hogar,
  configurable agregando/quitando perfiles — no requiere ajuste manual.
