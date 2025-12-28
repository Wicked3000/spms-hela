
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SPMS Hela - Student Profile Management System',
  description: 'Student Profile Promotion Web Application for Hela Province',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full flex flex-col`}>
        {children}
        <Toaster position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
