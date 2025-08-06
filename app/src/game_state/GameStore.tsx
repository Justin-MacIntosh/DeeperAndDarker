import { create } from 'zustand';

import { loadGameState } from './stateStorageHelpers';
import { INITIAL_GAME_STATE } from './InitialGameState';
import { GameState } from './types';
import {
  calculatePriceForMultiplePurchases,
  recalculateResourceProduction
} from '../helpers/producerStateHelpers';

var Fraction = require('fractional').Fraction;

const LOADED_GAME_STATE = loadGameState() || INITIAL_GAME_STATE;

/**
 * Game Store using Zustand for state management.
 * This store holds the game state and provides methods to manipulate it.
 */
export const useGameStore = create<
  GameState & {
    tick: (milliseconds: number) => void;
    purchaseProducer: (stageId: string, producerId: string, numToPurchase: number) => void;
    updateTimeSaved: (timeSaved: number) => void;
    resetGame: () => void;
  }
>((set, get) => ({
  ...LOADED_GAME_STATE,

  // Tick function to update resources based on time elapsed
  tick: (milliseconds: number) => {
    const { resources } = get();

    const updatedResources: {
      [key: string]: { currentAmount: bigint; amountPerSecond: bigint }
    } = {};

    for (const resourceKey in resources) {
      const resource = resources[resourceKey];
      const updatedAmount = resource.currentAmount + (
        (resource.amountPerSecond * BigInt(milliseconds)) / BigInt(1000)
      );
      updatedResources[resourceKey] = { ...resource, currentAmount: updatedAmount };
    }

    set({ resources: updatedResources });
  },

  // Purchase a producer by its ID and quantity
  purchaseProducer: (stageId: string, producerId: string, numToPurchase: number) => {
    if (numToPurchase <= 0) {
      console.error("Number to purchase must be greater than zero.");
      return;
    }

    const { resources, stages } = get();
    const stage = stages[stageId];
    if (!stage) {
      console.error(`Stage with ID ${stageId} not found.`);
      return;
    }
    const producerToBuy = stage.producers[producerId];
    if (!producerToBuy) {
      console.error(`Producer with ID ${producerId} not found in stage ${stageId}.`);
      return;
    }

    const purchaseResource = producerToBuy.static.purchaseResource;
    const producedResource = producerToBuy.static.producedResource;
    const currentCost = calculatePriceForMultiplePurchases(producerToBuy, numToPurchase);

    if (resources[purchaseResource].currentAmount < currentCost) {
      console.error(`Not enough ${purchaseResource} to buy producer with ID ${producerId}.`);
      return;
    }

    // Update the producer count in the stage
    const updatedStages = {
      ...stages,
      [stageId]: {
        ...stage,
        producers: {
          ...stage.producers,
          [producerId]: {
            ...producerToBuy,
            dynamic: {
              ...producerToBuy.dynamic,
              count: producerToBuy.dynamic.count + numToPurchase,
            }
          },
        },
      },
    };

    // Update resource counts and production rates
    const updatedResources = { ...resources };
    updatedResources[purchaseResource] = {
      ...updatedResources[purchaseResource],
      currentAmount: updatedResources[purchaseResource].currentAmount - currentCost,
    };
    updatedResources[producedResource] = {
      ...updatedResources[producedResource],
      amountPerSecond: recalculateResourceProduction(updatedStages, producedResource),
    };

    set({
      resources: updatedResources,
      stages: updatedStages,
    });
  },

  // Purchase a producer by its ID and quantity
  purchaseUpgrade: (stageId: string, upgradeId: string) => {
    const { resources, stages } = get();
    const stage = stages[stageId];
    if (!stage) {
      console.error(`Stage with ID ${stageId} not found.`);
      return;
    }
    const upgradeToBuy = stage.upgrades[upgradeId];
    if (!upgradeToBuy) {
      console.error(`Upgrade with ID ${upgradeId} not found in stage ${stageId}.`);
      return;
    }
    const purchaseResource = upgradeToBuy.static.purchaseResource;

    const costIncreaseFraction = new Fraction(upgradeToBuy.static.baseRateOfCostIncrease ** (upgradeToBuy.dynamic.count + 1));
    const currentCost = (
      upgradeToBuy.static.baseCost *
      BigInt(costIncreaseFraction.numerator)
    ) / BigInt(costIncreaseFraction.denominator);

    if (resources[purchaseResource].currentAmount < currentCost) {
      console.error(`Not enough ${purchaseResource} to buy upgrade with ID ${upgradeId}.`);
      return;
    }

    const updatedStages = {
      ...stages,
      [stageId]: {
        ...stage,
        upgrades: {
          ...stage.upgrades,
          [upgradeId]: {
            ...upgradeToBuy,
            dynamic: {
              ...upgradeToBuy.dynamic,
              count: upgradeToBuy.dynamic.count + 1,
            }
          },
        },
      },
    };
    const updatedResources = { ...resources };

    // Calculate effect on producers
    const effect = upgradeToBuy.static.effect;
    for (const { stageId, producerId } of effect.producersEffected) {
      const producer = updatedStages[stageId].producers[producerId];
      if (effect.type === "productionMultiplier") {
        producer.dynamic.productionMultiplier *= effect.multiplierAmount;
        updatedResources[producer.static.producedResource] = {
          ...updatedResources[producer.static.producedResource],
          amountPerSecond: recalculateResourceProduction(updatedStages, producer.static.producedResource),
        };
      } else if (effect.type === "costReduction") {
        producer.dynamic.costReductionMultiplier *= effect.multiplierAmount;
      }
    }

    set({ resources: updatedResources, stages: updatedStages });
  },

  // Update the last time the game state was saved
  updateTimeSaved: (lastTimeSaved: number) => {
    set({ lastTimeSaved: lastTimeSaved });
  },

  // Reset the game state to the initial state
  resetGame: () => {
    set({ ...INITIAL_GAME_STATE });
  },
}));
