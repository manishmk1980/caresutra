import { z } from "zod";
import { onlyDigits } from "@/lib/onlyDigits";

export const customerStatusOptions = ["ACTIVE", "INACTIVE", "PROSPECT"] as const;
export const customerTypeOptions = ["INSURANCE", "LOAN", "HEALTHCARE"] as const;

const optionalDateString = z
  .string()
  .optional()
  .transform((v) => (v && v.trim().length > 0 ? v : undefined))
  .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), {
    message: "Please enter a valid date.",
  });

export const optionalAmount = z
  .union([z.number(), z.string()])
  .optional()
  .transform((v) => {
    if (v === undefined) return undefined;
    if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
    const normalized = String(v).trim();
    if (!normalized) return undefined;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : NaN;
  })
  .refine((v) => v === undefined || Number.isFinite(v), {
    message: "Please enter a valid amount.",
  });

const expiryAfterService = (data: { serviceCommencedDate?: string; expiryDate?: string }, ctx: z.core.$RefinementCtx) => {
  if (data.serviceCommencedDate && data.expiryDate) {
    if (data.expiryDate < data.serviceCommencedDate) {
      ctx.addIssue({
        code: "custom",
        message: "Expiry date cannot be before service start date.",
        path: ["expiryDate"],
      });
    }
  }
};

/** Object shape only (no cross-field refinements) — safe for `.pick()` in step schemas (Zod 4). */
const customerRecordSubmitFieldsSchema = z.object({
  recordStatus: z.enum(["DRAFT", "SUBMITTED"]).optional(),
  firstName: z.string().min(1, "First name is required."),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required."),
  email: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || z.string().email().safeParse(v).success, "Enter a valid email address."),
  mobile: z.preprocess(
    (val) => (typeof val === "string" ? onlyDigits(val) : val),
    z.string().min(1, "Mobile number is required.").regex(/^\d{10}$/, "Mobile number must be 10 digits."),
  ),
  alternativeMobile: z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined || v === null) return undefined;
      const d = onlyDigits(String(v).trim());
      return d.length === 0 ? undefined : d;
    })
    .refine((v) => v === undefined || /^\d{10}$/.test(v), "Alternative mobile must be 10 digits."),
  dateOfBirth: optionalDateString,
  pan: z
    .string()
    .optional()
    .transform((v) => {
      if (!v || !String(v).trim()) return undefined;
      return String(v).trim().toUpperCase();
    })
    .refine((v) => !v || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v), {
      message: "Enter a valid PAN, e.g. ABCDE1234F.",
    }),
  aadhaar: z
    .string()
    .optional()
    .transform((v) => {
      if (!v || !String(v).trim()) return undefined;
      return onlyDigits(String(v).trim());
    })
    .refine((v) => !v || /^\d{12}$/.test(v), {
      message: "AADHAAR must be 12 digits.",
    }),

  addressLine: z.string().min(1, "Home / Apartment / Flat is required."),
  floor: z.string().optional(),
  street: z.string().min(1, "Street / Locality is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  pinCode: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits."),

  customerPictureUrl: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined))
    .refine((v) => !v || v.startsWith("/") || z.string().url().safeParse(v).success, {
      message: "Picture URL must be a valid URL or uploaded path.",
    }),

  customerStatus: z.enum(customerStatusOptions, {
    message: "Customer status is required.",
  }),
  customerType: z.enum(customerTypeOptions, {
    message: "Customer type is required.",
  }),

  providerCompanyName: z.string().optional(),
  serviceCommencedDate: optionalDateString,
  expiryDate: optionalDateString,
  insuranceLoanAmount: optionalAmount,
  premiumEmi: optionalAmount,
  coverFinalPayout: optionalAmount,
});

/** Full validation for final submit */
export const customerRecordSubmitSchema = customerRecordSubmitFieldsSchema.superRefine(expiryAfterService);

/** @deprecated Use customerRecordSubmitSchema — kept for imports */
export const customerRecordSchema = customerRecordSubmitSchema;

export type CustomerRecordFormInput = z.input<typeof customerRecordSubmitSchema>;
export type CustomerRecordFormData = z.infer<typeof customerRecordSubmitSchema>;

const optStr = z.string().optional();

