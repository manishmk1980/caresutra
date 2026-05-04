export function emptyToNull(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return String(value);
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export function nullableDate(value: unknown): Date | null {
  if (!value || typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function nullableDecimal(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  const normalized = String(value).replace(/,/g, "").trim();
  if (!normalized) return null;
  if (Number.isNaN(Number(normalized))) return null;
  return normalized;
}
