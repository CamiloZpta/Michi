function pad(n: number) {
  return String(n).padStart(2, '0')
}

/**
 * Genera un link de "Agregar a Google Calendar" a partir de los datos de un
 * recordatorio. Si no hay hora, crea un evento de todo el día.
 */
export function buildGoogleCalendarLink({
  nombre,
  descripcion,
  fecha,
  hora,
  lugar,
}: {
  nombre: string
  descripcion?: string | null
  fecha: string // 'YYYY-MM-DD'
  hora?: string | null // 'HH:MM'
  lugar?: string | null
}) {
  const params = new URLSearchParams()
  params.set('action', 'TEMPLATE')
  params.set('text', nombre)
  if (descripcion) params.set('details', descripcion)
  if (lugar) params.set('location', lugar)

  const fechaCompacta = fecha.replace(/-/g, '')

  if (hora) {
    const [hh, mm] = hora.split(':').map(Number)
    const inicio = `${fechaCompacta}T${pad(hh)}${pad(mm)}00`

    let finHH = hh + 1
    let finDia = fechaCompacta
    if (finHH >= 24) {
      finHH -= 24
      const d = new Date(`${fecha}T00:00:00`)
      d.setDate(d.getDate() + 1)
      finDia = d.toISOString().slice(0, 10).replace(/-/g, '')
    }
    const fin = `${finDia}T${pad(finHH)}${pad(mm)}00`
    params.set('dates', `${inicio}/${fin}`)
  } else {
    const d = new Date(`${fecha}T00:00:00`)
    d.setDate(d.getDate() + 1)
    const finFecha = d.toISOString().slice(0, 10).replace(/-/g, '')
    params.set('dates', `${fechaCompacta}/${finFecha}`)
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
