var Fraction = require('fractional').Fraction;

export const multiplyBigIntByNumber = (value: bigint, multiplier: number): bigint => {
  const numberFraction = new Fraction(multiplier);
  const result = (
    value *
    BigInt(numberFraction.numerator)
  ) / BigInt(numberFraction.denominator);
  return result;
}