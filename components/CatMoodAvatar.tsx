'use client'

import { useEffect, useState } from 'react'
import { CatAvatar, type ColorPelajeKey, type PatronPelaje, type OjosKey } from './CatAvatar'

const ESTADOS = [
  '¡Hola!',
  'Miau~',
  'Zzz…',
  'Ronroneo',
  'Olfateando',
  'Acicalándose',
  'Estirándose',
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
    const id = setInterval(() => {
      setIndice((i) => (i + 1) % ESTADOS.length)
    }, 60000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col items-center gap-1">
      <CatAvatar
        colorPelaje={(gato.color_pelaje as ColorPelajeKey) ?? 'naranja_blanco'}
        patron={(gato.patron_pelaje as PatronPelaje) ?? 'atigrado'}
        ojos={(gato.ojos as OjosKey) ?? 'cafe'}
        size={64}
      />
      <p className="text-xs font-semibold text-ink">{gato.nombre}</p>
      <p key={indice} className="text-[11px] text-rose-700 font-display animate-[fadeIn_0.3s_ease-out]">
        {ESTADOS[indice]}
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
