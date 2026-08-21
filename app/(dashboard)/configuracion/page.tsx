import { createClient } from '@/lib/supabase/server'
import { getOrCreateHousehold } from '@/lib/household'
import { CambiarNombreForm } from '@/components/CambiarNombreForm'
import { MisHogares } from '@/components/MisHogares'
import { UnirseHogarForm } from '@/components/UnirseHogarForm'
import { LogoutButton } from '@/components/LogoutButton'
import { EliminarCuentaButton } from '@/components/EliminarCuentaButton'

export const dynamic = 'force-dynamic'

export default async function ConfiguracionPage() {
  const supabase = createClient()
  const householdActivoId = await getOrCreateHousehold()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  const [{ data: perfil }, { data: misHogares }] = await Promise.all([
    supabase.from('profiles').select('nombre').eq('id', user!.id).maybeSingle(),
    supabase
      .from('household_members')
      .select('household_id, rol, households(nombre)')
      .eq('user_id', user!.id),
  ])

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Configuración</h1>
        <p className="text-ink-soft">Tu cuenta, tus hogares, y cómo salir si algún día quieres irte.</p>
      </div>

      <div className="card-michi">
        <h2 className="text-xl font-display font-semibold mb-4">Tu nombre</h2>
        <CambiarNombreForm nombreActual={perfil?.nombre ?? ''} />
      </div>

      <div className="card-michi">
        <h2 className="text-xl font-display font-semibold mb-4">Tus hogares</h2>
        <MisHogares hogares={misHogares ?? []} activoId={householdActivoId} />
      </div>

      <div className="card-michi">
        <h2 className="text-xl font-display font-semibold mb-2">Unirte a otro hogar</h2>
        <p className="text-sm text-ink-soft mb-4">
          Por ejemplo, si adoptaste un gato con alguien más y ya tiene su propio hogar en Michi,
          pide el código de invitación y únete sin perder el que ya tienes.
        </p>
        <UnirseHogarForm />
      </div>

      <div className="card-michi flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold">Cerrar sesión</h2>
          <p className="text-sm text-ink-soft">Vuelves a entrar cuando quieras con tu correo.</p>
        </div>
        <LogoutButton />
      </div>

      <div className="card-michi border-alerta/30">
        <h2 className="text-xl font-display font-semibold mb-2 text-alerta">Zona peligrosa</h2>
        <p className="text-sm text-ink-soft mb-4">
          Eliminar tu cuenta es permanente. Los gastos que registraste se quedan en el historial del
          hogar, pero ya no se te atribuirán a ti.
        </p>
        <EliminarCuentaButton />
      </div>
    </div>
  )
}
