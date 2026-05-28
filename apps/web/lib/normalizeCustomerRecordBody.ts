/** Uppercase enum strings from JSON before Zod. */
export function normalizeCustomerRecordBody(body: unknown): unknown {
  if (!body || typeof body !== "object" || Array.isArray(body)) return body;
  const o = { ...(body as Record<string, unknown>) };
  if (typeof o.customerStatus === "string") {
    const normalized = o.customerStatus.trim().toUpperCase();
    o.customerStatus = normalized.length > 0 ? normalized : undefined;
  }
  if (typeof o.customerType === "string") {
    const normalized = o.customerType.trim().toUpperCase();
    o.customerType = normalized.length > 0 ? normalized : undefined;
  }
  return o;
}
