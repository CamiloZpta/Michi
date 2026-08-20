import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

/**
 * Devuelve el household_id del usuario actual.
 * - Si ya pertenece a uno, lo retorna.
 * - Si no, y trae una cookie `michi_invite` con un código válido, se une a ese hogar.
 * - Si no, le crea un hogar nuevo (será el admin y podrá invitar a su pareja).
 */
export async function getOrCreateHousehold(): Promise<string> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No hay sesión activa')

  const { data: membership } = await supabase
    .from('household_members')
    .select('household_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (membership) return membership.household_id

  const cookieStore = cookies()
  const inviteCode = cookieStore.get('michi_invite')?.value

  if (inviteCode) {
    const { data: invite } = await supabase
      .from('household_invites')
      .select('id, household_id, expires_at, used_at')
      .eq('codigo', inviteCode)
      .maybeSingle()

    if (invite && !invite.used_at && new Date(invite.expires_at) > new Date()) {
      await supabase.from('household_members').insert({
        household_id: invite.household_id,
        user_id: user.id,
        rol: 'miembro',
      })
      await supabase
        .from('household_invites')
        .update({ used_at: new Date().toISOString(), used_by: user.id })
        .eq('id', invite.id)

      return invite.household_id
    }
  }

  // No hay invitación válida: crea un hogar nuevo
  const { data: nuevoHogar, error } = await supabase
    .from('households')
    .insert({ nombre: 'Nuestro hogar' })
    .select('id')
    .single()

  if (error || !nuevoHogar) throw new Error('No se pudo crear el hogar')

  await supabase.from('household_members').insert({
    household_id: nuevoHogar.id,
    user_id: user.id,
    rol: 'admin',
  })

  return nuevoHogar.id
}
