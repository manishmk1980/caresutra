"use client"

import { ChangeEvent, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema"
import { cn } from "@/lib/utils"

const docCard =
  "rounded-2xl border border-soft-gold/35 bg-ivory/40 p-3 shadow-sm md:p-4"
const docInput =
  "mt-1.5 w-full rounded-xl border border-soft-gold/40 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition-shadow focus-visible:border-trust-blue/50 focus-visible:ring-2 focus-visible:ring-trust-blue/25 md:mt-2 md:px-4 md:py-3"
const docLabel = "block text-xs font-medium text-charcoal md:text-sm"
const actionBtn =
  "inline-flex items-center justify-center rounded-xl border border-trust-blue/20 bg-white px-3 py-2 text-xs font-semibold text-trust-blue shadow-sm transition hover:border-trust-blue/35 hover:bg-trust-blue/5 disabled:cursor-not-allowed disabled:opacity-60"
const dangerBtn =
  "inline-flex items-center justify-center rounded-xl border border-red-700/20 bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm transition hover:border-red-700/35 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"

type DocumentFieldName =
  | "customerPictureUrl"
  | "panDocumentUrl"
  | "aadhaarFrontUrl"
  | "aadhaarBackUrl"
  | "otherDocumentUrl"

type DocumentUploadFieldProps = {
  name: DocumentFieldName
  label: string
  placeholder: string
  value: unknown
  error?: unknown
  captureMode?: "user" | "environment"
  fileAccept?: string
  cameraAccept?: string
  documentType: string
  customerId?: string | number | null
}

type StepDocumentsProps = {
  customerId?: string | number | null
}

const generalFileAccept =
  ".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

function trimUrl(v: unknown): string {
  if (v === undefined || v === null) return ""
  return String(v).trim()
}

function normalizePanInput(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10)
}

function formatAadhaarInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 12)
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
}

function isPreviewableImage(value: string) {
  return /\.(jpg|jpeg|png|webp)$/i.test(value.split("?")[0] || "")
}

function fileNameFromPath(value: string): string {
  const clean = value.split("?")[0] || value
  return clean.split("/").filter(Boolean).pop() || value
}

function UploadLine({ filled, uploading }: { filled: boolean; uploading?: boolean }) {
  return (
    <p className="mt-1.5 text-[11px] font-medium md:text-xs" aria-live="polite">
      <span className={filled ? "text-green-800" : "text-charcoal/50"}>
        {uploading ? "Uploading..." : filled ? "Uploaded" : "Not uploaded"}
      </span>
    </p>
  )
}

async function uploadDocument(
  file: File,
  documentType: string,
  customerId?: string | number | null
): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("documentType", documentType)
  formData.append("customerId", customerId ? String(customerId) : "draft")

  const response = await fetch("/api/customer-records/upload", {
    method: "POST",
    body: formData,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || "Upload failed.")
  }

  if (!data.url || typeof data.url !== "string") {
    throw new Error("Upload completed but no file URL was returned.")
  }

  return data.url
}

async function deleteUploadedDocument(url: string): Promise<void> {
  const response = await fetch("/api/customer-records/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || "Delete failed.")
  }
}

