"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  FileTextIcon,
  Grid2X2Icon,
  ListIcon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  PlusCircleIcon,
  SearchIcon,
  Trash2Icon,
  UserRoundIcon,
  ExternalLinkIcon,
} from "lucide-react"

import { SafeCustomerImage } from "@/components/admin/SafeCustomerImage"
import { cn } from "@/lib/utils"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

type CustomerRecordRow = {
  id: number
  customerName: string
  initials: string
  email: string
  mobile: string
  serviceType: string
  customerStatus: string
  recordStatus: string
  city: string
  documents: string
  uploadedDocumentCount: number
  totalDocumentCount: number
  createdAt: string
  createdAtIso: string
  customerPictureUrl: string | null
  panDocumentUrl: string | null
  aadharFrontUrl: string | null
  aadharBackUrl: string | null
  otherDocumentUrl: string | null
  reviewer: string
}

type DocumentItem = {
  label: string
  type: string
  url: string | null
}

function formatServiceType(value: string) {
  if (value === "INSURANCE") return "Insurance"
  if (value === "LOAN") return "Loan"
  if (value === "HEALTHCARE") return "Health Services"
  return value
}

function serviceClasses(value: string) {
  if (value === "LOAN") return "border-cyan-200 bg-cyan-50 text-cyan-700"
  if (value === "HEALTHCARE") return "border-violet-200 bg-violet-50 text-violet-700"
  return "border-blue-200 bg-blue-50 text-blue-700"
}

function customerStatusClasses(value: string) {
  if (value === "ACTIVE") return "border-green-200 bg-green-50 text-green-700"
  if (value === "INACTIVE") return "border-slate-200 bg-slate-50 text-slate-600"
  return "border-slate-200 bg-white text-slate-600"
}

function recordStatusClasses(value: string) {
  if (value === "SUBMITTED") return "border-slate-950 bg-slate-950 text-white"
  return "border-slate-200 bg-white text-slate-600"
}

function documentItems(record: CustomerRecordRow): DocumentItem[] {
  return [
    { label: "Photo", type: "JPG", url: record.customerPictureUrl },
    { label: "PAN Card", type: "PDF", url: record.panDocumentUrl },
    { label: "Aadhaar Front", type: "JPG", url: record.aadharFrontUrl },
    { label: "Aadhaar Back", type: "JPG", url: record.aadharBackUrl },
    { label: "Other Document", type: "PDF", url: record.otherDocumentUrl },
  ]
}

function firstPreviewUrl(record: CustomerRecordRow) {
  return documentItems(record).find((item) => item.url)?.url ?? null
}

function searchText(record: CustomerRecordRow) {
  return [
    record.customerName,
    record.mobile,
    record.email,
    record.city,
    record.serviceType,
    record.customerStatus,
    record.recordStatus,
  ]
    .join(" ")
    .toLowerCase()
}

function DocumentThumb({ item }: { item: DocumentItem }) {
  return (
    <div className="w-20 shrink-0">
      <div className="flex size-20 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
        {item.url ? (
          <SafeCustomerImage
            src={item.url}
            alt={item.label}
            className="size-full object-cover"
            fallbackClassName="size-full border-0 bg-slate-50 text-slate-500"
            fallbackText={item.type}
          />
        ) : (
          <FileTextIcon className="size-7 text-slate-400" />
        )}
      </div>
      <p className="mt-2 truncate text-center text-xs font-semibold text-slate-950">
        {item.label}
      </p>
      <p className="text-center text-xs text-slate-500">
        {item.url ? item.type : "Not uploaded"}
      </p>
    </div>
  )
}

