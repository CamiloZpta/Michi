'use client'

import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { Gasto, Categoria } from '@/lib/metrics'

export function TendenciaChart({ gastos, categorias }: { gastos: Gasto[]; categorias: Categoria[] }) {
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? '')

  const datos = useMemo(() => {
    // Agrupa por fecha dentro de la categoría (varias compras el mismo día se suman)
    const porFecha = new Map<string, { precio: number; cantidad: number }>()
    gastos
      .filter((g) => g.categoria_id === categoriaId)
      .forEach((g) => {
        const key = g.fecha
        const prev = porFecha.get(key) ?? { precio: 0, cantidad: 0 }
        porFecha.set(key, { precio: prev.precio + g.precio, cantidad: prev.cantidad + g.cantidad_total })
      })

    return Array.from(porFecha.entries())
      .map(([fecha, { precio, cantidad }]) => ({
        fecha: new Date(fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }),
        precioPorUnidad: cantidad > 0 ? Math.round(precio / cantidad) : 0,
      }))
      .sort((a, b) => (a.fecha > b.fecha ? 1 : -1))
  }, [gastos, categoriaId])

  if (categorias.length === 0) {
    return <p className="text-sm text-ink-soft">Crea una categoría consumible (ej. Alimento, Arena) para ver su tendencia.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <select
        className="input-michi max-w-xs"
        value={categoriaId}
        onChange={(e) => setCategoriaId(e.target.value)}
      >
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.icono} {c.nombre}
          </option>
        ))}
      </select>

      {datos.length >= 2 ? (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={datos}>
              <CartesianGrid stroke="#F3ECE1" />
              <XAxis dataKey="fecha" stroke="#7A6A62" fontSize={12} />
              <YAxis stroke="#7A6A62" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #EFD6D1' }} />
              <Line type="monotone" dataKey="precioPorUnidad" stroke="#9C6259" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-ink-soft">
          Se necesitan al menos 2 compras de esta categoría para ver la tendencia.
        </p>
      )}
    </div>
  )
}
