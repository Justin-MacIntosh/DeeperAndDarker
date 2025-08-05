import { IconOption } from '../icons/types';


/* GameState typing */
export interface GameState {
  lastTimeSaved: number; // Timestamp of the last save
  resources: {
    [key: string]: {
      currentAmount: bigint; // Current amount of the resource
      amountPerSecond: bigint; // Amount produced per second
    }
  };
  offlineData?: OfflineData;
  stages: {
    [key: string]: Stage; // Keyed by stage ID
  };
}
interface OfflineData {
  timeElapsed: number; // Time elapsed while offline
  resourcesEarned: {
    [key: string]: bigint; // Resources earned while offline
  }
}

/* Stage typing */
interface Stage {
  name: string;
  description: string;
  isActive: boolean; // Whether the stage is currently active
  producers: {
    [key: string]: Producer; // Keyed by producer ID
  };
  upgrades: {
    [key: string]: Upgrade; // Keyed by upgrade ID
  };
  buffs: {
    [key: string]: Buff; // Keyed by buff ID
  };
  unlocks: {
    [key: string]: Unlockable; // Keyed by unlockable ID
  };
}

/* Producer typing */
export interface Producer {
  static: {
    name: string;
    description: string;
    iconOption: IconOption; // Optional icon for UI representation
    resourceToPurchase: string; // Resource required to purchase the upgrade
    baseCost: bigint; // Base cost of the producer
    baseRateOfCostIncrease: number; // Rate of cost increase
    resourceProduced: string; // Resource name produced by this producer
    baseProduction: bigint; // Base production amount per second
    animateAppearance: boolean;
    color: string; // Optional color for UI representation
  },
  dynamic: {
    count: number; // Number of producers owned
    productionMultiplier: number; // Multiplier for production
    costReductionMultiplier: number; // Multiplier for cost reduction
    isActive: boolean; // Whether the producer is currently available to purchase
  }
}

/* Buff and Upgrade typing */
export interface Upgrade {
  static: {
    name: string;
    description: string;
    iconOption: IconOption; // Optional icon for UI representation
    effect: ProductionMultiplier | CostReducer;
    resourceToPurchase: string; // Resource required to purchase the upgrade
    baseCost: bigint;
    costIncreaseRate?: number; // Optional, used for upgrades that increase in cost
    maximumPurchasable?: number; // Optional, used for upgrades that have a limit
  },
  dynamic: {
    count: number;
    isActive: boolean;
  }
}
export interface Buff {
  static: {
    name: string;
    description: string;
    iconOption: IconOption; // Optional icon for UI representation
    resourceToPurchase: string; // Resource required to purchase the upgrade
    cost: bigint;
    effect: ProductionMultiplier | CostReducer;
    duration: number; // Optional duration for buffs
  },
  dynamic: {
    isActive: boolean;
    isBuffing?: boolean; // Optional, used to indicate if the buff is currently buffing
  }
}
interface ProductionMultiplier {
  type: "productionMultiplier";
  multiplierAmount: number;
  producersEffected: Array<{
    stage: string;
    producer: string;
  }>,
}
interface CostReducer {
  type: "costReduction";
  multiplierAmount: number;
  producersEffected: Array<{
    stage: string;
    producer: string;
  }>,
}

/* Unlockable typing */
export interface Unlockable {
  static: {
    name: string;
    description: string;
    iconOption: IconOption; // Optional icon for UI representation
    resourceToPurchase: string; // Resource required to unlock
    cost: bigint;
    unlock: StageUnlock | ProducerUnlock | UpgradeUnlock | BuffUnlock
  },
  dynamic: {
    isActive: boolean;
    hasBeenPurchased: boolean;
  }
} 
interface StageUnlock {
  type: "stage";
  stage: string;
}
interface ProducerUnlock {
  type: "producer";
  stage: string;
  producer: string;
}
interface UpgradeUnlock {
  type: "upgrade";
  stage: string;
  upgrade: string;
}
interface BuffUnlock {
  type: "buff";
  stage: string;
  buff: string;
}
