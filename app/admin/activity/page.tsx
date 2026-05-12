"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CustomerRecordWizard, { type CustomerRecordWizardHandle } from "@/components/admin/customer-records/CustomerRecordWizard";
import CustomerActivityTable, { type CustomerRecord } from "@/components/admin/CustomerActivityTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { formatDateOnly, formatTimeOnly, formatInrAmount } from "@/lib/formatDateTime";
import { Users, BadgeCheck, FilePenLine, CalendarClock, LogOut, RefreshCw, X } from "lucide-react";
import { SafeCustomerImage } from "@/components/admin/SafeCustomerImage";

const STATUS_LABEL: Record<string, string> = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    PROSPECT: "Prospect",
};

const TYPE_LABEL: Record<string, string> = {
    INSURANCE: "Insurance",
    LOAN: "Loan",
    HEALTHCARE: "Healthcare",
};

export default function AdminActivityPage() {
    const router = useRouter();
    const [records, setRecords] = useState<CustomerRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [refreshTick, setRefreshTick] = useState(0);
    const [recordToLoad, setRecordToLoad] = useState<CustomerRecord | null>(null);
    const [recordToView, setRecordToView] = useState<CustomerRecord | null>(null);
    const wizardRef = useRef<CustomerRecordWizardHandle>(null);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetchWithTimeout("/api/admin/logout", { method: "POST" });
            router.push("/admin/login");
            router.refresh();
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            setLoggingOut(false);
        }
    };

    const fetchRecords = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const res = await fetchWithTimeout("/api/customer-records");
            if (res.status === 401) {
                window.location.assign("/admin/login");
                return;
            }
            if (res.status === 504) {
                setLoadError("Database timed out while loading customer records.");
                setRecords([]);
                return;
            }
            const payload = (await res.json().catch(() => null)) as
                | CustomerRecord[]
                | { success?: boolean; message?: string; records?: CustomerRecord[] }
                | null;
            if (!res.ok) {
                const msg =
                    payload &&
                    typeof payload === "object" &&
                    !Array.isArray(payload) &&
                    typeof (payload as { message?: string }).message === "string"
                        ? (payload as { message: string }).message
                        : "Unable to load customer records. Please refresh or check server logs.";
                setLoadError(msg);
                setRecords([]);
                return;
            }
            const recordsPayload = Array.isArray(payload)
              ? payload
              : payload && typeof payload === "object" && Array.isArray(payload.records)
                ? payload.records
                : null;
            if (!recordsPayload) {
                setLoadError("Unable to load customer records. Please refresh or check server logs.");
                setRecords([]);
                return;
            }
            setRecords(recordsPayload);
        } catch (error) {
            console.error("Failed to fetch customer records", error);
            setLoadError("Unable to load customer records. Please refresh or check server logs.");
            setRecords([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            void fetchRecords();
        });
    }, [fetchRecords, refreshTick]);

    const handleSuccess = useCallback(() => {
        setRefreshTick((prev) => prev + 1);
        setRecordToLoad(null);
    }, []);

    const handleContinue = useCallback((record: CustomerRecord) => {
        if (wizardRef.current && !wizardRef.current.confirmDiscardIfDirty()) return;
        setRecordToLoad(record);
    }, []);

    const totalRecords = records.length;
    const submittedCount = records.filter((r) => r.recordStatus === "SUBMITTED").length;
    const draftCount = records.filter((r) => r.recordStatus === "DRAFT").length;
    const expiringSoon = records.filter((r) => {
      if (r.recordStatus !== "SUBMITTED") return false;
      if (!r.expiryDate) return false;
      const expiry = new Date(r.expiryDate);
      if (Number.isNaN(expiry.getTime())) return false;
      const now = new Date();
      const next30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      return expiry >= now && expiry <= next30;
    }).length;

    return (
        <div className="min-h-screen bg-ivory px-3 pt-4 md:p-8 md:pt-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                    <div className="relative mb-3 rounded-2xl border border-soft-gold/35 bg-white/80 p-3 pr-14 shadow-sm sm:mb-8 sm:flex sm:items-start sm:justify-between sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:pr-0 sm:shadow-none md:pr-0">
                        <div className="absolute right-2 top-2 flex flex-col gap-1 sm:hidden">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setRefreshTick((prev) => prev + 1)}
                                className="h-10 w-10 shrink-0 rounded-xl border-soft-gold/50 text-charcoal hover:bg-soft-gold/15"
                                aria-label="Refresh records"
                            >
                                <RefreshCw className="h-4 w-4" aria-hidden />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                disabled={loggingOut}
                                onClick={handleLogout}
                                className="h-10 w-10 shrink-0 rounded-xl border-soft-gold/50 text-charcoal hover:bg-soft-gold/15"
                                aria-label="Log out"
                            >
                                <LogOut className="h-4 w-4" aria-hidden />
                            </Button>
                        </div>
                        <div className="min-w-0 pr-1 sm:pr-0">
                            <h1 className="font-serif text-3xl font-bold leading-tight text-charcoal sm:text-4xl md:text-5xl">
                            Customer Records
                            </h1>
                            <p className="mt-1.5 max-w-[min(100%,18rem)] text-sm leading-snug text-charcoal/65 sm:mt-2 sm:max-w-xl sm:text-lg sm:leading-6">
                                <span className="sm:hidden">Guided onboarding, drafts, and submitted records.</span>
                                <span className="hidden sm:inline">Guided onboarding, drafts, and submitted CareSutra customer records.</span>
                            </p>
                            <div className="mt-2 h-1 w-14 rounded-full bg-heritage-gold sm:mt-4 sm:w-24"></div>
                        </div>

                        <div className="mt-4 hidden items-center gap-2 sm:flex">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRefreshTick((prev) => prev + 1)}
                            className="shrink-0 rounded-xl border-soft-gold/50 text-charcoal hover:bg-soft-gold/15"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={loggingOut}
                            onClick={handleLogout}
                            className="shrink-0 rounded-xl border-soft-gold/50 text-charcoal hover:bg-soft-gold/15"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            {loggingOut ? "Signing out..." : "Log out"}
                        </Button>
                        </div>
                    </div>

                <div
                    className="lg:hidden -mx-0.5 mb-4 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    role="region"
                    aria-label="Quick stats"
                >
                    <div className="flex min-w-max gap-2 px-0.5">
                        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-soft-gold/35 bg-white px-3 py-2 pr-4 shadow-sm">
                            <div className="rounded-lg bg-trust-blue/10 p-2">
                                <Users className="h-4 w-4 text-trust-blue" aria-hidden />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-charcoal/55">Total</p>
                                <p className="text-lg font-bold text-trust-blue leading-none">{totalRecords}</p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-soft-gold/35 bg-white px-3 py-2 pr-4 shadow-sm">
                            <div className="rounded-lg bg-green-100 p-2">
                                <BadgeCheck className="h-4 w-4 text-green-700" aria-hidden />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-charcoal/55">Submitted</p>
                                <p className="text-lg font-bold text-green-700 leading-none">{submittedCount}</p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-soft-gold/35 bg-white px-3 py-2 pr-4 shadow-sm">
                            <div className="rounded-lg bg-soft-gold/25 p-2">
                                <FilePenLine className="h-4 w-4 text-heritage-gold" aria-hidden />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-charcoal/55">Drafts</p>
                                <p className="text-lg font-bold text-heritage-gold leading-none">{draftCount}</p>
                            </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-soft-gold/35 bg-white px-3 py-2 pr-4 shadow-sm">
                            <div className="rounded-lg bg-support-blue/10 p-2">
                                <CalendarClock className="h-4 w-4 text-support-blue" aria-hidden />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-charcoal/55">Expiring</p>
                                <p className="text-lg font-bold text-support-blue leading-none">{expiringSoon}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                    {/* Left: Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-soft-gold/30 bg-white rounded-2xl shadow-xl md:rounded-3xl">
                            <CardHeader className="space-y-1 border-b border-soft-gold/20 p-4 pb-3 md:p-6 md:pb-4">
                                <CardTitle className="text-xl font-bold text-charcoal md:text-2xl">Customer onboarding</CardTitle>
                                <CardDescription className="text-sm text-charcoal/70 md:text-base">
                                    Step through KYC and service details. Save a draft anytime, or submit when everything is complete.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-4 md:p-6 md:pt-6">
                                <CustomerRecordWizard
                                  ref={wizardRef}
                                  initialRecord={recordToLoad}
                                  onSuccess={handleSuccess}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Quick Stats */}
                    <div className="hidden lg:block">
                        <Card className="border-soft-gold/30 bg-white rounded-3xl shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-trust-blue/10 to-support-blue/10 rounded-t-3xl">
                                <CardTitle className="text-trust-blue text-xl font-bold">Quick Stats</CardTitle>
                                <CardDescription className="text-charcoal/70">
                                    Live overview of customer records
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-soft-gold/30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-trust-blue/10 rounded-xl">
                                            <Users className="h-6 w-6 text-trust-blue" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-charcoal">Total Records</span>
                                            <p className="text-charcoal/50 text-sm">Drafts and submitted</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-3xl text-trust-blue">{totalRecords}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-soft-gold/30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-100 rounded-xl">
                                            <BadgeCheck className="h-6 w-6 text-green-700" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-charcoal">Submitted Customers</span>
                                            <p className="text-charcoal/50 text-sm">Final customer records</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-3xl text-green-700">{submittedCount}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-soft-gold/30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-soft-gold/25 rounded-xl">
                                            <FilePenLine className="h-6 w-6 text-heritage-gold" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-charcoal">Drafts</span>
                                            <p className="text-charcoal/50 text-sm">In progress</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-3xl text-heritage-gold">{draftCount}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-soft-gold/30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-support-blue/10 rounded-xl">
                                            <CalendarClock className="h-6 w-6 text-support-blue" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-charcoal">Expiring Soon</span>
                                            <p className="text-charcoal/50 text-sm">Submitted, within 30 days</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-3xl text-support-blue">{expiringSoon}</span>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full border-soft-gold text-charcoal hover:bg-soft-gold/10 rounded-xl py-3"
                                    >
                                        <Link href="/" className="w-full text-center font-medium">
                                            Back to Home
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Table Section */}
                <div className="mt-8 scroll-mt-28 md:mt-12">
                    <Card className="border-soft-gold/30 bg-white rounded-2xl shadow-xl overflow-hidden md:rounded-3xl">
                        <CardHeader className="bg-gradient-to-r from-trust-blue/5 to-support-blue/5 border-b border-soft-gold/20 p-4 md:p-6">
                            <CardTitle className="text-xl font-bold text-charcoal md:text-2xl">Customer Records</CardTitle>
                            <CardDescription className="text-sm text-charcoal/70 md:text-base">
                                Continue a draft or review submitted details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <CustomerActivityTable
                              records={records}
                              loading={loading}
                              loadError={loadError}
                              onEdit={handleContinue}
                              onView={setRecordToView}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Footer note */}
                <div className="mt-6 pb-32 text-center text-charcoal/50 text-sm md:mt-8 md:pb-48">
                    <p>
                      Data updates in real-time. Last refreshed:{" "}
                      <span suppressHydrationWarning>{formatTimeOnly(new Date())}</span>
                    </p>
                </div>
            </div>
            {recordToView ? (
              <div className="fixed inset-0 z-[70] bg-charcoal/45 p-4 md:p-8">
                <div className="mx-auto max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-soft-gold/40 bg-white shadow-2xl">
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-soft-gold/30 bg-white/95 px-5 py-4 backdrop-blur-sm md:px-6">
                    <h2 className="font-serif text-xl font-semibold text-charcoal">Customer record details</h2>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Close record view"
                      onClick={() => setRecordToView(null)}
                    >
                      <X className="h-5 w-5" aria-hidden />
                    </Button>
                  </div>
                  <div className="space-y-5 p-5 md:p-6">
                    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-soft-gold/30 bg-ivory/40 p-4 md:grid-cols-[110px_1fr]">
                      <div className="h-24 w-24 overflow-hidden rounded-xl border border-soft-gold/40 bg-white">
                        {recordToView.customerPictureUrl ? (
                          <SafeCustomerImage
                            src={recordToView.customerPictureUrl}
                            alt="Customer picture"
                            className="h-full w-full object-cover"
                            fallbackClassName="h-full w-full"
                            fallbackText="No image"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-charcoal/60">No image</div>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-charcoal/85">
                        <p className="text-lg font-semibold text-charcoal">
                          {[recordToView.firstName, recordToView.middleName, recordToView.lastName].filter(Boolean).join(" ") || "—"}
                        </p>
                        <p>Email: {recordToView.email || "—"}</p>
                        <p>Mobile: {recordToView.mobile || "—"}</p>
                        <p>Address: {[recordToView.addressLine, recordToView.floor, recordToView.street, recordToView.city, recordToView.state, recordToView.pinCode].filter(Boolean).join(", ") || "—"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                      <div className="rounded-2xl border border-soft-gold/30 bg-ivory/30 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">Customer Status & Type</p>
                        <p className="mt-2">Customer Status: {STATUS_LABEL[recordToView.customerStatus] ?? "—"}</p>
                        <p>Customer Type: {recordToView.customerType ? TYPE_LABEL[recordToView.customerType] : "—"}</p>
                        <p>Record Status: {recordToView.recordStatus === "SUBMITTED" ? "Submitted" : "Draft"}</p>
                      </div>
                      <div className="rounded-2xl border border-soft-gold/30 bg-ivory/30 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">Service Details</p>
                        <p className="mt-2">Provider Company: {recordToView.providerCompanyName || "—"}</p>
                        <p>Service Commenced: {formatDateOnly(recordToView.serviceCommencedDate) || "—"}</p>
                        <p>Expiry Date: {formatDateOnly(recordToView.expiryDate) || "—"}</p>
                        <p>Insurance / Loan Amount: {formatInrAmount(recordToView.insuranceLoanAmount)}</p>
                        <p>Premium / EMI: {formatInrAmount(recordToView.premiumEmi)}</p>
                        <p>Cover / Final Payout: {formatInrAmount(recordToView.coverFinalPayout)}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-soft-gold/30 bg-ivory/30 p-4 text-sm">
                      <p>Created: {formatDateOnly(recordToView.createdAt)}</p>
                      <p>Updated: {formatDateOnly(recordToView.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
        </div>
    );
}
