import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { PublicChrome } from "@/components/layout/PublicChrome"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://caresutra.in"),
  title: "CareSutra | Har Zarurat Ka Sahi Margdarshan",
  description:
    "CareSutra helps individuals and families with guidance-first support across insurance, loans, and health services.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${fontSans.variable} ${fontMono.variable} min-h-screen font-sans antialiased`}
      >
        <TooltipProvider>
          <PublicChrome>{children}</PublicChrome>
        </TooltipProvider>
      </body>
    </html>
  )
}
