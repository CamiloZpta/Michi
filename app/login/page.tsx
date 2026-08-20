'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PawLogo } from '@/components/PawLogo'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [modo, setModo] = useState<'login' | 'signup'>('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [codigoInvitacion, setCodigoInvitacion] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setCargando(true)

    if (modo === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/')
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else if (data.user) {
        // Guarda el nombre en su perfil (solo funciona si hay sesión inmediata,
        // es decir si la confirmación por correo está desactivada en Supabase).
        if (data.session) {
          await supabase.from('profiles').upsert({ id: data.user.id, nombre })
        }
        if (codigoInvitacion) {
          document.cookie = `michi_invite=${codigoInvitacion}; path=/; max-age=3600`
        }
        router.push('/')
      }
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-beige-100 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <PawLogo size={48} className="text-rose-500 mb-1" />
          <h1 className="logo-wordmark text-5xl">Michi</h1>
          <p className="text-ink-soft text-sm mt-2">Gastos y cuidado de tus gatos, en familia</p>
        </div>

        <div className="card-michi">
          <div className="flex bg-beige-100 rounded-full p-1 mb-6">
            <button
              className={`flex-1 py-2 text-sm rounded-full font-display font-semibold transition-colors ${modo === 'login' ? 'bg-rose-500 text-beige-50' : 'text-ink-soft'}`}
              onClick={() => setModo('login')}
              type="button"
            >
              Iniciar sesión
            </button>
            <button
              className={`flex-1 py-2 text-sm rounded-full font-display font-semibold transition-colors ${modo === 'signup' ? 'bg-rose-500 text-beige-50' : 'text-ink-soft'}`}
              onClick={() => setModo('signup')}
              type="button"
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {modo === 'signup' && (
              <div>
                <label className="label-michi">Tu nombre</label>
                <input
                  type="text"
                  required
                  className="input-michi"
                  placeholder="Ej. Ana"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="label-michi">Correo</label>
              <input
                type="email"
                required
                className="input-michi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label-michi">Contraseña</label>
              <input
                type="password"
                required
                minLength={6}
                className="input-michi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {modo === 'signup' && (
              <div>
                <label className="label-michi">Código de invitación (opcional)</label>
                <input
                  type="text"
                  placeholder="Déjalo vacío si vas a crear el hogar"
                  className="input-michi"
                  value={codigoInvitacion}
                  onChange={(e) => setCodigoInvitacion(e.target.value)}
                />
                <p className="text-xs text-ink-soft mt-1">
                  Si alguien de tu hogar ya lo creó, pídele el código para unirte y compartir los gatos.
                </p>
              </div>
            )}

            {error && <p className="text-sm text-alerta">{error}</p>}

            <button type="submit" disabled={cargando} className="btn-primary mt-2">
              {cargando ? 'Un momento…' : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
