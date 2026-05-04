import { z } from "zod";

export const customerStatusOptions = ["ACTIVE", "INACTIVE", "PROSPECT"] as const;
export const customerTypeOptions = ["INSURANCE", "LOAN", "HEALTHCARE"] as const;

const optionalDateString = z
  .string()
  .optional()
  .transform((v) => (v && v.trim().length > 0 ? v : undefined));

const optionalAmount = z
  .union([z.number(), z.string()])
  .optional()
  .transform((v) => {
    if (v === undefined) return undefined;
    if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
    const normalized = v.trim();
    if (!normalized) return undefined;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : NaN;
  })
  .refine((v) => v === undefined || Number.isFinite(v), {
    message: "Please enter a valid amount.",
  });

export const customerRecordSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required."),
  email: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || z.string().email().safeParse(v).success, "Enter a valid email address."),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits."),
  alternativeMobile: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v : undefined))
    .refine((v) => !v || /^\d{10}$/.test(v), "Alternative mobile must be 10 digits."),
  dateOfBirth: optionalDateString,
  pan: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim().toUpperCase() : undefined))
    .refine((v) => !v || /^[A-Z0-9]{10}$/.test(v), "PAN must be 10 characters."),
  aadhaar: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined))
    .refine((v) => !v || /^\d{12}$/.test(v), "AADHAR must be 12 digits."),

  addressLine: z.string().min(1, "Home / Apartment / Flat is required."),
  floor: z.string().optional(),
  street: z.string().min(1, "Street / Locality is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  pinCode: z.string().regex(/^\d{6}$/, "PIN Code must be 6 digits."),

  customerPictureUrl: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined))
    .refine((v) => !v || v.startsWith("/") || z.string().url().safeParse(v).success, {
      message: "Picture URL must be a valid URL or uploaded path.",
    }),

  customerStatus: z.enum(customerStatusOptions, {
    message: "Please select customer status.",
  }),
  customerType: z.enum(customerTypeOptions, {
    message: "Please select customer type.",
  }),

  providerCompanyName: z.string().optional(),
  serviceCommencedDate: optionalDateString,
  expiryDate: optionalDateString,
  insuranceLoanAmount: optionalAmount,
  premiumEmi: optionalAmount,
  coverFinalPayout: optionalAmount,
});

export type CustomerRecordFormInput = z.input<typeof customerRecordSchema>;
export type CustomerRecordFormData = z.infer<typeof customerRecordSchema>;
