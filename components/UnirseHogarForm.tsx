'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function UnirseHogarForm() {
  const router = useRouter()
  const supabase = createClient()
  const [codigo, setCodigo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCargando(true)
    setMensaje(null)

    const { error } = await supabase.rpc('join_household_by_code', {
      codigo_invitacion: codigo.trim(),
    })

    setCargando(false)
    if (error) {
      setMensaje({ tipo: 'error', texto: error.message })
    } else {
      setMensaje({ tipo: 'ok', texto: '¡Listo! Ya eres parte de ese hogar.' })
      setCodigo('')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <label className="label-michi">Código de invitación</label>
          <input
            className="input-michi"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={cargando} className="btn-primary">
          {cargando ? 'Uniendo…' : 'Unirme'}
        </button>
      </div>
      {mensaje && (
        <p className={`text-sm ${mensaje.tipo === 'error' ? 'text-alerta' : 'text-ink-soft'}`}>
          {mensaje.texto}
        </p>
      )}
    </form>
  )
}
