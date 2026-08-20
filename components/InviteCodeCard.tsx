'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function generarCodigo() {
  return Array.from({ length: 8 }, () =>
    '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 32)]
  ).join('')
}

export function InviteCodeCard({ householdId }: { householdId: string }) {
  const supabase = createClient()
  const [codigo, setCodigo] = useState<string | null>(null)
  const [generando, setGenerando] = useState(false)

  async function crear() {
    setGenerando(true)
    const nuevoCodigo = generarCodigo()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from('household_invites').insert({
      household_id: householdId,
      codigo: nuevoCodigo,
      created_by: user?.id,
    })

    setGenerando(false)
    if (!error) setCodigo(nuevoCodigo)
  }

  return (
    <div className="flex flex-col gap-3">
      {codigo ? (
        <div className="flex items-center gap-3">
          <code className="bg-beige-100 border border-rose-100 rounded-xl px-4 py-2 text-lg font-mono tracking-widest">
            {codigo}
          </code>
          <span className="text-xs text-ink-soft">Válido por 7 días</span>
        </div>
      ) : (
        <button onClick={crear} disabled={generando} className="btn-primary self-start">
          {generando ? 'Generando…' : 'Generar código de invitación'}
        </button>
      )}
    </div>
  )
}
