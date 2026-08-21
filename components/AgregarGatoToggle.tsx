'use client'

import { useState } from 'react'
import { NuevoGatoForm } from './NuevoGatoForm'

export function AgregarGatoToggle({ householdId }: { householdId: string }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className="card-michi">
      {!abierto ? (
        <button className="btn-secondary" onClick={() => setAbierto(true)}>
          + Agregar gato
        </button>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-display font-semibold">Nuevo gato</h2>
            <button
              className="text-ink-soft text-sm hover:text-ink"
              onClick={() => setAbierto(false)}
            >
              Cancelar
            </button>
          </div>
          <NuevoGatoForm householdId={householdId} onGuardado={() => setAbierto(false)} />
        </>
      )}
    </div>
  )
}
