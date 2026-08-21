import type { Metadata } from 'next'
import { Pacifico, Baloo_2, Quicksand } from 'next/font/google'
import './globals.css'

const pacifico = Pacifico({
  subsets: ['latin'],
  variable: '--font-pacifico',
  weight: '400',
})
const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo',
  weight: ['600', '700'],
})
const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Michi · Gastos y cuidado de gatos',
  description: 'Lleva el control de los gastos y el cuidado de tus gatos, en familia.',
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${pacifico.variable} ${baloo.variable} ${quicksand.variable}`}>
        {children}
      </body>
    </html>
  )
}
