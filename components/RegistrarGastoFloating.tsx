'use client'

import { FloatingAddButton } from './FloatingAddButton'
import { RegistrarGastoForm } from './RegistrarGastoForm'

type Categoria = { id: string; nombre: string; icono: string }
type Gato = { id: string; nombre: string }

export function RegistrarGastoFloating({
  householdId,
  categorias,
  gatos,
}: {
  householdId: string
  categorias: Categoria[]
  gatos: Gato[]
}) {
  return (
    <FloatingAddButton label="Registrar compra">
      {(cerrar) => (
        <RegistrarGastoForm
          householdId={householdId}
          categorias={categorias}
          gatos={gatos}
          onGuardado={cerrar}
        />
      )}
    </FloatingAddButton>
  )
}
