'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  return (
    <button
      className="text-sm text-ink-soft hover:text-alerta transition-colors"
      onClick={async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
      }}
    >
      Cerrar sesión
    </button>
  )
}
