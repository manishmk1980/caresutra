"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { cn } from "@/lib/utils";

const docCard =
  "rounded-2xl border border-soft-gold/35 bg-ivory/40 p-3 shadow-sm md:p-4";
const docInput =
  "mt-1.5 w-full rounded-xl border border-soft-gold/40 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition-shadow focus-visible:border-trust-blue/50 focus-visible:ring-2 focus-visible:ring-trust-blue/25 md:mt-2 md:px-4 md:py-3";
const docLabel = "block text-xs font-medium text-charcoal md:text-sm";

function trimUrl(v: unknown): string {
  if (v === undefined || v === null) return "";
  return String(v).trim();
}

function UploadLine({ filled }: { filled: boolean }) {
  return (
    <p className="mt-1.5 text-[11px] font-medium md:text-xs" aria-live="polite">
      <span className={filled ? "text-green-800" : "text-charcoal/50"}>{filled ? "Uploaded" : "Not uploaded"}</span>
    </p>
  );
}

export function StepDocuments() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<CustomerRecordFormInput>();

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
          KYC numbers and document URLs or paths. Status updates as you type.
        </p>
        <p className="hidden text-sm leading-snug text-charcoal/70 md:block">
          Capture PAN and Aadhaar, then link or paste paths for each document. Optional fields can be added later.
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
              className={docInput}
            />
            <p className="mt-1 text-[11px] text-charcoal/55 md:text-xs">12 digits</p>
            {errors.aadhaar ? <p className={errCls}>{String(errors.aadhaar.message)}</p> : null}
          </div>
        </div>
      </section>

      <section aria-labelledby="docs-files-heading" className="space-y-3">
        <h3 id="docs-files-heading" className="text-xs font-semibold uppercase tracking-wide text-trust-blue md:text-sm">
          Document files (URL or path)
        </h3>
        <p className="text-[11px] text-charcoal/55 md:text-xs">Paste a public URL or an app upload path (e.g. /uploads/…).</p>

        <div className={cn(docCard, "space-y-1")}>
          <label htmlFor="customer-record-picture-url" className={docLabel}>
            Customer picture
          </label>
          <input
            id="customer-record-picture-url"
            type="text"
            placeholder="/uploads/customer-photo.jpg"
            {...register("customerPictureUrl")}
            className={docInput}
          />
          <UploadLine filled={Boolean(trimUrl(customerPictureUrl))} />
          {errors.customerPictureUrl ? (
            <p className={errCls}>{String(errors.customerPictureUrl.message)}</p>
          ) : null}
        </div>

        <div className={docCard}>
          <label htmlFor="customer-record-pan-doc-url" className={docLabel}>
            PAN document
          </label>
          <input
            id="customer-record-pan-doc-url"
            type="text"
            placeholder="/uploads/pan.pdf"
            {...register("panDocumentUrl")}
            className={docInput}
          />
          <UploadLine filled={Boolean(trimUrl(panDocumentUrl))} />
          {errors.panDocumentUrl ? <p className={errCls}>{String(errors.panDocumentUrl.message)}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          <div className={docCard}>
            <label htmlFor="customer-record-aadhaar-front-url" className={docLabel}>
              Aadhaar front
            </label>
            <input
              id="customer-record-aadhaar-front-url"
              type="text"
              placeholder="/uploads/aadhaar-front.jpg"
              {...register("aadhaarFrontUrl")}
              className={docInput}
            />
            <UploadLine filled={Boolean(trimUrl(aadhaarFrontUrl))} />
            {errors.aadhaarFrontUrl ? <p className={errCls}>{String(errors.aadhaarFrontUrl.message)}</p> : null}
          </div>
          <div className={docCard}>
            <label htmlFor="customer-record-aadhaar-back-url" className={docLabel}>
              Aadhaar back
            </label>
            <input
              id="customer-record-aadhaar-back-url"
              type="text"
              placeholder="/uploads/aadhaar-back.jpg"
              {...register("aadhaarBackUrl")}
              className={docInput}
            />
            <UploadLine filled={Boolean(trimUrl(aadhaarBackUrl))} />
            {errors.aadhaarBackUrl ? <p className={errCls}>{String(errors.aadhaarBackUrl.message)}</p> : null}
          </div>
        </div>

        <div className={docCard}>
          <label htmlFor="customer-record-other-doc-url" className={docLabel}>
            Other document
          </label>
          <input
            id="customer-record-other-doc-url"
            type="text"
            placeholder="/uploads/other-document.pdf"
            {...register("otherDocumentUrl")}
            className={docInput}
          />
          <UploadLine filled={Boolean(trimUrl(otherDocumentUrl))} />
          {errors.otherDocumentUrl ? <p className={errCls}>{String(errors.otherDocumentUrl.message)}</p> : null}
        </div>
      </section>
    </div>
  );
}
