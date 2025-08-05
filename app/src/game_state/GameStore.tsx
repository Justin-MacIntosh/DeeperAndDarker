// import { create } from 'zustand';

// import { loadGameState } from './stateStorageHelpers';
// import { INITIAL_GAME_STATE } from './InitialGameState';
// import { refreshProducerProduction, calculatePriceForMultiplePurchases } from '../helpers/producerStateHelpers';
// import { GameState, Producer } from '../types';

// var Fraction = require('fractional').Fraction;

// const LOADED_GAME_STATE = loadGameState() || INITIAL_GAME_STATE;

// /**
//  * Game Store using Zustand for state management.
//  * This store holds the game state and provides methods to manipulate it.
//  */
// export const useGameStore = create<
//   GameState & {
//     tick: (milliseconds: number) => void;
//     purchaseProducer: (producerId: number, numToPurchase: number) => void;
//     purchaseUpgrade: (upgradeSlotId: number, upgradeId: number) => void;
//     updateTimeSaved: (timeSaved: number) => void;
//     resetGame: () => void;
//   }
// >((set, get) => ({
//   ...LOADED_GAME_STATE,

//   // Tick function to update resources based on time elapsed
//   tick: (milliseconds: number) => {
//     const { currentResources, resourcesPerSecond, producers } = get();
//     const tickRate = milliseconds / 1000;
//     const updatedMoney = currentResources + ((resourcesPerSecond * BigInt(milliseconds)) / BigInt(1000));

//     // Update producers to be shown if they meet the minimum money requirement
//     const updatedProducers = producers.map(
//       prod => {
//         if (!prod.isBeingShown && updatedMoney > prod.minMoneyToShow) {
//           return { ...prod, isBeingShown: true };
//         }
//         return { ...prod };
//       }
//     );

//     set({ currentResources: updatedMoney, producers: updatedProducers });
//   },

//   // Purchase a single producer by its ID
//   purchaseProducer: (producerId: number, numToPurchase: number) => {
//     const { producers, currentResources, stage } = get();
//     const prodIndex = producers.findIndex(prod => prod.id === producerId);
//     if (prodIndex === -1) {
//       console.error(`Producer with ID ${producerId} not found.`);
//       return;
//     }

//     const producerToBuy = producers[prodIndex];
//     const currentCost = calculatePriceForMultiplePurchases(
//       producerToBuy, numToPurchase, stage.upgradeSlots
//     );
//     if (currentResources < currentCost) {
//       console.error(`Not enough money to buy producer with ID ${producerId}.`);
//       return;
//     }

//     const updatedProducers = [...producers];
//     updatedProducers[prodIndex] = refreshProducerProduction(
//       {...producerToBuy, count: producerToBuy.count + numToPurchase },
//       stage.upgradeSlots
//     );

//     set({
//       producers: updatedProducers,
//       resourcesPerSecond: (
//         updatedProducers.reduce(
//           (total, prod) => total + prod.resourcesPerSecond, BigInt(0)
//         )
//       ),
//       currentResources: currentResources - currentCost,
//     });
//   },

//   // Purchase an Upgrade to be built in a specific slot
//   purchaseUpgrade: (upgradeSlotId: number, upgradeId: number) => {
//     const { buildableUpgrades: buildableUpgrades, stage, currentResources, producers } = get();

//     // Get Upgrade to purchase
//     const upgradeToPurchase = buildableUpgrades.find(upg => upg.id === upgradeId);
//     if (!upgradeToPurchase) {
//       console.error(`Upgrade with ID ${upgradeId} not found.`);
//       return;
//     }

//     // Get Upgrade Slot to build in and check if Slot is Available
//     const upgradeSlotIndex = stage.upgradeSlots.findIndex(slot => slot.id === upgradeSlotId);
//     if (upgradeSlotIndex === -1) {
//       console.error(`Upgrade slot with ID ${upgradeSlotId} not found.`);
//       return;
//     }
//     const upgradeSlot = stage.upgradeSlots[upgradeSlotIndex];

//     // Check if there are enough resources to purchase the Upgrade
//     const multiplierFraction = new Fraction(upgradeSlot.costMultiplier);
//     const totalCost = (upgradeToPurchase.cost * BigInt(multiplierFraction.numerator)) / BigInt(multiplierFraction.denominator);
//     if (currentResources < totalCost) {
//       console.error(`Not enough money to buy Upgrade with ID ${upgradeId}.`);
//       return;
//     }

//     // Update the Upgrade Slot
//     const updatedSlots = [...stage.upgradeSlots];
//     updatedSlots[upgradeSlotIndex] = {
//       ...upgradeSlot,
//       upgrade: { ...upgradeToPurchase },
//     }

//     // Refresh Producers based on the new Upgrade state
//     const updatedProducers: Producer[] = [];
//     for (const prod of producers) {
//       updatedProducers.push(refreshProducerProduction(prod, updatedSlots));
//     }

//     console.log("STUFF");
//     console.log(currentResources);
//     console.log(totalCost);
//     console.log("STUFF2");

//     // Update the game state
//     set({
//       producers: updatedProducers,
//       resourcesPerSecond: (
//         updatedProducers.reduce(
//           (total, prod) => { console.log(prod.resourcesPerSecond); return total + prod.resourcesPerSecond }, BigInt(0)
//         )
//       ),
//       currentResources: currentResources - totalCost,
//       stage: { ...stage, upgradeSlots: updatedSlots },
//     });
//   },

//   // Update the last time the game state was saved
//   updateTimeSaved: (lastTimeSaved: number) => {
//     set({ lastTimeSaved: lastTimeSaved });
//   },

//   // Reset the game state to the initial state
//   resetGame: () => {
//     set({ ...INITIAL_GAME_STATE });
//   },
// }));

export {}