export function formatNumber(num: bigint): string {
  if (num > BigInt(99999)) {
    return num.toLocaleString(
      'en-US', { notation: "scientific", maximumFractionDigits: 2 }
    );
  }
  return num.toString();
}
