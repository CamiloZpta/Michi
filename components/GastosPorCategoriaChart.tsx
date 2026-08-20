'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORES = ['#DCAAA4', '#C3D0AC', '#C0837D', '#93A776', '#EFD6D1', '#9C6259']

export function GastosPorCategoriaChart({
  data,
}: {
  data: { nombre: string; total: number }[]
}) {
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="nombre"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORES[i % COLORES.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) =>
              value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
            }
            contentStyle={{ borderRadius: 12, border: '1px solid #EFD6D1', fontFamily: 'var(--font-jakarta)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
