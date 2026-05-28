import { AdminShell } from "@/components/admin/admin-shell"
import { MobileQuickActions } from "@/components/admin/mobile-quick-actions"
import {
  ChartAreaInteractive,
  type CustomerRecordChartPoint,
} from "@/components/chart-area-interactive"
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

function getFallbackChartDates(): string[] {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    return date.toISOString().slice(0, 10)
  })
}

function normalizeServiceType(value: string) {
  const normalized = value.toUpperCase()

  if (normalized === "INSURANCE") return "insurance"
  if (normalized === "LOAN") return "loans"
  if (normalized === "HEALTHCARE" || normalized === "HEALTH_SERVICES") {
    return "healthcare"
  }

  return null
}

function getChartData(records: CustomerRecordTableRow[]) {
  const recordDates = Array.from(
    new Set(
      records
        .map((record) => record.createdAtIso)
        .filter((date): date is string => Boolean(date))
    )
  )
    .sort()
    .slice(-7)

  const dates = recordDates.length > 0 ? recordDates : getFallbackChartDates()

  const points: CustomerRecordChartPoint[] = dates.map((date) => ({
    date,
    insurance: 0,
    loans: 0,
    healthcare: 0,
  }))

  const pointByDate = new Map(points.map((point) => [point.date, point]))

  for (const record of records) {
    const point = pointByDate.get(record.createdAtIso)
    const serviceKey = normalizeServiceType(record.serviceType)

    if (!point || !serviceKey) continue

    point[serviceKey] += 1
  }

  return points
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
  const chartData = getChartData(data)

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

            <MobileQuickActions />

            <SectionCards stats={stats} />

            <div className="px-4 lg:px-6">
              <ChartAreaInteractive data={chartData} source={source} />
            </div>

            <DataTable data={data} />
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

