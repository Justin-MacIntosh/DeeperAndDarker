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
  costMultiplier: number;
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
export interface ProductionMultiplier {
  type: 'production';
  robotTiersEffected: number[];
  multiplier: number;
}
export interface CostReducer {
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
export const INITIAL_GAME_STATE: GameState = {
  currentResources: 100,
  resourcesPerSecond: 0,
  lastTimeSaved: 0,
  planet: {
    name: "Baj",
    biome: "Swamp",
    structureSlots: [
      { id: 1, costMultiplier: 1.0 },
      { id: 2, costMultiplier: 10.0 },
      { id: 3, costMultiplier: 100.0 },
      { id: 4, costMultiplier: 1000.0 },
      { id: 5, costMultiplier: 10000.0 },
    ],
    difficultyCoefficient: 1.0,
  },
  buildableStructures: [
    {
      id: 1,
      name: "MNR Control Center",
      icon: "satellite-dish",
      description: "Increases all Automaton resource production by 60%",
      cost: 1000,
      effect: {
        type: 'production',
        robotTiersEffected: [1, 2, 3],
        multiplier: 1.6,
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
        robotTiersEffected: [1, 2, 3],
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
      baseCost: 5000,
      baseRate: 1.15,

      color: "red",
      minMoneyToShow: 10000,
      isBeingShown: false,
      animateAppearance: true,
    },
    {
      id: 3,
      name: "MNR-XXXXX",
      description: "Supersupercharged mining robot",

      resourcesPerSecond: 0,
      baseProduction: 10000,

      count: 0,
      baseCost: 5000,
      baseRate: 1.15,

      color: "green",
      minMoneyToShow: 10000,
      isBeingShown: false,
      animateAppearance: true,
    },
  ],
};
