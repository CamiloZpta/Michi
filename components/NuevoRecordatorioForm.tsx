'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function NuevoRecordatorioForm({
  householdId,
  onGuardado,
}: {
  householdId: string
  onGuardado?: () => void
}) {
  const router = useRouter()
  const supabase = createClient()
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)
    const form = new FormData(e.currentTarget)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase.from('recordatorios').insert({
      household_id: householdId,
      nombre: form.get('nombre'),
      descripcion: form.get('descripcion') || null,
      fecha: form.get('fecha'),
      hora: form.get('hora') || null,
      lugar: form.get('lugar') || null,
      created_by: user?.id,
    })

    setGuardando(false)
    if (error) {
      setMensaje(`Error: ${error.message}`)
    } else {
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
      onGuardado?.()
    }
  }

  const hoy = new Date().toISOString().slice(0, 10)

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2 min-w-0">
        <label className="label-michi">Nombre del evento</label>
        <input name="nombre" required className="input-michi" placeholder="Ej. Vacuna triple felina" />
      </div>
      <div className="sm:col-span-2 min-w-0">
        <label className="label-michi">Descripción (opcional)</label>
        <textarea name="descripcion" className="input-michi" rows={2} />
      </div>
      <div className="min-w-0">
        <label className="label-michi">Fecha</label>
        <input name="fecha" type="date" defaultValue={hoy} required className="input-michi" />
      </div>
      <div className="min-w-0">
        <label className="label-michi">Hora (opcional)</label>
        <input name="hora" type="time" className="input-michi" />
      </div>
      <div className="sm:col-span-2 min-w-0">
        <label className="label-michi">Lugar (opcional)</label>
        <input name="lugar" className="input-michi" placeholder="Ej. Veterinaria Huellitas" />
      </div>

      <div className="sm:col-span-2 flex items-center gap-4">
        <button type="submit" disabled={guardando} className="btn-primary">
          {guardando ? 'Guardando…' : 'Guardar recordatorio'}
        </button>
        {mensaje && <span className="text-sm text-alerta">{mensaje}</span>}
      </div>
    </form>
  )
}