function RecordCard({
  record,
  compact,
  onDelete,
}: {
  record: CustomerRecordRow
  compact: boolean
  onDelete: (record: CustomerRecordRow) => void
}) {
  const docs = documentItems(record)
  const visibleDocs = docs.filter((item) => item.url).slice(0, compact ? 3 : 4)
  const hiddenCount = Math.max(record.uploadedDocumentCount - visibleDocs.length, 0)
  const otherDocument = docs[4] ?? {
    label: "Other Document",
    type: "PDF",
    url: null,
  }
  const previewUrl = firstPreviewUrl(record)

  return (
    <article className="grid min-w-0 gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-xs sm:gap-5 sm:p-5 2xl:grid-cols-[minmax(320px,1.05fr)_minmax(430px,1.7fr)_220px]">
      <section className="flex min-w-0 flex-col gap-3 min-[380px]:flex-row min-[380px]:gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base font-semibold text-slate-950 sm:size-16 sm:text-lg">
          {record.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 max-w-full truncate text-base font-semibold text-slate-950 sm:text-lg">
              {record.customerName}
            </h3>
            <Badge
              variant="outline"
              className={cn("h-5 text-[11px]", serviceClasses(record.serviceType))}
            >
              {formatServiceType(record.serviceType)}
            </Badge>
            <Badge
              variant="outline"
              className={cn("h-5 text-[11px]", recordStatusClasses(record.recordStatus))}
            >
              {record.recordStatus}
            </Badge>
            <Badge
              variant="outline"
              className={cn("h-5 text-[11px]", customerStatusClasses(record.customerStatus))}
            >
              {record.customerStatus}
            </Badge>
          </div>

          <div className="mt-4 space-y-3 border-b border-slate-200 pb-4 text-sm text-slate-950 sm:mt-5">
            <div className="flex min-w-0 items-center gap-3">
              <PhoneIcon className="size-4 shrink-0 text-slate-700" />
              <span className="truncate">{record.mobile}</span>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <MailIcon className="size-4 shrink-0 text-slate-700" />
              <span className="truncate">{record.email}</span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-slate-950 min-[560px]:grid-cols-3">
            <div className="flex min-w-0 items-center gap-2">
              <MapPinIcon className="size-4 shrink-0 text-slate-700" />
              <span className="truncate">{record.city}</span>
            </div>
            <div className="flex min-w-0 items-center gap-2 border-slate-200 min-[560px]:border-l min-[560px]:pl-4">
              <CalendarDaysIcon className="size-4 shrink-0 text-slate-700" />
              <span className="truncate">{record.createdAt}</span>
            </div>
            <div className="flex min-w-0 items-center gap-2 border-slate-200 min-[560px]:border-l min-[560px]:pl-4">
              <FileTextIcon className="size-4 shrink-0 text-slate-700" />
              <span className="truncate">{record.documents}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-slate-200 2xl:border-l 2xl:pl-6">
        <h4 className="text-sm font-semibold text-slate-950">Documents</h4>
        <div className="mt-4 flex min-w-0 flex-wrap items-start gap-3 sm:gap-4">
          {visibleDocs.length > 0 ? (
            visibleDocs.map((item) => <DocumentThumb key={item.label} item={item} />)
          ) : (
            <div className="flex h-20 w-full min-w-0 items-center gap-3 rounded-lg border border-dashed border-slate-200 px-4 text-sm text-slate-500 sm:w-auto sm:min-w-52">
              <FileTextIcon className="size-5" />
              No documents uploaded
            </div>
          )}

          {hiddenCount > 0 ? (
            <div className="flex size-20 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-xs">
              <span>+{hiddenCount}</span>
              <span className="text-xs font-medium">More</span>
            </div>
          ) : null}

          <div className="w-full min-w-0 border-slate-200 pl-0 md:w-auto md:min-w-44 md:border-l md:pl-5">
            <div className="flex h-20 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4">
              <FileTextIcon className="size-6 shrink-0 text-slate-500" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  Other Document
                </p>
                <p className="truncate text-sm text-slate-500">
                  {otherDocument.url ? otherDocument.type : "Not uploaded"}
                </p>
              </div>
            </div>
            {previewUrl ? (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-slate-950 hover:underline"
              >
                <SearchIcon className="size-4" />
                Open preview
              </a>
            ) : (
              <span className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400">
                <SearchIcon className="size-4" />
                Open preview
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="flex min-w-0 flex-col gap-3 border-slate-200 2xl:border-l 2xl:pl-5">
        <Button
          className="h-11 bg-slate-950 text-white hover:bg-slate-800"
          asChild={Boolean(previewUrl)}
          disabled={!previewUrl}
        >
          {previewUrl ? (
            <a href={previewUrl} target="_blank" rel="noreferrer">
              <EyeIcon />
              Preview
            </a>
          ) : (
            <>
              <EyeIcon />
              Preview
            </>
          )}
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-10" asChild>
            <Link href={`/admin/customer-records/${record.id}`}>
              <ExternalLinkIcon />
              View
            </Link>
          </Button>
          <Button variant="outline" className="h-10" asChild>
            <Link href={`/admin/customer-records/${record.id}/edit`}>
              <PencilIcon />
              Edit
            </Link>
          </Button>
        </div>
        <Button
          variant="destructive"
          className="h-10 border border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
          onClick={() => onDelete(record)}
        >
          <Trash2Icon />
          Delete
        </Button>
      </section>
    </article>
  )
}

export function DataTable({ data }: { data: CustomerRecordRow[] }) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">("newest")
  const [compact, setCompact] = React.useState(false)
  const [deletedIds, setDeletedIds] = React.useState<Set<number>>(() => new Set())
  const [deleteCandidate, setDeleteCandidate] =
    React.useState<CustomerRecordRow | null>(null)
  const [actionMessage, setActionMessage] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const visibleRows = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return data
      .filter((record) => !deletedIds.has(record.id))
      .filter((record) =>
        normalizedQuery ? searchText(record).includes(normalizedQuery) : true
      )
      .sort((a, b) => {
        const left = new Date(a.createdAtIso).getTime()
        const right = new Date(b.createdAtIso).getTime()
        return sortOrder === "newest" ? right - left : left - right
      })
  }, [data, deletedIds, query, sortOrder])

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

      setDeletedIds((currentIds) => new Set(currentIds).add(deleteCandidate.id))
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
    <div className="space-y-5">
      <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <UserRoundIcon className="size-4 text-slate-800" />
          <span>{visibleRows.length} customer records found</span>
        </div>

        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center">
          <div className="relative min-w-0 md:w-96">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, mobile, email..."
              className="h-11 border-slate-200 pr-10"
            />
            <SearchIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-500" />
          </div>
          <Button className="h-11 bg-slate-950 px-4 text-white hover:bg-slate-800" asChild>
            <Link href="/admin/customer-records/new">
              <PlusCircleIcon />
              New Customer
            </Link>
          </Button>
        </div>
      </div>

      {actionMessage ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {actionMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="inline-flex w-fit overflow-hidden rounded-lg border border-slate-200 bg-white">
          <Button
            type="button"
            size="icon-lg"
            variant="ghost"
            aria-label="Comfortable card view"
            className={cn("rounded-none", !compact && "bg-slate-950 text-white hover:bg-slate-950 hover:text-white")}
            onClick={() => setCompact(false)}
          >
            <Grid2X2Icon />
          </Button>
          <Button
            type="button"
            size="icon-lg"
            variant="ghost"
            aria-label="Compact card view"
            className={cn("rounded-none", compact && "bg-slate-950 text-white hover:bg-slate-950 hover:text-white")}
            onClick={() => setCompact(true)}
          >
            <ListIcon />
          </Button>
        </div>

        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}
        >
          <SelectTrigger className="h-11 min-w-40 border-slate-200 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {visibleRows.length > 0 ? (
          visibleRows.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              compact={compact}
              onDelete={setDeleteCandidate}
            />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No customer records found.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {visibleRows.length ? 1 : 0} to {visibleRows.length} of{" "}
          {visibleRows.length} customer records
        </span>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <span>Page 1 of 1</span>
          <div className="inline-flex items-center gap-2">
            <Button size="icon" variant="outline" disabled aria-label="Previous page">
              <ChevronLeftIcon />
            </Button>
            <Button size="icon" variant="outline" aria-current="page">
              1
            </Button>
            <Button size="icon" variant="outline" disabled aria-label="Next page">
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
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
              className="bg-red-600 text-white hover:bg-red-700"
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
