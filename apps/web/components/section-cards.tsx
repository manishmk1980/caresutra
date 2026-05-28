"use client"

import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ClipboardCheckIcon,
  FileClockIcon,
  FileWarningIcon,
  UsersIcon,
} from "lucide-react"

export type AdminDashboardStats = {
  totalRecords: number
  submittedRecords: number
  draftRecords: number
  documentsPending: number
  source: "live" | "fallback"
}

export function SectionCards({ stats }: { stats: AdminDashboardStats }) {
  const metrics = [
    {
      label: "Total Customer Records",
      value: String(stats.totalRecords),
      badge: stats.source === "live" ? "Live" : "Offline",
      footerTitle: "Records available in admin",
      footerText:
        stats.source === "live"
          ? "Loaded from CustomerRecord database."
          : "Database not reachable in this environment.",
      icon: UsersIcon,
    },
    {
      label: "Submitted Records",
      value: String(stats.submittedRecords),
      badge: "Submitted",
      footerTitle: "Submitted customer records",
      footerText: "Records marked as SUBMITTED for processing.",
      icon: ClipboardCheckIcon,
    },
    {
      label: "Draft Records",
      value: String(stats.draftRecords),
      badge: "Draft",
      footerTitle: "Draft records need completion",
      footerText: "Records saved but not finally submitted.",
      icon: FileClockIcon,
    },
    {
      label: "Documents Pending",
      value: String(stats.documentsPending),
      badge: "Review",
      footerTitle: "Document checks required",
      footerText: "PAN, Aadhaar, photo, or other files may be incomplete.",
      icon: FileWarningIcon,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <Card key={metric.label} className="@container/card">
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metric.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Icon />
                  {metric.badge}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {metric.footerTitle}
                <Icon className="size-4" />
              </div>
              <div className="text-muted-foreground">{metric.footerText}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
