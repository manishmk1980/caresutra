import type { Prisma } from "@prisma/client";
import { existsSync } from "node:fs";
import path from "node:path";
import type { CustomerRecordFormInput } from "@/lib/validations/customerRecordSchema";
import { emptyToNull, nullableDate, nullableDecimal } from "@/lib/customerRecordNormalize";
import type { z } from "zod";
import { customerRecordDraftSchema } from "@/lib/validations/customerRecordSchema";
import { onlyDigits } from "@/lib/onlyDigits";

type DraftData = z.infer<typeof customerRecordDraftSchema>;

function normalizeEnum<T extends string>(value: unknown): T | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase();
  return normalized.length > 0 ? (normalized as T) : null;
}

function existingDocumentUrl(value: unknown): string | null {
  const url = emptyToNull(value);
  if (!url) return null;
  if (!url.startsWith("/uploads/customers/")) return url;

  const cleanUrl = url.split("?")[0]?.replaceAll("\\", "/") ?? "";
  const publicDir = path.join(process.cwd(), "public");
  const targetPath = path.join(publicDir, cleanUrl);
  const relative = path.relative(publicDir, targetPath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  return existsSync(targetPath) ? url : null;
}

/** Prisma payload for DRAFT create/update from relaxed draft parse */
export function draftToPrismaUnchecked(data: DraftData): Prisma.CustomerRecordUncheckedCreateInput {
  const customerStatus = normalizeEnum<"ACTIVE" | "INACTIVE" | "PROSPECT">(data.customerStatus) ?? "PROSPECT";
  const customerType = normalizeEnum<"INSURANCE" | "LOAN" | "HEALTHCARE">(data.customerType);

  return {
    recordStatus: "DRAFT",
    firstName: emptyToNull(data.firstName),
    middleName: emptyToNull(data.middleName),
    lastName: emptyToNull(data.lastName),
    email: emptyToNull(data.email),
    mobile: onlyDigits(String(data.mobile ?? "")),
    alternativeMobile: emptyToNull(onlyDigits(String(data.alternativeMobile ?? ""))),
    dateOfBirth: nullableDate(data.dateOfBirth),
    pan: emptyToNull(typeof data.pan === "string" ? data.pan.toUpperCase() : data.pan),
    aadhaar: emptyToNull(onlyDigits(String(data.aadhaar ?? ""))),
    addressLine: emptyToNull(data.addressLine),
    floor: emptyToNull(data.floor),
    street: emptyToNull(data.street),
    city: emptyToNull(data.city),
    state: emptyToNull(data.state),
    pinCode: emptyToNull(onlyDigits(String(data.pinCode ?? ""))),
    customerPictureUrl: existingDocumentUrl(data.customerPictureUrl),
    panDocumentUrl: existingDocumentUrl(data.panDocumentUrl),
    aadharFrontUrl: existingDocumentUrl(data.aadhaarFrontUrl),
    aadharBackUrl: existingDocumentUrl(data.aadhaarBackUrl),
    otherDocumentUrl: existingDocumentUrl(data.otherDocumentUrl),
    customerStatus,
    customerType,
    providerCompanyName: emptyToNull(data.providerCompanyName),
    serviceCommencedDate: nullableDate(data.serviceCommencedDate),
    expiryDate: nullableDate(data.expiryDate),
    insuranceLoanAmount: nullableDecimal(data.insuranceLoanAmount),
    premiumEmi: nullableDecimal(data.premiumEmi),
    coverFinalPayout: nullableDecimal(data.coverFinalPayout),
  };
}

/** Prisma payload for SUBMITTED from full validation */
export function submitToPrismaUnchecked(data: CustomerRecordFormInput): Prisma.CustomerRecordUncheckedCreateInput {
  const customerStatus = normalizeEnum<"ACTIVE" | "INACTIVE" | "PROSPECT">(data.customerStatus) ?? "PROSPECT";
  const customerType = normalizeEnum<"INSURANCE" | "LOAN" | "HEALTHCARE">(data.customerType);

  return {
    recordStatus: "SUBMITTED",
    firstName: emptyToNull(data.firstName) ?? "",
    middleName: emptyToNull(data.middleName),
    lastName: emptyToNull(data.lastName) ?? "",
    email: emptyToNull(data.email),
    mobile: onlyDigits(String(data.mobile ?? "")),
    alternativeMobile: emptyToNull(onlyDigits(String(data.alternativeMobile ?? ""))),
    dateOfBirth: nullableDate(data.dateOfBirth),
    pan: emptyToNull(typeof data.pan === "string" ? data.pan.toUpperCase() : data.pan),
    aadhaar: emptyToNull(onlyDigits(String(data.aadhaar ?? ""))),
    addressLine: emptyToNull(data.addressLine) ?? "",
    floor: emptyToNull(data.floor),
    street: emptyToNull(data.street) ?? "",
    city: emptyToNull(data.city) ?? "",
    state: emptyToNull(data.state) ?? "",
    pinCode: onlyDigits(String(data.pinCode ?? "")),
    customerPictureUrl: existingDocumentUrl(data.customerPictureUrl),
    panDocumentUrl: existingDocumentUrl(data.panDocumentUrl),
    aadharFrontUrl: existingDocumentUrl(data.aadhaarFrontUrl),
    aadharBackUrl: existingDocumentUrl(data.aadhaarBackUrl),
    otherDocumentUrl: existingDocumentUrl(data.otherDocumentUrl),
    customerStatus,
    customerType,
    providerCompanyName: emptyToNull(data.providerCompanyName),
    serviceCommencedDate: nullableDate(data.serviceCommencedDate),
    expiryDate: nullableDate(data.expiryDate),
    insuranceLoanAmount: nullableDecimal(data.insuranceLoanAmount),
    premiumEmi: nullableDecimal(data.premiumEmi),
    coverFinalPayout: nullableDecimal(data.coverFinalPayout),
  };
}
