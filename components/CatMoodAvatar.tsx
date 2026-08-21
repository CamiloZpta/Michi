'use client'

import { useEffect, useState } from 'react'
import { CatAvatar, type ColorPelajeKey, type PatronPelaje, type OjosKey } from './CatAvatar'

const ESTADOS = [
  { emoji: '👋', texto: '¡Hola!' },
  { emoji: '😺', texto: 'Miau~' },
  { emoji: '💤', texto: 'Zzz…' },
  { emoji: '🐾', texto: 'Ronroneo' },
]

type Gato = {
  id: string
  nombre: string
  color_pelaje: string | null
  patron_pelaje: string | null
  ojos: string | null
}

function AvatarConEstado({ gato }: { gato: Gato }) {
  const [indice, setIndice] = useState(() => Math.floor(Math.random() * ESTADOS.length))

  useEffect(() => {
    const duracion = 3500 + Math.random() * 2500
    const id = setInterval(() => {
      setIndice((i) => (i + 1) % ESTADOS.length)
    }, duracion)
    return () => clearInterval(id)
  }, [])

  const estado = ESTADOS[indice]

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <CatAvatar
          colorPelaje={(gato.color_pelaje as ColorPelajeKey) ?? 'naranja_blanco'}
          patron={(gato.patron_pelaje as PatronPelaje) ?? 'atigrado'}
          ojos={(gato.ojos as OjosKey) ?? 'cafe'}
          size={64}
        />
        <span
          key={indice}
          className="absolute -top-1 -right-2 text-lg animate-[fadeIn_0.3s_ease-out]"
          aria-hidden
        >
          {estado.emoji}
        </span>
      </div>
      <p className="text-xs font-semibold text-ink">{gato.nombre}</p>
      <p key={`t-${indice}`} className="text-[11px] text-rose-700 font-display animate-[fadeIn_0.3s_ease-out]">
        {estado.texto}
      </p>
    </div>
  )
}

export function CatMoodRow({ gatos }: { gatos: Gato[] }) {
  return (
    <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
      {gatos.map((gato) => (
        <AvatarConEstado key={gato.id} gato={gato} />
      ))}
    </div>
  )
}
