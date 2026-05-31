"use client"

import { usePathname } from "next/navigation"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-charcoal">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
