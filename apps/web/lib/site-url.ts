/** Absolute origin for canonical URLs, OG, sitemap, robots (matches NEXT_PUBLIC_SITE_URL). */
const SITE_ORIGIN_FALLBACK = "https://caresutra.kreatorbox.com";

function normalizeOrigin(raw: string): string | undefined {
  try {
    return new URL(raw).origin;
  } catch {
    return undefined;
  }
}

/** Public site origin without trailing slash (for joining paths). */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    const origin = normalizeOrigin(raw);
    if (origin) return origin;
  }
  return SITE_ORIGIN_FALLBACK;
}
