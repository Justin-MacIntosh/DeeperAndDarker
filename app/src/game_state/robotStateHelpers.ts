import { Robot, StructureSlot } from "./GameStateTypes";


/** Calculates the price for purchasing a robot multiple times. */
export const calculatePriceForMultiplePurchases = (
  robot: Robot, numPurchases: number, structureSlots: StructureSlot[]
): number => {
  const costMultiplier = structureSlots.reduce((acc, slot) => {
    if (
      slot.structure &&
      slot.structure.effect.type === "cost_reducer" &&
      slot.structure.effect.robotTiersEffected.includes(robot.id)
    ) {
      return acc * slot.structure.effect.multiplier;
    }
    return acc;
  }, 1);

  // Calculate the total cost using the formula for geometric series
  let rateExponentialTotal = 0;
  for (let i = 0; i < numPurchases; i++) {
    rateExponentialTotal += robot.baseRate ** (robot.count + i);
  }

  console.log(rateExponentialTotal);
  console.log(costMultiplier);

  const totalCost = Math.round(robot.baseCost * rateExponentialTotal * costMultiplier);
  console.log(totalCost);

  // The total cost is the base cost multiplied by the total rate and the
  // cost multiplier and rounded to the nearest integer
  return Math.round(robot.baseCost * rateExponentialTotal * costMultiplier);
};

/**
 * Refreshes the robot state based on the current structure slots.
 * This function recalculates the cost and production values of the robot.
 */
export const refreshRobotProduction = (robot: Robot, structureSlots: StructureSlot[]): Robot => {
  const productionMultiplier = structureSlots.reduce((acc, slot) => {
    if (
      slot.structure &&
      slot.structure.effect.type === "production" &&
      slot.structure.effect.robotTiersEffected.includes(robot.id)
    ) {
      return acc * slot.structure.effect.multiplier;
    }
    return acc;
  }, 1);
  const robotProduction = robot.count * robot.baseProduction * productionMultiplier;

  return {
    ...robot,
    resourcesPerSecond: robotProduction,
  };
};
