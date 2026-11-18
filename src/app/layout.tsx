import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import { CartProvider } from '@/context/CartContext'
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Blessed Drinks | Ghanaian Artisanal Heritage Beverages',
  description:
    'Freshly pressed, authentic Ghanaian local drinks — Sobolo, Brukina, Lamugin, Asaana, and Fresh Palm Wine delivered cold across Accra & Tema.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="bg-[#fcf9f0] text-[#1c1c17] antialiased min-h-screen flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
