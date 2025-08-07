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

function measureTime<T extends (...args: any[]) => any>(fn: T, actionName: string): T {
  return ((...args: any[]) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`${actionName} took ${end - start}ms`);
    return result;
  }) as T;
}

/**
 * Game Store using Zustand for state management.
 * This store holds the game state and provides methods to manipulate it.
 */
export const useGameStore = create<
  GameState & {
    tick: (milliseconds: number) => void;
    purchaseProducer: (stageId: string, producerId: string, numToPurchase: number) => void;
    purchaseUpgrade: (stageId: string, upgradeId: string) => void;
    purchaseUnlock: (stageId: string, unlockableId: string) => void;
    updateTimeSaved: (timeSaved: number) => void;
    resetGame: () => void;
  }
>((set, get) => ({
  ...LOADED_GAME_STATE,

  // Tick function to update resources based on time elapsed
  tick:
    (milliseconds: number) => {
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


  //  'tick'
  // ),

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

    const costIncreaseFraction = new Fraction(upgradeToBuy.static.baseRateOfCostIncrease ** (upgradeToBuy.dynamic.count));
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
      // TODO: fix using spread operator to avoid mutating state directly
      const producer = updatedStages[stageId].producers[producerId];
      if (effect.type === "productionMultiplier") {
        producer.dynamic.productionMultiplier *= effect.multiplierAmount;
        updatedResources[producer.static.producedResource] = {
          ...updatedResources[producer.static.producedResource],
          amountPerSecond: recalculateResourceProduction(updatedStages, producer.static.producedResource),
        };
      } else if (effect.type === "costReduction") {
      // TODO: fix using spread operator to avoid mutating state directly
        producer.dynamic.costReductionMultiplier *= effect.multiplierAmount;
      }
    }

    updatedResources[purchaseResource] = {
      ...updatedResources[purchaseResource],
      currentAmount: updatedResources[purchaseResource].currentAmount - currentCost,
    };

    set({ resources: updatedResources, stages: updatedStages });
  },

  purchaseUnlock: (stageId: string, unlockableId: string) => {
    const { resources, stages } = get();
    const stage = stages[stageId];
    if (!stage) {
      console.error(`Stage with ID ${stageId} not found.`);
      return;
    }
    const unlockableToBuy = stage.unlocks[unlockableId];
    if (!unlockableToBuy) {
      console.error(`Unlockable with ID ${unlockableId} not found in stage ${stageId}.`);
      return;
    }

    const purchaseResource = unlockableToBuy.static.purchaseResource;
    if (resources[purchaseResource].currentAmount < unlockableToBuy.static.cost) {
      console.error(`Not enough ${purchaseResource} to buy unlockable with ID ${unlockableId}.`);
      return;
    }

    const updatedResources = { ...resources };
    updatedResources[purchaseResource] = {
      ...updatedResources[purchaseResource],
      currentAmount: updatedResources[purchaseResource].currentAmount - unlockableToBuy.static.cost,
    };

    const updatedStages = { ...stages };
    updatedStages[stageId] = {
      ...stage,
      unlocks: {
        ...stage.unlocks,
        [unlockableId]: {
          ...unlockableToBuy,
          dynamic: {
            ...unlockableToBuy.dynamic,
            isActive: false,
          }
        },
      },
    };

    for (const unlock of unlockableToBuy.static.unlocks) {
      switch (unlock.type) {
        case "stage":
          updatedStages[unlock.stageId] = {
            ...updatedStages[unlock.stageId],
            isActive: true,
          };
          break;
        case "producer":
          updatedStages[unlock.stageId] = {
            ...updatedStages[unlock.stageId],
            producers: {
              ...updatedStages[unlock.stageId].producers,
              [unlock.producerId]: {
                ...updatedStages[unlock.stageId].producers[unlock.producerId],
                dynamic: {
                  ...updatedStages[unlock.stageId].producers[unlock.producerId].dynamic,
                  isActive: true,
                },
              },
            },
          };
          break;
        case "upgrade":
          updatedStages[unlock.stageId] = {
            ...updatedStages[unlock.stageId],
            upgrades: {
              ...updatedStages[unlock.stageId].upgrades,
              [unlock.upgradeId]: {
                ...updatedStages[unlock.stageId].upgrades[unlock.upgradeId],
                dynamic: {
                  ...updatedStages[unlock.stageId].upgrades[unlock.upgradeId].dynamic,
                  isActive: true,
                },
              },
            },
          };
          break;
        case "buff":
          updatedStages[unlock.stageId] = {
            ...updatedStages[unlock.stageId],
            buffs: {
              ...updatedStages[unlock.stageId].buffs,
              [unlock.buffId]: {
                ...updatedStages[unlock.stageId].buffs[unlock.buffId],
                dynamic: {
                  ...updatedStages[unlock.stageId].buffs[unlock.buffId].dynamic,
                  isActive: true,
                },
              },
            },
          };
          break;
        case "unlock":
          updatedStages[unlock.stageId] = {
            ...updatedStages[unlock.stageId],
            unlocks: {
              ...updatedStages[unlock.stageId].unlocks,
              [unlock.unlockId]: {
                ...updatedStages[unlock.stageId].unlocks[unlock.unlockId],
                dynamic: {
                  ...updatedStages[unlock.stageId].unlocks[unlock.unlockId].dynamic,
                  isActive: true,
                },
              },
            },
          };
          break;
        default:
          break;
      }
    }

    set({
      resources: updatedResources,
      stages: updatedStages,
    });
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
