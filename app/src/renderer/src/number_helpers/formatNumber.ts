export function formatNumber(num: bigint): string {
  if (num > BigInt(99999)) {
    return num.toLocaleString(
      'en-US', { notation: "scientific", minimumFractionDigits: 2, maximumFractionDigits: 2 }
    ).toLowerCase();
  }
  return num.toString().toLowerCase();
}
