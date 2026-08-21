'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Hogar = {
  household_id: string
  rol: string
  households: { nombre: string } | { nombre: string }[] | null
}

function nombreDe(h: Hogar) {
  if (Array.isArray(h.households)) return h.households[0]?.nombre ?? 'Hogar'
  return h.households?.nombre ?? 'Hogar'
}

export function MisHogares({ hogares, activoId }: { hogares: Hogar[]; activoId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [cambiando, setCambiando] = useState<string | null>(null)

  async function activar(householdId: string) {
    setCambiando(householdId)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ hogar_activo_id: householdId }).eq('id', user!.id)
    setCambiando(null)
    router.refresh()
  }

  if (hogares.length === 0) {
    return <p className="text-sm text-ink-soft">Todavía no perteneces a ningún hogar.</p>
  }

  return (
    <ul className="flex flex-col gap-1">
      {hogares.map((h) => (
        <li
          key={h.household_id}
          className="flex items-center justify-between border-b border-rose-50 py-2.5 last:border-0"
        >
          <div>
            <p className="font-medium">{nombreDe(h)}</p>
            <p className="text-xs text-ink-soft capitalize">{h.rol}</p>
          </div>
          {h.household_id === activoId ? (
            <span className="sello-fecha">Activo</span>
          ) : (
            <button
              className="btn-secondary text-sm py-1.5 px-4"
              disabled={cambiando === h.household_id}
              onClick={() => activar(h.household_id)}
            >
              {cambiando === h.household_id ? '…' : 'Ver este hogar'}
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
