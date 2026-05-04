import type { FieldErrors, FieldPath } from "react-hook-form";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";

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
