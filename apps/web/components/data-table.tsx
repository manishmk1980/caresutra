"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

type CustomerRecordRow = {
  id: number
  customerName: string
  mobile: string
  serviceType: string
  customerStatus: string
  recordStatus: string
  city: string
  documents: string
  createdAt: string
  reviewer: string
}

function formatServiceType(value: string) {
  if (value === "INSURANCE") return "Insurance"
  if (value === "LOAN") return "Loan"
  if (value === "HEALTHCARE") return "Health Services"
  return value
}

export function DataTable({ data }: { data: CustomerRecordRow[] }) {
  const router = useRouter()
  const [rows, setRows] = React.useState<CustomerRecordRow[]>(data)
  const [deleteCandidate, setDeleteCandidate] =
    React.useState<CustomerRecordRow | null>(null)
  const [actionMessage, setActionMessage] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    setRows(data)
  }, [data])

  async function deleteRecord() {
    if (!deleteCandidate) return

    setIsDeleting(true)
    setActionMessage(null)

    try {
      const response = await fetch(`/api/customer-records/${deleteCandidate.id}`, {
        method: "DELETE",
        credentials: "same-origin",
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          result?.error || result?.message || "Unable to delete customer record."
        )
      }

      const deletedName = deleteCandidate.customerName

      setRows((currentRows) =>
        currentRows.filter((record) => record.id !== deleteCandidate.id)
      )
      setDeleteCandidate(null)
      setActionMessage(`${deletedName} has been deleted successfully.`)
      router.refresh()
    } catch (error) {
      setActionMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete customer record."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div>
            <h2 className="text-base font-semibold">Customer Records</h2>
            <p className="text-sm text-muted-foreground">
              Insurance, loan, and health service customer records.
            </p>
          </div>
          <Button size="sm" asChild>
            <a href="/admin/customer-records/new">New Customer</a>
          </Button>
        </div>

        {actionMessage ? (
          <div className="border-b bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            {actionMessage}
          </div>
        ) : null}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Customer Status</TableHead>
              <TableHead>Record Status</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[220px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.customerName}
                  </TableCell>
                  <TableCell>{record.mobile}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {formatServiceType(record.serviceType)}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.customerStatus}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.recordStatus === "SUBMITTED"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {record.recordStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.city}</TableCell>
                  <TableCell>{record.documents}</TableCell>
                  <TableCell>{record.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" asChild>
                        <a href={`/admin/customer-records/${record.id}`}>View</a>
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <a href={`/admin/customer-records/${record.id}/edit`}>
                          Edit
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteCandidate(record)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-28 text-center text-sm text-muted-foreground"
                >
                  No customer records found. Use New Customer to add the first
                  record.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteCandidate !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleteCandidate(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer record?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete the record for{" "}
              <span className="font-medium text-foreground">
                {deleteCandidate?.customerName}
              </span>
              . This should only be done when the record was created by mistake.
              This action cannot be undone from the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault()
                void deleteRecord()
              }}
            >
              {isDeleting ? "Deleting..." : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
