"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export type CustomerRecord = {
  id: number;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email?: string | null;
  mobile: string;
  city: string;
  customerPictureUrl?: string | null;
  customerType: "INSURANCE" | "LOAN" | "HEALTHCARE";
  customerStatus: "ACTIVE" | "INACTIVE" | "PROSPECT";
  providerCompanyName?: string | null;
  serviceCommencedDate?: string | null;
  expiryDate?: string | null;
  premiumEmi?: string | number | null;
  coverFinalPayout?: string | number | null;
  createdAt: string;
};

function statusClasses(status: CustomerRecord["customerStatus"]) {
  if (status === "ACTIVE") return "bg-green-100 text-green-800 border border-green-300";
  if (status === "INACTIVE") return "bg-gray-100 text-gray-700 border border-gray-300";
  return "bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/40";
}

function typeClasses(type: CustomerRecord["customerType"]) {
  if (type === "INSURANCE") return "bg-trust-blue/15 text-trust-blue border border-trust-blue/30";
  if (type === "LOAN") return "bg-support-blue/15 text-support-blue border border-support-blue/30";
  return "bg-green-100 text-green-800 border border-green-300";
}

function labelStatus(status: CustomerRecord["customerStatus"]) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function labelType(type: CustomerRecord["customerType"]) {
  if (type === "HEALTHCARE") return "Healthcare";
  if (type === "INSURANCE") return "Insurance";
  return "Loan";
}

function formatCurrency(value: string | number | null | undefined) {
  if (value === undefined || value === null || value === "") return "-";
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(parsed);
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

export default function CustomerActivityTable({
  records,
  loading,
  loadError,
}: {
  records: CustomerRecord[];
  loading: boolean;
  loadError: string | null;
}) {

    return (
        <Card className="shadow-xl border-soft-gold/30 rounded-3xl">
            <CardHeader className="bg-gradient-to-r from-trust-blue/10 to-support-blue/10 rounded-t-3xl border-b border-soft-gold/20">
                <CardTitle className="text-charcoal font-cormorant text-2xl">Customer Records</CardTitle>
                <CardDescription className="text-charcoal/70">
                  View, monitor, and track customer service records.
                </CardDescription>
            </CardHeader>
            <CardContent>
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
                        <p className="text-charcoal/60 max-w-md mx-auto">
                            Start by adding a customer record using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-2 px-2">
                        <table className="w-full border-collapse min-w-[1400px]">
                            <thead>
                                <tr className="border-b bg-ivory">
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
                                    <th className="text-left py-4 px-4 font-medium text-charcoal">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record) => (
                                    <tr key={record.id} className="border-b hover:bg-ivory/50 even:bg-ivory/30">
                                        <td className="py-4 px-4">
                                          {record.customerPictureUrl ? (
                                            <Image
                                              src={record.customerPictureUrl}
                                              alt={`${record.firstName} picture`}
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
                                              {[record.firstName, record.middleName, record.lastName].filter(Boolean).join(" ")}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 font-mono text-sm text-charcoal">{record.mobile}</td>
                                        <td className="py-4 px-4 text-charcoal/80">{record.email || "-"}</td>
                                        <td className="py-4 px-4 text-charcoal/80">{record.city}</td>
                                        <td className="py-4 px-4">
                                            <Badge variant="outline" className={typeClasses(record.customerType)}>
                                                {labelType(record.customerType)}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge className={`${statusClasses(record.customerStatus)} font-medium`}>
                                                {labelStatus(record.customerStatus)}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4 text-charcoal/80">{record.providerCompanyName || "-"}</td>
                                        <td className="py-4 px-4 text-charcoal/80">{formatDate(record.serviceCommencedDate)}</td>
                                        <td className="py-4 px-4 text-charcoal/80">{formatDate(record.expiryDate)}</td>
                                        <td className="py-4 px-4 text-charcoal/80">{formatCurrency(record.premiumEmi)}</td>
                                        <td className="py-4 px-4 text-charcoal/80">{formatCurrency(record.coverFinalPayout)}</td>
                                        <td className="py-4 px-4 text-sm text-charcoal/80">{formatDate(record.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}