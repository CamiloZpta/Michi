import { buildGoogleCalendarLink } from '@/lib/googleCalendar'

type Recordatorio = {
  id: string
  nombre: string
  descripcion: string | null
  fecha: string
  hora: string | null
  lugar: string | null
}

export function ListaRecordatorios({ recordatorios }: { recordatorios: Recordatorio[] }) {
  if (recordatorios.length === 0) {
    return (
      <p className="text-sm text-ink-soft">
        No hay recordatorios todavía. Usa el botón + para agregar uno (una vacuna, una cirugía, lo que sea).
      </p>
    )
  }

  const hoy = new Date().toISOString().slice(0, 10)
  const proximos = recordatorios.filter((r) => r.fecha >= hoy)
  const pasados = recordatorios.filter((r) => r.fecha < hoy)

  return (
    <div className="flex flex-col gap-8">
      <Grupo titulo="Próximos" recordatorios={proximos} vacio="No tienes recordatorios próximos." />
      {pasados.length > 0 && (
        <Grupo titulo="Pasados" recordatorios={[...pasados].reverse()} vacio="" />
      )}
    </div>
  )
}

function Grupo({
  titulo,
  recordatorios,
  vacio,
}: {
  titulo: string
  recordatorios: Recordatorio[]
  vacio: string
}) {
  return (
    <div>
      <h2 className="text-sm font-display font-semibold text-ink-soft uppercase tracking-wide mb-3">
        {titulo}
      </h2>
      {recordatorios.length === 0 ? (
        <p className="text-sm text-ink-soft">{vacio}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {recordatorios.map((r) => (
            <li key={r.id} className="card-michi flex items-start justify-between gap-4">
              <div>
                <p className="font-display font-semibold">{r.nombre}</p>
                <p className="text-sm text-ink-soft">
                  {new Date(`${r.fecha}T00:00:00`).toLocaleDateString('es-CO', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                  {r.hora && ` · ${r.hora.slice(0, 5)}`}
                  {r.lugar && ` · ${r.lugar}`}
                </p>
                {r.descripcion && <p className="text-sm text-ink-soft mt-1">{r.descripcion}</p>}
              </div>
              <a
                href={buildGoogleCalendarLink(r)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-1.5 px-3 whitespace-nowrap"
              >
                📅 Agendar
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
