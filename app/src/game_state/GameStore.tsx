import { create } from 'zustand';
import { loadGameState } from './stateStorageHelpers';

/* Types and Interfaces */
export interface GameState {
  planet: Planet;
  robots: Robot[];
  currentResources: number;
  resourcesPerSecond: number;
  timeSaved: number;
  timeOfflineData?: OfflineData;
}
interface Planet {
  name: string;
  biome: string;
  structureSlots: StructureSlot[];
  difficultyCoefficient: number;
}
export interface StructureSlot {
  id: number;
  structure?: Structure;
}
interface Structure {
  type: string;
}
export interface Robot {
  id: number;
  name: string;
  description: string;
  color: 'blue' | 'red' | 'green';
  count: number;
  currentCost: number;
  baseCost: number;
  baseRate: number;
  baseProduction: number;
  minMoneyToShow: number;
  isBeingShown: boolean;
  animateAppearance: boolean;
}
export interface OfflineData {
  moneyEarned: number;
  timeElapsed: number;
}

/* Initial Game State */
const INITIAL_GAME_STATE: GameState = {
  planet: {
    name: "Baj",
    biome: "Swamp",
    structureSlots: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
    ],
    difficultyCoefficient: 1.0,
  },
  currentResources: 100,
  resourcesPerSecond: 0,
  timeSaved: 0,
  robots: [
    {
      id: 1,
      name: "MNR-N1",
      description: "Basic mining robot",
      color: 'blue',
      count: 0,
      currentCost: 100,
      baseCost: 100,
      baseRate: 1.15,
      baseProduction: 150,
      minMoneyToShow: 0,
      isBeingShown: true,
      animateAppearance: false,
    },
    {
      id: 2,
      name: "MNR-X1",
      description: "Supercharged mining robot",
      color: 'red',
      count: 0,
      currentCost: 5000,
      baseCost: 5000,
      baseRate: 1.15,
      baseProduction: 2500,
      minMoneyToShow: 10000,
      isBeingShown: false,
      animateAppearance: true,
    },
  ],
};

const updateRobotStateAfterPurchase = (robot: Robot, numPurchased: number): Robot => {
  const updatedCount = robot.count + numPurchased;
  let updatedCost = robot.currentCost + (robot.baseCost * (robot.baseRate ** updatedCount));
  updatedCost = Math.round(updatedCost);
  return {
    ...robot,
    count: updatedCount,
    currentCost: updatedCost,
  };
};

const LOADED_GAME_STATE = loadGameState() || INITIAL_GAME_STATE;

export const useGameStore = create<GameState & {
  tick: (milliseconds: number) => void;
  purchaseRobot: (robotId: number) => void;
  updateTimeSaved: (timeSaved: number) => void;
  resetGame: () => void;
}>((set, get) => ({
  ...LOADED_GAME_STATE,

  tick: (milliseconds: number) => {
    const { currentResources, resourcesPerSecond, robots } = get();
    const tickRate = milliseconds / 1000;
    const updatedMoney = currentResources + resourcesPerSecond * tickRate;

    const updatedRobots = robots.map(robot => {
      if (!robot.isBeingShown && updatedMoney > robot.minMoneyToShow) {
        return { ...robot, isBeingShown: true };
      }
      return robot;
    });

    set({ currentResources: updatedMoney, robots: updatedRobots });
  },

  purchaseRobot: (robotId: number) => {
    const { robots, currentResources, resourcesPerSecond } = get();
    const robotIndex = robots.findIndex(r => r.id === robotId);
    if (robotIndex === -1) {
      console.error(`Robot with ID ${robotId} not found.`);
      return;
    }

    const robot = robots[robotIndex];
    if (currentResources < robot.currentCost) {
      console.error(`Not enough money to buy robot with ID ${robotId}.`);
      return;
    }

    const updatedRobot = updateRobotStateAfterPurchase(robot, 1);
    const updatedRobots = [...robots];
    updatedRobots[robotIndex] = updatedRobot;

    set({
      currentResources: currentResources - robot.currentCost,
      resourcesPerSecond: resourcesPerSecond + robot.baseProduction,
      robots: updatedRobots,
    });
  },

  updateTimeSaved: (timeSaved: number) => {
    set({ timeSaved });
  },

  resetGame: () => {
    set({ ...INITIAL_GAME_STATE });
  },
}));
