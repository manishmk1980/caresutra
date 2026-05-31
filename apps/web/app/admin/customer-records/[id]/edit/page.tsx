import { notFound } from "next/navigation"

import { AdminShell } from "@/components/admin/admin-shell"
import CustomerRecordWizard from "@/components/admin/customer-records/CustomerRecordWizard"
import { getCustomerRecordById } from "@/lib/adminCustomerRecords"

export const dynamic = "force-dynamic"

export default async function CustomerRecordEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const recordId = Number(id)

  if (!Number.isInteger(recordId) || recordId <= 0) {
    notFound()
  }

  let record = null

  try {
    record = await getCustomerRecordById(recordId)
  } catch (error) {
    console.error("CUSTOMER_RECORD_EDIT_PAGE_ERROR", error)
  }

  if (!record) {
    notFound()
  }

  return (
    <AdminShell>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Customer Record</h1>
          <p className="text-sm text-muted-foreground">
            Update customer details, service information, and required documents.
          </p>
        </div>

        <CustomerRecordWizard initialRecord={record} />
      </div>
    </AdminShell>
  )
}
