import { create } from 'zustand';
import { loadGameState } from './stateStorageHelpers';

/* Types and Interfaces */
export interface GameState {
  planet: Planet;
  robots: Robot[];
  currentResources: number;
  resourcesPerSecond: number;
  lastTimeSaved: number;
  buildableStructures: Structure[];
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
export interface Structure {
  id: number;
  name: string;
  icon: string;
  description: string;
  cost: number;
  effect: ProductionMultiplier | CostReducer;
}
interface ProductionMultiplier {
  type: 'production';
  robotTiersEffected: number[];
  multiplier: number;
}
interface CostReducer {
  type: 'cost_reducer';
  robotTiersEffected: number[];
  multiplier: number;
}

export interface Robot {
  // Identification
  id: number;
  name: string;
  description: string;
  
  // Resource production values
  resourcesPerSecond: number;
  baseProduction: number;

  // Cost and count values
  count: number;
  currentCost: number;
  baseCost: number;
  baseRate: number;

  // Display values
  color: 'blue' | 'red' | 'green';
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
  currentResources: 100,
  resourcesPerSecond: 0,
  lastTimeSaved: 0,
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
  buildableStructures: [
    {
      id: 1,
      name: "MNR-N1 Control Center",
      icon: "satellite-dish",
      description: "Increases MNR-N1 resource production by 30%",
      cost: 1000,
      effect: {
        type: 'production',
        robotTiersEffected: [1],
        multiplier: 1.2,
      } as ProductionMultiplier,
    },
    {
      id: 2,
      name: "Automaton Factory",
      icon: "industry",
      description: "Reduces all Automaton costs by 50%",
      cost: 2000,
      effect: {
        type: 'cost_reducer',
        robotTiersEffected: [1, 2],
        multiplier: 0.5,
      } as CostReducer,
    },
  ],
  robots: [
    {
      id: 1,
      name: "MNR-N1",
      description: "Basic mining robot",

      resourcesPerSecond: 0,
      baseProduction: 150,

      count: 0,
      currentCost: 100,
      baseCost: 100,
      baseRate: 1.15,

      color: "blue",
      minMoneyToShow: 0,
      isBeingShown: true,
      animateAppearance: false,
    },
    {
      id: 2,
      name: "MNR-X1",
      description: "Supercharged mining robot",

      resourcesPerSecond: 0,
      baseProduction: 2500,

      count: 0,
      currentCost: 5000,
      baseCost: 5000,
      baseRate: 1.15,

      color: "red",
      minMoneyToShow: 10000,
      isBeingShown: false,
      animateAppearance: true,
    },
  ],
};

const refreshRobotState = (robot: Robot, structureSlots: StructureSlot[]): Robot => {
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

  let updatedCost = robot.baseCost * (robot.baseRate ** robot.count);
  updatedCost *= costMultiplier;
  updatedCost = Math.round(updatedCost);

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
    currentCost: updatedCost,
    resourcesPerSecond: robotProduction,
  };
};

const LOADED_GAME_STATE = loadGameState() || INITIAL_GAME_STATE;

export const useGameStore = create<GameState & {
  tick: (milliseconds: number) => void;
  purchaseRobot: (robotId: number) => void;
  purchaseStructure: (structureSlotId: number, structureId: number) => void;
  updateTimeSaved: (timeSaved: number) => void;
  resetGame: () => void;
}>((set, get) => ({
  ...LOADED_GAME_STATE,

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

  purchaseRobot: (robotId: number) => {
    const { robots, currentResources, planet } = get();
    const robotIndex = robots.findIndex(r => r.id === robotId);
    if (robotIndex === -1) {
      console.error(`Robot with ID ${robotId} not found.`);
      return;
    }

    const robot = robots[robotIndex];
    const currentCost = robot.currentCost;
    if (currentResources < currentCost) {
      console.error(`Not enough money to buy robot with ID ${robotId}.`);
      return;
    }

    const updatedRobots = [...robots];
    updatedRobots[robotIndex] =  refreshRobotState(
      {...robot, count: robot.count + 1 },
      planet.structureSlots
    );

    set({
      robots: updatedRobots,
      resourcesPerSecond: updatedRobots.reduce((total, robot) => total + robot.resourcesPerSecond, 0),
      currentResources: currentResources - currentCost,
    });
  },

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
    if (currentResources < structureToBuild.cost) {
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
      updatedRobots.push(refreshRobotState(robot, updatedSlots));
    }

    // Update the game state
    set({
      robots: updatedRobots,
      resourcesPerSecond: updatedRobots.reduce((total, robot) => total + robot.resourcesPerSecond, 0),
      currentResources: currentResources - structureToBuild.cost,
      planet: { ...planet, structureSlots: updatedSlots },
    });
  },

  updateTimeSaved: (lastTimeSaved: number) => {
    set({ lastTimeSaved: lastTimeSaved });
  },

  resetGame: () => {
    set({ ...INITIAL_GAME_STATE });
  },
}));
