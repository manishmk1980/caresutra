/** Strip non-digits for mobile / AADHAAR normalization. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}
