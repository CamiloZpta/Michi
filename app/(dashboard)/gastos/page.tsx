import { createClient } from '@/lib/supabase/server'
import { getOrCreateHousehold } from '@/lib/household'
import { RegistrarGastoForm } from '@/components/RegistrarGastoForm'
import { HistorialGastosFiltrable } from '@/components/HistorialGastosFiltrable'
import { FloatingAddButton } from '@/components/FloatingAddButton'

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
    <div className="flex flex-col gap-6 max-w-4xl pb-20">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Historial de gastos</h1>
        <p className="text-ink-soft">Filtra por fecha o categoría. Usa el botón + para registrar una compra.</p>
      </div>

      <div className="card-michi">
        <HistorialGastosFiltrable gastos={gastos ?? []} categorias={categorias ?? []} />
      </div>

      <FloatingAddButton label="Registrar compra">
        {(cerrar) => (
          <RegistrarGastoForm
            householdId={householdId}
            categorias={categorias ?? []}
            gatos={gatos ?? []}
            onGuardado={cerrar}
          />
        )}
      </FloatingAddButton>
    </div>
  )
}
