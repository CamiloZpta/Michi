import { createClient } from '@/lib/supabase/server'
import { getOrCreateHousehold } from '@/lib/household'
import { estimarInventario, totalEnRango, costoDiarioPorGato, type Gasto } from '@/lib/metrics'
import { PawMeter } from '@/components/PawMeter'
import { GastosPorCategoriaChart } from '@/components/GastosPorCategoriaChart'
import { CatMoodRow } from '@/components/CatMoodAvatar'

export const dynamic = 'force-dynamic'

export default async function ResumenPage() {
  const supabase = createClient()
  const householdId = await getOrCreateHousehold()

  const [{ data: gastos }, { data: categorias }, { data: gatos }] = await Promise.all([
    supabase.from('gastos').select('*').eq('household_id', householdId).order('fecha'),
    supabase.from('categorias').select('*').eq('household_id', householdId),
    supabase
      .from('cats')
      .select('id, nombre, color_pelaje, patron_pelaje, ojos')
      .eq('household_id', householdId)
      .eq('activo', true),
  ])

  const todosGastos = (gastos ?? []) as Gasto[]
  const todasCategorias = categorias ?? []
  const numGatos = gatos?.length || 1

  const ahora = new Date()
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1)
  const inicioAnio = new Date(ahora.getFullYear(), 0, 1)
  const finAnio = new Date(ahora.getFullYear() + 1, 0, 1)

  const gastoMes = totalEnRango(todosGastos, inicioMes, finMes)
  const gastoAnio = totalEnRango(todosGastos, inicioAnio, finAnio)

  const categoriasConsumibles = todasCategorias.filter((c) => c.es_consumible)
  const idsConsumibles = new Set(categoriasConsumibles.map((c) => c.id))
  // El costo diario por gato solo cuenta lo esencial (alimento, arena, y
  // cualquier otra categoría marcada como "consumible") -- juguetes, salud
  // u otros gastos puntuales no deberían inflar este número.
  const gastosEsencialesMes = todosGastos.filter((g) => idsConsumibles.has(g.categoria_id))
  const gastoEsencialMes = totalEnRango(gastosEsencialesMes, inicioMes, finMes)
  const costoDiario = costoDiarioPorGato(gastoEsencialMes, numGatos)

  const gastosPorCategoriaMap = new Map<string, { nombre: string; total: number }>()
  for (const g of todosGastos.filter((g) => new Date(g.fecha) >= inicioMes && new Date(g.fecha) < finMes)) {
    const cat = todasCategorias.find((c) => c.id === g.categoria_id)
    const nombre = cat?.nombre ?? 'Otros'
    const prev = gastosPorCategoriaMap.get(nombre)?.total ?? 0
    gastosPorCategoriaMap.set(nombre, { nombre, total: prev + g.precio })
  }
  const gastosPorCategoria = Array.from(gastosPorCategoriaMap.values())

  const fmt = (n: number) =>
    n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Resumen</h1>
        <p className="text-ink-soft">Cómo van las cuentas de la casa este mes.</p>
      </div>

      {(gatos ?? []).length > 0 && (
        <div className="card-michi">
          <CatMoodRow gatos={gatos ?? []} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-michi">
          <p className="label-michi">Gasto del mes</p>
          <p className="stat-number">{fmt(gastoMes)}</p>
        </div>
        <div className="card-michi">
          <p className="label-michi">Costo diario por gato</p>
          <p className="stat-number">{fmt(costoDiario)}</p>
          <p className="text-xs text-ink-soft mt-1">
            Alimento + arena ÷ {numGatos} {numGatos === 1 ? 'gato' : 'gatos'}
          </p>
        </div>
        <div className="card-michi">
          <p className="label-michi">Acumulado del año</p>
          <p className="stat-number">{fmt(gastoAnio)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoriasConsumibles.map((cat) => {
          const gastosCat = todosGastos.filter((g) => g.categoria_id === cat.id)
          const est = estimarInventario(gastosCat)
          return (
            <div key={cat.id} className="card-michi">
              <p className="label-michi">
                {cat.icono} Inventario de {cat.nombre}
              </p>
              {est.suficienteHistorial ? (
                <PawMeter diasRestantes={est.diasRestantes} />
              ) : (
                <p className="text-sm text-ink-soft">
                  Faltan registros ({est.registros}/2) para estimar el consumo.
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="card-michi">
        <p className="label-michi mb-4">Distribución de gastos de este mes</p>
        {gastosPorCategoria.length > 0 ? (
          <GastosPorCategoriaChart data={gastosPorCategoria} />
        ) : (
          <p className="text-sm text-ink-soft">Aún no hay gastos registrados este mes.</p>
        )}
      </div>
    </div>
  )
}
