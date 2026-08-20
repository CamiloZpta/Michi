'use client'

type GastoRow = {
  id: string
  fecha: string
  producto: string
  precio: number
  cantidad_total: number
  unidad: string
  categorias: { nombre: string; icono: string } | null
}

export function HistorialGastos({ gastos }: { gastos: GastoRow[] }) {
  if (gastos.length === 0) {
    return <p className="text-sm text-ink-soft">Todavía no hay gastos registrados.</p>
  }

  const fmt = (n: number) =>
    n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink-soft border-b border-rose-100">
            <th className="py-2 pr-4">Fecha</th>
            <th className="py-2 pr-4">Categoría</th>
            <th className="py-2 pr-4">Producto</th>
            <th className="py-2 pr-4">Cantidad</th>
            <th className="py-2 pr-4 text-right">Precio</th>
          </tr>
        </thead>
        <tbody>
          {gastos.map((g) => (
            <tr key={g.id} className="border-b border-rose-50">
              <td className="py-2 pr-4 whitespace-nowrap">
                {new Date(g.fecha).toLocaleDateString('es-CO')}
              </td>
              <td className="py-2 pr-4 whitespace-nowrap">
                {g.categorias?.icono} {g.categorias?.nombre}
              </td>
              <td className="py-2 pr-4">{g.producto}</td>
              <td className="py-2 pr-4 whitespace-nowrap font-mono">
                {g.cantidad_total} {g.unidad}
              </td>
              <td className="py-2 pr-4 text-right font-mono">{fmt(g.precio)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
