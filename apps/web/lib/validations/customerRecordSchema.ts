import { z } from "zod";
import { onlyDigits } from "@/lib/onlyDigits";

export const customerStatusOptions = ["ACTIVE", "INACTIVE", "PROSPECT"] as const;
export const customerTypeOptions = ["INSURANCE", "LOAN", "HEALTHCARE"] as const;

const optStr = z
  .string()
  .optional()
  .transform((v) => {
    if (v === undefined || v === null) return undefined;
    const trimmed = String(v).trim();
    return trimmed.length > 0 ? trimmed : undefined;
  });

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

const docUrl = z
  .string()
  .optional()
  .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined))
  .refine((v) => !v || v.startsWith("/") || z.string().url().safeParse(v).success, {
    message: "Document URL must be a valid URL or uploaded path.",
  });

const expiryAfterService = (
  data: { serviceCommencedDate?: string; expiryDate?: string },
  ctx: z.RefinementCtx,
) => {
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

/**
 * IMPORTANT:
 * This base schema must stay plain z.object().
 * Do not add .superRefine() here, because .pick() and .partial()
 * are used below for step schemas and draft schema.
 */
const customerRecordBaseSchema = z.object({
  recordStatus: z.enum(["DRAFT", "SUBMITTED"]).optional(),

  // Step 1 — Personal
  firstName: z.string().min(1, "First name is required."),
  middleName: optStr,
  lastName: z.string().min(1, "Last name is required."),

  email: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || z.string().email().safeParse(v).success, {
      message: "Enter a valid email address.",
    }),

  mobile: z.preprocess(
    (val) => (typeof val === "string" ? onlyDigits(val) : val),
    z
      .string()
      .min(1, "Mobile number is required.")
      .regex(/^\d{10}$/, "Mobile number must be 10 digits."),
  ),

  alternativeMobile: z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined || v === null) return undefined;
      const digits = onlyDigits(String(v).trim());
      return digits.length === 0 ? undefined : digits;
    })
    .refine((v) => v === undefined || /^\d{10}$/.test(v), {
      message: "Alternative mobile must be 10 digits.",
    }),

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

  // Step 2 — Address
  addressLine: z.string().min(1, "Home / Apartment / Flat is required."),
  floor: optStr,
  street: z.string().min(1, "Street / Locality is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  pinCode: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits."),

  // Step 3 — Documents
  customerPictureUrl: docUrl,
  panDocumentUrl: docUrl,
  aadhaarFrontUrl: docUrl,
  aadhaarBackUrl: docUrl,
  otherDocumentUrl: docUrl,

  // Step 4 — Service
  customerStatus: z.enum(customerStatusOptions, {
    message: "Customer status is required.",
  }),

  customerType: z.enum(customerTypeOptions, {
    message: "Customer type is required.",
  }),

  providerCompanyName: optStr,
  serviceCommencedDate: optionalDateString,
  expiryDate: optionalDateString,
  insuranceLoanAmount: optionalAmount,
  premiumEmi: optionalAmount,
  coverFinalPayout: optionalAmount,
});

/**
 * Final submit schema.
 * This validates all required fields and then checks service/expiry date relation.
 */
export const customerRecordSubmitSchema =
  customerRecordBaseSchema.superRefine(expiryAfterService);

/**
 * Draft schema.
 * Draft should allow incomplete records, so base schema is partial first,
 * then date relation refinement is applied.
 */
export const customerRecordDraftSchema =
  customerRecordBaseSchema.partial().superRefine(expiryAfterService);

export type CustomerRecordFormInput = z.input<typeof customerRecordSubmitSchema>;
export type CustomerRecordSubmitInput = z.infer<typeof customerRecordSubmitSchema>;
export type CustomerRecordDraftInput = z.input<typeof customerRecordDraftSchema>;

/** Step 1 — Personal */
export const customerRecordStep1Schema = customerRecordBaseSchema.pick({
  firstName: true,
  middleName: true,
  lastName: true,
  email: true,
  mobile: true,
  alternativeMobile: true,
  dateOfBirth: true,
});

/** Step 2 — Address */
export const customerRecordStep2Schema = customerRecordBaseSchema.pick({
  addressLine: true,
  floor: true,
  street: true,
  city: true,
  state: true,
  pinCode: true,
});

/** Step 3 — Documents */
export const customerRecordStep3Schema = customerRecordBaseSchema.pick({
  pan: true,
  aadhaar: true,
  customerPictureUrl: true,
  panDocumentUrl: true,
  aadhaarFrontUrl: true,
  aadhaarBackUrl: true,
  otherDocumentUrl: true,
});

/** Step 4 — Service */
export const customerRecordStep4Schema = customerRecordBaseSchema
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
    "dateOfBirth",
  ],
  ["addressLine", "floor", "street", "city", "state", "pinCode"],
  [
    "pan",
    "aadhaar",
    "customerPictureUrl",
    "panDocumentUrl",
    "aadhaarFrontUrl",
    "aadhaarBackUrl",
    "otherDocumentUrl",
  ],
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