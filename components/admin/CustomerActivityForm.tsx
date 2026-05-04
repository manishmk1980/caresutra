"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerActivitySchema, type CustomerActivityFormData } from "@/lib/validations/customerActivitySchema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

const serviceInterestOptions = [
    "Home Nursing",
    "Physiotherapy",
    "Elderly Care",
    "Post‑Operative Care",
    "Newborn & Mother Care",
    "Medical Equipment",
    "Doctor Consultation",
    "Lab Tests at Home",
    "Other",
];

const customerTypeOptions = ["New Lead", "Existing Customer", "Referral", "Corporate"];

const leadSourceOptions = ["Website", "Phone Call", "WhatsApp", "Referral", "Social Media", "Walk‑In", "Other"];

const currentStatusOptions = ["New", "Contacted", "Follow‑up Scheduled", "Converted", "Not Interested"];

export default function CustomerActivityForm({ onSuccess }: { onSuccess?: () => void }) {
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const form = useForm<CustomerActivityFormData>({
        resolver: zodResolver(customerActivitySchema),
        defaultValues: {
            customerName: "",
            mobile: "",
            email: "",
            city: "",
            serviceInterest: "",
            customerType: "",
            leadSource: "",
            currentStatus: "New",
            followUpDate: "",
            notes: "",
            assignedTo: "",
        },
    });

    const onSubmit = async (data: CustomerActivityFormData) => {
        setSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const res = await fetchWithTimeout("/api/customer-activity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to create activity");
            }

            setSubmitSuccess(true);
            form.reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Submit error:", error);
            setSubmitError(error instanceof Error ? error.message : "Unknown error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto shadow-xl border-soft-gold/30 rounded-3xl">
            <CardHeader className="bg-gradient-to-r from-trust-blue/10 to-support-blue/10 rounded-t-3xl border-b border-soft-gold/20">
                <CardTitle className="text-charcoal font-cormorant text-2xl">Add New Customer Activity</CardTitle>
                <CardDescription className="text-charcoal/70">
                    Fill in the details below to track a new customer lead or activity
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="customerName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-charcoal font-medium">Customer Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter full name"
                                                {...field}
                                                className="border-soft-gold/50 focus:border-trust-blue focus:ring-trust-blue/20 rounded-xl"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-support-blue" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mobile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-charcoal font-medium">Mobile Number *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="10-digit mobile number"
                                                {...field}
                                                className="border-soft-gold/50 focus:border-trust-blue focus:ring-trust-blue/20 rounded-xl"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-support-blue" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-charcoal font-medium">Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="customer@example.com"
                                                type="email"
                                                {...field}
                                                className="border-soft-gold/50 focus:border-trust-blue focus:ring-trust-blue/20 rounded-xl"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-support-blue" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-charcoal font-medium">City</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter city"
                                                {...field}
                                                className="border-soft-gold/50 focus:border-trust-blue focus:ring-trust-blue/20 rounded-xl"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-support-blue" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="serviceInterest"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-charcoal font-medium">Service Interest *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="border-soft-gold/50 focus:border-trust-blue focus:ring-trust-blue/20 rounded-xl">
                                                    <SelectValue placeholder="Select a service" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-soft-gold/30">
                                                {serviceInterestOptions.map((option) => (
                                                    <SelectItem key={option} value={option} className="focus:bg-trust-blue/10">
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-support-blue" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="customerType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-charcoal font-medium">Customer Type *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="border-soft-gold/50 focus:border-trust-blue focus:ring-trust-blue/20 rounded-xl">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-soft-gold/30">
                                                {customerTypeOptions.map((option) => (
                                                    <SelectItem key={option} value={option} className="focus:bg-trust-blue/10">
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-support-blue" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="leadSource"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-charcoal font-medium">Lead Source</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="border-soft-gold/50 focus:border-trust-blue focus:ring-trust-blue/20 rounded-xl">
                                                    <SelectValue placeholder="How did they find us?" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-soft-gold/30">
                                                {leadSourceOptions.map((option) => (
                                                    <SelectItem key={option} value={option} className="focus:bg-trust-blue/10">
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-support-blue" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currentStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-charcoal font-medium">Current Status *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="border-soft-gold/50 focus:border-trust-blue focus:ring-trust-blue/20 rounded-xl">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-xl border-soft-gold/30">
                                                {currentStatusOptions.map((option) => (
                                                    <SelectItem key={option} value={option} className="focus:bg-trust-blue/10">
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="text-support-blue" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="followUpDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-charcoal font-medium">Follow-up Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                className="border-soft-gold/50 focus:border-trust-blue focus:ring-trust-blue/20 rounded-xl"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-charcoal/60">
                                            Schedule a follow-up if needed
                                        </FormDescription>
                                        <FormMessage className="text-support-blue" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="assignedTo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-charcoal font-medium">Assigned To</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Team member name"
                                                {...field}
                                                className="border-soft-gold/50 focus:border-trust-blue focus:ring-trust-blue/20 rounded-xl"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-support-blue" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-charcoal font-medium">Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Additional details, observations, or next steps..."
                                            className="min-h-[120px] border-soft-gold/50 focus:border-trust-blue focus:ring-trust-blue/20 rounded-xl"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-support-blue" />
                                </FormItem>
                            )}
                        />

                        <div className="pt-4">
                            {submitError && (
                                <div className="mb-4 p-4 bg-support-blue/10 border border-support-blue/30 text-support-blue rounded-xl">
                                    <p className="font-medium">Error submitting form</p>
                                    <p className="text-sm">{submitError}</p>
                                </div>
                            )}

                            {submitSuccess && (
                                <div className="mb-4 p-4 bg-heritage-gold/10 border border-heritage-gold/30 text-heritage-gold rounded-xl">
                                    <p className="font-medium">✓ Activity created successfully!</p>
                                    <p className="text-sm">The customer activity has been added to the system.</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full md:w-auto bg-trust-blue hover:bg-support-blue text-white font-medium py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    "Create Customer Activity"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}