import { createClient } from '@/lib/supabase/server'
import { getOrCreateHousehold } from '@/lib/household'
import { ListaRecordatorios } from '@/components/ListaRecordatorios'
import { NuevoRecordatorioFloating } from '@/components/NuevoRecordatorioFloating'

export const dynamic = 'force-dynamic'

export default async function RecordatoriosPage() {
  const supabase = createClient()
  const householdId = await getOrCreateHousehold()

  const { data: recordatorios } = await supabase
    .from('recordatorios')
    .select('*')
    .eq('household_id', householdId)
    .order('fecha', { ascending: true })

  return (
    <div className="flex flex-col gap-6 max-w-3xl pb-20">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Recordatorios</h1>
        <p className="text-ink-soft">Vacunas, cirugías, citas — todo lo que no quieres olvidar.</p>
      </div>

      <ListaRecordatorios recordatorios={recordatorios ?? []} />

      <NuevoRecordatorioFloating householdId={householdId} />
    </div>
  )
}
