/* Types and Interfaces */
export interface GameState {
  stage: Stage;
  producers: Producer[];
  currentResources: number;
  resourcesPerSecond: number;
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
  icon: string;
  description: string;
  cost: number;
  effect: ProductionMultiplier | CostReducer;
}
export interface ProductionMultiplier {
  type: 'production';
  producerIdsEffected: number[];
  multiplier: number;
}
export interface CostReducer {
  type: 'cost_reducer';
  producerIdsEffected: number[];
  multiplier: number;
}
export interface Producer {
  // Identification
  id: number;
  name: string;
  description: string;
  iconName: string;

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
