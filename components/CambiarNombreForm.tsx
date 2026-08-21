'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function CambiarNombreForm({ nombreActual }: { nombreActual: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [nombre, setNombre] = useState(nombreActual)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from('profiles').upsert({ id: user!.id, nombre })

    setGuardando(false)
    setMensaje(error ? `Error: ${error.message}` : 'Guardado ✅')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:items-end">
      <div className="flex-1">
        <label className="label-michi">Tu nombre</label>
        <input
          className="input-michi"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={guardando} className="btn-primary">
        {guardando ? 'Guardando…' : 'Guardar'}
      </button>
      {mensaje && <span className="text-sm text-ink-soft">{mensaje}</span>}
    </form>
  )
}
