import { Producer, Stage } from "../types";
import { multiplyBigIntByNumber } from "../../number_helpers/bigIntUtils";

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
  return multiplyBigIntByNumber(producer.static.baseCost, totalIncreaseInPrice);
};

/** TODO */
export const calculateProducerProduction = (
  producer: Producer,
): bigint => {
  const producerBaseProd = (
    producer.static.baseProduction * BigInt(producer.dynamic.count)
  );
  return multiplyBigIntByNumber(
    producerBaseProd, producer.dynamic.productionMultiplier
  );
};

// TODO: recalc
export const recalculateProducerProductionMultiplier = (
  stages: { [key: string]: Stage }, producerStageId: string, producerId: string,
): number => {
  let totalMultiplier = 1;
  for (const stageId in stages) {
    const stage = stages[stageId];
    for (const upgradeId in stage.upgrades) {
      const upgrade = stage.upgrades[upgradeId];
      const effect = upgrade.static.effect;
      if (
        upgrade.dynamic.count === 0 ||
        effect.type !== 'productionMultiplier' ||
        !effect.producersEffected.some(
          (p: { stageId: string; producerId: string }) =>
          p.stageId === producerStageId && p.producerId === producerId
        )
      ) {
        continue;
      }

      const multiplier = effect.multiplier;
      if (multiplier.type === "log") {
        const logMultiplier = Math.log(upgrade.dynamic.count) / Math.log(multiplier.logBase) + multiplier.flatAddition;
        totalMultiplier *= logMultiplier;
      } else if (effect.multiplier.type === "flat") {

        totalMultiplier *= Math.pow(effect.multiplier.multiplierAmount, upgrade.dynamic.count);
      }
    }
  }

  return totalMultiplier;
}

// TODO: recalc
export const recalculateProducerCostReduction = (
  stages: { [key: string]: Stage }, producerStageId: string, producerId: string,
): number => {
  let totalMultiplier = 1;
  for (const stageId in stages) {
    const stage = stages[stageId];
    for (const upgradeId in stage.upgrades) {
      const upgrade = stage.upgrades[upgradeId];
      const effect = upgrade.static.effect;
      if (
        upgrade.dynamic.count === 0 ||
        effect.type !== 'costReduction' ||
        !effect.producersEffected.some(
          (p: { stageId: string; producerId: string }) =>
          p.stageId === producerStageId && p.producerId === producerId
        )
      ) {
        continue;
      }

      totalMultiplier *= Math.pow(effect.multiplierAmount, upgrade.dynamic.count);
    }
  }

  return totalMultiplier;
}

