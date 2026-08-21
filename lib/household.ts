import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

/**
 * Devuelve el household_id "activo" del usuario actual.
 * - Si su perfil ya tiene uno guardado y sigue siendo miembro, lo usa.
 * - Si no, toma el primero al que pertenezca (por si acaba de unirse a otro).
 * - Si no pertenece a ninguno, canjea una invitación pendiente (cookie del
 *   signup) o crea un hogar nuevo.
 *
 * Nota de rendimiento: usamos getSession() (lee la cookie localmente, sin ir
 * a la red) en vez de getUser() (que sí hace una llamada HTTP a Supabase Auth
 * en cada invocación). El middleware ya valida la sesión con getUser() antes
 * de dejar pasar la petición, así que repetir esa validación acá solo
 * agregaba una espera extra en cada cambio de pestaña sin ganar seguridad.
 */
export async function getOrCreateHousehold(): Promise<string> {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) throw new Error('No hay sesión activa')

  const { data: perfil } = await supabase
    .from('profiles')
    .select('hogar_activo_id')
    .eq('id', user.id)
    .maybeSingle()

  if (perfil?.hogar_activo_id) {
    const { data: sigueSiendoMiembro } = await supabase
      .from('household_members')
      .select('household_id')
      .eq('household_id', perfil.hogar_activo_id)
      .eq('user_id', user.id)
      .maybeSingle()
    if (sigueSiendoMiembro) return perfil.hogar_activo_id
  }

  const { data: membresia } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('user_id', user.id)
    .order('joined_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (membresia) {
    await supabase
      .from('profiles')
      .update({ hogar_activo_id: membresia.household_id })
      .eq('id', user.id)
    return membresia.household_id
  }

  const cookieStore = cookies()
  const inviteCode = cookieStore.get('michi_invite')?.value

  if (inviteCode) {
    const { data: householdId, error } = await supabase.rpc('join_household_by_code', {
      codigo_invitacion: inviteCode,
    })
    if (!error && householdId) return householdId as string
  }

  const { data: nuevoHogarId, error } = await supabase.rpc('create_household', {
    nombre_hogar: 'Nuestro hogar',
  })

  if (error || !nuevoHogarId) {
    throw new Error(`No se pudo crear el hogar: ${error?.message ?? 'sin datos devueltos'}`)
  }

  return nuevoHogarId as string
}
