'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function RegistrarPesoForm({ catId, onGuardado }: { catId: string; onGuardado?: () => void }) {
  const router = useRouter()
  const supabase = createClient()
  const [guardando, setGuardando] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuardando(true)
    const form = new FormData(e.currentTarget)

    await supabase.from('cat_weights').insert({
      cat_id: catId,
      peso_kg: Number(form.get('peso_kg')),
      fecha: form.get('fecha'),
    })

    setGuardando(false)
    router.refresh()
    onGuardado?.()
  }

  const hoy = new Date().toISOString().slice(0, 10)

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div>
        <label className="label-michi">Peso (kg)</label>
        <input name="peso_kg" type="number" step="0.01" min="0" required className="input-michi" />
      </div>
      <div>
        <label className="label-michi">Fecha</label>
        <input name="fecha" type="date" defaultValue={hoy} required className="input-michi" />
      </div>
      <button type="submit" disabled={guardando} className="btn-primary">
        {guardando ? '…' : 'Guardar'}
      </button>
    </form>
  )
}
