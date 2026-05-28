import { AdminShell } from "@/components/admin/admin-shell"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards, type AdminDashboardStats } from "@/components/section-cards"
import {
  getCustomerRecordRows,
  type CustomerRecordTableRow,
} from "@/lib/adminCustomerRecords"
import { Card, CardContent } from "@workspace/ui/components/card"

export const dynamic = "force-dynamic"

function getDashboardStats(
  records: CustomerRecordTableRow[],
  source: AdminDashboardStats["source"]
): AdminDashboardStats {
  return {
    totalRecords: records.length,
    submittedRecords: records.filter(
      (record) => record.recordStatus === "SUBMITTED"
    ).length,
    draftRecords: records.filter((record) => record.recordStatus === "DRAFT")
      .length,
    documentsPending: records.filter((record) => record.documents !== "5/5")
      .length,
    source,
  }
}

export default async function Page() {
  let data: CustomerRecordTableRow[] = []
  let source: AdminDashboardStats["source"] = "live"
  let errorMessage: string | null = null

  try {
    data = await getCustomerRecordRows()
  } catch (error) {
    console.error("ADMIN_DASHBOARD_PAGE_ERROR", error)
    source = "fallback"
    errorMessage =
      "Dashboard data could not be loaded because the database connection is not configured or not reachable in this environment."
  }

  const stats = getDashboardStats(data, source)

  return (
    <AdminShell>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {errorMessage ? (
              <div className="px-4 lg:px-6">
                <Card className="border-amber-200 bg-amber-50/60">
                  <CardContent className="p-4 text-sm text-amber-900">
                    {errorMessage}
                  </CardContent>
                </Card>
              </div>
            ) : null}

            <SectionCards stats={stats} />

            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>

            <DataTable data={data} />
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
