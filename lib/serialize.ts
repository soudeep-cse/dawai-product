/**
 * Prisma Decimal fields serialize to strings over JSON (Decimal.toJSON()
 * returns a string), which silently turns client-side arithmetic like
 * `total + medicine.pricePerUnit` into string concatenation instead of
 * addition. Convert known Decimal fields to real numbers before sending
 * a medicine object in an API response.
 */
export function serializeMedicine<T extends Record<string, any>>(medicine: T): T {
  return {
    ...medicine,
    originalPricePerPack:
      medicine.originalPricePerPack !== undefined ? Number(medicine.originalPricePerPack) : undefined,
    pricePerPack: medicine.pricePerPack !== undefined ? Number(medicine.pricePerPack) : undefined,
    pricePerUnit: medicine.pricePerUnit !== undefined ? Number(medicine.pricePerUnit) : undefined,
    discountValue:
      medicine.discountValue !== null && medicine.discountValue !== undefined
        ? Number(medicine.discountValue)
        : medicine.discountValue,
  };
}
