import CustomerActivityForm from "@/components/admin/CustomerActivityForm";
import CustomerActivityTable from "@/components/admin/CustomerActivityTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminActivityPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage customer activities and leads.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CustomerActivityForm />
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                            <CardDescription>Overview of customer activities</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Total Leads</span>
                                <span className="font-bold text-2xl">24</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">New This Week</span>
                                <span className="font-bold text-2xl">5</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Pending Follow-up</span>
                                <span className="font-bold text-2xl">8</span>
                            </div>
                            <div className="pt-4">
                                <Button variant="outline" className="w-full">
                                    <Link href="/">Back to Home</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="mt-12">
                <CustomerActivityTable />
            </div>
        </div>
    );
}