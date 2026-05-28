import { z } from "zod";

const serviceInterestOptions = ["Insurance", "Loan", "Health Service", "Multiple Services"] as const;
const customerTypeOptions = ["New Customer", "Existing Customer"] as const;
const leadSourceOptions = ["Referral", "Phone Call", "WhatsApp", "Website", "Walk-in", "Other"] as const;
const currentStatusOptions = [
    "New",
    "Contacted",
    "Documents Pending",
    "In Progress",
    "Converted",
    "Not Interested",
    "Follow-up Required",
] as const;

export const customerActivitySchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    mobile: z.string().min(10, "Valid mobile number is required").max(15),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    city: z.string().optional(),
    serviceInterest: z.string().refine(
        (val) => serviceInterestOptions.includes(val as any),
        { message: "Please select a valid service interest" }
    ),
    customerType: z.string().refine(
        (val) => customerTypeOptions.includes(val as any),
        { message: "Please select customer type" }
    ),
    leadSource: z.string().refine(
        (val) => !val || leadSourceOptions.includes(val as any),
        { message: "Please select a valid lead source" }
    ).optional(),
    currentStatus: z.string().refine(
        (val) => currentStatusOptions.includes(val as any),
        { message: "Please select current status" }
    ),
    followUpDate: z.string().optional(),
    notes: z.string().optional(),
    assignedTo: z.string().optional(),
});

export type CustomerActivityFormData = z.infer<typeof customerActivitySchema>;