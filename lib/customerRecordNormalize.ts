export function nullableDate(value: unknown): Date | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return null;
  const t = value.trim();
  if (!t) return null;
  const date = new Date(t);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function nullableDecimal(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return null;
    return s;
  }
  return null;
}
