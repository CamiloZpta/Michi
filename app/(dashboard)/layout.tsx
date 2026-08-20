import { TabNav } from '@/components/TabNav'
import { PawLogo } from '@/components/PawLogo'
import { LogoutButton } from '@/components/LogoutButton'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-beige-100">
      <header className="border-b border-ink/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 flex items-end justify-between">
          <div className="flex items-center gap-2 pb-4">
            <PawLogo size={26} className="text-rose-500" />
            <span className="font-display italic text-2xl font-semibold">Michi</span>
          </div>
          <div className="pb-4">
            <LogoutButton />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <TabNav />
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-beige-50 rounded-b-2xl rounded-tr-2xl border border-ink/10 p-6 sm:p-10">
          {children}
        </div>
      </main>
    </div>
  )
}
