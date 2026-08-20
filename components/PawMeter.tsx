import { PawLogo } from './PawLogo'

/**
 * Medidor de huellitas: el elemento de firma visual de Michi.
 * En vez de una barra de progreso genérica, muestra el inventario
 * restante como una fila de huellas que se van "llenando".
 *
 * diasRestantes / diasReferencia definen cuántas de las `total` huellas
 * se pintan como llenas. diasReferencia = duración típica de una compra
 * (por defecto 30 días) para que el medidor tenga una escala estable.
 */
export function PawMeter({
  diasRestantes,
  diasReferencia = 30,
  total = 8,
  critico = 4,
}: {
  diasRestantes: number
  diasReferencia?: number
  total?: number
  critico?: number
}) {
  const proporcion = Math.max(0, Math.min(1, diasRestantes / diasReferencia))
  const llenas = Math.round(proporcion * total)
  const esCritico = diasRestantes <= critico

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <PawLogo
            key={i}
            size={20}
            className={
              i < llenas
                ? esCritico
                  ? 'text-alerta'
                  : 'text-rose-500'
                : 'text-rose-100'
            }
          />
        ))}
      </div>
      <p className={`text-sm font-medium ${esCritico ? 'text-alerta' : 'text-ink-soft'}`}>
        {diasRestantes > 0
          ? `${diasRestantes} días restantes aprox.`
          : '¡Sin existencias estimadas!'}
      </p>
    </div>
  )
}
