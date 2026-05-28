import { AdminShell } from "@/components/admin/admin-shell"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function Page() {
  return (
    <AdminShell>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            View appointment requests and upcoming customer meetings.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>
                  This admin module is ready for detailed functionality.
                </CardDescription>
              </div>
              <Badge variant="secondary">Coming soon</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
              We have added this page to keep navigation complete. Next, we can connect it with actual CareSutra data and workflows.
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
