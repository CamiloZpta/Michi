'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: 'Resumen' },
  { href: '/tendencia', label: 'Tendencia' },
  { href: '/gastos', label: 'Gastos' },
  { href: '/gatos', label: 'Nuestros gatos' },
  { href: '/hogar', label: 'Hogar' },
  { href: '/configuracion', label: 'Configuración' },
]

export function TabNav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1">
      {NAV.map((item) => {
        const activo = pathname === item.href
        return (
          <Link key={item.href} href={item.href} data-active={activo} className="tab-pill">
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
