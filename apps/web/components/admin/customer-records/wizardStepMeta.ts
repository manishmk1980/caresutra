/** UI copy only — step order matches CUSTOMER_RECORD_STEP_FIELDS + review. */
export const WIZARD_STEP_META = [
  {
    title: "Personal Details",
    description: "Identity and contact details for this customer.",
  },
  {
    title: "Address Details",
    description: "Residential address and PIN for records and correspondence.",
  },
  {
    title: "Documents & KYC",
    description: "PAN, Aadhaar, and document links or upload paths.",
  },
  {
    title: "Service Details",
    description: "Status, product type, provider, dates, and amounts.",
  },
  {
    title: "Review & Submit",
    description: "Confirm everything before final submission.",
  },
] as const;
