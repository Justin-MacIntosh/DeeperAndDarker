import { Producer } from "../game_state/types";

var Fraction = require('fractional').Fraction;

/**
 * Calculates the maximum number of producers that can be purchased with the current resources.
 * This function iteratively checks how many producers can be bought until the resources run out.
 */
export const calculateMaxPossiblePurchase = (
  producer: Producer, currentResources: bigint
): { cost: bigint; maxPossiblePurchase: number } => {
  let numToPurchase = 1;
  while (true) {
    const costForPurchase = calculatePriceForMultiplePurchases(
      producer, numToPurchase + 1
    );
    if (currentResources < costForPurchase) {
      break;
    }
    numToPurchase++;
  }

  const totalCost = calculatePriceForMultiplePurchases(
    producer, numToPurchase
  );
  return {
    cost: totalCost,
    maxPossiblePurchase: numToPurchase,
  };
} 

/** Calculates the price for purchasing a producer multiple times. */
export const calculatePriceForMultiplePurchases = (
  producer: Producer, numPurchases: number
): bigint => {
  const costMultiplier = producer.dynamic.costReductionMultiplier;

  // Calculate the total cost using the formula for geometric series
  let rateExponentialTotal = 0;
  for (let purchaseIdx = 0; purchaseIdx < numPurchases; purchaseIdx++) {
    rateExponentialTotal += producer.static.baseRateOfCostIncrease ** (producer.dynamic.count + purchaseIdx);
  }

  const totalIncreaseInPrice = rateExponentialTotal * costMultiplier;

  const totalIncreaseFraction = new Fraction(totalIncreaseInPrice);
  const totalCost = (
    producer.static.baseCost *
    BigInt(totalIncreaseFraction.numerator)
  ) / BigInt(totalIncreaseFraction.denominator);

  return totalCost;
};

/**
 * Refreshes the producer state based on the current upgrade slots.
 * This function recalculates the cost and production values of the producer.
 */
export const calculateProducerProduction = (
  producer: Producer,
): bigint => {
  const productionMultiplier = producer.dynamic.productionMultiplier;

  const increaseInProductionNum = producer.dynamic.count * productionMultiplier;
  const increaseInProductionFraction = new Fraction(increaseInProductionNum);
  const totalProduction = (
    producer.static.baseProduction *
    BigInt(increaseInProductionFraction.numerator)
  ) / BigInt(increaseInProductionFraction.denominator);

  return totalProduction;
};
