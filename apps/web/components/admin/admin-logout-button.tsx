"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export function AdminLogoutButton() {
  const router = useRouter()

  async function logout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    })

    router.push("/admin/login")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
      aria-label="Logout"
      title="Logout"
    >
      <LogOut className="h-4 w-4" aria-hidden />
    </button>
  )
}
