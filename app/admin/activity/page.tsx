"use client";

import { useState, useEffect, useCallback } from "react";
import CustomerActivityForm from "@/components/admin/CustomerActivityForm";
import CustomerActivityTable from "@/components/admin/CustomerActivityTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { Users, Calendar, Clock, TrendingUp, LogOut } from "lucide-react";

type CustomerActivity = {
    id: number;
    customerName: string;
    mobile: string;
    email?: string;
    city?: string;
    serviceInterest: string;
    customerType: string;
    leadSource?: string;
    currentStatus: string;
    followUpDate?: string;
    notes?: string;
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
};

export default function AdminActivityPage() {
    const [activities, setActivities] = useState<CustomerActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loggingOut, setLoggingOut] = useState(false);

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

    const fetchActivities = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchWithTimeout("/api/customer-activity");
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error("Failed to fetch activities", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            void fetchActivities();
        });
    }, [fetchActivities, refreshKey]);

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    // Calculate stats
    const totalLeads = activities.length;
    
    const newThisWeek = activities.filter(activity => {
        const created = new Date(activity.createdAt);
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return created >= oneWeekAgo;
    }).length;

    const pendingFollowUp = activities.filter(activity => {
        const status = activity.currentStatus;
        return status === "Follow-up Required" || status === "Documents Pending" || status === "In Progress";
    }).length;

    const converted = activities.filter(activity => activity.currentStatus === "Converted").length;

    return (
        <div className="min-h-screen bg-ivory p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal">Admin Dashboard</h1>
                        <p className="text-charcoal/70 text-lg mt-2">Manage customer activities and lead follow‑ups.</p>
                        <div className="w-24 h-1 bg-heritage-gold mt-4"></div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={loggingOut}
                        onClick={handleLogout}
                        className="shrink-0 border-soft-gold/50 text-charcoal hover:bg-soft-gold/15 rounded-xl"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        {loggingOut ? "Signing out…" : "Log out"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-soft-gold/30 bg-white rounded-3xl shadow-xl">
                            <CardHeader className="pb-4 border-b border-soft-gold/20">
                                <CardTitle className="text-2xl font-bold text-charcoal">Add Customer Activity</CardTitle>
                                <CardDescription className="text-charcoal/70">
                                    Record new customer interactions and follow‑ups
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
                                    Live overview of customer activities
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
                                            <span className="font-medium text-charcoal">Total Leads</span>
                                            <p className="text-charcoal/50 text-sm">All time records</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-3xl text-trust-blue">{totalLeads}</span>
                                </div>

                                {/* Stat 2 */}
                                <div className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-soft-gold/30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-support-blue/10 rounded-xl">
                                            <Calendar className="h-6 w-6 text-support-blue" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-charcoal">New This Week</span>
                                            <p className="text-charcoal/50 text-sm">Last 7 days</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-3xl text-support-blue">{newThisWeek}</span>
                                </div>

                                {/* Stat 3 */}
                                <div className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-soft-gold/30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-heritage-gold/10 rounded-xl">
                                            <Clock className="h-6 w-6 text-heritage-gold" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-charcoal">Pending Follow‑up</span>
                                            <p className="text-charcoal/50 text-sm">Requires attention</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-3xl text-heritage-gold">{pendingFollowUp}</span>
                                </div>

                                {/* Stat 4 */}
                                <div className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-soft-gold/30">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-100 rounded-xl">
                                            <TrendingUp className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <span className="font-medium text-charcoal">Converted</span>
                                            <p className="text-charcoal/50 text-sm">Successful conversions</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-3xl text-green-600">{converted}</span>
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
                            <CardTitle className="text-2xl font-bold text-charcoal">Customer Activity</CardTitle>
                            <CardDescription className="text-charcoal/70">
                                View, filter, and manage all customer interactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <CustomerActivityTable key={refreshKey} />
                        </CardContent>
                    </Card>
                </div>

                {/* Footer note */}
                <div className="mt-8 text-center text-charcoal/50 text-sm">
                    <p>Data updates in real‑time. Last refreshed: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>
        </div>
    );
}