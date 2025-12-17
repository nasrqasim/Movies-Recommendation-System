import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Movie Rec',
  description:
    "Smart movie recommendations powered by Artificial Intelligence. Discover movies you'll love from Hollywood, Bollywood, and Lollywood.",
  openGraph: {
    title: 'AI Movie Rec',
    description:
      "Smart movie recommendations powered by Artificial Intelligence. Discover movies you'll love from Hollywood, Bollywood, and Lollywood.",
    url: 'https://ai-movie-rec.vercel.app',
    siteName: 'AI Movie Rec',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

