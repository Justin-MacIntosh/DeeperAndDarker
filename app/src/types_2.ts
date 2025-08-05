import { IconOption } from './icons/types';


const gameObject = {
  "lastTimeSaved": 0,
  "resources": {
    "copper": {
      "currentAmount": BigInt(0),
      "amountPerSecond": BigInt(0),
    },
    "silver": {
      "currentAmount": BigInt(0),
      "amountPerSecond": BigInt(0),
    }
  },
  "offlineData?": {
    "timeElapsed": 0,
    "resourcesEarned": {
      "copper": BigInt(0),
      "silver": BigInt(0),
    },
  },
  "stages": {
    "stage_1": {
      "name": "Braxios Solar System",
      "description": "Deep Space",
      "producers": {
        "mnr_n1": {
          "static": {
            "resourceProduced": "copper",
            "name": "MNR-N1",
            "description": "Basic bot",
            "baseCost": 100,
            "baseRate": 1.15,
            "color": "blue",
          },
          "dynamic": {
            "count": 0,
            "productionMultiplier": 1,
            "costReductionMultiplier": 1,
          }
        },
        "mnr_s1": {
          "static": {
            "resourceProduced": "copper",
            "name": "MNR-S1",
            "description": "Delicate silver extractor",
            "baseCost": 20000,
            "baseRate": 1.15,
            "color": "red",
          },
          "dynamic": {
            "count": 0,
            "productionMultiplier": 1,
            "costReductionMultiplier": 1,
          }
        }
      },
      "upgrades": {
        "mnr_n1_control_center": {
          "static": {
            "effect": {
              "type": "productionMultiplier",
              "multiplierAmount": "1.5",
              "producersEffected": [
                {
                  "stage": "stage_1",
                  "producer": "mnr_n1",
                }
              ],
            },
            "name": "MNR-N1 Control Center",
            "description": "Increases MNR-N1 Production by 50%",
            "baseCost": {
              "copper": 5000
            },
            "costIncreaseRate": 1.5,
            "maximumPurchasable": 5,
          },
          "dynamic": {
            "count": 0,
          }
        },
      },
      "buffs": {
        "mnr_n1_supercharge": {
          "static": {
            "effect": {
              "type": "productionMultiplier",
              "multiplierAmount": "5",
              "producersEffected": [
                {
                  "stage": "stage_1",
                  "producer": "mnr_n1",
                }
              ],
            },
            "name": "MNR-N1 Supercharge",
            "description": "Increases MNR-N1 Production by 500%",
            "cost": {
              "copper": 100000,
              "silver": 100,
            },
            "duration": 30,
          },
          "dynamic": {
            "isActive": false
          },
        }
      },
      "unlocks": {
        "silver_production": {
          "name": "MNR-S1 Factory",
          "description": "Allows the creation of MNR-S1: Silver-Mining Robots",
          "cost": {
            "copper": 30000,
          },
          "unlock": {
            "type": "production",
            "stage": "stage_1",
            "producer": "mnr_s1",
          },
        },
        "settlement": {
          "name": "Planet Yan Settlement",
          "description": "Begin settling on Planet Yan",
          "cost": {
            "copper": 100000,
            "silver": 100,
          },
          "unlock": {
            "type": "stage",
            "stage": "stage_2",
          },
          "hasBeenPurchased": false,
        }
      }
    }
  }
}


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
