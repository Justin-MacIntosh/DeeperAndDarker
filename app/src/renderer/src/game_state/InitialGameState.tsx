import { GameState } from "./types";

export const CURRENT_ACCEPTED_VERSION = "0.0.01";

export const INITIAL_GAME_STATE: GameState = {
  version: CURRENT_ACCEPTED_VERSION,
  lastTimeSaved: 0,
  resources: {
    copper: {
      currentAmount: BigInt(1000000),
      amountPerSecond: BigInt(0),
    },
    silver: {
      currentAmount: BigInt(1000000),
      amountPerSecond: BigInt(0),
    },
    personnel: {
      currentAmount: BigInt(10),
      amountPerSecond: BigInt(0),
    },
    yan_research: {
      currentAmount: BigInt(0),
      amountPerSecond: BigInt(0),
    },
    yan_military_presence: {
      currentAmount: BigInt(0),
      amountPerSecond: BigInt(0),
    }
  },
  stages: {
    stage_1: {
      name: "Deep Space",
      description: "In the Braxios Solar System",
      isActive: true,
      resourcesToDisplay: ["copper", "silver"],
      producers: {
        mnr_n1: {
          static: {
            name: "MNR-N1",
            description: "Robot for mining copper from asteroids",
            iconOption: "IconRobot",
            purchaseResource: "copper",
            baseCost: BigInt(100),
            baseRateOfCostIncrease: 1.15,
            producedResource: "copper",
            baseProduction: BigInt(50),
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
            purchaseResource: "copper",
            baseCost: BigInt(20000),
            baseRateOfCostIncrease: 1.15,
            producedResource: "silver",
            baseProduction: BigInt(100),
            color: "red",
          },
          dynamic: {
            count: 0,
            productionMultiplier: 1,
            costReductionMultiplier: 1,
            isActive: false,
          }
        },
      },
      upgrades: {
        mnr_n1_control_center: {
          static: {
            effect: {
              type: "productionMultiplier",
              multiplier: {
                type: "flat",
                multiplierAmount: 1.4
              },
              producersEffected: [
                {
                  stageId: "stage_1",
                  producerId: "mnr_n1",
                }
              ],
            },
            name: "MNR-N1 Control Center",
            description: "Increases MNR-N1 Production by 40%",
            iconOption: "IconBuildingBroadcastTower",
            purchaseResource: "copper",
            baseCost: BigInt(12500),
            baseRateOfCostIncrease: 1.8,
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
              multiplierAmount: .7,
              producersEffected: [
                {
                  stageId: "stage_1",
                  producerId: "mnr_n1",
                }
              ],
            },
            name: "MNR-N1 Fabricator",
            description: "Reduces cost of MNR-N1 by 30%",
            iconOption: "IconBuildingFactory",
            purchaseResource: "copper",
            baseCost: BigInt(10000),
            baseRateOfCostIncrease: 1.8,
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
              multiplier: {
                type: "flat",
                multiplierAmount: 1.4
              },
              producersEffected: [
                {
                  stageId: "stage_1",
                  producerId: "mnr_s1",
                }
              ],
            },
            name: "MNR-S1 Control Center",
            description: "Increases MNR-S1 Production by 40%",
            iconOption: "IconBuildingBroadcastTower",
            purchaseResource: "silver",
            baseCost: BigInt(10000),
            baseRateOfCostIncrease: 1.8,
            maximumPurchasable: 4,
          },
          dynamic: {
            count: 0,
            isActive: false,
          }
        },
        mnr_s1_fabricator: {
          static: {
            effect: {
              type: "costReduction",
              multiplierAmount: .7,
              producersEffected: [
                {
                  stageId: "stage_1",
                  producerId: "mnr_s1",
                }
              ],
            },
            name: "MNR-S1 Fabricator",
            description: "Reduces cost of MR-S1 by 30%",
            iconOption: "IconBuildingFactory",
            purchaseResource: "silver",
            baseCost: BigInt(5000),
            baseRateOfCostIncrease: 1.8,
          },
          dynamic: {
            count: 0,
            isActive: false,
          }
        },
      },
      buffs: {},
      unlocks: {
        silver_production: {
          static: {
            name: "MNR-S1 Fabrication",
            description: "Start mining SIlver!",
            iconOption: "IconRobot",
            purchaseResource: "copper",
            color: "purple",
            cost: BigInt(100000),
            unlocks: [
              {
                type: "producer",
                stageId: "stage_1",
                producerId: "mnr_s1",
              },
              {
                type: "upgrade",
                stageId: "stage_1",
                upgradeId: "mnr_s1_control_center",
              },
              {
                type: "upgrade",
                stageId: "stage_1",
                upgradeId: "mnr_s1_fabricator",
              },
              {
                type: "unlock",
                stageId: "stage_1",
                unlockId: "settlement",
              }
            ],
          },
          dynamic: {
            isActive: true,
          }
        },
        settlement: {
          static: {
            name: "Planet Yan Settlement",
            description: "Settle Planet Yan!",
            iconOption: "IconBuilding",
            purchaseResource: "silver",
            cost: BigInt(100000),
            color: "green",
            unlocks: [
              {
                type: "stage",
                stageId: "stage_2",
              }
            ],
          },
          dynamic: {
            isActive: false,
          }
        }
      }
    },
    stage_2: {
      name: "Planet Yan",
      description: "Lush and rich in minerals",
      isActive: false,
      resourcesToDisplay: ["personnel", "silver"],
      producers: {
        yan_researcher: {
          static: {
            name: "Yan Researcher",
            description: "Researches the mysteries of Planet Yan",
            iconOption: "IconUser",
            purchaseResource: "personnel",
            baseCost: BigInt(1),
            baseRateOfCostIncrease: 1,
            producedResource: "yan_research",
            baseProduction: BigInt(10),
            color: "blue",
          },
          dynamic: {
            count: 0,
            productionMultiplier: 1,
            costReductionMultiplier: 1,
            isActive: false,
          }
        },
        yan_soldier: {
          static: {
            name: "Yan Soldier",
            description: "Required to face threats on Planet Yan",
            iconOption: "IconUser",
            purchaseResource: "personnel",
            baseCost: BigInt(1),
            baseRateOfCostIncrease: 1,
            producedResource: "yan_military_presence",
            baseProduction: BigInt(5),
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
      upgrades: {},
      buffs: {},
      unlocks: {
        establish_military_base: {
          static: {
            name: "Choice 1: Military Base",
            description: "Military Base",
            iconOption: "IconBuilding",
            purchaseResource: "silver",
            cost: BigInt(100000),
            color: "red",
            unlocks: [
              {
                type: "producer",
                stageId: "stage_2",
                producerId: "yan_soldier",
              },
              {
                type: "unlock",
                stageId: "stage_2",
                unlockId: "forest_expeditions",
              },
              {
                type: "lock",
                stageId: "stage_2",
                unlockId: "establish_research_base",
              },
            ],
          },
          dynamic: {
            isActive: true,
          }
        },
        forest_expeditions: {
          static: {
            name: "Woodland Expeditions",
            description: "Begin sending expeditions into the Yan forests",
            iconOption: "IconBuilding",
            purchaseResource: "yan_military_presence",
            cost: BigInt(100),
            color: "red",
            unlocks: [
              {
                type: "unlock",
                stageId: "stage_2",
                unlockId: "undergound_expeditions",
              },
            ],
          },
          dynamic: {
            isActive: false,
          }
        },
        undergound_expeditions: {
          static: {
            name: "Underground Expeditions",
            description: "Begin sending expeditions into the Yan cave systems",
            iconOption: "IconBuilding",
            purchaseResource: "yan_military_presence",
            cost: BigInt(100000),
            color: "red",
            unlocks: [],
          },
          dynamic: {
            isActive: false,
          }
        },
        establish_research_base: {
          static: {
            name: "Choice 2: Research Base",
            description: "Research Base",
            iconOption: "IconBuilding",
            purchaseResource: "silver",
            cost: BigInt(100000),
            color: "green",
            unlocks: [
              {
                type: "producer",
                stageId: "stage_2",
                producerId: "yan_researcher",
              },
              {
                type: "lock",
                stageId: "stage_2",
                unlockId: "establish_military_base",
              },
            ],
          },
          dynamic: {
            isActive: true,
          }
        },
      }
    }
  },
  tutorials: {
    stage_selection: false,
    settling_yan: false,
  }
}
