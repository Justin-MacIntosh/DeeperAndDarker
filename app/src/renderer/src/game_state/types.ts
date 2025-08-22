import { IconOption } from '../components/icons/types';


/* GameState typing */
export interface GameState {
  version: string; // Game version for compatibility checks
  currentStage: string; // ID of the current stage
  lastTimeSaved: number; // Timestamp of the last save
  resources: {
    [key: string]: {
      currentAmount: bigint; // Current amount of the resource
      amountPerSecond: bigint; // Amount produced per second
    }
  };
  offlineData?: OfflineData;
  tutorials: {
    [key: string]: boolean; // Keyed by Tutorial ID
  };
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
export interface Stage {
  name: string;
  description: string;
  isActive: boolean; // Whether the stage is currently active
  resourcesToDisplay: string[];
  producers: {
    [key: string]: Producer; // Keyed by producer ID
  };
  upgrades: {
    [key: string]: Upgrade; // Keyed by upgrade ID
  };
  tasks: {
    [key: string]: Task; // Keyed by task ID
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
    purchaseResource: string; // Resource required to purchase the upgrade
    baseCost: bigint; // Base cost of the producer
    baseRateOfCostIncrease: number; // Rate of cost increase
    producedResource: string; // Resource name produced by this producer
    baseProduction: bigint; // Base production amount per second
    color: string;
  },
  dynamic: {
    count: number; // Number of producers owned
    productionMultiplier: number; // Multiplier for production
    costReductionMultiplier: number; // Multiplier for cost reduction
    isActive: boolean; // Whether the producer is currently available to purchase
  }
}

/* Upgrade and Task typing */
export interface Upgrade {
  static: {
    name: string;
    description: string;
    iconOption: IconOption; // Optional icon for UI representation
    effect: ProductionMultiplier | CostReducer;
    purchaseResource: string; // Resource required to purchase the upgrade
    baseCost: bigint;
    baseRateOfCostIncrease: number; // Optional, used for upgrades that increase in cost
    maximumPurchasable?: number; // Optional, used for upgrades that have a limit
  },
  dynamic: {
    count: number;
    isActive: boolean;
  }
}
export interface Task {
  static: {
    name: string;
    description: string;
    iconOption: IconOption; // Optional icon for UI representation
    duration: number; // Duration of the event in seconds
    purchaseResource: string; // Resource required to trigger the event
    cost: bigint; // Cost to trigger the event
  },
  dynamic: {
    isActive: boolean; // Whether the event is currently active in the UI
    isRunning: boolean; // Whether the event is currently running
    isCompleted: boolean; // Whether the event has been completed
    startTime?: number; // Optional, used to track when the event started
  }
}


interface ProductionMultiplier {
  type: "productionMultiplier";
  multiplier: FlatMultiplier | LogMultiplier;
  producersEffected: Array<{
    stageId: string;
    producerId: string;
  }>,
}
interface FlatMultiplier {
  type: "flat";
  multiplierAmount: number;
}
interface LogMultiplier {
  type: "log";
  logBase: number;
  flatAddition: number;
}

interface CostReducer {
  type: "costReduction";
  multiplierAmount: number;
  producersEffected: Array<{
    stageId: string;
    producerId: string;
  }>,
}

/* Unlockable typing */
export interface Unlockable {
  static: {
    name: string;
    description: string;
    iconOption: IconOption; // Optional icon for UI representation
    purchaseResource: string; // Resource required to unlock
    cost: bigint;
    unlocks: Array<StageUnlock | ProducerUnlock | UpgradeUnlock | TaskUnlock | UnlockableUnlock | LockUnlock>;
    color: string; // Optional color for UI representation
  },
  dynamic: {
    isActive: boolean;
  }
}
interface StageUnlock {
  type: "stage";
  stageId: string;
}
interface ProducerUnlock {
  type: "producer";
  stageId: string;
  producerId: string;
}
interface UpgradeUnlock {
  type: "upgrade";
  stageId: string;
  upgradeId: string;
}
interface TaskUnlock {
  type: "task";
  stageId: string;
  taskId: string;
}
interface UnlockableUnlock {
  type: "unlock";
  stageId: string;
  unlockId: string;
}
interface LockUnlock {
  type: "lock";
  stageId: string;
  unlockId: string;
}

/* Unused */
// export interface Buff {
//   static: {
//     name: string;
//     description: string;
//     iconOption: IconOption; // Optional icon for UI representation
//     resourceToPurchase: string; // Resource required to purchase the upgrade
//     cost: bigint;
//     effect: ProductionMultiplier | CostReducer;
//     duration: number; // Optional duration for buffs
//   },
//   dynamic: {
//     isActive: boolean;
//     isBuffing?: boolean; // Optional, used to indicate if the buff is currently buffing
//   }
// }