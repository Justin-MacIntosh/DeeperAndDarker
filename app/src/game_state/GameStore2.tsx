import { create } from 'zustand';

import { loadGameState } from './stateStorageHelpers';
import { INITIAL_GAME_STATE } from './InitialGameState';
import { GameState } from './types';


const LOADED_GAME_STATE = loadGameState() || INITIAL_GAME_STATE;

/**
 * Game Store using Zustand for state management.
 * This store holds the game state and provides methods to manipulate it.
 */
export const useGameStore = create<
  GameState & {
    tick: (milliseconds: number) => void;
    updateTimeSaved: (timeSaved: number) => void;
    resetGame: () => void;
  }
>((set, get) => ({
  ...LOADED_GAME_STATE,

  // Tick function to update resources based on time elapsed
  tick: (milliseconds: number) => {
    const { resources } = get();

    const updatedResources: {
      [key: string]: { currentAmount: bigint; amountPerSecond: bigint }
    } = {};

    for (const resourceKey in resources) {
      const resource = resources[resourceKey];
      const updatedAmount = resource.currentAmount + (
        (resource.amountPerSecond * BigInt(milliseconds)) / BigInt(1000)
      );
      updatedResources[resourceKey] = { ...resource, currentAmount: updatedAmount };
    }

    set({ resources: updatedResources });
  },

  // Update the last time the game state was saved
  updateTimeSaved: (lastTimeSaved: number) => {
    set({ lastTimeSaved: lastTimeSaved });
  },

  // Reset the game state to the initial state
  resetGame: () => {
    set({ ...INITIAL_GAME_STATE });
  },
}));
