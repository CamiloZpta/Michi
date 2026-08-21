import { createClient } from '@/lib/supabase/server'
import { getOrCreateHousehold } from '@/lib/household'
import { TendenciaChart } from '@/components/TendenciaChart'

export const dynamic = 'force-dynamic'

export default async function TendenciaPage() {
  const supabase = createClient()
  const householdId = await getOrCreateHousehold()

  const [{ data: gastos }, { data: categorias }] = await Promise.all([
    supabase.from('gastos').select('*').eq('household_id', householdId).order('fecha'),
    supabase.from('categorias').select('*').eq('household_id', householdId).eq('es_consumible', true),
  ])

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Tendencia de precios</h1>
        <p className="text-ink-soft">La "inflación felina": cómo ha evolucionado el costo por kilo/unidad.</p>
      </div>
      <div className="card-michi">
        <TendenciaChart gastos={gastos ?? []} categorias={categorias ?? []} />
      </div>
    </div>
  )
}
