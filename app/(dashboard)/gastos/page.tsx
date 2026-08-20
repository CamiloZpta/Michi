import { createClient } from '@/lib/supabase/server'
import { getOrCreateHousehold } from '@/lib/household'
import { RegistrarGastoForm } from '@/components/RegistrarGastoForm'
import { HistorialGastos } from '@/components/HistorialGastos'

export const dynamic = 'force-dynamic'

export default async function GastosPage() {
  const supabase = createClient()
  const householdId = await getOrCreateHousehold()

  const [{ data: categorias }, { data: gatos }, { data: gastos }] = await Promise.all([
    supabase.from('categorias').select('*').eq('household_id', householdId).order('nombre'),
    supabase.from('cats').select('id, nombre').eq('household_id', householdId).eq('activo', true),
    supabase
      .from('gastos')
      .select('*, categorias(nombre, icono)')
      .eq('household_id', householdId)
      .order('fecha', { ascending: false }),
  ])

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Gastos</h1>
        <p className="text-ink-soft">Registra una compra nueva o revisa el historial completo.</p>
      </div>

      <div className="card-michi">
        <h2 className="text-xl font-display font-semibold mb-4">➕ Registrar compra</h2>
        <RegistrarGastoForm
          householdId={householdId}
          categorias={categorias ?? []}
          gatos={gatos ?? []}
        />
      </div>

      <div className="card-michi">
        <h2 className="text-xl font-display font-semibold mb-4">🧾 Historial</h2>
        <HistorialGastos gastos={gastos ?? []} />
      </div>
    </div>
  )
}
