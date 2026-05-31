"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"

export function AdminLogoutButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function logout() {
    setLoggingOut(true)

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      })

      setOpen(false)
      router.push("/admin/login")
      router.refresh()
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
        aria-label="Logout"
        title="Logout"
      >
        <LogOut className="h-4 w-4" aria-hidden />
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout from CareSutra Admin?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of the admin workspace and redirected to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loggingOut}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                logout()
              }}
              disabled={loggingOut}
              className="bg-trust-blue text-white hover:bg-support-blue"
            >
              {loggingOut ? "Logging out..." : "Yes, logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
