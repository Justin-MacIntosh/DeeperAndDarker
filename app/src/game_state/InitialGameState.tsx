import { GameState, ProductionMultiplier, CostReducer } from '../types';

export const INITIAL_GAME_STATE: GameState = {
  currentResources: 100,
  resourcesPerSecond: 0,
  lastTimeSaved: 0,
  stage: {
    name: "Planet Baj",
    description: "Swamp Biome",
    upgradeSlots: [
      { id: 1, costMultiplier: 50 ** 0 },
      { id: 2, costMultiplier: 50 ** 1 },
      { id: 3, costMultiplier: 50 ** 2 },
      { id: 4, costMultiplier: 50 ** 3 },
      { id: 5, costMultiplier: 50 ** 4 },
    ],
    difficultyCoefficient: 1.0,
  },
  buildableUpgrades: [
    {
      id: 1,
      name: "MNR Control Center",
      icon: "fa-satellite-dish",
      description: "Increases all Automaton resource production by 60%",
      cost: 1500,
      effect: {
        type: 'production',
        producerIdsEffected: [1, 2],
        multiplier: 1.6,
      } as ProductionMultiplier,
    },
    {
      id: 2,
      name: "Automaton Factory",
      icon: "fa-industry",
      description: "Reduces all Automaton costs by 50%",
      cost: 2000,
      effect: {
        type: 'cost_reducer',
        producerIdsEffected: [1, 2],
        multiplier: 0.5,
      } as CostReducer,
    },
  ],
  producers: [
    {
      id: 1,
      name: "MNR-N1",
      description: "Basic mining robot",
      iconName: "fa-robot",

      resourcesPerSecond: 0,
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
      iconName: "fa-robot",

      resourcesPerSecond: 0,
      baseProduction: 2500,

      count: 0,
      baseCost: 5000,
      baseRate: 1.15,

      color: "red",
      minMoneyToShow: 10000,
      isBeingShown: false,
      animateAppearance: true,
    },
  ],
};
