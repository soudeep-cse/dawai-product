/**
 * Normalizes a Bangladeshi phone number to E.164 format for Firebase
 * Phone Auth, e.g. "01712345678" -> "+8801712345678".
 */
export function toE164(input: string): string {
  const digits = input.replace(/\D/g, '');

  if (digits.startsWith('880')) {
    return `+${digits}`;
  }
  if (digits.startsWith('0')) {
    return `+880${digits.slice(1)}`;
  }
  return `+880${digits}`;
}
