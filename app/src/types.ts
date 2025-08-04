import { IconOption } from './icons/types';

/* Types and Interfaces */
export interface GameState {
  stage: Stage;
  producers: Producer[];
  currentResources: bigint;
  resourcesPerSecond: bigint;
  lastTimeSaved: number;
  buildableUpgrades: Upgrade[];
  timeOfflineData?: OfflineData;
}
interface Stage {
  name: string;
  description: string;
  upgradeSlots: UpgradeSlot[];
  difficultyCoefficient: number;
}
export interface UpgradeSlot {
  id: number;
  costMultiplier: number;
  upgrade?: Upgrade;
}
export interface Upgrade {
  id: number;
  name: string;
  icon: IconOption;
  description: string;
  cost: bigint;
  effect: ProductionMultiplier | CostReducer;
}
export interface ProductionMultiplier {
  type: "production";
  producerIdsEffected: number[];
  multiplier: number;
}
export interface CostReducer {
  type: "cost_reducer";
  producerIdsEffected: number[];
  multiplier: number;
}
export interface Producer {
  // Identification
  id: number;
  name: string;
  description: string;
  icon: IconOption;

  // Resource production values
  resourcesPerSecond: bigint;
  baseProduction: number;

  // Cost and count values
  count: number;
  baseCost: number;
  baseRate: number;

  // Display values
  color: "blue" | "red" | "green";
  minMoneyToShow: number;
  isBeingShown: boolean;
  animateAppearance: boolean;
}
export interface OfflineData {
  moneyEarned: bigint;
  timeElapsed: number;
}
