'use client'

import { useState } from 'react'
import { CatAvatar, type ColorPelajeKey, type PatronPelaje } from './CatAvatar'
import { calcularEdad } from '@/lib/metrics'
import { RegistrarPesoForm } from './RegistrarPesoForm'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type CatWeight = { peso_kg: number; fecha: string }
type Gato = {
  id: string
  nombre: string
  sexo: 'macho' | 'hembra' | null
  fecha_nacimiento_aprox: string | null
  contextura: string | null
  color_pelaje: string | null
  patron_pelaje: string | null
  cat_weights: CatWeight[]
}

const CONTEXTURA_LABEL: Record<string, string> = {
  delgado: 'Delgado',
  normal: 'Normal',
  robusto: 'Robusto',
  sobrepeso: 'Con sobrepeso',
}

export function CatCard({ gato }: { gato: Gato }) {
  const [mostrarPeso, setMostrarPeso] = useState(false)

  const pesos = [...(gato.cat_weights ?? [])].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  )
  const pesoActual = pesos[pesos.length - 1]?.peso_kg

  return (
    <div className="card-michi flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <CatAvatar
          colorPelaje={(gato.color_pelaje as ColorPelajeKey) ?? 'naranja_blanco'}
          patron={(gato.patron_pelaje as PatronPelaje) ?? 'atigrado'}
          size={72}
        />
        <div>
          <h3 className="text-xl font-display font-semibold">{gato.nombre}</h3>
          <p className="text-sm text-ink-soft">
            {gato.sexo === 'macho' ? '♂ Macho' : gato.sexo === 'hembra' ? '♀ Hembra' : 'Sexo no definido'}
            {' · '}
            {calcularEdad(gato.fecha_nacimiento_aprox)}
          </p>
          <p className="text-sm text-ink-soft">
            {CONTEXTURA_LABEL[gato.contextura ?? 'normal']}
            {pesoActual ? ` · ${pesoActual} kg` : ''}
          </p>
        </div>
      </div>

      {pesos.length >= 2 && (
        <div style={{ width: '100%', height: 120 }}>
          <ResponsiveContainer>
            <LineChart data={pesos}>
              <XAxis dataKey="fecha" hide />
              <YAxis domain={['auto', 'auto']} width={30} fontSize={11} stroke="#7A6A62" />
              <Tooltip
                labelFormatter={(v) => new Date(v).toLocaleDateString('es-CO')}
                formatter={(v: number) => [`${v} kg`, 'Peso']}
                contentStyle={{ borderRadius: 12, border: '1px solid #EFD6D1' }}
              />
              <Line type="monotone" dataKey="peso_kg" stroke="#93A776" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <button
        className="btn-secondary self-start text-sm py-1.5 px-4"
        onClick={() => setMostrarPeso((v) => !v)}
      >
        {mostrarPeso ? 'Cancelar' : '+ Registrar peso'}
      </button>
      {mostrarPeso && <RegistrarPesoForm catId={gato.id} onGuardado={() => setMostrarPeso(false)} />}
    </div>
  )
}
