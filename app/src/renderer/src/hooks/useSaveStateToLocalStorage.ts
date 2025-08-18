import { useEffect } from 'react';

import { useGameStore } from '../game_state/GameStore';
import { GameState } from '../game_state/types';
import { saveGameState } from '../game_state/stateStorageHelpers';

/**
 * Custom hook to save game state to local storage periodically.
 * It also provides a function to save the current game data immediately.
 */
export const useSaveStateToLocalStorage = () => {
  const updateTimeSavedAction = useGameStore((state) => state.updateTimeSaved);

  const saveCurrentGameData = () => {
    const onlyState = Object.fromEntries(
      Object.entries(useGameStore.getState()).filter(([_, value]) => typeof value !== 'function')
    )
    const timeSaved = Date.now();
    updateTimeSavedAction(timeSaved);
    saveGameState({ ...onlyState, lastTimeSaved: timeSaved } as GameState);
  }

  // Effects to save game state periodically
  useEffect(() => {
    const saveStateIntervalId = setInterval(() => {
      saveCurrentGameData();
    }, 5000);
    return () => clearInterval(saveStateIntervalId);
  }, []);

  return { saveCurrentGameData };
}
