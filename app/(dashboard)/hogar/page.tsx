import { createClient } from '@/lib/supabase/server'
import { getOrCreateHousehold } from '@/lib/household'
import { InviteCodeCard } from '@/components/InviteCodeCard'

export const dynamic = 'force-dynamic'

export default async function HogarPage() {
  const supabase = createClient()
  const householdId = await getOrCreateHousehold()

  const { data: household } = await supabase
    .from('households')
    .select('nombre')
    .eq('id', householdId)
    .single()

  const { data: miembros } = await supabase
    .from('household_members')
    .select('user_id, rol, joined_at')
    .eq('household_id', householdId)

  const userIds = (miembros ?? []).map((m) => m.user_id)
  const { data: perfiles } = await supabase
    .from('profiles')
    .select('id, nombre')
    .in('id', userIds.length > 0 ? userIds : ['00000000-0000-0000-0000-000000000000'])

  const nombrePorId = new Map((perfiles ?? []).map((p) => [p.id, p.nombre]))

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">{household?.nombre ?? 'Nuestro hogar'}</h1>
        <p className="text-ink-soft">Quiénes tienen acceso a los datos de los gatos de la casa.</p>
      </div>

      <div className="card-michi">
        <h2 className="text-xl font-display font-semibold mb-4">👥 Papás gatunos</h2>
        <ul className="flex flex-col gap-2">
          {(miembros ?? []).map((m) => (
            <li key={m.user_id} className="flex justify-between text-sm border-b border-rose-50 py-2.5">
              <span>{nombrePorId.get(m.user_id) ?? 'Sin nombre'}</span>
              <span className="capitalize text-ink-soft">{m.rol}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-michi">
        <h2 className="text-xl font-display font-semibold mb-2">✉️ Invitar a alguien</h2>
        <p className="text-sm text-ink-soft mb-4">
          Genera un código, compártelo, y la otra persona lo ingresa al crear su cuenta en Michi
          para unirse a este mismo hogar y ver/editar todo lo de los gatos.
        </p>
        <InviteCodeCard householdId={householdId} />
      </div>
    </div>
  )
}
