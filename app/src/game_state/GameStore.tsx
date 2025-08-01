import { create } from 'zustand';

import { loadGameState } from './stateStorageHelpers';
import { INITIAL_GAME_STATE } from './InitialGameState';
import { refreshRobotProduction, calculatePriceForMultiplePurchases } from '../helpers/robotStateHelpers';
import { GameState, Robot } from '../types';

const LOADED_GAME_STATE = loadGameState() || INITIAL_GAME_STATE;

/**
 * Game Store using Zustand for state management.
 * This store holds the game state and provides methods to manipulate it.
 */
export const useGameStore = create<GameState & {
  tick: (milliseconds: number) => void;
  purchaseRobot: (robotId: number, numToPurchase: number) => void;
  purchaseStructure: (structureSlotId: number, structureId: number) => void;
  updateTimeSaved: (timeSaved: number) => void;
  resetGame: () => void;
}>((set, get) => ({
  ...LOADED_GAME_STATE,

  // Tick function to update resources based on time elapsed
  tick: (milliseconds: number) => {
    const { currentResources, resourcesPerSecond, robots } = get();
    const tickRate = milliseconds / 1000;
    const updatedMoney = currentResources + resourcesPerSecond * tickRate;

    // Update robots to be shown if they meet the minimum money requirement
    const updatedRobots = robots.map(robot => {
      if (!robot.isBeingShown && updatedMoney > robot.minMoneyToShow) {
        return { ...robot, isBeingShown: true };
      }
      return robot;
    });

    set({ currentResources: updatedMoney, robots: updatedRobots });
  },

  // Purchase a single robot by its ID
  purchaseRobot: (robotId: number, numToPurchase: number) => {
    const { robots, currentResources, planet } = get();
    const robotIndex = robots.findIndex(r => r.id === robotId);
    if (robotIndex === -1) {
      console.error(`Robot with ID ${robotId} not found.`);
      return;
    }

    const robot = robots[robotIndex];

    const currentCost = calculatePriceForMultiplePurchases(
      robot, numToPurchase, planet.structureSlots
    );
    if (currentResources < currentCost) {
      console.error(`Not enough money to buy robot with ID ${robotId}.`);
      return;
    }

    const updatedRobots = [...robots];
    updatedRobots[robotIndex] = refreshRobotProduction(
      {...robot, count: robot.count + numToPurchase },
      planet.structureSlots
    );

    set({
      robots: updatedRobots,
      resourcesPerSecond: updatedRobots.reduce((total, robot) => total + robot.resourcesPerSecond, 0),
      currentResources: currentResources - currentCost,
    });
  },

  // Purchase a structure to be built in a specific slot
  purchaseStructure: (structureSlotId: number, structureId: number) => {
    const { buildableStructures, planet, currentResources, robots } = get();

    // Get Structure to Build
    const structureToBuild = buildableStructures.find(s => s.id === structureId);
    if (!structureToBuild) {
      console.error(`Structure with ID ${structureId} not found.`);
      return;
    }

    // Get Structure Slot to build in and check if Slot is Available
    const structureSlotIndex = planet.structureSlots.findIndex(slot => slot.id === structureSlotId);
    if (structureSlotIndex === -1) {
      console.error(`Structure slot with ID ${structureSlotId} not found.`);
      return;
    }
    const structureSlot = planet.structureSlots[structureSlotIndex];

    // Check if there are enough resources to purchase the structure
    const totalCost = structureToBuild.cost * structureSlot.costMultiplier;
    if (currentResources < totalCost) {
      console.error(`Not enough money to buy structure with ID ${structureId}.`);
      return;
    }

    // Update the structure slot
    const updatedSlots = [...planet.structureSlots];
    updatedSlots[structureSlotIndex] = {
      ...structureSlot,
      structure: { ...structureToBuild },
    }

    // Refresh robots based on the new structure state
    const updatedRobots: Robot[] = [];
    for (const robot of robots) {
      updatedRobots.push(refreshRobotProduction(robot, updatedSlots));
    }

    // Update the game state
    set({
      robots: updatedRobots,
      resourcesPerSecond: updatedRobots.reduce((total, robot) => total + robot.resourcesPerSecond, 0),
      currentResources: currentResources - totalCost,
      planet: { ...planet, structureSlots: updatedSlots },
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
