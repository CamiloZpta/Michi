export type Gasto = {
  id: string
  categoria_id: string
  producto: string
  precio: number
  cantidad_total: number
  unidad: string
  fecha: string // ISO date
}

export type Categoria = {
  id: string
  nombre: string
  es_consumible: boolean
  icono: string
}

/** Normaliza gramos -> kg, igual que la app original. */
export function normalizarCantidad(cantidad: number, unidad: string): { cantidad: number; unidad: string } {
  const u = unidad.trim().toLowerCase()
  if (['gr', 'g', 'gramos'].includes(u)) {
    return { cantidad: cantidad / 1000, unidad: 'kg' }
  }
  return { cantidad, unidad: u }
}

/**
 * Estima el consumo diario promedio y los días restantes de inventario
 * para una categoría consumible, a partir de su historial de compras.
 * Misma lógica que analizar_inventario_y_alertas() en main.py.
 */
export function estimarInventario(gastosCategoria: Gasto[]) {
  const compras = [...gastosCategoria].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  )

  if (compras.length < 2) {
    return { suficienteHistorial: false as const, registros: compras.length }
  }

  const consumosDiarios: number[] = []
  for (let i = 1; i < compras.length; i++) {
    const dias =
      (new Date(compras[i].fecha).getTime() - new Date(compras[i - 1].fecha).getTime()) /
      (1000 * 60 * 60 * 24)
    const cantidadConsumida = compras[i - 1].cantidad_total
    if (dias > 0) consumosDiarios.push(cantidadConsumida / dias)
  }

  const consumoDiarioPromedio =
    consumosDiarios.reduce((a, b) => a + b, 0) / (consumosDiarios.length || 1)

  const ultimaCompra = compras[compras.length - 1]
  const diasDuracionEstimada =
    consumoDiarioPromedio > 0 ? ultimaCompra.cantidad_total / consumoDiarioPromedio : 0

  const fechaUltimaCompra = new Date(ultimaCompra.fecha)
  const fechaAgotamiento = new Date(fechaUltimaCompra)
  fechaAgotamiento.setDate(fechaAgotamiento.getDate() + Math.round(diasDuracionEstimada))

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const diasRestantes = Math.round(
    (fechaAgotamiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  )

  return {
    suficienteHistorial: true as const,
    consumoDiarioPromedio,
    fechaAgotamiento,
    diasRestantes,
    unidad: ultimaCompra.unidad,
    diasDuracionEstimada,
  }
}

/** Gasto total de un rango de fechas [inicio, fin) sobre un arreglo de gastos. */
export function totalEnRango(gastos: Gasto[], inicio: Date, fin: Date) {
  return gastos
    .filter((g) => {
      const f = new Date(g.fecha)
      return f >= inicio && f < fin
    })
    .reduce((sum, g) => sum + g.precio, 0)
}

export function costoDiarioPorGato(gastoTotalMes: number, numGatos: number, diasDelMes = 30) {
  if (numGatos <= 0) return 0
  return gastoTotalMes / diasDelMes / numGatos
}

export function calcularEdad(fechaNacimiento: string | null): string {
  if (!fechaNacimiento) return 'Edad desconocida'
  const nacimiento = new Date(fechaNacimiento)
  const hoy = new Date()
  let años = hoy.getFullYear() - nacimiento.getFullYear()
  let meses = hoy.getMonth() - nacimiento.getMonth()
  if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) {
    años--
    meses += 12
  }
  if (años < 1) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`
  return `${años} ${años === 1 ? 'año' : 'años'}${meses > 0 ? ` y ${meses} m.` : ''}`
}
