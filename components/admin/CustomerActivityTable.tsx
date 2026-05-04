"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, RefreshCw } from "lucide-react";

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

    const fetchActivities = async () => {
        try {
            const res = await fetch("/api/customer-activity");
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error("Failed to fetch activities", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "New":
                return "bg-blue-100 text-blue-800";
            case "Contacted":
                return "bg-yellow-100 text-yellow-800";
            case "Converted":
                return "bg-green-100 text-green-800";
            case "Not Interested":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this activity?")) return;
        try {
            const res = await fetch(`/api/customer-activity/${id}`, {
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
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Customer Activities</CardTitle>
                    <CardDescription>List of all customer leads and activities</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchActivities}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8">Loading activities...</div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No customer activities found. Create one using the form above.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium">Name</th>
                                    <th className="text-left py-3 px-4 font-medium">Mobile</th>
                                    <th className="text-left py-3 px-4 font-medium">Service</th>
                                    <th className="text-left py-3 px-4 font-medium">Status</th>
                                    <th className="text-left py-3 px-4 font-medium">Follow-up</th>
                                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((activity) => (
                                    <tr key={activity.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="font-medium">{activity.customerName}</div>
                                            <div className="text-sm text-gray-500">{activity.email}</div>
                                        </td>
                                        <td className="py-3 px-4">{activity.mobile}</td>
                                        <td className="py-3 px-4">
                                            <div>{activity.serviceInterest}</div>
                                            <div className="text-sm text-gray-500">{activity.customerType}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge className={getStatusColor(activity.currentStatus)}>
                                                {activity.currentStatus}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4">
                                            {activity.followUpDate
                                                ? new Date(activity.followUpDate).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
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