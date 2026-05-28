"use client"

import * as React from "react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
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
  const [deleteCandidate, setDeleteCandidate] =
    React.useState<CustomerRecordRow | null>(null)

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
            {data.map((record) => (
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
            ))}
          </TableBody>
        </Table>
      </div>

      {deleteCandidate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-md rounded-xl border bg-background p-5 shadow-lg">
            <h2 className="text-lg font-semibold">Delete customer record?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You are about to delete the record for{" "}
              <span className="font-medium text-foreground">
                {deleteCandidate.customerName}
              </span>
              . This action should only be used when the record was created by
              mistake.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteCandidate(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setDeleteCandidate(null)
                  alert("Delete action placeholder. We will connect API next.")
                }}
              >
                Yes, delete
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
