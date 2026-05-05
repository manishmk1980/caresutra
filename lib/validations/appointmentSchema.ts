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

export const appointmentRequestSchema = z.object({
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
  serviceInterest: z.enum(SERVICE_INTERESTS, {
    message: "Please select service interest.",
  }),
  preferredContactMethod: z.enum(CONTACT_METHODS, {
    message: "Please select a preferred contact method.",
  }),
  preferredDate: optionalDate,
  preferredTimeSlot: z
    .enum(TIME_SLOTS)
    .optional(),
  message: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length > 0 ? v.trim() : undefined)),
  consentAccepted: z
    .boolean()
    .refine((v) => v === true, "Consent is required to submit your request."),
});

export const appointmentStatusSchema = z.enum(APPOINTMENT_STATUSES);

export type AppointmentRequestInput = z.input<typeof appointmentRequestSchema>;
export type AppointmentRequestData = z.infer<typeof appointmentRequestSchema>;
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
