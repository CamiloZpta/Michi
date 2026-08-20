// Presets de color de pelaje disponibles al crear el perfil de un gato.
// 'clave' se guarda en cats.color_pelaje; el resto es solo para pintar el avatar.
export const COLOR_PELAJE_PRESETS = {
  naranja: { nombre: 'Naranja / jengibre', piel: '#E3A45C', marcas: '#C97F35' },
  naranja_blanco: { nombre: 'Naranja y blanco', piel: '#F0C994', marcas: '#E3A45C' },
  negro: { nombre: 'Negro', piel: '#4A4038', marcas: '#2F2822' },
  gris: { nombre: 'Gris / azul ruso', piel: '#B8B0A8', marcas: '#9A9088' },
  gris_atigrado: { nombre: 'Gris atigrado', piel: '#C7C0B6', marcas: '#8A8177' },
  blanco: { nombre: 'Blanco', piel: '#F5EFE4', marcas: '#E3D9C6' },
  crema_puntos: { nombre: 'Crema con puntos grises (lynx point)', piel: '#F2EAD9', marcas: '#8C8073' },
  carey: { nombre: 'Carey (tricolor)', piel: '#D9B27C', marcas: '#5A4635' },
  gris_blanco: { nombre: 'Gris y blanco', piel: '#EDE7DD', marcas: '#B8B0A8' },
} as const

export type ColorPelajeKey = keyof typeof COLOR_PELAJE_PRESETS
export type PatronPelaje = 'solido' | 'atigrado' | 'manchado' | 'bicolor' | 'colorpoint'

export const OJOS_PRESETS = {
  cafe: '#4A3C36',
  azul: '#7FADC4',
  verde: '#7C9473',
  ambar: '#C0873F',
} as const
export type OjosKey = keyof typeof OJOS_PRESETS

export function CatAvatar({
  colorPelaje = 'naranja_blanco',
  patron = 'atigrado',
  ojos = 'cafe',
  size = 96,
  className = '',
}: {
  colorPelaje?: ColorPelajeKey
  patron?: PatronPelaje
  ojos?: OjosKey
  size?: number
  className?: string
}) {
  const { piel, marcas } = COLOR_PELAJE_PRESETS[colorPelaje] ?? COLOR_PELAJE_PRESETS.naranja_blanco
  const colorOjos = OJOS_PRESETS[ojos] ?? OJOS_PRESETS.cafe
  const esColorpoint = patron === 'colorpoint'
  const colorOrejas = esColorpoint ? marcas : piel

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Orejas (en colorpoint se pintan más oscuras, como en un siamés) */}
      <path d="M22 34 L14 10 L38 26 Z" fill={colorOrejas} />
      <path d="M78 34 L86 10 L62 26 Z" fill={colorOrejas} />
      <path d="M25 30 L20 15 L34 26 Z" fill="#F7E9E6" opacity="0.8" />
      <path d="M75 30 L80 15 L66 26 Z" fill="#F7E9E6" opacity="0.8" />

      {/* Cabeza */}
      <circle cx="50" cy="55" r="34" fill={piel} />

      {/* Patrón atigrado (rayas suaves) */}
      {patron === 'atigrado' && (
        <g stroke={marcas} strokeWidth="3" strokeLinecap="round" opacity="0.55">
          <line x1="30" y1="26" x2="35" y2="38" />
          <line x1="40" y1="22" x2="43" y2="35" />
          <line x1="60" y1="22" x2="57" y2="35" />
          <line x1="70" y1="26" x2="65" y2="38" />
        </g>
      )}
      {/* Patrón manchado */}
      {patron === 'manchado' && (
        <g fill={marcas} opacity="0.55">
          <ellipse cx="30" cy="50" rx="6" ry="5" />
          <ellipse cx="70" cy="46" rx="5" ry="4" />
          <ellipse cx="50" cy="75" rx="7" ry="4" />
        </g>
      )}
      {/* Patrón bicolor (mancha grande de un lado) */}
      {patron === 'bicolor' && (
        <path d="M50 21 a34 34 0 0 1 0 68 Z" fill={marcas} opacity="0.5" />
      )}
      {/* Patrón colorpoint (máscara alrededor del hocico, como un siamés) */}
      {esColorpoint && (
        <ellipse cx="50" cy="70" rx="14" ry="8" fill={marcas} opacity="0.65" />
      )}

      {/* Mejillas / hocico */}
      <ellipse cx="50" cy="66" rx="16" ry="11" fill="#FBF8F3" opacity="0.9" />

      {/* Ojos */}
      <ellipse cx="38" cy="54" rx="4.5" ry="6" fill={colorOjos} />
      <ellipse cx="62" cy="54" rx="4.5" ry="6" fill={colorOjos} />
      <circle cx="39.5" cy="51.5" r="1.3" fill="#FBF8F3" />
      <circle cx="63.5" cy="51.5" r="1.3" fill="#FBF8F3" />

      {/* Nariz y boca */}
      <path d="M47 63 L53 63 L50 66 Z" fill="#C0837D" />
      <path d="M50 66 Q50 70 44 71" stroke="#4A3C36" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M50 66 Q50 70 56 71" stroke="#4A3C36" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Bigotes */}
      <g stroke="#4A3C36" strokeWidth="1.5" opacity="0.5" strokeLinecap="round">
        <line x1="18" y1="60" x2="32" y2="62" />
        <line x1="18" y1="66" x2="32" y2="66" />
        <line x1="82" y1="60" x2="68" y2="62" />
        <line x1="82" y1="66" x2="68" y2="66" />
      </g>
    </svg>
  )
}
