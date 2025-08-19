import { create } from 'zustand';

import { loadGameState } from './stateStorageHelpers';
import { INITIAL_GAME_STATE } from './InitialGameState';
import { GameState } from './types';
import { calculatePriceForMultiplePurchases } from './state_helpers/producerHelpers';
import { updateStateForUpgradePurchase } from './state_helpers/upgradeHelpers';
import { recalculateResourceProduction } from './state_helpers/resourceHelpers';
import { multiplyBigIntByNumber } from '../number_helpers/bigIntUtils';
import {
  updateProducerInStages, updateUpgradeInStages, updateUnlockInStages
} from './state_helpers/spreadHelpers';

const LOADED_GAME_STATE = loadGameState() || INITIAL_GAME_STATE;

// function measureTime<T extends (...args: any[]) => any>(fn: T, actionName: string): T {
//   return ((...args: any[]) => {
//     const start = performance.now();
//     const result = fn(...args);
//     const end = performance.now();
//     console.log(`${actionName} took ${end - start}ms`);
//     return result;
//   }) as T;
// }

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
    setTutorialSeen: (tutorialId: string) => void;
    updateTimeSaved: (timeSaved: number) => void;
    resetGame: () => void;
  }
>((set, get, store) => ({
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
    if (!producerToBuy.dynamic.isActive) {
      console.error(`Producer with ID ${producerId} is already purchased or inactive.`);
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
    let updatedStages = { ...stages };
    updatedStages = updateProducerInStages(
      updatedStages, stageId, producerId,
      { ...producerToBuy, dynamic: { ...producerToBuy.dynamic, count: producerToBuy.dynamic.count + numToPurchase } }
    );

    // Update resource counts and production rates
    const updatedResources = { ...resources };
    updatedResources[purchaseResource] = {
      ...updatedResources[purchaseResource],
      currentAmount: updatedResources[purchaseResource].currentAmount - currentCost,
    };
    if (producedResource) {
      updatedResources[producedResource] = {
        ...updatedResources[producedResource],
        amountPerSecond: recalculateResourceProduction(updatedStages, producedResource),
      };
    }

    set({ resources: updatedResources, stages: updatedStages });
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
    if (!upgradeToBuy.dynamic.isActive) {
      console.error(`Upgrade with ID ${upgradeId} is already purchased or inactive.`);
      return;
    }
    const purchaseResource = upgradeToBuy.static.purchaseResource;

    // Check if the player has enough resources to purchase the upgrade
    const currentUpgradeCost = multiplyBigIntByNumber(
      upgradeToBuy.static.baseCost,
      upgradeToBuy.static.baseRateOfCostIncrease ** (upgradeToBuy.dynamic.count)
    );
    if (resources[purchaseResource].currentAmount < currentUpgradeCost) {
      console.error(`Not enough ${purchaseResource} to buy upgrade with ID ${upgradeId}.`);
      return;
    }

    // Update the upgrade count in the stage
    const newCount = upgradeToBuy.dynamic.count + 1;
    let updatedStages = { ...stages};
    updatedStages = updateUpgradeInStages(
      updatedStages, stageId, upgradeId,
      { ...upgradeToBuy, dynamic: { ...upgradeToBuy.dynamic, count: newCount, } }
    );

    let updatedResources = { ...resources };

    // Deduct the cost of the upgrade from the resources
    updatedResources[purchaseResource] = {
      ...updatedResources[purchaseResource],
      currentAmount: updatedResources[purchaseResource].currentAmount - currentUpgradeCost,
    };

    // Update the stages and resources based on the impact of the upgrade
    [ updatedStages, updatedResources ] = updateStateForUpgradePurchase(updatedStages, updatedResources, stageId, upgradeId);
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
    if (!unlockableToBuy.dynamic.isActive) {
      console.error(`Unlockable with ID ${unlockableId} is already purchased or inactive.`);
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

    // Update the unlockable state in the stages
    let updatedStages = { ...stages };
    updatedStages = updateUnlockInStages(
      updatedStages, stageId, unlockableId,
      { ...unlockableToBuy, dynamic: { ...unlockableToBuy.dynamic, isActive: false, } }
    );

    for (const unlock of unlockableToBuy.static.unlocks) {
      switch (unlock.type) {
        case "stage":
          updatedStages[unlock.stageId] = {
            ...updatedStages[unlock.stageId],
            isActive: true,
          };
          break;
        case "producer":
          const producer = updatedStages[unlock.stageId].producers[unlock.producerId];
          updatedStages = updateProducerInStages(
            updatedStages, unlock.stageId, unlock.producerId,
            { ...producer, dynamic: { ...producer.dynamic, isActive: true, } }
          );
          break;
        case "upgrade":
          const upgrade = updatedStages[unlock.stageId].upgrades[unlock.upgradeId];
          updatedStages = updateUpgradeInStages(
            updatedStages, unlock.stageId, unlock.upgradeId,
            { ...upgrade, dynamic: { ...upgrade.dynamic, isActive: true, } }
          );
          break;
        case "unlock":
          const unlockableToBeUnlocked = updatedStages[unlock.stageId].unlocks[unlock.unlockId];
          updatedStages = updateUnlockInStages(
            updatedStages, unlock.stageId, unlock.unlockId,
            { ...unlockableToBeUnlocked, dynamic: { ...unlockableToBeUnlocked.dynamic, isActive: true, } }
          );
          break;
        case "lock":
          const unlockableToBeLocked = updatedStages[unlock.stageId].unlocks[unlock.unlockId];
          updatedStages = updateUnlockInStages(
            updatedStages, unlock.stageId, unlock.unlockId,
            { ...unlockableToBeLocked, dynamic: { ...unlockableToBeLocked.dynamic, isActive: false, } }
          );
          break;
        case "buff":
          // TODO
          break;
        default:
          break;
      }
    }

    set({ resources: updatedResources, stages: updatedStages });
  },

  // Set a tutorial as seen
  setTutorialSeen: (tutorialId: string) => {
    const { tutorials } = get();

    // Check if the tutorial exists in the state
    const tutorial = tutorials[tutorialId];
    if (tutorial === undefined) {
      console.error(`Tutorial with ID ${tutorialId} not found.`);
      return;
    }
  
    set({ tutorials: { ...tutorials, [tutorialId]: true } });
  },

  // Update the last time the game state was saved
  updateTimeSaved: (lastTimeSaved: number) => {
    set({ lastTimeSaved: lastTimeSaved });
  },

  // Reset the game state to the initial state
  resetGame: () => {
    set(INITIAL_GAME_STATE);
  },
}));
