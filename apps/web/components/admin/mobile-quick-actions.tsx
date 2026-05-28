import Link from "next/link"
import {
  CalendarDays,
  FileUp,
  UserPlus,
  UsersRound,
} from "lucide-react"

const quickLinks = [
  {
    label: "View Customers",
    href: "/admin/customer-records",
    icon: UsersRound,
  },
  {
    label: "New Customer",
    href: "/admin/customer-records/new",
    icon: UserPlus,
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: CalendarDays,
  },
  {
    label: "Uploads",
    href: "/admin/uploads",
    icon: FileUp,
  },
]

export function MobileQuickActions() {
  return (
    <div className="px-4 lg:hidden">
      <div className="rounded-2xl border border-soft-gold/40 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-charcoal">Quick actions</h2>
          <span className="text-[11px] font-medium text-charcoal/55">
            Admin shortcuts
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {quickLinks.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-16 items-center gap-2 rounded-xl border border-soft-gold/35 bg-ivory/60 px-3 py-2 text-sm font-semibold text-charcoal transition hover:border-trust-blue/30 hover:bg-trust-blue/5 hover:text-trust-blue"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-trust-blue shadow-sm">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="leading-tight">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
