"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { formatDateOnly, formatInrAmount } from "@/lib/formatDateTime";
import { Button } from "@workspace/ui/components/button";
import { SafeCustomerImage } from "@/components/admin/SafeCustomerImage";

const STATUS: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PROSPECT: "Prospect",
};
const TYPE: Record<string, string> = {
  INSURANCE: "Insurance",
  LOAN: "Loan",
  HEALTHCARE: "Healthcare",
};

function displayValue(value: unknown, fallback = "Not provided yet"): string {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "string" && value.trim().length === 0) return fallback;
  return String(value);
}

function docFilled(v: unknown): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

function DocStatus({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-soft-gold/30 bg-white/80 px-2 py-0.5 text-[11px] md:text-xs">
      <span className="text-charcoal/70">{label}</span>
      <span className={ok ? "font-medium text-green-800" : "text-charcoal/45"}>{ok ? "Uploaded" : "Not uploaded"}</span>
    </span>
  );
}

type Props = {
  onEditStep: (step: number) => void;
};

export function StepReviewSubmit({ onEditStep }: Props) {
  const { control } = useFormContext<CustomerRecordFormInput>();
  const v = useWatch({ control }) as CustomerRecordFormInput;

  const fullName = [v.firstName, v.middleName, v.lastName].filter((part) => Boolean(part?.trim())).join(" ");
  const fullAddress = [v.addressLine, v.floor, v.street, v.city, v.state, v.pinCode]
    .filter((part) => Boolean(part?.trim()))
    .join(", ");

  const optionalDocs: { label: string; ok: boolean }[] = [
    { label: "Customer picture", ok: docFilled(v.customerPictureUrl) },
    { label: "PAN document", ok: docFilled(v.panDocumentUrl) },
    { label: "Aadhaar front", ok: docFilled(v.aadhaarFrontUrl) },
    { label: "Aadhaar back", ok: docFilled(v.aadhaarBackUrl) },
    { label: "Other document", ok: docFilled(v.otherDocumentUrl) },
  ];
  const missingOptional = optionalDocs.filter((d) => !d.ok);

  return (
    <div className="space-y-4 md:space-y-6">
      <div
        role="status"
        className="rounded-2xl border border-trust-blue/20 bg-trust-blue/[0.06] px-3 py-2.5 text-[11px] leading-snug text-charcoal md:px-4 md:py-3 md:text-sm"
      >
        <p className="font-medium text-trust-blue">Please review details before final submission.</p>
        <p className="mt-1 text-charcoal/75">
          Use <strong className="font-semibold text-charcoal">Back</strong> to edit a step,{" "}
          <strong className="font-semibold text-charcoal">Save draft</strong> to keep progress, or{" "}
          <strong className="font-semibold text-charcoal">Submit</strong> when everything is correct.
        </p>
      </div>

      {missingOptional.length > 0 ? (
        <div className="rounded-2xl border border-soft-gold/40 bg-ivory/60 px-3 py-2.5 md:px-4 md:py-3">
          <p className="text-xs font-semibold text-charcoal md:text-sm">Optional documents not yet added</p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[11px] text-charcoal/75 md:text-sm">
            {missingOptional.map((d) => (
              <li key={d.label}>{d.label}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="space-y-4 rounded-2xl border border-soft-gold/35 bg-ivory/50 p-3 text-sm md:space-y-5 md:p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">Personal details</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-lg"
              onClick={() => onEditStep(0)}
              aria-label="Edit personal details"
            >
              Edit
            </Button>
          </div>
          <p>
            <span className="text-charcoal/65">Name: </span>
            {displayValue(fullName)}
          </p>
          <p>
            <span className="text-charcoal/65">Email: </span>
            {displayValue(v.email, "No email added")}
          </p>
          <p>
            <span className="text-charcoal/65">Mobile: </span>
            {displayValue(v.mobile)}
          </p>
          <p>
            <span className="text-charcoal/65">Alternative mobile: </span>
            {displayValue(v.alternativeMobile, "No alternate mobile added")}
          </p>
          <p>
            <span className="text-charcoal/65">Date of birth: </span>
            {v.dateOfBirth ? formatDateOnly(v.dateOfBirth) : "Date of birth not known"}
          </p>
        </div>

        <div className="space-y-2 border-t border-soft-gold/25 pt-3 md:pt-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">Address details</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-lg"
              onClick={() => onEditStep(1)}
              aria-label="Edit address details"
            >
              Edit
            </Button>
          </div>
          <p>
            <span className="text-charcoal/65">Full address: </span>
            {displayValue(fullAddress)}
          </p>
          <p>
            <span className="text-charcoal/65">PIN code: </span>
            {displayValue(v.pinCode)}
          </p>
        </div>

        <div className="space-y-2 border-t border-soft-gold/25 pt-3 md:pt-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">Documents &amp; KYC</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-lg"
              onClick={() => onEditStep(2)}
              aria-label="Edit documents and KYC"
            >
              Edit
            </Button>
          </div>
          <p>
            <span className="text-charcoal/65">PAN: </span>
            {displayValue(v.pan, "PAN number not added")}
          </p>
          <p>
            <span className="text-charcoal/65">Aadhaar: </span>
            {displayValue(v.aadhaar, "Aadhaar number not added")}
          </p>
          {v.customerPictureUrl?.trim() ? (
            <div className="flex items-start gap-3">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-soft-gold/40 bg-white">
                <SafeCustomerImage
                  src={v.customerPictureUrl.trim()}
                  alt="Customer"
                  className="h-full w-full object-cover"
                  fallbackClassName="h-full w-full"
                  fallbackText="Unavailable"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-xs text-charcoal/65">Customer picture preview</p>
                <div className="flex flex-wrap gap-1.5">
                  <DocStatus ok={docFilled(v.customerPictureUrl)} label="Photo" />
                  <DocStatus ok={docFilled(v.panDocumentUrl)} label="PAN doc" />
                  <DocStatus ok={docFilled(v.aadhaarFrontUrl)} label="Aadhaar F" />
                  <DocStatus ok={docFilled(v.aadhaarBackUrl)} label="Aadhaar B" />
                  <DocStatus ok={docFilled(v.otherDocumentUrl)} label="Other" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              <DocStatus ok={false} label="Photo" />
              <DocStatus ok={docFilled(v.panDocumentUrl)} label="PAN doc" />
              <DocStatus ok={docFilled(v.aadhaarFrontUrl)} label="Aadhaar F" />
              <DocStatus ok={docFilled(v.aadhaarBackUrl)} label="Aadhaar B" />
              <DocStatus ok={docFilled(v.otherDocumentUrl)} label="Other" />
            </div>
          )}
        </div>

        <div className="space-y-2 border-t border-soft-gold/25 pt-3 md:pt-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">Service details</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="rounded-lg"
              onClick={() => onEditStep(3)}
              aria-label="Edit service details"
            >
              Edit
            </Button>
          </div>
          <p>
            <span className="text-charcoal/65">Customer status: </span>
            {displayValue(STATUS[v.customerStatus] ?? v.customerStatus)}
          </p>
          <p>
            <span className="text-charcoal/65">Customer type: </span>
            {displayValue(TYPE[v.customerType] ?? v.customerType)}
          </p>
          <p>
            <span className="text-charcoal/65">Provider company: </span>
            {displayValue(v.providerCompanyName, "Provider not confirmed")}
          </p>
          <p>
            <span className="text-charcoal/65">Service commenced: </span>
            {v.serviceCommencedDate ? formatDateOnly(v.serviceCommencedDate) : "Start date not confirmed"}
          </p>
          <p>
            <span className="text-charcoal/65">Expiry date: </span>
            {v.expiryDate ? formatDateOnly(v.expiryDate) : "Expiry date not confirmed"}
          </p>
          <p>
            <span className="text-charcoal/65">Insurance / loan amount: </span>
            {v.insuranceLoanAmount !== undefined && v.insuranceLoanAmount !== null && v.insuranceLoanAmount !== ""
              ? formatInrAmount(v.insuranceLoanAmount)
              : "Amount not confirmed"}
          </p>
          <p>
            <span className="text-charcoal/65">Premium / EMI: </span>
            {v.premiumEmi !== undefined && v.premiumEmi !== null && v.premiumEmi !== ""
              ? formatInrAmount(v.premiumEmi)
              : "Premium/EMI not confirmed"}
          </p>
          <p>
            <span className="text-charcoal/65">Cover / final payout: </span>
            {v.coverFinalPayout !== undefined && v.coverFinalPayout !== null && v.coverFinalPayout !== ""
              ? formatInrAmount(v.coverFinalPayout)
              : "Payout not confirmed"}
          </p>
        </div>
      </div>
    </div>
  );
}
