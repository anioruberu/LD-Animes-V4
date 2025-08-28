import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BottomNavbar } from "@/components/bottom-navbar"
import { AdBlockerDetector } from "@/components/ad-blocker-detector"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LD Animes - Ver Anime Online",
  description:
    "Ve Animes online y haz comentarios en este sitio web hecho con Next.js, TypeScript, Firebase, Anilist, Consumet y Aniwatch API.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AdBlockerDetector />
          <main className="min-h-screen bg-background">{children}</main>
          <BottomNavbar />
        </ThemeProvider>
      </body>
    </html>
  )
}
