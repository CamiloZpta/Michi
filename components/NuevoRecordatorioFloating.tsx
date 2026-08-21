'use client'

import { FloatingAddButton } from './FloatingAddButton'
import { NuevoRecordatorioForm } from './NuevoRecordatorioForm'

export function NuevoRecordatorioFloating({ householdId }: { householdId: string }) {
  return (
    <FloatingAddButton label="Nuevo recordatorio">
      {(cerrar) => <NuevoRecordatorioForm householdId={householdId} onGuardado={cerrar} />}
    </FloatingAddButton>
  )
}
