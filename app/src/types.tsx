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
