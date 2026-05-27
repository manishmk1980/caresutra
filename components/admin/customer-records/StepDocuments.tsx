"use client";

import { ChangeEvent, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { cn } from "@/lib/utils";

const docCard =
  "rounded-2xl border border-soft-gold/35 bg-ivory/40 p-3 shadow-sm md:p-4";
const docInput =
  "mt-1.5 w-full rounded-xl border border-soft-gold/40 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition-shadow focus-visible:border-trust-blue/50 focus-visible:ring-2 focus-visible:ring-trust-blue/25 md:mt-2 md:px-4 md:py-3";
const docLabel = "block text-xs font-medium text-charcoal md:text-sm";
const actionBtn =
  "inline-flex items-center justify-center rounded-xl border border-trust-blue/20 bg-white px-3 py-2 text-xs font-semibold text-trust-blue shadow-sm transition hover:border-trust-blue/35 hover:bg-trust-blue/5 disabled:cursor-not-allowed disabled:opacity-60";
const dangerBtn =
  "inline-flex items-center justify-center rounded-xl border border-amber-700/20 bg-white px-3 py-2 text-xs font-semibold text-amber-900 shadow-sm transition hover:border-amber-700/35 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60";

type DocumentFieldName =
  | "customerPictureUrl"
  | "panDocumentUrl"
  | "aadhaarFrontUrl"
  | "aadhaarBackUrl"
  | "otherDocumentUrl";

type DocumentUploadFieldProps = {
  name: DocumentFieldName;
  label: string;
  placeholder: string;
  value: unknown;
  error?: unknown;
  captureMode?: "user" | "environment";
  fileAccept?: string;
  cameraAccept?: string;
};

const generalFileAccept =
  ".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function trimUrl(v: unknown): string {
  if (v === undefined || v === null) return "";
  return String(v).trim();
}

function normalizePanInput(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
}

function formatAadhaarInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function UploadLine({ filled, uploading }: { filled: boolean; uploading?: boolean }) {
  return (
    <p className="mt-1.5 text-[11px] font-medium md:text-xs" aria-live="polite">
      <span className={filled ? "text-green-800" : "text-charcoal/50"}>
        {uploading ? "Uploading..." : filled ? "Uploaded" : "Not uploaded"}
      </span>
    </p>
  );
}

async function uploadDocument(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/customer-records/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Upload failed.");
  }

  if (!data.url || typeof data.url !== "string") {
    throw new Error("Upload completed but no file URL was returned.");
  }

  return data.url;
}

function fileNameFromPath(value: string): string {
  const clean = value.split("?")[0] || value;
  return clean.split("/").filter(Boolean).pop() || value;
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
}: DocumentUploadFieldProps) {
  const { register, setValue } = useFormContext<CustomerRecordFormInput>();
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const currentValue = trimUrl(value);
  const inputId = `customer-record-${name}`;
  const uploadId = `${inputId}-file`;
  const cameraId = `${inputId}-camera`;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setUploading(true);
    setLocalError(null);

    try {
      const uploadedUrl = await uploadDocument(file);
      setValue(name, uploadedUrl, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setValue(name, "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setLocalError(null);
  };

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
            <a
              href={currentValue}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-soft-gold/40 bg-white px-3 py-2 text-xs font-semibold text-charcoal/70 shadow-sm transition hover:bg-soft-gold/10"
            >
              View
            </a>
            <button type="button" onClick={clearFile} className={dangerBtn} disabled={uploading}>
              Clear
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
    </div>
  );
}

export function StepDocuments() {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<CustomerRecordFormInput>();

  const panValue = useWatch({ control, name: "pan" });
  const aadhaarValue = useWatch({ control, name: "aadhaar" });
  const customerPictureUrl = useWatch({ control, name: "customerPictureUrl" });
  const panDocumentUrl = useWatch({ control, name: "panDocumentUrl" });
  const aadhaarFrontUrl = useWatch({ control, name: "aadhaarFrontUrl" });
  const aadhaarBackUrl = useWatch({ control, name: "aadhaarBackUrl" });
  const otherDocumentUrl = useWatch({ control, name: "otherDocumentUrl" });

  const errCls = "mt-1.5 text-xs text-amber-900 md:text-sm";

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
          label="Customer picture"
          placeholder="/uploads/customer-photo.jpg"
          value={customerPictureUrl}
          error={errors.customerPictureUrl?.message}
          captureMode="user"
          fileAccept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        />

        <DocumentUploadField
          name="panDocumentUrl"
          label="PAN document"
          placeholder="/uploads/pan.pdf"
          value={panDocumentUrl}
          error={errors.panDocumentUrl?.message}
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <DocumentUploadField
            name="aadhaarFrontUrl"
            label="Aadhaar front"
            placeholder="/uploads/aadhaar-front.jpg"
            value={aadhaarFrontUrl}
            error={errors.aadhaarFrontUrl?.message}
          />

          <DocumentUploadField
            name="aadhaarBackUrl"
            label="Aadhaar back"
            placeholder="/uploads/aadhaar-back.jpg"
            value={aadhaarBackUrl}
            error={errors.aadhaarBackUrl?.message}
          />
        </div>

        <DocumentUploadField
          name="otherDocumentUrl"
          label="Other document"
          placeholder="/uploads/other-document.pdf"
          value={otherDocumentUrl}
          error={errors.otherDocumentUrl?.message}
        />
      </section>
    </div>
  );
}
