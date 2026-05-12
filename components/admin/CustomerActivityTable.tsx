"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateOnly, formatInrAmount } from "@/lib/formatDateTime";
import type { ApiCustomerRecord } from "@/lib/customerRecordLoadRecord";
import { Eye, Pencil } from "lucide-react";
import { SafeCustomerImage } from "@/components/admin/SafeCustomerImage";
import { cn } from "@/lib/utils";

export type CustomerRecord = ApiCustomerRecord;

function statusClasses(status: NonNullable<CustomerRecord["customerStatus"]>) {
  if (status === "ACTIVE") return "bg-green-100 text-green-800 border border-green-300";
  if (status === "INACTIVE") return "bg-gray-100 text-gray-700 border border-gray-300";
  return "bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/40";
}

function typeClasses(type: NonNullable<CustomerRecord["customerType"]>) {
  if (type === "INSURANCE") return "bg-trust-blue/15 text-trust-blue border border-trust-blue/30";
  if (type === "LOAN") return "bg-support-blue/15 text-support-blue border border-support-blue/30";
  return "bg-green-100 text-green-800 border border-green-300";
}

function recordStatusClasses(rs: CustomerRecord["recordStatus"]) {
  if (rs === "DRAFT") return "bg-soft-gold/30 text-charcoal border border-heritage-gold/50";
  return "bg-trust-blue/15 text-trust-blue border border-trust-blue/35";
}

const STATUS_LABELS: Record<NonNullable<CustomerRecord["customerStatus"]>, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PROSPECT: "Prospect",
};

const TYPE_LABELS: Record<NonNullable<CustomerRecord["customerType"]>, string> = {
  INSURANCE: "Insurance",
  LOAN: "Loan",
  HEALTHCARE: "Healthcare",
};

function labelStatus(status: CustomerRecord["customerStatus"]) {
  if (!status) return "—";
  return STATUS_LABELS[status];
}

function labelType(type: CustomerRecord["customerType"]) {
  if (!type) return "—";
  return TYPE_LABELS[type];
}

function DocChip({ ok, label, abbr }: { ok: boolean; label: string; abbr: string }) {
  return (
    <span
      title={`${label}: ${ok ? "Uploaded" : "Not uploaded"}`}
      className={cn(
        "inline-flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded border px-0.5 font-mono text-[9px] font-bold leading-none",
        ok ? "border-green-300/80 bg-green-50 text-green-800" : "border-soft-gold/35 bg-ivory text-charcoal/35",
      )}
      aria-label={`${label}: ${ok ? "Uploaded" : "Not uploaded"}`}
    >
      {abbr}
    </span>
  );
}

function DocumentChips({ record }: { record: CustomerRecord }) {
  const pic = Boolean(record.customerPictureUrl?.trim());
  const pan = Boolean(record.panDocumentUrl?.trim());
  const af = Boolean(record.aadharFrontUrl?.trim());
  const ab = Boolean(record.aadharBackUrl?.trim());
  const oth = Boolean(record.otherDocumentUrl?.trim());
  return (
    <div className="flex flex-wrap items-center gap-0.5" role="group" aria-label="Document upload status">
      <DocChip ok={pic} label="Customer picture" abbr="P" />
      <DocChip ok={pan} label="PAN document" abbr="N" />
      <DocChip ok={af} label="Aadhaar front" abbr="F" />
      <DocChip ok={ab} label="Aadhaar back" abbr="B" />
      <DocChip ok={oth} label="Other document" abbr="O" />
    </div>
  );
}

