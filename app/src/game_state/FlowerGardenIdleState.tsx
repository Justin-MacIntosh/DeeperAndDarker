import { IconFlowerFilled, IconPaperBag } from '@tabler/icons-react';
import { GameState, ProductionMultiplier, CostReducer } from '../types';

export const INITIAL_GAME_STATE: GameState = {
  currentResources: 100,
  resourcesPerSecond: 0,
  lastTimeSaved: 0,
  stage: {
    name: "Backyard",
    description: "Small home garden",
    upgradeSlots: [
      { id: 1, costMultiplier: 50 ** 0 },
      { id: 2, costMultiplier: 50 ** 1 },
      { id: 5, costMultiplier: 50 ** 5 },
    ],
    difficultyCoefficient: 1.0,
  },
  buildableUpgrades: [
    {
      id: 1,
      name: "Fertilizer",
      icon: IconPaperBag,
      description: "Increases all Flower production by 50%",
      cost: 1000,
      effect: {
        type: 'production',
        producerIdsEffected: [1],
        multiplier: 1.5,
      } as ProductionMultiplier,
    },
  ],
  producers: [
    {
      id: 1,
      name: "Daisy",
      description: "Basic Daisy",
      icon: IconFlowerFilled,

      resourcesPerSecond: 0,
      baseProduction: 50,

      count: 0,
      baseCost: 100,
      baseRate: 1.15,

      color: "green",
      minMoneyToShow: 0,
      isBeingShown: true,
      animateAppearance: false,
    },
  ],
};
