import { Stage } from "../types";
import { calculateProducerProduction } from "./producerHelpers";

// Recalculates the total production for a specific resource type across all stages
export const recalculateResourceProduction = (
  stages: { [key: string]: Stage }, resourceId: string
): bigint => {
  let totalProduction = BigInt(0);
  for (const stageId in stages) {
    const stage = stages[stageId];
    for (const producerId in stage.producers) {
      const producer = stage.producers[producerId];
      if (producer.static.producedResource !== resourceId) {
        continue;
      }
      totalProduction += calculateProducerProduction(producer);
    }
  }
  return totalProduction;
}