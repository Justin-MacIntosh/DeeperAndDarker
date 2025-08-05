import { IconOption } from './icons/types';

const initialGameState: GameState = {
  lastTimeSaved: 0,
  resources: {
    copper: {
      currentAmount: BigInt(0),
      amountPerSecond: BigInt(0),
    },
    silver: {
      currentAmount: BigInt(0),
      amountPerSecond: BigInt(0),
    }
  },
  stages: {
    stage_1: {
      name: "Braxios Solar System",
      description: "Deep Space",
      isActive: true,
      producers: {
        mnr_n1: {
          static: {
            name: "MNR-N1",
            description: "Basic bot",
            iconOption: "IconRobot",
            baseCost: {
              copper: BigInt(100),
            },
            baseRateOfCostIncrease: 1.15,
            baseProduction: {
              copper: BigInt(50),
            },
            color: "blue",
          },
          dynamic: {
            count: 0,
            productionMultiplier: 1,
            costReductionMultiplier: 1,
            isActive: true,
          }
        },
        mnr_s1: {
          static: {
            name: "MNR-S1",
            description: "Delicate silver extractor",
            iconOption: "IconRobot",
            baseCost: {
              copper: BigInt(20000),
            },
            baseRateOfCostIncrease: 1.15,
            baseProduction: {
              silver: BigInt(100),
            },
            color: "red",
          },
          dynamic: {
            count: 0,
            productionMultiplier: 1,
            costReductionMultiplier: 1,
            isActive: false,
          }
        }
      },
      upgrades: {
        mnr_n1_control_center: {
          static: {
            effect: {
              type: "productionMultiplier",
              multiplierAmount: 1.5,
              producersEffected: [
                {
                  stage: "stage_1",
                  producer: "mnr_n1",
                }
              ],
            },
            name: "MNR-N1 Control Center",
            description: "Increases MNR-N1 Production by 50%",
            iconOption: "IconBuildingBroadcastTower",
            baseCost: {
              copper: BigInt(15000)
            },
            costIncreaseRate: 1.5,
            maximumPurchasable: 4,
          },
          dynamic: {
            count: 0,
            isActive: true,
          }
        },
        mnr_n1_fabricator: {
          static: {
            effect: {
              type: "costReduction",
              multiplierAmount: .8,
              producersEffected: [
                {
                  stage: "stage_1",
                  producer: "mnr_n1",
                }
              ],
            },
            name: "MNR-N1 Fabricator",
            description: "Reduces cost of MNR-N1 by 20%",
            iconOption: "IconBuildingFactory",
            baseCost: {
              copper: BigInt(10000)
            },
            costIncreaseRate: 1.3,
          },
          dynamic: {
            count: 0,
            isActive: true,
          }
        },
        mnr_s1_control_center: {
          static: {
            effect: {
              type: "productionMultiplier",
              multiplierAmount: 1.5,
              producersEffected: [
                {
                  stage: "stage_1",
                  producer: "mnr_s1",
                }
              ],
            },
            name: "MNR-S1 Control Center",
            description: "Increases MNR-S1 Production by 50%",
            iconOption: "IconBuildingBroadcastTower",
            baseCost: {
              copper: BigInt(30000),
              silver: BigInt(2000)
            },
            costIncreaseRate: 1.5,
            maximumPurchasable: 4,
          },
          dynamic: {
            count: 0,
            isActive: true,
          }
        },
        mnr_s1_fabricator: {
          static: {
            effect: {
              type: "costReduction",
              multiplierAmount: .8,
              producersEffected: [
                {
                  stage: "stage_1",
                  producer: "mnr_n1",
                }
              ],
            },
            name: "MNR-S1 Fabricator",
            description: "Reduces cost of MNR-S1 by 20%",
            iconOption: "IconBuildingFactory",
            baseCost: {
              copper: BigInt(20000),
              silver: BigInt(1500),
            },
            costIncreaseRate: 1.3,
          },
          dynamic: {
            count: 0,
            isActive: true,
          }
        },
      },
      buffs: {
        mnr_n1_supercharge: {
          static: {
            effect: {
              type: "productionMultiplier",
              multiplierAmount: 5,
              producersEffected: [
                {
                  stage: "stage_1",
                  producer: "mnr_n1",
                }
              ],
            },
            name: "MNR-N1 Supercharge",
            description: "Increases MNR-N1 Production by 500%",
            iconOption: "IconBolt",
            cost: {
              copper: BigInt(100000),
            },
            duration: 30,
          },
          dynamic: {
            isActive: true,
            isBuffing: false,
          },
        }
      },
      unlocks: {
        silver_production: {
          static: {
            name: "MNR-S1 Fabricator",
            description: "Allows the creation of MNR-S1: Silver-Mining Robots",
            iconOption: "IconRobot",
            cost: {
              copper: BigInt(30000),
            },
            unlock: {
              type: "producer",
              stage: "stage_1",
              producer: "mnr_s1",
            },
          },
          dynamic: {
            isActive: true,
            hasBeenPurchased: false,
          }
        },
        settlement: {
          static: {
            name: "Planet Yan Settlement",
            description: "Begin settling on Planet Yan",
            iconOption: "IconBuilding",
            cost: {
              copper: BigInt(2000000),
              silver: BigInt(10000),
            },
            unlock: {
              type: "stage",
              stage: "stage_2",
            },
          },
          dynamic: {
            isActive: true,
            hasBeenPurchased: false,
          }
        }
      }
    }
  }
}

/* GameState typing */
interface GameState {
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
interface Producer {
  static: {
    name: string;
    description: string;
    iconOption?: IconOption; // Optional icon for UI representation
    baseCost: {
      [key: string]: bigint; // Resource name as key, amount as value
    };
    baseRateOfCostIncrease: number; // Rate of cost increase
    baseProduction: {
      [key: string]: bigint; // Resource name as key, amount produced per second
    };
    color?: string; // Optional color for UI representation
  },
  dynamic: {
    count: number; // Number of producers owned
    productionMultiplier: number; // Multiplier for production
    costReductionMultiplier: number; // Multiplier for cost reduction
    isActive: boolean; // Whether the producer is currently available to purchase
  }
}

/* Buff and Upgrade typing */
interface Upgrade {
  static: {
    name: string;
    description: string;
    iconOption?: IconOption; // Optional icon for UI representation
    effect: ProductionMultiplier | CostReducer;
    baseCost: {
      [key: string]: bigint
    };
    costIncreaseRate?: number; // Optional, used for upgrades that increase in cost
    maximumPurchasable?: number; // Optional, used for upgrades that have a limit
  },
  dynamic: {
    count: number;
    isActive: boolean;
  }
}
interface Buff {
  static: {
    name: string;
    description: string;
    iconOption?: IconOption; // Optional icon for UI representation
    cost: {
      [key: string]: bigint
    };
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
interface Unlockable {
  static: {
    name: string;
    description: string;
    iconOption?: IconOption; // Optional icon for UI representation
    cost: {
      [key: string]: bigint
    },
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
