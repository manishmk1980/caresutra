"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, RefreshCw } from "lucide-react";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

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

export default function CustomerActivityTable() {
    const [activities, setActivities] = useState<CustomerActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const fetchActivities = async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const res = await fetchWithTimeout("/api/customer-activity");
            if (res.status === 504) {
                setLoadError("Database did not respond in time. Check DATABASE_URL and that MySQL is running.");
                return;
            }
            if (!res.ok) {
                setLoadError("Could not load activities from the server.");
                return;
            }
            const data = await res.json();
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch activities", error);
            setLoadError(
                "Request timed out or failed. If this persists, verify the API and database connection.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        queueMicrotask(() => {
            void fetchActivities();
        });
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "New":
                return "bg-support-blue/20 text-support-blue border border-support-blue/30";
            case "Contacted":
                return "bg-trust-blue/20 text-trust-blue border border-trust-blue/30";
            case "Follow‑up Scheduled":
                return "bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/30";
            case "Converted":
                return "bg-green-100 text-green-800 border border-green-300";
            case "Not Interested":
                return "bg-red-100 text-red-800 border border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-300";
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this activity?")) return;
        try {
            const res = await fetchWithTimeout(`/api/customer-activity/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setActivities(activities.filter((act) => act.id !== id));
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <Card className="shadow-xl border-soft-gold/30 rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-trust-blue/10 to-support-blue/10 rounded-t-3xl border-b border-soft-gold/20">
                <div>
                    <CardTitle className="text-charcoal font-cormorant text-2xl">Customer Activities</CardTitle>
                    <CardDescription className="text-charcoal/70">List of all customer leads and activities</CardDescription>
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchActivities} 
                    className="border-soft-gold/50 hover:bg-trust-blue/10 hover:border-trust-blue text-charcoal rounded-xl"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-trust-blue"></div>
                        <p className="mt-4 text-charcoal/70">Loading activities...</p>
                    </div>
                ) : loadError ? (
                    <div className="text-center py-8 space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-support-blue/20 text-support-blue">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p className="text-support-blue font-medium">{loadError}</p>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={fetchActivities} 
                            className="mt-2 border-soft-gold/50 hover:bg-trust-blue/10 rounded-xl"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-trust-blue/20 text-trust-blue">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-charcoal">No activities yet</h3>
                        <p className="text-charcoal/60 max-w-md mx-auto">
                            Start by adding a customer activity using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-2 px-2">
                        <table className="w-full border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="border-b bg-ivory">
                                    <th className="text-left py-4 px-4 font-medium text-charcoal">Customer Name</th>
                                    <th className="text-left py-4 px-4 font-medium text-charcoal">Mobile</th>
                                    <th className="text-left py-4 px-4 font-medium text-charcoal">Service Interest</th>
                                    <th className="text-left py-4 px-4 font-medium text-charcoal">Customer Type</th>
                                    <th className="text-left py-4 px-4 font-medium text-charcoal">Status</th>
                                    <th className="text-left py-4 px-4 font-medium text-charcoal">Follow-up Date</th>
                                    <th className="text-left py-4 px-4 font-medium text-charcoal">Assigned To</th>
                                    <th className="text-left py-4 px-4 font-medium text-charcoal">Created At</th>
                                    <th className="text-left py-4 px-4 font-medium text-charcoal">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((activity) => (
                                    <tr key={activity.id} className="border-b hover:bg-ivory/50 even:bg-ivory/30">
                                        <td className="py-4 px-4">
                                            <div className="font-medium text-charcoal">{activity.customerName}</div>
                                            <div className="text-sm text-charcoal/60">{activity.email || "No email"}</div>
                                            <div className="text-xs text-charcoal/40">{activity.city || "No city"}</div>
                                        </td>
                                        <td className="py-4 px-4 font-mono text-sm text-charcoal">{activity.mobile}</td>
                                        <td className="py-4 px-4">
                                            <div className="font-medium text-charcoal">{activity.serviceInterest}</div>
                                            <div className="text-sm text-charcoal/60">{activity.leadSource || "No source"}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge variant="outline" className="border-support-blue/50 text-support-blue bg-support-blue/10">
                                                {activity.customerType}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Badge className={`${getStatusColor(activity.currentStatus)} font-medium`}>
                                                {activity.currentStatus}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-4">
                                            {activity.followUpDate
                                                ? <div className="font-medium text-charcoal">{new Date(activity.followUpDate).toLocaleDateString()}</div>
                                                : <span className="text-charcoal/40">-</span>}
                                        </td>
                                        <td className="py-4 px-4">
                                            {activity.assignedTo
                                                ? <span className="text-sm bg-trust-blue/10 text-trust-blue px-3 py-1.5 rounded-lg">{activity.assignedTo}</span>
                                                : <span className="text-charcoal/40">Unassigned</span>}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-charcoal/80">
                                            {new Date(activity.createdAt).toLocaleDateString()}
                                            <div className="text-xs text-charcoal/50">
                                                {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-9 w-9 p-0 hover:bg-trust-blue/10 hover:text-trust-blue rounded-lg"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 w-9 p-0 text-support-blue hover:text-support-blue hover:bg-support-blue/10 rounded-lg"
                                                    onClick={() => handleDelete(activity.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
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