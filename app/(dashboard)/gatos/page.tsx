import { createClient } from '@/lib/supabase/server'
import { getOrCreateHousehold } from '@/lib/household'
import { CatCard } from '@/components/CatCard'
import { NuevoGatoForm } from '@/components/NuevoGatoForm'

export const dynamic = 'force-dynamic'

export default async function GatosPage() {
  const supabase = createClient()
  const householdId = await getOrCreateHousehold()

  const { data: gatos } = await supabase
    .from('cats')
    .select('*, cat_weights(peso_kg, fecha)')
    .eq('household_id', householdId)
    .eq('activo', true)
    .order('created_at')

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Nuestros gatos</h1>
        <p className="text-ink-soft">Los perfiles de Tinto, Crema y quien más se una a la familia.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(gatos ?? []).map((gato) => (
          <CatCard key={gato.id} gato={gato} />
        ))}
      </div>

      <div className="card-michi">
        <h2 className="text-xl font-display font-semibold mb-4">➕ Agregar un gato</h2>
        <NuevoGatoForm householdId={householdId} />
      </div>
    </div>
  )
}
