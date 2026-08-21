'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function EliminarCuentaButton() {
  const router = useRouter()
  const supabase = createClient()
  const [confirmando, setConfirmando] = useState(false)
  const [texto, setTexto] = useState('')
  const [eliminando, setEliminando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function eliminar() {
    setEliminando(true)
    setError(null)
    const { error } = await supabase.rpc('delete_my_account')
    if (error) {
      setError(error.message)
      setEliminando(false)
      return
    }
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!confirmando) {
    return (
      <button
        className="text-sm text-alerta font-semibold hover:underline"
        onClick={() => setConfirmando(true)}
      >
        Eliminar mi cuenta
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3 border-2 border-alerta/30 rounded-2xl p-4 bg-alerta/5">
      <p className="text-sm text-ink">
        Esta acción es permanente. Escribe <strong>ELIMINAR</strong> para confirmar.
      </p>
      <input
        className="input-michi"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="ELIMINAR"
      />
      {error && <p className="text-sm text-alerta">{error}</p>}
      <div className="flex gap-2">
        <button
          className="btn-secondary text-sm py-1.5 px-4"
          onClick={() => {
            setConfirmando(false)
            setTexto('')
            setError(null)
          }}
        >
          Cancelar
        </button>
        <button
          className="bg-alerta text-beige-50 rounded-full px-5 py-1.5 text-sm font-display font-semibold disabled:opacity-50 transition-opacity"
          disabled={texto !== 'ELIMINAR' || eliminando}
          onClick={eliminar}
        >
          {eliminando ? 'Eliminando…' : 'Sí, eliminar definitivamente'}
        </button>
      </div>
    </div>
  )
}
