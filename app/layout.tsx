import type { Metadata } from 'next'
import { Fraunces, Work_Sans, Courier_Prime } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['500', '600'],
  style: ['italic', 'normal'],
})
const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['400', '500', '600'],
})
const courier = Courier_Prime({
  subsets: ['latin'],
  variable: '--font-courier',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Michi · Control de Tinto y Crema',
  description: 'El cuadernillo de gastos y cuidado de nuestros gatos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${fraunces.variable} ${workSans.variable} ${courier.variable}`}>
        {children}
      </body>
    </html>
  )
}
