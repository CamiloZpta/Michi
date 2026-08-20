import { TabNav } from '@/components/TabNav'
import { PawLogo } from '@/components/PawLogo'
import { LogoutButton } from '@/components/LogoutButton'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-beige-100">
      <header className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-end justify-between mb-4">
          <div className="flex items-center gap-2">
            <PawLogo size={28} className="text-rose-500" />
            <span className="logo-wordmark text-3xl">Michi</span>
          </div>
          <LogoutButton />
        </div>
        <TabNav />
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="card-michi p-6 sm:p-10">{children}</div>
      </main>
    </div>
  )
}