export default function CustomerActivityTable({
  records,
  loading,
  loadError,
  onEdit,
  onView,
}: {
  records: CustomerRecord[];
  loading: boolean;
  loadError: string | null;
  onEdit?: (record: CustomerRecord) => void;
  onView?: (record: CustomerRecord) => void;
}) {
  return (
    <div className="px-2 py-4 md:px-6 md:py-6">
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-trust-blue"></div>
          <p className="mt-4 text-charcoal/70">Loading customer records...</p>
        </div>
      ) : loadError ? (
        <div className="text-center py-8 space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-support-blue/20 text-support-blue">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-support-blue font-medium">{loadError}</p>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-trust-blue/20 text-trust-blue">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <p className="mx-auto max-w-md text-base font-medium leading-relaxed text-charcoal">
            No customer records yet. Start by adding a customer record.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full border-collapse min-w-[1680px]">
            <thead>
              <tr className="border-b bg-ivory">
                <th className="text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Record</th>
                <th className="text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Picture</th>
                <th className="min-w-[120px] text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Docs</th>
                <th className="text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Name</th>
                <th className="text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Mobile</th>
                <th className="min-w-[220px] text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Email</th>
                <th className="min-w-[120px] text-left py-3.5 px-4 font-semibold text-charcoal align-middle">City</th>
                <th className="min-w-[130px] text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Customer Type</th>
                <th className="min-w-[120px] text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Customer status</th>
                <th className="min-w-[160px] text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Provider Company</th>
                <th className="text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Service Commenced</th>
                <th className="text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Expiry Date</th>
                <th className="text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Premium / EMI</th>
                <th className="text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Cover / Final Payout</th>
                <th className="min-w-[110px] text-left py-3.5 px-4 font-semibold text-charcoal align-middle">Updated</th>
                <th className="sticky right-0 z-10 min-w-[100px] text-left py-3.5 px-4 font-semibold text-charcoal align-middle bg-ivory">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b hover:bg-ivory/50 even:bg-ivory/30">
                  <td className="py-3.5 px-4 align-middle">
                    <Badge variant="outline" className={`${recordStatusClasses(record.recordStatus)} font-medium`}>
                      {record.recordStatus === "DRAFT" ? "Draft" : "Submitted"}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 align-middle">
                    {record.customerPictureUrl ? (
                      <SafeCustomerImage
                        src={record.customerPictureUrl}
                        alt={`${record.firstName ?? "Customer"} picture`}
                        className="h-11 w-11 rounded-full border border-soft-gold/30 object-cover"
                        fallbackClassName="h-11 w-11 rounded-full"
                        fallbackText="N/A"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-soft-gold/30 bg-ivory text-xs text-charcoal/50">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 align-middle">
                    <DocumentChips record={record} />
                  </td>
                  <td className="py-3.5 px-4 align-middle">
                    <div className="font-medium text-charcoal">
                      {[record.firstName, record.middleName, record.lastName].filter(Boolean).join(" ") || "—"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-middle font-mono text-sm text-charcoal whitespace-nowrap">{record.mobile || "—"}</td>
                  <td className="py-3.5 px-4 align-middle text-charcoal/80 break-words">{record.email || "—"}</td>
                  <td className="py-3.5 px-4 align-middle text-charcoal/80">{record.city || "—"}</td>
                  <td className="py-3.5 px-4 align-middle">
                    {record.customerType ? (
                      <Badge variant="outline" className={typeClasses(record.customerType)}>
                        {labelType(record.customerType)}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3.5 px-4 align-middle">
                    {record.customerStatus ? (
                      <Badge className={`${statusClasses(record.customerStatus)} font-medium`}>
                        {labelStatus(record.customerStatus)}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3.5 px-4 align-middle text-charcoal/80 break-words">{record.providerCompanyName || "—"}</td>
                  <td className="py-3.5 px-4 align-middle text-charcoal/80 whitespace-nowrap">{formatDateOnly(record.serviceCommencedDate)}</td>
                  <td className="py-3.5 px-4 align-middle text-charcoal/80 whitespace-nowrap">{formatDateOnly(record.expiryDate)}</td>
                  <td className="py-3.5 px-4 align-middle text-charcoal/80 whitespace-nowrap">{formatInrAmount(record.premiumEmi)}</td>
                  <td className="py-3.5 px-4 align-middle text-charcoal/80 whitespace-nowrap">{formatInrAmount(record.coverFinalPayout)}</td>
                  <td className="py-3.5 px-4 align-middle text-sm text-charcoal/80 whitespace-nowrap">{formatDateOnly(record.updatedAt)}</td>
                  <td className="sticky right-0 z-[1] py-3.5 px-4 align-middle bg-white/95 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      {onView ? (
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg border-soft-gold/50 text-support-blue hover:bg-support-blue/10"
                          aria-label="View customer record"
                          title="View"
                          onClick={() => onView(record)}
                        >
                          <Eye className="h-4 w-4" aria-hidden />
                        </Button>
                      ) : null}
                      {onEdit ? (
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg border-trust-blue/40 text-trust-blue hover:bg-trust-blue/10"
                          aria-label="Edit customer record"
                          title="Edit"
                          onClick={() => onEdit(record)}
                        >
                          <Pencil className="h-4 w-4" aria-hidden />
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
