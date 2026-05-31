import { AdminShell } from "@/components/admin/admin-shell"
import { MobileQuickActions } from "@/components/admin/mobile-quick-actions"
import { DataTable } from "@/components/data-table"
import {
  getCustomerRecordRows,
  type CustomerRecordTableRow,
} from "@/lib/adminCustomerRecords"
import { Card, CardContent } from "@workspace/ui/components/card"

export const dynamic = "force-dynamic"

export default async function CustomerRecordsPage() {
  let data: CustomerRecordTableRow[] = []
  let errorMessage: string | null = null

  try {
    data = await getCustomerRecordRows()
  } catch (error) {
    console.error("ADMIN_CUSTOMER_RECORDS_PAGE_ERROR", error)
    errorMessage =
      "Customer records could not be loaded because the database connection is not configured or not reachable in this environment."
  }

  return (
    <AdminShell>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Customer Records
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage CareSutra customer records across insurance, loans,
            and health services.
          </p>
        </div>

        {errorMessage ? (
          <Card className="border-amber-200 bg-amber-50/60">
            <CardContent className="p-4 text-sm text-amber-900">
              {errorMessage}
            </CardContent>
          </Card>
        ) : null}

        <MobileQuickActions />
        <DataTable data={data} />
      </div>
    </AdminShell>
  )
}
