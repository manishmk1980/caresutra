import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminShell } from "@/components/admin/admin-shell"
import { getCustomerRecordById } from "@/lib/adminCustomerRecords"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export const dynamic = "force-dynamic"

function value(v: unknown) {
  if (v === null || v === undefined || v === "") return "-"
  return String(v)
}

export default async function CustomerRecordViewPage({
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
    console.error("CUSTOMER_RECORD_VIEW_PAGE_ERROR", error)
  }

  if (!record) {
    notFound()
  }

  const fullName = [record.firstName, record.middleName, record.lastName]
    .filter(Boolean)
    .join(" ")

  const documents = [
    ["Customer Photo", record.customerPictureUrl],
    ["PAN Document", record.panDocumentUrl],
    ["Aadhaar Front", record.aadharFrontUrl],
    ["Aadhaar Back", record.aadharBackUrl],
    ["Other Document", record.otherDocumentUrl],
  ]

  return (
    <AdminShell>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {fullName || "Customer Record"}
            </h1>
            <p className="text-sm text-muted-foreground">
              View customer details, service information, and document status.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/customer-records">Back to Records</Link>
            </Button>
            <Button asChild>
              <Link href={`/admin/customer-records/${record.id}/edit`}>
                Edit Record
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Basic customer information</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Mobile</span>
                <span className="font-medium">{value(record.mobile)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{value(record.email)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">PAN</span>
                <span className="font-medium">{value(record.pan)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Aadhaar</span>
                <span className="font-medium">{value(record.aadhaar)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline">{record.customerStatus}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>CareSutra service information</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Service Type</span>
                <Badge>{value(record.customerType)}</Badge>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium">{value(record.providerCompanyName)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{value(record.insuranceLoanAmount)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Premium / EMI</span>
                <span className="font-medium">{value(record.premiumEmi)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Record Status</span>
                <Badge variant={record.recordStatus === "SUBMITTED" ? "default" : "secondary"}>
                  {record.recordStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
              <CardDescription>Customer address details</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-6">
              <p>{value(record.addressLine)}</p>
              <p>{value(record.floor)} {value(record.street)}</p>
              <p>
                {value(record.city)}, {value(record.state)} - {value(record.pinCode)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Uploaded document status</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              {documents.map(([label, url]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{label}</span>
                  <Badge variant={url ? "default" : "secondary"}>
                    {url ? "Uploaded" : "Pending"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  )
}
