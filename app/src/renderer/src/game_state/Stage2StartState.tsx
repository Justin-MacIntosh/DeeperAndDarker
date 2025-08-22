import { GameState } from "./types";

export const CURRENT_ACCEPTED_VERSION = "0.0.01";

export const INITIAL_GAME_STATE: GameState = {
  version: CURRENT_ACCEPTED_VERSION,
  currentStage: "stage_2",
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
    yan_personnel: {
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
    },
    yan_specimens: {
      currentAmount: BigInt(0),
      amountPerSecond: BigInt(0),
    }
  },
  runningTasks: [],
  stages: {
    stage_2: {
      name: "Planet Yan",
      description: "Lush and rich in minerals",
      isActive: true,
      resourcesToDisplay: ["yan_personnel", "silver"],
      producers: {
        yan_researcher: {
          static: {
            name: "Yan Researcher",
            description: "Researches the mysteries of Planet Yan",
            iconOption: "IconUser",
            purchaseResource: "yan_personnel",
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
            purchaseResource: "yan_personnel",
            baseCost: BigInt(1),
            baseRateOfCostIncrease: 1,
            producedResource: "yan_military_presence",
            baseProduction: BigInt(2),
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
      tasks: {
        explore_plains: {
          static: {
            name: "Explore the Plains",
            description: "Explore vast plains, collecting flora",
            iconOption: "IconPlant2", // TODO
            purchaseResource: "yan_military_presence",
            cost: BigInt(10),
            duration: 5,
          },
          dynamic: {
            isActive: false,
            isRunning: false,
            isCompleted: false,
            startTime: undefined,
          }
        },
        hunt_wild_creature: {
          static: {
            name: "Hunt Wild Creatures",
            description: "Hunt a creature native to Planet Yan",
            iconOption: "IconPaw",
            purchaseResource: "yan_military_presence",
            cost: BigInt(100),
            duration: 10,
          },
          dynamic: {
            isActive: false,
            isRunning: false,
            isCompleted: false,
            startTime: undefined,
          }
        }
      },
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
                type: "task",
                stageId: "stage_2",
                taskId: "explore_plains",
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
            cost: BigInt(100000),
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
            cost: BigInt(1000000),
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
