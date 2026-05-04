"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateOnly, formatInrAmount } from "@/lib/formatDateTime";
import type { ApiCustomerRecord } from "@/lib/customerRecordLoadRecord";

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

export default function CustomerActivityTable({
  records,
  loading,
  loadError,
  onContinue,
}: {
  records: CustomerRecord[];
  loading: boolean;
  loadError: string | null;
  onContinue?: (record: CustomerRecord) => void;
}) {
  return (
    <div className="px-4 md:px-6 py-6">
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
          <h3 className="text-lg font-medium text-charcoal">No customer records yet</h3>
          <p className="text-charcoal/60 max-w-md mx-auto">Start with the guided form above — save a draft or submit when ready.</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full border-collapse min-w-[1520px]">
            <thead>
              <tr className="border-b bg-ivory">
                <th className="text-left py-4 px-4 font-medium text-charcoal">Record</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Picture</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Name</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Mobile</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Email</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">City</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Customer Type</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Status</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Provider Company</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Service Commenced</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Expiry Date</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Premium / EMI</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Cover / Final Payout</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Updated</th>
                <th className="text-left py-4 px-4 font-medium text-charcoal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b hover:bg-ivory/50 even:bg-ivory/30">
                  <td className="py-4 px-4">
                    <Badge variant="outline" className={`${recordStatusClasses(record.recordStatus)} font-medium`}>
                      {record.recordStatus === "DRAFT" ? "Draft" : "Submitted"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    {record.customerPictureUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin URLs
                      <img
                        src={record.customerPictureUrl}
                        alt={`${record.firstName ?? "Customer"} picture`}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full object-cover border border-soft-gold/30"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-ivory border border-soft-gold/30 flex items-center justify-center text-xs text-charcoal/50">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-charcoal">
                      {[record.firstName, record.middleName, record.lastName].filter(Boolean).join(" ") || "—"}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-sm text-charcoal">{record.mobile || "—"}</td>
                  <td className="py-4 px-4 text-charcoal/80">{record.email || "-"}</td>
                  <td className="py-4 px-4 text-charcoal/80">{record.city || "—"}</td>
                  <td className="py-4 px-4">
                    {record.customerType ? (
                      <Badge variant="outline" className={typeClasses(record.customerType)}>
                        {labelType(record.customerType)}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {record.customerStatus ? (
                      <Badge className={`${statusClasses(record.customerStatus)} font-medium`}>
                        {labelStatus(record.customerStatus)}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-4 px-4 text-charcoal/80">{record.providerCompanyName || "-"}</td>
                  <td className="py-4 px-4 text-charcoal/80">{formatDateOnly(record.serviceCommencedDate)}</td>
                  <td className="py-4 px-4 text-charcoal/80">{formatDateOnly(record.expiryDate)}</td>
                  <td className="py-4 px-4 text-charcoal/80">{formatInrAmount(record.premiumEmi)}</td>
                  <td className="py-4 px-4 text-charcoal/80">{formatInrAmount(record.coverFinalPayout)}</td>
                  <td className="py-4 px-4 text-sm text-charcoal/80">{formatDateOnly(record.updatedAt)}</td>
                  <td className="py-4 px-4">
                    {onContinue ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-lg border-trust-blue/40 text-trust-blue hover:bg-trust-blue/10"
                        onClick={() => onContinue(record)}
                      >
                        {record.recordStatus === "DRAFT" ? "Continue" : "Edit"}
                      </Button>
                    ) : null}
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
