export const ADMIN_SESSION_COOKIE = "caresutra_admin_session";

const MAX_SESSION_MS = 8 * 60 * 60 * 1000;

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function getSessionSecret(): string | undefined {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) return undefined;
  return s;
}

/**
 * Signed session token: base64url(utf8(username.timestamp)).base64url(hmacSha256(payloadBytes))
 * Compatible with Edge (middleware) and Node (route handlers).
 */
export async function signAdminSession(username: string): Promise<string> {
  const secret = getSessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");

  const ts = Date.now();
  const payload = `${username}.${ts}`;
  const payloadBytes = new TextEncoder().encode(payload);
  const key = await importHmacKey(secret);
  const sigBuf = await crypto.subtle.sign("HMAC", key, payloadBytes as unknown as BufferSource);
  const sigBytes = new Uint8Array(sigBuf);

  return `${toBase64Url(payloadBytes)}.${toBase64Url(sigBytes)}`;
}

export async function verifyAdminSession(cookieValue?: string | null): Promise<boolean> {
  const secret = getSessionSecret();
  const expectedUser = process.env.ADMIN_USERNAME;
  if (!secret || !expectedUser) return false;
  if (!cookieValue || !cookieValue.includes(".")) return false;

  const firstDot = cookieValue.indexOf(".");
  if (firstDot === -1) return false;
  const payloadB64 = cookieValue.slice(0, firstDot);
  const sigB64 = cookieValue.slice(firstDot + 1);
  if (!payloadB64 || !sigB64) return false;

  try {
    const payloadBytes = fromBase64Url(payloadB64);
    const sigBytes = fromBase64Url(sigB64);
    const payload = new TextDecoder().decode(payloadBytes);
    const lastDot = payload.lastIndexOf(".");
    if (lastDot <= 0) return false;

    const username = payload.slice(0, lastDot);
    const ts = Number(payload.slice(lastDot + 1));
    if (username !== expectedUser) return false;
    if (!Number.isFinite(ts)) return false;
    if (Date.now() - ts > MAX_SESSION_MS) return false;

    const key = await importHmacKey(secret);
    const expectedSigBuf = await crypto.subtle.sign(
      "HMAC",
      key,
      payloadBytes as unknown as BufferSource,
    );
    const expectedSig = new Uint8Array(expectedSigBuf);

    return timingSafeEqualBytes(sigBytes, expectedSig);
  } catch {
    return false;
  }
}
