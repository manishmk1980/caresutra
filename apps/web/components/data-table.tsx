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
              <TableHead className="text-right">Action</TableHead>
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
                  <Button size="sm" variant="ghost" asChild>
                    <a href={`/admin/customer-records/${record.id}`}>View</a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
