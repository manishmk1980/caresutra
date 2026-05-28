"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"

const titleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/customer-records": "Customer Records",
  "/admin/customer-records/new": "New Customer Record",
  "/admin/activity": "Activity",
  "/admin/appointments": "Appointments",
  "/admin/documents": "Documents",
  "/admin/uploads": "Uploads",
  "/admin/reports": "Reports",
  "/admin/services/insurance": "Insurance",
  "/admin/services/loans": "Loans",
  "/admin/services/health": "Health Services",
  "/admin/settings": "Settings",
}

function getTitle(pathname: string) {
  return titleMap[pathname] ?? "CareSutra Admin"
}

export function AdminHeader() {
  const pathname = usePathname()

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div>
        <h1 className="text-sm font-semibold">{getTitle(pathname)}</h1>
        <p className="text-xs text-muted-foreground">
          CareSutra operations workspace
        </p>
      </div>
    </header>
  )
}
