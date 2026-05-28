import Link from "next/link"
import { PlusCircle, UsersRound } from "lucide-react"

import { AdminShell } from "@/components/admin/admin-shell"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export default function Page() {
  return (
    <AdminShell>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
            <p className="text-sm text-muted-foreground">
              Track customer activity, follow-ups, document movement, and recent admin actions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/admin/customer-records">
                <UsersRound className="mr-2 h-4 w-4" aria-hidden />
                View Customers
              </Link>
            </Button>

            <Button asChild className="rounded-xl bg-trust-blue text-white hover:bg-support-blue">
              <Link href="/admin/customer-records/new">
                <PlusCircle className="mr-2 h-4 w-4" aria-hidden />
                Add Customer
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Activity</CardTitle>
                <CardDescription>
                  This admin module is ready for detailed functionality.
                </CardDescription>
              </div>
              <Badge variant="secondary">Coming soon</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
              We have added this page to keep navigation complete. Next, we can connect it with actual CareSutra data and workflows.
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
