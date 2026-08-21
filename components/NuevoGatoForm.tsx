'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  CatAvatar,
  COLOR_PELAJE_PRESETS,
  OJOS_PRESETS,
  type ColorPelajeKey,
  type PatronPelaje,
  type OjosKey,
} from './CatAvatar'

export function NuevoGatoForm({
  householdId,
  onGuardado,
}: {
  householdId: string
  onGuardado?: () => void
}) {
  const router = useRouter()
  const supabase = createClient()
  const [guardando, setGuardando] = useState(false)
  const [colorPelaje, setColorPelaje] = useState<ColorPelajeKey>('naranja_blanco')
  const [patron, setPatron] = useState<PatronPelaje>('atigrado')
  const [ojos, setOjos] = useState<OjosKey>('cafe')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setGuardando(true)
    const form = new FormData(e.currentTarget)

    const { error } = await supabase.from('cats').insert({
      household_id: householdId,
      nombre: form.get('nombre'),
      sexo: form.get('sexo') || null,
      fecha_nacimiento_aprox: form.get('fecha_nacimiento_aprox') || null,
      contextura: form.get('contextura'),
      color_pelaje: colorPelaje,
      patron_pelaje: patron,
      ojos,
    })

    setGuardando(false)
    if (!error) {
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
      onGuardado?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
      <div className="flex flex-col items-center gap-2">
        <CatAvatar colorPelaje={colorPelaje} patron={patron} ojos={ojos} size={100} />
        <span className="text-xs text-ink-soft">Vista previa</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        <div className="min-w-0">
          <label className="label-michi">Nombre</label>
          <input name="nombre" required className="input-michi" placeholder="Nombre del gato" />
        </div>
        <div className="min-w-0">
          <label className="label-michi">Sexo</label>
          <select name="sexo" className="input-michi">
            <option value="">No especificado</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>
        </div>
        <div className="min-w-0">
          <label className="label-michi">Fecha de nacimiento aprox.</label>
          <input name="fecha_nacimiento_aprox" type="date" className="input-michi" />
        </div>
        <div className="min-w-0">
          <label className="label-michi">Contextura</label>
          <select name="contextura" className="input-michi" defaultValue="normal">
            <option value="delgado">Delgado</option>
            <option value="normal">Normal</option>
            <option value="robusto">Robusto</option>
            <option value="sobrepeso">Con sobrepeso</option>
          </select>
        </div>
        <div className="min-w-0">
          <label className="label-michi">Color de pelaje</label>
          <select
            className="input-michi"
            value={colorPelaje}
            onChange={(e) => setColorPelaje(e.target.value as ColorPelajeKey)}
          >
            {Object.entries(COLOR_PELAJE_PRESETS).map(([key, preset]) => (
              <option key={key} value={key}>
                {preset.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label className="label-michi">Patrón</label>
          <select
            className="input-michi"
            value={patron}
            onChange={(e) => setPatron(e.target.value as PatronPelaje)}
          >
            <option value="solido">Sólido</option>
            <option value="atigrado">Atigrado</option>
            <option value="manchado">Manchado</option>
            <option value="bicolor">Bicolor</option>
            <option value="colorpoint">Point (orejas/cara oscuras, tipo siamés)</option>
          </select>
        </div>
        <div className="min-w-0">
          <label className="label-michi">Color de ojos</label>
          <select
            className="input-michi"
            value={ojos}
            onChange={(e) => setOjos(e.target.value as OjosKey)}
          >
            <option value="cafe">Café / ámbar oscuro</option>
            <option value="azul">Azul</option>
            <option value="verde">Verde</option>
            <option value="ambar">Ámbar claro</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <button type="submit" disabled={guardando} className="btn-primary">
            {guardando ? 'Guardando…' : 'Crear perfil'}
          </button>
        </div>
      </div>
    </form>
  )
}
