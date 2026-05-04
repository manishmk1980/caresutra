import type { FieldErrors, FieldPath } from "react-hook-form";
import type { ZodIssue } from "zod";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { CUSTOMER_RECORD_STEP_FIELDS } from "@/lib/validations/customerRecordSchema";

/** Visual / focus order for the customer record form */
export const CUSTOMER_RECORD_FIELD_ORDER = [
  "firstName",
  "middleName",
  "lastName",
  "email",
  "mobile",
  "alternativeMobile",
  "pan",
  "aadhaar",
  "dateOfBirth",
  "addressLine",
  "floor",
  "street",
  "city",
  "state",
  "pinCode",
  "customerPictureUrl",
  "customerStatus",
  "customerType",
  "providerCompanyName",
  "serviceCommencedDate",
  "expiryDate",
  "insuranceLoanAmount",
  "premiumEmi",
  "coverFinalPayout",
] as const satisfies readonly FieldPath<CustomerRecordFormInput>[];

export function orderedValidationMessages(
  errors: FieldErrors<CustomerRecordFormInput>,
): string[] {
  const messages: string[] = [];
  for (const key of CUSTOMER_RECORD_FIELD_ORDER) {
    const e = errors[key];
    if (e && typeof e === "object" && "message" in e && typeof e.message === "string" && e.message) {
      messages.push(e.message);
    }
  }
  return messages;
}

export function orderedValidationMessagesForStep(
  errors: FieldErrors<CustomerRecordFormInput>,
  stepIndex: number,
): string[] {
  const fields = CUSTOMER_RECORD_STEP_FIELDS[stepIndex];
  if (!fields) return [];
  const messages: string[] = [];
  for (const key of fields) {
    const e = errors[key as keyof typeof errors];
    if (e && typeof e === "object" && "message" in e && typeof e.message === "string" && e.message) {
      messages.push(e.message);
    }
  }
  return messages;
}

export function focusFirstInvalidCustomerField(errors: FieldErrors<CustomerRecordFormInput>): void {
  for (const key of CUSTOMER_RECORD_FIELD_ORDER) {
    if (!errors[key]) continue;
    const root = document.querySelector(`[data-rhf-field="${String(key)}"]`);
    if (!(root instanceof HTMLElement)) continue;
    root.scrollIntoView({ behavior: "smooth", block: "center" });
    const focusable = root.matches("input, button, select, textarea")
      ? root
      : root.querySelector<HTMLElement>("input, button, select, textarea, [role='combobox']");
    focusable?.focus();
    return;
  }
}

export function focusFirstZodPath(issues: readonly ZodIssue[]): void {
  const first = issues.find((i) => typeof i.path[0] === "string")?.path[0];
  if (typeof first !== "string") return;
  const root = document.querySelector(`[data-rhf-field="${first}"]`);
  if (!(root instanceof HTMLElement)) return;
  root.scrollIntoView({ behavior: "smooth", block: "center" });
  const focusable = root.matches("input, button, select, textarea")
    ? root
    : root.querySelector<HTMLElement>("input, button, select, textarea, [role='combobox']");
  focusable?.focus();
}
