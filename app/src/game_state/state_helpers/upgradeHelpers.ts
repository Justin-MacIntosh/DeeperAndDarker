import { Stage } from "../types";
import { recalculateProducerCostReduction, recalculateProducerProductionMultiplier } from "./producerHelpers";
import { recalculateResourceProduction } from "./resourceHelpers";
import { updateProducerInStages } from "./spreadHelpers";


// Updates the stages and resources state after an upgrade is purchased
export const updateStateForUpgradePurchase = (
  stages: { [key: string]: Stage },
  resources: { [key: string]: { currentAmount: bigint; amountPerSecond: bigint;} },
  stageId: string,
  upgradeId: string
): [ { [key: string]: Stage }, { [key: string]: { currentAmount: bigint; amountPerSecond: bigint;} } ] => {
  const upgradePurchased = stages[stageId].upgrades[upgradeId];

  const resourcesAffected = [];
  let updatedStages = { ...stages };
  const effect = upgradePurchased.static.effect;
  for (const { stageId, producerId } of effect.producersEffected) {
    const producer = stages[stageId].producers[producerId];

    if (effect.type === "productionMultiplier") {
      // Update producer production and track affected resources
      const updatedProducer = {
        ...producer,
        dynamic: {
          ...producer.dynamic,
          productionMultiplier: recalculateProducerProductionMultiplier(stages, stageId, producerId),
        },
      };
      updatedStages = updateProducerInStages(updatedStages, stageId, producerId, updatedProducer);
      resourcesAffected.push(producer.static.producedResource);
    } else if (effect.type === "costReduction") {
      // Update producer cost reduction
      const updatedProducer = {
        ...producer,
        dynamic: {
          ...producer.dynamic,
          costReductionMultiplier: recalculateProducerCostReduction(stages, stageId, producerId),
        },
      };
      updatedStages = updateProducerInStages(updatedStages, stageId, producerId, updatedProducer);
    }
  }

  // Recalculate the amount-per-second for all affected resources
  const updatedResources = { ...resources };
  for (const resourceId of resourcesAffected) {
    updatedResources[resourceId] = {
      ...resources[resourceId],
      amountPerSecond: recalculateResourceProduction(updatedStages, resourceId),
    };
  }

  return [ updatedStages, updatedResources ];
}
