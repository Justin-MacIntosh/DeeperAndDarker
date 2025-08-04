import { GameState, ProductionMultiplier, CostReducer } from '../types';

export const INITIAL_GAME_STATE: GameState = {
  currentResources: BigInt(100),
  resourcesPerSecond: BigInt(0),
  lastTimeSaved: 0,
  stage: {
    name: "Braxios Solar System",
    description: "Deep space",
    upgradeSlots: [
      { id: 1, costMultiplier: 50 ** 0 },
      { id: 2, costMultiplier: 50 ** 1 },
      { id: 3, costMultiplier: 50 ** 2 },
      { id: 4, costMultiplier: 50 ** 3 },
      { id: 5, costMultiplier: 50 ** 4 },
      { id: 5, costMultiplier: 50 ** 5 },
    ],
    difficultyCoefficient: 1.0,
  },
  buildableUpgrades: [
    {
      id: 1,
      name: "MNR Control Center Supercharge",
      icon: "IconBuildingBroadcastTower",
      description: "Increases MNR-N1 resource production by 300% for 30 seconds",
      cost: BigInt(1500),
      effect: {
        type: 'production',
        producerIdsEffected: [1, 2, 3],
        multiplier: 1.6,
      } as ProductionMultiplier,
    },
    {
      id: 2,
      name: "Automaton Factory",
      icon: "IconBuildingFactory",
      description: "Reduces all Automaton costs by 50%",
      cost: BigInt(2000),
      effect: {
        type: 'cost_reducer',
        producerIdsEffected: [1, 2, 3],
        multiplier: 0.5,
      } as CostReducer,
    },
  ],
  producers: [
    {
      id: 1,
      name: "MNR-N1",
      description: "Basic mining robot",
      icon: "IconRobot",

      resourcesPerSecond: BigInt(0),
      baseProduction: 50,

      count: 0,
      baseCost: 100,
      baseRate: 1.15,

      color: "blue",
      minMoneyToShow: 0,
      isBeingShown: true,
      animateAppearance: false,
    },
    {
      id: 2,
      name: "MNR-X1",
      description: "Supercharged mining robot",
      icon: "IconRobot",

      resourcesPerSecond: BigInt(0),
      baseProduction: 2500,

      count: 0,
      baseCost: 5000,
      baseRate: 1.15,

      color: "red",
      minMoneyToShow: 4000,
      isBeingShown: false,
      animateAppearance: true,
    },
  ],
};