function PreviewModal({
  url,
  title,
  onClose,
}: {
  url: string
  title: string
  onClose: () => void
}) {
  const image = isPreviewableImage(url)

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} preview`}
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-charcoal">{title}</h3>
            <p className="break-all text-xs text-charcoal/55">{fileNameFromPath(url)}</p>
          </div>
          <button
            type="button"
            className="rounded-xl border border-soft-gold/40 px-3 py-2 text-xs font-semibold text-charcoal hover:bg-soft-gold/10"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="flex max-h-[78vh] items-center justify-center overflow-auto bg-charcoal/5 p-4">
          {image ? (
            <img
              src={url}
              alt={`${title} preview`}
              className="max-h-[74vh] max-w-full rounded-xl object-contain"
            />
          ) : (
            <div className="rounded-2xl border border-soft-gold/40 bg-white p-6 text-center">
              <p className="text-sm font-medium text-charcoal">Preview is available in a new tab.</p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-xl bg-trust-blue px-4 py-2 text-sm font-semibold text-white hover:bg-support-blue"
              >
                Open document
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DocumentUploadField({
  name,
  label,
  placeholder,
  value,
  error,
  captureMode = "environment",
  fileAccept = generalFileAccept,
  cameraAccept = "image/*",
  documentType,
  customerId,
}: DocumentUploadFieldProps) {
  const { register, setValue } = useFormContext<CustomerRecordFormInput>()
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const currentValue = trimUrl(value)
  const imagePreview = currentValue && isPreviewableImage(currentValue)
  const inputId = `customer-record-${name}`
  const uploadId = `${inputId}-file`
  const cameraId = `${inputId}-camera`

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return

    setUploading(true)
    setLocalError(null)

    try {
      const uploadedUrl = await uploadDocument(file, documentType, customerId)
      setValue(name, uploadedUrl, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  const clearFile = async () => {
    if (!currentValue) return

    const confirmed = window.confirm(
      "Delete this uploaded file and clear it from this record?"
    )

    if (!confirmed) return

    setDeleting(true)
    setLocalError(null)

    try {
      await deleteUploadedDocument(currentValue)
      setValue(name, "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
      setPreviewOpen(false)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Delete failed.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={docCard}>
      <label htmlFor={inputId} className={docLabel}>
        {label}
      </label>

      <input
        id={inputId}
        type="text"
        placeholder={placeholder}
        {...register(name)}
        className={docInput}
      />

      {imagePreview ? (
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="mt-3 block w-full overflow-hidden rounded-xl border border-soft-gold/40 bg-white"
        >
          <img
            src={currentValue}
            alt={`${label} thumbnail`}
            className="h-36 w-full object-contain p-2"
          />
        </button>
      ) : currentValue ? (
        <div className="mt-3 rounded-xl border border-soft-gold/40 bg-white p-3 text-xs text-charcoal/70">
          {fileNameFromPath(currentValue)}
        </div>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          id={uploadId}
          type="file"
          accept={fileAccept}
          onChange={handleFileChange}
          className="sr-only"
        />
        <label htmlFor={uploadId} className={cn(actionBtn, uploading && "pointer-events-none opacity-60")}>
          Upload file
        </label>

        <input
          id={cameraId}
          type="file"
          accept={cameraAccept}
          capture={captureMode}
          onChange={handleFileChange}
          className="sr-only"
        />
        <label htmlFor={cameraId} className={cn(actionBtn, uploading && "pointer-events-none opacity-60")}>
          Capture photo
        </label>

        {currentValue ? (
          <>
            <button type="button" onClick={() => setPreviewOpen(true)} className={actionBtn}>
              Preview / Zoom
            </button>
            <a
              href={currentValue}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-soft-gold/40 bg-white px-3 py-2 text-xs font-semibold text-charcoal/70 shadow-sm transition hover:bg-soft-gold/10"
            >
              Open
            </a>
            <button type="button" onClick={clearFile} className={dangerBtn} disabled={uploading || deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        ) : null}
      </div>

      {currentValue ? (
        <p className="mt-1.5 break-all text-[11px] text-charcoal/55 md:text-xs">
          {fileNameFromPath(currentValue)}
        </p>
      ) : null}

      <UploadLine filled={Boolean(currentValue)} uploading={uploading} />

      {localError ? <p className="mt-1.5 text-xs text-red-700 md:text-sm">{localError}</p> : null}
      {error ? <p className="mt-1.5 text-xs text-amber-900 md:text-sm">{String(error)}</p> : null}

      {previewOpen && currentValue ? (
        <PreviewModal url={currentValue} title={label} onClose={() => setPreviewOpen(false)} />
      ) : null}
    </div>
  )
}

export function StepDocuments({ customerId }: StepDocumentsProps) {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<CustomerRecordFormInput>()

  const panValue = useWatch({ control, name: "pan" })
  const aadhaarValue = useWatch({ control, name: "aadhaar" })
  const customerPictureUrl = useWatch({ control, name: "customerPictureUrl" })
  const panDocumentUrl = useWatch({ control, name: "panDocumentUrl" })
  const aadhaarFrontUrl = useWatch({ control, name: "aadhaarFrontUrl" })
  const aadhaarBackUrl = useWatch({ control, name: "aadhaarBackUrl" })
  const otherDocumentUrl = useWatch({ control, name: "otherDocumentUrl" })

  const errCls = "mt-1.5 text-xs text-amber-900 md:text-sm"

  return (
    <div className="space-y-4 md:space-y-5">
      <div>
        <p className="text-[11px] leading-snug text-charcoal/65 md:hidden">
          KYC numbers and uploaded document paths. You can upload files or capture photos from camera.
        </p>
        <p className="hidden text-sm leading-snug text-charcoal/70 md:block">
          Capture PAN and Aadhaar details, then upload documents or capture photos directly from camera.
        </p>
      </div>

      <section aria-labelledby="docs-kyc-heading" className="space-y-3">
        <h3 id="docs-kyc-heading" className="text-xs font-semibold uppercase tracking-wide text-trust-blue md:text-sm">
          PAN &amp; Aadhaar (KYC)
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 md:gap-4">
          <div className={docCard}>
            <label htmlFor="customer-record-pan" className={docLabel}>
              PAN
            </label>
            <input
              id="customer-record-pan"
              type="text"
              autoComplete="off"
              placeholder="ABCDE1234F"
              {...register("pan")}
              value={String(panValue ?? "")}
              onChange={(event) =>
                setValue("pan", normalizePanInput(event.target.value), {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              className={docInput}
            />
            <p className="mt-1 text-[11px] text-charcoal/55 md:text-xs">Format: ABCDE1234F</p>
            {errors.pan ? <p className={errCls}>{String(errors.pan.message)}</p> : null}
          </div>

          <div className={docCard}>
            <label htmlFor="customer-record-aadhaar" className={docLabel}>
              Aadhaar
            </label>
            <input
              id="customer-record-aadhaar"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="123412341234"
              {...register("aadhaar")}
              value={formatAadhaarInput(String(aadhaarValue ?? ""))}
              onChange={(event) =>
                setValue("aadhaar", formatAadhaarInput(event.target.value), {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              className={docInput}
            />
            <p className="mt-1 text-[11px] text-charcoal/55 md:text-xs">12 digits, shown as 1234 1234 1234</p>
            {errors.aadhaar ? <p className={errCls}>{String(errors.aadhaar.message)}</p> : null}
          </div>
        </div>
      </section>

      <section aria-labelledby="docs-files-heading" className="space-y-3">
        <h3 id="docs-files-heading" className="text-xs font-semibold uppercase tracking-wide text-trust-blue md:text-sm">
          Document files
        </h3>
        <p className="text-[11px] text-charcoal/55 md:text-xs">
          Upload JPG, PNG, WEBP, PDF, DOC, or DOCX files up to 10MB. Camera capture works on supported mobile devices.
        </p>

        <DocumentUploadField
          name="customerPictureUrl"
          documentType="customer-picture"
          customerId={customerId}
          label="Customer picture"
          placeholder="/uploads/customer-photo.jpg"
          value={customerPictureUrl}
          error={errors.customerPictureUrl?.message}
          captureMode="user"
          fileAccept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        />

        <DocumentUploadField
          name="panDocumentUrl"
          documentType="pan-document"
          customerId={customerId}
          label="PAN document"
          placeholder="/uploads/pan.pdf"
          value={panDocumentUrl}
          error={errors.panDocumentUrl?.message}
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <DocumentUploadField
            name="aadhaarFrontUrl"
            documentType="aadhaar-front"
            customerId={customerId}
            label="Aadhaar front"
            placeholder="/uploads/aadhaar-front.jpg"
            value={aadhaarFrontUrl}
            error={errors.aadhaarFrontUrl?.message}
          />

          <DocumentUploadField
            name="aadhaarBackUrl"
            documentType="aadhaar-back"
            customerId={customerId}
            label="Aadhaar back"
            placeholder="/uploads/aadhaar-back.jpg"
            value={aadhaarBackUrl}
            error={errors.aadhaarBackUrl?.message}
          />
        </div>

        <DocumentUploadField
          name="otherDocumentUrl"
          documentType="other-document"
          customerId={customerId}
          label="Other document"
          placeholder="/uploads/other-document.pdf"
          value={otherDocumentUrl}
          error={errors.otherDocumentUrl?.message}
        />
      </section>
    </div>
  )
}
