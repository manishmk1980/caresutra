"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { formatDateOnly, formatInrAmount } from "@/lib/formatDateTime";
import { Button } from "@/components/ui/button";

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

function displayValue(value: unknown): string {
  if (value === undefined || value === null) return "—";
  if (typeof value === "string" && value.trim().length === 0) return "—";
  return String(value);
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

  return (
    <div className="space-y-6">
      <p className="text-sm text-charcoal/70">
        Review everything below. Use <strong>Back</strong> to edit a step, <strong>Save Draft</strong> to save progress,
        or <strong>Submit</strong> to finalize the record.
      </p>
      <div className="rounded-2xl border border-soft-gold/35 bg-ivory/50 p-4 md:p-5 space-y-5 text-sm">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">Section 1: Personal Details</p>
            <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={() => onEditStep(0)}>
              Edit
            </Button>
          </div>
          <p>Full Name: {displayValue(fullName)}</p>
          <p>First Name: {displayValue(v.firstName)}</p>
          <p>Middle Name: {displayValue(v.middleName)}</p>
          <p>Last Name: {displayValue(v.lastName)}</p>
          <p>Email Address: {displayValue(v.email)}</p>
          <p>Mobile: {displayValue(v.mobile)}</p>
          <p>Alternative Mobile: {displayValue(v.alternativeMobile)}</p>
          <p>Date of Birth: {v.dateOfBirth ? formatDateOnly(v.dateOfBirth) : "—"}</p>
          <p>PAN: {displayValue(v.pan)}</p>
          <p>AADHAAR: {displayValue(v.aadhaar)}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">Section 2: Address Details</p>
            <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={() => onEditStep(1)}>
              Edit
            </Button>
          </div>
          <p>Home / Apartment / Flat: {displayValue(v.addressLine)}</p>
          <p>Floor: {displayValue(v.floor)}</p>
          <p>Street / Locality: {displayValue(v.street)}</p>
          <p>City: {displayValue(v.city)}</p>
          <p>State: {displayValue(v.state)}</p>
          <p>PIN Code: {displayValue(v.pinCode)}</p>
          <p>Full Address: {displayValue(fullAddress)}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">Section 3: Customer Picture</p>
            <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={() => onEditStep(2)}>
              Edit
            </Button>
          </div>
          {v.customerPictureUrl?.trim() ? (
            <div className="h-24 w-24 rounded-xl overflow-hidden border border-soft-gold/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.customerPictureUrl} alt="Customer" className="h-full w-full object-cover" />
            </div>
          ) : (
            <p>No picture added</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">Section 4: Customer Status & Type</p>
            <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={() => onEditStep(3)}>
              Edit
            </Button>
          </div>
          <p>Customer Status: {displayValue(STATUS[v.customerStatus] ?? v.customerStatus)}</p>
          <p>Customer Type: {displayValue(TYPE[v.customerType] ?? v.customerType)}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">Section 5: Service Details</p>
            <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={() => onEditStep(3)}>
              Edit
            </Button>
          </div>
          <p>Provider Company Name: {displayValue(v.providerCompanyName)}</p>
          <p>Date of Service Commenced: {v.serviceCommencedDate ? formatDateOnly(v.serviceCommencedDate) : "—"}</p>
          <p>Expiry Date: {v.expiryDate ? formatDateOnly(v.expiryDate) : "—"}</p>
          <p>
            Insurance / Loan Amount:{" "}
            {v.insuranceLoanAmount !== undefined && v.insuranceLoanAmount !== null && v.insuranceLoanAmount !== ""
              ? formatInrAmount(v.insuranceLoanAmount)
              : "—"}
          </p>
          <p>
            Premium / EMI:{" "}
            {v.premiumEmi !== undefined && v.premiumEmi !== null && v.premiumEmi !== ""
              ? formatInrAmount(v.premiumEmi)
              : "—"}
          </p>
          <p>
            Cover / Final Payout:{" "}
            {v.coverFinalPayout !== undefined && v.coverFinalPayout !== null && v.coverFinalPayout !== ""
              ? formatInrAmount(v.coverFinalPayout)
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
