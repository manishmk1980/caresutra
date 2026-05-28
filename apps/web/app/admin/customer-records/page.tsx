import { AdminShell } from "@/components/admin/admin-shell"
import { DataTable } from "@/components/data-table"

import data from "../data.json"

export default function CustomerRecordsPage() {
  return (
    <AdminShell>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Customer Records</h1>
          <p className="text-sm text-muted-foreground">
            View and manage CareSutra customer records across insurance, loans, and health services.
          </p>
        </div>

        <DataTable data={data} />
      </div>
    </AdminShell>
  )
}
