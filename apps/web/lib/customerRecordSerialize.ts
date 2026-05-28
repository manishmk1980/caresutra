import type { CustomerRecord as PrismaCustomerRecord } from "@prisma/client";

/** JSON-safe shape for admin UI (ISO strings, decimals as strings). */
export function serializeCustomerRecord(record: PrismaCustomerRecord) {
  return {
    id: record.id,
    firstName: record.firstName,
    middleName: record.middleName,
    lastName: record.lastName,
    email: record.email,
    mobile: record.mobile,
    alternativeMobile: record.alternativeMobile,
    dateOfBirth: record.dateOfBirth ? record.dateOfBirth.toISOString() : null,
    pan: record.pan,
    aadhaar: record.aadhaar,
    addressLine: record.addressLine,
    floor: record.floor,
    street: record.street,
    city: record.city,
    state: record.state,
    pinCode: record.pinCode,
    customerPictureUrl: record.customerPictureUrl,
    customerStatus: record.customerStatus,
    customerType: record.customerType,
    providerCompanyName: record.providerCompanyName,
    serviceCommencedDate: record.serviceCommencedDate
      ? record.serviceCommencedDate.toISOString()
      : null,
    expiryDate: record.expiryDate ? record.expiryDate.toISOString() : null,
    insuranceLoanAmount:
      record.insuranceLoanAmount != null ? String(record.insuranceLoanAmount) : null,
    premiumEmi: record.premiumEmi != null ? String(record.premiumEmi) : null,
    coverFinalPayout: record.coverFinalPayout != null ? String(record.coverFinalPayout) : null,
    recordStatus: record.recordStatus,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    documents: {
      customerPhoto: !!record.customerPictureUrl,
      pan: !!record.panDocumentUrl,
      aadhaarFront: !!record.aadharFrontUrl,
      aadhaarBack: !!record.aadharBackUrl,
      otherDocument: !!record.otherDocumentUrl,
    },
  };
}
