'use client'

import { useMemo, useState } from 'react'
import { HistorialGastos } from './HistorialGastos'

type GastoRow = {
  id: string
  fecha: string
  producto: string
  precio: number
  cantidad_total: number
  unidad: string
  categoria_id: string
  categorias: { nombre: string; icono: string } | null
}
type Categoria = { id: string; nombre: string; icono: string }

export function HistorialGastosFiltrable({
  gastos,
  categorias,
}: {
  gastos: GastoRow[]
  categorias: Categoria[]
}) {
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [categoriaId, setCategoriaId] = useState('todas')

  const filtrados = useMemo(() => {
    return gastos.filter((g) => {
      if (desde && g.fecha < desde) return false
      if (hasta && g.fecha > hasta) return false
      if (categoriaId !== 'todas' && g.categoria_id !== categoriaId) return false
      return true
    })
  }, [gastos, desde, hasta, categoriaId])

  const total = filtrados.reduce((sum, g) => sum + g.precio, 0)
  const fmt = (n: number) =>
    n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="min-w-0">
          <label className="label-michi">Desde</label>
          <input
            type="date"
            className="input-michi"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
        </div>
        <div className="min-w-0">
          <label className="label-michi">Hasta</label>
          <input
            type="date"
            className="input-michi"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
          />
        </div>
        <div className="min-w-0">
          <label className="label-michi">Categoría</label>
          <select
            className="input-michi"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            <option value="todas">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icono} {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(desde || hasta || categoriaId !== 'todas') && (
        <div className="flex items-center justify-between text-sm text-ink-soft">
          <span>
            {filtrados.length} {filtrados.length === 1 ? 'resultado' : 'resultados'} · Total {fmt(total)}
          </span>
          <button
            className="text-rose-700 font-semibold hover:underline"
            onClick={() => {
              setDesde('')
              setHasta('')
              setCategoriaId('todas')
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <HistorialGastos gastos={filtrados} />
    </div>
  )
}
