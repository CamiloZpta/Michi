import Link from 'next/link'
import { PawLogo } from '@/components/PawLogo'
import { LogoutButton } from '@/components/LogoutButton'

const NAV = [
  { href: '/', label: 'Resumen', icon: '📊' },
  { href: '/tendencia', label: 'Tendencia de precios', icon: '📈' },
  { href: '/gastos', label: 'Gastos', icon: '🧾' },
  { href: '/gatos', label: 'Nuestros gatos', icon: '🐾' },
  { href: '/hogar', label: 'Hogar y miembros', icon: '👥' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-beige-100">
      <aside className="md:w-64 md:min-h-screen bg-beige-50 border-r border-rose-100 p-6 flex md:flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <PawLogo size={28} className="text-rose-500" />
            <span className="font-display text-xl font-semibold">Michi</span>
          </div>
          <nav className="flex md:flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-ink-soft hover:bg-rose-50 hover:text-ink transition-colors text-sm font-medium"
              >
                <span>{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden md:block">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  )
}
