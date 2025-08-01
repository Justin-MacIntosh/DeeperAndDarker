import { Robot, StructureSlot } from "../types";

/**
 * Calculates the cost multiplier based on the structure slots and the robot ID.
 * This function checks for structures that reduce costs for specific robot tiers.
 */
const calculateCostMultiplier = (structureSlots: StructureSlot[], robotId: number): number => {
  return structureSlots.reduce((acc, slot) => {
    if (
      slot.structure &&
      slot.structure.effect.type === "cost_reducer" &&
      slot.structure.effect.robotTiersEffected.includes(robotId)
    ) {
      return acc * slot.structure.effect.multiplier;
    }
    return acc;
  }, 1);
}

/**
 * Calculates the production multiplier based on the structure slots and the robot ID.
 * This function checks for structures that enhance production for specific robot tiers.
 */
const calculateProductionMultiplier = (structureSlots: StructureSlot[], robotId: number): number => {
  return structureSlots.reduce((acc, slot) => {
    if (
      slot.structure &&
      slot.structure.effect.type === "production" &&
      slot.structure.effect.robotTiersEffected.includes(robotId)
    ) {
      return acc * slot.structure.effect.multiplier;
    }
    return acc;
  }, 1);
}

/**
 * Calculates the maximum number of robots that can be purchased with the current resources.
 * This function iteratively checks how many robots can be bought until the resources run out.
 */
export const calculateMaxPossiblePurchase = (
  robot: Robot, currentResources: number, structureSlots: StructureSlot[]
): { cost: number; maxPossiblePurchase: number } => {
  let numToPurchase = 1;
  while (true) {
    const costForPurchase = calculatePriceForMultiplePurchases(
      robot, numToPurchase + 1, structureSlots
    );
    if (currentResources < costForPurchase) {
      break;
    }
    numToPurchase++;
  }

  const totalCost = calculatePriceForMultiplePurchases(
    robot, numToPurchase, structureSlots
  );
  return {
    cost: totalCost,
    maxPossiblePurchase: numToPurchase,
  };
} 

/** Calculates the price for purchasing a robot multiple times. */
export const calculatePriceForMultiplePurchases = (
  robot: Robot, numPurchases: number, structureSlots: StructureSlot[]
): number => {
  const costMultiplier = calculateCostMultiplier(structureSlots, robot.id);

  // Calculate the total cost using the formula for geometric series
  let rateExponentialTotal = 0;
  for (let i = 0; i < numPurchases; i++) {
    rateExponentialTotal += robot.baseRate ** (robot.count + i);
  }

  // The total cost is the base cost multiplied by the total rate and the
  // cost multiplier and rounded to the nearest integer
  return Math.round(robot.baseCost * rateExponentialTotal * costMultiplier);
};

/**
 * Refreshes the robot state based on the current structure slots.
 * This function recalculates the cost and production values of the robot.
 */
export const refreshRobotProduction = (
  robot: Robot,
  structureSlots: StructureSlot[]
): Robot => {
  const productionMultiplier = calculateProductionMultiplier(structureSlots, robot.id);
  const robotProduction = robot.count * robot.baseProduction * productionMultiplier;

  return {
    ...robot,
    resourcesPerSecond: robotProduction,
  };
};
