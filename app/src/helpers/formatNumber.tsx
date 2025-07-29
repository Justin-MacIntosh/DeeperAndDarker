export function formatNumber(num: number): string {
  const numStr = Math.floor(num).toString();
  if (numStr.length > 5) {
    return num.toExponential(2);
  }
  return numStr;
}
