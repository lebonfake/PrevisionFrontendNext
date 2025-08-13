import type React from "react"
import { Inter, Roboto } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
})

export const metadata = {
  title: "Duroc Tiers",
  description: "Application de gestion des validateurs",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${roboto.variable} antialiased`}>
      <body className="bg-gray-50">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-6 md:p-8 pt-16 md:pt-8">{children}</div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
