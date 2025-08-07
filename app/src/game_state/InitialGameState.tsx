import { GameState } from "./types";


export const INITIAL_GAME_STATE: GameState = {
  lastTimeSaved: 0,
  resources: {
    copper: {
      currentAmount: BigInt(100000),
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
            animateAppearance: true,
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
                  stageId: "stage_1",
                  producerId: "mnr_n1",
                }
              ],
            },
            name: "MNR-N1 Control Center",
            description: "Increases MNR-N1 Production by 50%",
            iconOption: "IconBuildingBroadcastTower",
            purchaseResource: "copper",
            baseCost: BigInt(15000),
            baseRateOfCostIncrease: 1.5,
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
                  stageId: "stage_1",
                  producerId: "mnr_n1",
                }
              ],
            },
            name: "MNR-N1 Fabricator",
            description: "Reduces cost of MNR-N1 by 20%",
            iconOption: "IconBuildingFactory",
            purchaseResource: "copper",
            baseCost: BigInt(10000),
            baseRateOfCostIncrease: 1.3,
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
                  stageId: "stage_1",
                  producerId: "mnr_s1",
                }
              ],
            },
            name: "MNR-S1 Control Center",
            description: "Increases MNR-S1 Production by 50%",
            iconOption: "IconBuildingBroadcastTower",
            purchaseResource: "copper",
            baseCost: BigInt(30000),
            baseRateOfCostIncrease: 1.5,
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
              multiplierAmount: .8,
              producersEffected: [
                {
                  stageId: "stage_1",
                  producerId: "mnr_s1",
                }
              ],
            },
            name: "MNR-S1 Fabricator",
            description: "Reduces cost of MR-S1 by 20%",
            iconOption: "IconBuildingFactory",
            purchaseResource: "silver",
            baseCost: BigInt(1500),
            baseRateOfCostIncrease: 1.3,
          },
          dynamic: {
            count: 0,
            isActive: false,
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
                  stageId: "stage_1",
                  producerId: "mnr_n1",
                }
              ],
            },
            name: "MNR-N1 Supercharge",
            description: "Increases MNR-N1 Production by 500%",
            iconOption: "IconBolt",
            resourceToPurchase: "copper",
            cost: BigInt(100000),
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
            name: "MNR-S1 Fabrication",
            description: "Allows the creation of Silver-Mining Robots",
            iconOption: "IconRobot",
            purchaseResource: "copper",
            color: "red",
            cost: BigInt(30000),
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
            description: "Begin settling on Planet Yan",
            iconOption: "IconBuilding",
            purchaseResource: "silver",
            cost: BigInt(10000),
            animateAppearance: true,
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
    }
  }
}
