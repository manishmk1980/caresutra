import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";

/** Shape returned by GET /api/customer-records (serialized) */
export type ApiCustomerRecord = {
  id: number;
  firstName: string | null;
  middleName?: string | null;
  lastName: string | null;
  email?: string | null;
  mobile: string | null;
  alternativeMobile?: string | null;
  dateOfBirth?: string | null;
  pan?: string | null;
  aadhaar?: string | null;
  addressLine: string | null;
  floor?: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  pinCode: string | null;
  customerPictureUrl?: string | null;
  /** Present on list/detail payloads from Prisma — used for admin table doc indicators only. */
  panDocumentUrl?: string | null;
  aadharFrontUrl?: string | null;
  aadharBackUrl?: string | null;
  otherDocumentUrl?: string | null;
  customerStatus: "ACTIVE" | "INACTIVE" | "PROSPECT";
  customerType: "INSURANCE" | "LOAN" | "HEALTHCARE" | null;
  providerCompanyName?: string | null;
  serviceCommencedDate?: string | null;
  expiryDate?: string | null;
  insuranceLoanAmount?: string | null;
  premiumEmi?: string | null;
  coverFinalPayout?: string | null;
  recordStatus: "DRAFT" | "SUBMITTED";
  createdAt: string;
  updatedAt: string;
};

export const emptyWizardValues: CustomerRecordFormInput = {
  recordStatus: "DRAFT",
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  mobile: "",
  alternativeMobile: "",
  dateOfBirth: "",
  pan: "",
  aadhaar: "",
  addressLine: "",
  floor: "",
  street: "",
  city: "",
  state: "",
  pinCode: "",
  customerPictureUrl: "",
  customerStatus: "PROSPECT",
  customerType: "INSURANCE",
  providerCompanyName: "",
  serviceCommencedDate: "",
  expiryDate: "",
  insuranceLoanAmount: "" as unknown as CustomerRecordFormInput["insuranceLoanAmount"],
  premiumEmi: "" as unknown as CustomerRecordFormInput["premiumEmi"],
  coverFinalPayout: "" as unknown as CustomerRecordFormInput["coverFinalPayout"],
  panDocumentUrl: "",
  aadhaarFrontUrl: "",
  aadhaarBackUrl: "",
  otherDocumentUrl: "",
};

export function apiRecordToFormValues(r: ApiCustomerRecord): CustomerRecordFormInput {
  const toStr = (v: string | null | undefined) => (v == null ? "" : String(v));
  const toNum = (v: string | number | null | undefined) => {
    if (v === undefined || v === null || v === "") return undefined;
    const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : undefined;
  };
  return {
    firstName: toStr(r.firstName),
    middleName: toStr(r.middleName),
    lastName: toStr(r.lastName),
    email: toStr(r.email),
    mobile: toStr(r.mobile),
    alternativeMobile: toStr(r.alternativeMobile),
    dateOfBirth: r.dateOfBirth ? r.dateOfBirth.slice(0, 10) : "",
    pan: toStr(r.pan),
    aadhaar: toStr(r.aadhaar),
    addressLine: toStr(r.addressLine),
    floor: toStr(r.floor),
    street: toStr(r.street),
    city: toStr(r.city),
    state: toStr(r.state),
    pinCode: toStr(r.pinCode),
    customerPictureUrl: toStr(r.customerPictureUrl),
    panDocumentUrl: toStr(r.panDocumentUrl),
    aadhaarFrontUrl: toStr(r.aadharFrontUrl),
    aadhaarBackUrl: toStr(r.aadharBackUrl),
    otherDocumentUrl: toStr(r.otherDocumentUrl),
    customerStatus: r.customerStatus,
    customerType: r.customerType ?? "INSURANCE",
    providerCompanyName: toStr(r.providerCompanyName),
    serviceCommencedDate: r.serviceCommencedDate ? r.serviceCommencedDate.slice(0, 10) : "",
    expiryDate: r.expiryDate ? r.expiryDate.slice(0, 10) : "",
    insuranceLoanAmount: toNum(r.insuranceLoanAmount),
    premiumEmi: toNum(r.premiumEmi),
    coverFinalPayout: toNum(r.coverFinalPayout),
    recordStatus: r.recordStatus,
  };
}

export function inferInitialWizardStep(r: ApiCustomerRecord): number {
  const m = onlyDigitsLocal(r.mobile ?? "");
  if (!r.firstName?.trim() || !r.lastName?.trim() || m.length !== 10) return 0;
  if (
    !r.addressLine?.trim() ||
    !r.street?.trim() ||
    !r.city?.trim() ||
    !r.state?.trim() ||
    !(r.pinCode && String(r.pinCode).replace(/\D/g, "").length === 6)
  ) {
    return 1;
  }
  if (!r.customerType) return 3;
  return 4;
}

function onlyDigitsLocal(v: string): string {
  return v.replace(/\D/g, "");
}
