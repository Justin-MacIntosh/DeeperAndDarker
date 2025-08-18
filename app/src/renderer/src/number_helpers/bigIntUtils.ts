import Fraction from 'fraction.js';

export const multiplyBigIntByNumber = (value: bigint, multiplier: number): bigint => {
  const numberFraction = new Fraction(multiplier);
  const result = (
    value *
    BigInt(numberFraction.n)
  ) / BigInt(numberFraction.d);
  return result;
}