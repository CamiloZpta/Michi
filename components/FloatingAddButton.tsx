'use client'

import { useState } from 'react'

export function FloatingAddButton({
  label,
  children,
}: {
  label: string
  children: (close: () => void) => React.ReactNode
}) {
  const [abierto, setAbierto] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={() => setAbierto(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-700
                   text-beige-50 shadow-lg flex items-center justify-center transition-colors
                   text-3xl font-display leading-none"
      >
        +
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/30 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
          onClick={() => setAbierto(false)}
        >
          <div
            className="bg-beige-50 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto
                       p-6 shadow-michi animate-[slideUp_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-display font-semibold">{label}</h2>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setAbierto(false)}
                className="text-ink-soft text-2xl leading-none px-2"
              >
                ×
              </button>
            </div>
            {children(() => setAbierto(false))}
          </div>
        </div>
      )}
    </>
  )
}
