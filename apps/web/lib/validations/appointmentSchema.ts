import { z } from "zod";

const CONTACT_METHODS = ["PHONE_CALL", "WHATSAPP", "EMAIL", "TELEGRAM"] as const;
const SERVICE_INTERESTS = ["INSURANCE", "LOAN", "HEALTH_SERVICES", "MULTIPLE_SERVICES", "NEED_GUIDANCE"] as const;
const TIME_SLOTS = ["MORNING", "AFTERNOON", "EVENING", "FLEXIBLE"] as const;
export const APPOINTMENT_STATUSES = ["NEW", "CONTACTED", "SCHEDULED", "COMPLETED", "CANCELLED"] as const;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

const optionalDate = z
  .string()
  .optional()
  .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined))
  .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), "Enter a valid preferred date.");

const appointmentRequestBaseSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address."),
  mobile: z
    .string()
    .transform((v) => onlyDigits(v))
    .refine((v) => /^\d{10}$/.test(v), "Mobile number must be 10 digits."),
  whatsapp: z
    .string()
    .optional()
    .transform((v) => {
      if (!v || !v.trim()) return undefined;
      return onlyDigits(v);
    })
    .refine((v) => !v || /^\d{10}$/.test(v), "WhatsApp number must be 10 digits."),
  telegram: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined)),
  city: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined)),
  serviceInterest: z
    .string()
    .min(1, "Service interest is required.")
    .refine((v) => (SERVICE_INTERESTS as readonly string[]).includes(v), "Please select service interest."),
  preferredContactMethod: z
    .string()
    .min(1, "Please select a preferred contact method.")
    .refine((v) => (CONTACT_METHODS as readonly string[]).includes(v), "Please select a preferred contact method."),
  preferredDate: optionalDate,
  preferredTimeSlot: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v : undefined))
    .refine((v) => !v || (TIME_SLOTS as readonly string[]).includes(v), "Please select a valid time slot."),
  message: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined)),
  consentAccepted: z
    .boolean()
    .refine((v) => v === true, "Consent is required."),
});

export const appointmentRequestSchema = appointmentRequestBaseSchema.superRefine((data, ctx) => {
  const preferred = data.preferredContactMethod;

  if (preferred === "WHATSAPP") {
    if (!data.whatsapp) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["whatsapp"],
        message: "WhatsApp number is required when WhatsApp is selected as preferred contact method.",
      });
    } else if (data.whatsapp.length !== 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["whatsapp"],
        message: "WhatsApp number must be 10 digits.",
      });
    }
  }

  if (preferred === "TELEGRAM" && !data.telegram?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["telegram"],
      message: "Telegram username or ID is required when Telegram is selected as preferred contact method.",
    });
  }

  if (preferred === "EMAIL") {
    if (!data.email?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Email address is required when Email is selected as preferred contact method.",
      });
    } else if (!z.string().email().safeParse(data.email).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Enter a valid email address.",
      });
    }
  }

  if (preferred === "PHONE_CALL") {
    if (!data.mobile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mobile"],
        message: "Mobile number is required when Phone Call is selected as preferred contact method.",
      });
    } else if (data.mobile.length !== 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mobile"],
        message: "Mobile number must be 10 digits.",
      });
    }
  }
});

export const appointmentStatusSchema = z.enum(APPOINTMENT_STATUSES);

export type AppointmentRequestInput = z.input<typeof appointmentRequestSchema>;
export type AppointmentRequestData = z.infer<typeof appointmentRequestSchema>;
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
