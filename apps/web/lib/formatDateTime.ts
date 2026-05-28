/**
 * Deterministic date/time formatting for SSR + client (no locale-sensitive AM/PM or date order surprises).
 */

export function formatDateOnly(value?: string | Date | null): string {
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "string") {
    const t = value.trim();
    if (!t) return "-";
    // Calendar date from API / forms (yyyy-MM-dd) — avoid timezone shifting the day
    const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
    if (ymd) {
      const [, y, m, d] = ymd;
      return `${d}-${m}-${y}`;
    }
    // ISO timestamps from Prisma: use the date in the string (UTC calendar date)
    const iso = /^(\d{4})-(\d{2})-(\d{2})T/.exec(t);
    if (iso) {
      const [, y, m, d] = iso;
      return `${d}-${m}-${y}`;
    }
  }
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatTimeOnly(value?: string | Date | null): string {
  if (value === undefined || value === null || value === "") return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours || 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}

/** INR display: explicit en-IN digit grouping + symbol (stable across Node/browser for same input). */
export function formatInrAmount(value: string | number | null | undefined): string {
  if (value === undefined || value === null || value === "") return "-";
  const parsed = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(parsed)) return "-";
  const digits = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsed);
  return `₹${digits}`;
}
