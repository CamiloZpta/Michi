'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Categoria = { id: string; nombre: string; icono: string }
type Gato = { id: string; nombre: string }

export function RegistrarGastoForm({
  householdId,
  categorias,
  gatos,
  onGuardado,
}: {
  householdId: string
  categorias: Categoria[]
  gatos: Gato[]
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

    const { error } = await supabase.from('gastos').insert({
      household_id: householdId,
      categoria_id: form.get('categoria_id'),
      cat_id: form.get('cat_id') || null,
      producto: form.get('producto'),
      precio: Number(form.get('precio')),
      cantidad_total: Number(form.get('cantidad_total')),
      unidad: form.get('unidad'),
      fecha: form.get('fecha'),
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
      <div className="min-w-0">
        <label className="label-michi">Categoría</label>
        <select name="categoria_id" required className="input-michi">
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icono} {c.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-0">
        <label className="label-michi">¿Para cuál gato? (opcional)</label>
        <select name="cat_id" className="input-michi">
          <option value="">General / ambos</option>
          {gatos.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2 min-w-0">
        <label className="label-michi">Producto</label>
        <input name="producto" required className="input-michi" placeholder="Ej. Croquetas salmón 3kg" />
      </div>
      <div className="min-w-0">
        <label className="label-michi">Precio</label>
        <input name="precio" type="number" step="0.01" min="0" required className="input-michi" />
      </div>
      <div className="min-w-0">
        <label className="label-michi">Fecha</label>
        <input name="fecha" type="date" defaultValue={hoy} required className="input-michi" />
      </div>
      <div className="min-w-0">
        <label className="label-michi">Cantidad</label>
        <input name="cantidad_total" type="number" step="0.01" min="0" required className="input-michi" />
      </div>
      <div className="min-w-0">
        <label className="label-michi">Unidad</label>
        <select name="unidad" className="input-michi">
          <option value="kg">kg</option>
          <option value="gr">gr</option>
          <option value="unidades">unidades</option>
          <option value="l">litros</option>
        </select>
      </div>

      <div className="sm:col-span-2 flex items-center gap-4">
        <button type="submit" disabled={guardando} className="btn-primary">
          {guardando ? 'Guardando…' : 'Guardar gasto'}
        </button>
        {mensaje && <span className="text-sm text-alerta">{mensaje}</span>}
      </div>
    </form>
  )
}