/** Relaxed validation for drafts — required fields may be empty */
export const customerRecordDraftSchema = z
  .object({
    id: z.number().int().positive().optional(),
    recordStatus: z.enum(["DRAFT", "SUBMITTED"]).optional(),
    firstName: optStr,
    middleName: optStr,
    lastName: optStr,
    email: optStr
      .transform((v) => (v?.trim() ? v.trim() : undefined))
      .refine((v) => !v || z.string().email().safeParse(v).success, "Enter a valid email address."),
    mobile: z
      .string()
      .optional()
      .transform((v) => (v === undefined || v === null ? "" : onlyDigits(String(v).trim())))
      .refine((v) => v === "" || v.length === 10, { message: "Mobile number must be 10 digits." }),
    alternativeMobile: z
      .string()
      .optional()
      .transform((v) => {
        if (v === undefined || v === null || !String(v).trim()) return undefined;
        const d = onlyDigits(String(v).trim());
        return d.length === 0 ? undefined : d;
      })
      .refine((v) => v === undefined || /^\d{10}$/.test(v), "Alternative mobile must be 10 digits."),
    dateOfBirth: optionalDateString,
    pan: z
      .string()
      .optional()
      .transform((v) => {
        if (!v || !String(v).trim()) return undefined;
        return String(v).trim().toUpperCase();
      })
      .refine((v) => !v || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v), {
        message: "Enter a valid PAN, e.g. ABCDE1234F.",
      }),
    aadhaar: z
      .string()
      .optional()
      .transform((v) => {
        if (!v || !String(v).trim()) return undefined;
        return onlyDigits(String(v).trim());
      })
      .refine((v) => !v || /^\d{12}$/.test(v), { message: "AADHAAR must be 12 digits." }),
    addressLine: optStr,
    floor: optStr,
    street: optStr,
    city: optStr,
    state: optStr,
    pinCode: z
      .string()
      .optional()
      .transform((v) => (v?.trim() ? onlyDigits(v.trim()) : ""))
      .refine((v) => v === "" || v.length === 6, { message: "PIN code must be 6 digits." }),
    customerPictureUrl: z
      .string()
      .optional()
      .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined))
      .refine((v) => !v || v.startsWith("/") || z.string().url().safeParse(v).success, {
        message: "Picture URL must be a valid URL or uploaded path.",
      }),
    customerStatus: z.enum(customerStatusOptions).optional(),
    customerType: z.enum(customerTypeOptions).optional(),
    providerCompanyName: optStr,
    serviceCommencedDate: optionalDateString,
    expiryDate: optionalDateString,
    insuranceLoanAmount: optionalAmount,
    premiumEmi: optionalAmount,
    coverFinalPayout: optionalAmount,
  })
  .superRefine(expiryAfterService);

export type CustomerRecordDraftInput = z.input<typeof customerRecordDraftSchema>;

/** Step 1 — Personal */
export const customerRecordStep1Schema = customerRecordSubmitFieldsSchema.pick({
  firstName: true,
  middleName: true,
  lastName: true,
  email: true,
  mobile: true,
  alternativeMobile: true,
  dateOfBirth: true,
  pan: true,
  aadhaar: true,
});

/** Step 2 — Address */
export const customerRecordStep2Schema = customerRecordSubmitFieldsSchema.pick({
  addressLine: true,
  floor: true,
  street: true,
  city: true,
  state: true,
  pinCode: true,
});

/** Step 3 — Picture (no required fields) */
export const customerRecordStep3Schema = customerRecordSubmitFieldsSchema.pick({
  customerPictureUrl: true,
});

/** Step 4 — Status & service */
export const customerRecordStep4Schema = customerRecordSubmitFieldsSchema
  .pick({
    customerStatus: true,
    customerType: true,
    providerCompanyName: true,
    serviceCommencedDate: true,
    expiryDate: true,
    insuranceLoanAmount: true,
    premiumEmi: true,
    coverFinalPayout: true,
  })
  .superRefine(expiryAfterService);

export const CUSTOMER_RECORD_STEP_FIELDS = [
  [
    "firstName",
    "middleName",
    "lastName",
    "email",
    "mobile",
    "alternativeMobile",
    "pan",
    "aadhaar",
    "dateOfBirth",
  ],
  ["addressLine", "floor", "street", "city", "state", "pinCode"],
  ["customerPictureUrl"],
  [
    "customerStatus",
    "customerType",
    "providerCompanyName",
    "serviceCommencedDate",
    "expiryDate",
    "insuranceLoanAmount",
    "premiumEmi",
    "coverFinalPayout",
  ],
] as const;
