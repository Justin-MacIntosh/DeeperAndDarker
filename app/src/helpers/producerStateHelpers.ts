import { Producer, UpgradeSlot } from "../types";

/**
 * Calculates the cost multiplier based on the upgrade slots and the producer ID.
 * This function checks for upgrades that reduce costs for specific producer tiers.
 */
const calculateCostMultiplier = (upgradeSlots: UpgradeSlot[], producerId: number): number => {
  return upgradeSlots.reduce((acc, upgSlot) => {
    if (
      upgSlot.upgrade &&
      upgSlot.upgrade.effect.type === "cost_reducer" &&
      upgSlot.upgrade.effect.producerIdsEffected.includes(producerId)
    ) {
      return acc * upgSlot.upgrade.effect.multiplier;
    }
    return acc;
  }, 1);
}

/**
 * Calculates the production multiplier based on the upgrade slots and the producer ID.
 * This function checks for upgrades that enhance production for specific producer tiers.
 */
const calculateProductionMultiplier = (upgradeSlots: UpgradeSlot[], producerId: number): number => {
  return upgradeSlots.reduce((acc, upgSlot) => {
    if (
      upgSlot.upgrade &&
      upgSlot.upgrade.effect.type === "production" &&
      upgSlot.upgrade.effect.producerIdsEffected.includes(producerId)
    ) {
      return acc * upgSlot.upgrade.effect.multiplier;
    }
    return acc;
  }, 1);
}

/**
 * Calculates the maximum number of producers that can be purchased with the current resources.
 * This function iteratively checks how many producers can be bought until the resources run out.
 */
export const calculateMaxPossiblePurchase = (
  producer: Producer, currentResources: bigint, upgradeSlots: UpgradeSlot[]
): { cost: bigint; maxPossiblePurchase: number } => {
  let numToPurchase = 1;
  while (true) {
    const costForPurchase = calculatePriceForMultiplePurchases(
      producer, numToPurchase + 1, upgradeSlots
    );
    if (currentResources < costForPurchase) {
      break;
    }
    numToPurchase++;
  }

  const totalCost = calculatePriceForMultiplePurchases(
    producer, numToPurchase, upgradeSlots
  );
  return {
    cost: totalCost,
    maxPossiblePurchase: numToPurchase,
  };
} 

/** Calculates the price for purchasing a producer multiple times. */
export const calculatePriceForMultiplePurchases = (
  producer: Producer, numPurchases: number, upgradeSlots: UpgradeSlot[]
): bigint => {
  const costMultiplier = calculateCostMultiplier(upgradeSlots, producer.id);

  // Calculate the total cost using the formula for geometric series
  let rateExponentialTotal = 0;
  for (let purchaseIdx = 0; purchaseIdx < numPurchases; purchaseIdx++) {
    rateExponentialTotal += producer.baseRate ** (producer.count + purchaseIdx);
  }

  // The total cost is the base cost multiplied by the total rate and the
  // cost multiplier and rounded to the nearest integer
  return BigInt(Math.round(producer.baseCost * rateExponentialTotal * costMultiplier));
};

/**
 * Refreshes the producer state based on the current upgrade slots.
 * This function recalculates the cost and production values of the producer.
 */
export const refreshProducerProduction = (
  producer: Producer,
  upgradeSlots: UpgradeSlot[]
): Producer => {
  const productionMultiplier = calculateProductionMultiplier(upgradeSlots, producer.id);
  const producerProduction = BigInt(producer.count * producer.baseProduction * productionMultiplier);

  return {
    ...producer,
    resourcesPerSecond: producerProduction,
  };
};
