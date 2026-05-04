"use client";

import { useState, useEffect, useCallback } from "react";
import CustomerActivityForm from "@/components/admin/CustomerActivityForm";
import CustomerActivityTable, { type CustomerRecord } from "@/components/admin/CustomerActivityTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { Users, Clock, ShieldCheck, CalendarClock, LogOut, RefreshCw } from "lucide-react";

export default function AdminActivityPage() {
    const [records, setRecords] = useState<CustomerRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [refreshTick, setRefreshTick] = useState(0);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.assign("/admin/login");
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
                return;
            }
            if (!res.ok) {
                setLoadError("Unable to load customer records.");
                return;
            }
            const data = (await res.json()) as CustomerRecord[];
            setRecords(data);
        } catch (error) {
            console.error("Failed to fetch customer records", error);
            setLoadError("Unable to load customer records.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            void fetchRecords();
        });
    }, [fetchRecords, refreshTick]);

    const handleSuccess = () => {
        setRefreshTick((prev) => prev + 1);
    };

    const totalCustomers = records.length;
    const activeCustomers = records.filter((r) => r.customerStatus === "ACTIVE").length;
    const prospects = records.filter((r) => r.customerStatus === "PROSPECT").length;
    const expiringSoon = records.filter((r) => {
      if (!r.expiryDate) return false;
      const expiry = new Date(r.expiryDate);
      if (Number.isNaN(expiry.getTime())) return false;
      const now = new Date();
      const next30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      return expiry >= now && expiry <= next30;
    }).length;

    return (
        <div className="min-h-screen bg-ivory p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal">Customer Records</h1>
                        <p className="text-charcoal/70 text-lg mt-2">
                          Manage CareSutra customers, service details, and renewal follow-ups.
                        </p>
                        <div className="w-24 h-1 bg-heritage-gold mt-4"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setRefreshTick((prev) => prev + 1)}
                        className="shrink-0 border-soft-gold/50 text-charcoal hover:bg-soft-gold/15 rounded-xl"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                      <Button
                          type="button"
                          variant="outline"
                          disabled={loggingOut}
                          onClick={handleLogout}
                          className="shrink-0 border-soft-gold/50 text-charcoal hover:bg-soft-gold/15 rounded-xl"
                      >
                          <LogOut className="h-4 w-4 mr-2" />
                          {loggingOut ? "Signing out..." : "Log out"}
                      </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-soft-gold/30 bg-white rounded-3xl shadow-xl">
                            <CardHeader className="pb-4 border-b border-soft-gold/20">
                                <CardTitle className="text-2xl font-bold text-charcoal">Add Customer Record</CardTitle>
                                <CardDescription className="text-charcoal/70">
                                    Fill customer KYC and service details section-wise.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <CustomerActivityForm onSuccess={handleSuccess} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Quick Stats */}
                    <div>
                        <Card className="border-soft-gold/30 bg-white rounded-3xl shadow-xl">
                            <CardHeader className="bg-gradient-to-r from-trust-blue/10 to-support-blue/10 rounded-t-3xl">
                                <CardTitle className="text-trust-blue text-xl font-bold">Quick Stats</CardTitle>
                                <CardDescription className="text-charcoal/70">
                                    Live overview of customer records
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                {/* Stat 1 */}
                                <div className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-soft-gold/30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-trust-blue/10 rounded-xl">
                                            <Users className="h-6 w-6 text-trust-blue" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-charcoal">Total Customers</span>
                                            <p className="text-charcoal/50 text-sm">All customer records</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-3xl text-trust-blue">{totalCustomers}</span>
                                </div>

                                {/* Stat 2 */}
                                <div className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-soft-gold/30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-100 rounded-xl">
                                            <ShieldCheck className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-charcoal">Active Customers</span>
                                            <p className="text-charcoal/50 text-sm">Current active accounts</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-3xl text-green-600">{activeCustomers}</span>
                                </div>

                                {/* Stat 3 */}
                                <div className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-soft-gold/30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-heritage-gold/10 rounded-xl">
                                            <Clock className="h-6 w-6 text-heritage-gold" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-charcoal">Prospects</span>
                                            <p className="text-charcoal/50 text-sm">Potential customers</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-3xl text-heritage-gold">{prospects}</span>
                                </div>

                                {/* Stat 4 */}
                                <div className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-soft-gold/30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-support-blue/10 rounded-xl">
                                            <CalendarClock className="h-6 w-6 text-support-blue" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-charcoal">Expiring Soon</span>
                                            <p className="text-charcoal/50 text-sm">Within next 30 days</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-3xl text-support-blue">{expiringSoon}</span>
                                </div>

                                <div className="pt-4">
                                    <Button
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
                <div className="mt-12">
                    <Card className="border-soft-gold/30 bg-white rounded-3xl shadow-xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-trust-blue/5 to-support-blue/5 border-b border-soft-gold/20">
                            <CardTitle className="text-2xl font-bold text-charcoal">Customer Records</CardTitle>
                            <CardDescription className="text-charcoal/70">
                                View customer KYC and service details in one place.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <CustomerActivityTable records={records} loading={loading} loadError={loadError} />
                        </CardContent>
                    </Card>
                </div>

                {/* Footer note */}
                <div className="mt-8 text-center text-charcoal/50 text-sm">
                    <p>
                      Data updates in real-time. Last refreshed:{" "}
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            </div>
        </div>
    );
}