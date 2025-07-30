import { useEffect } from 'react';
import { GameState, useGameStore } from '../game_state/GameStateZustand';
import { saveGameState } from '../game_state/gameStateStorage';

/**
 * Custom hook to save game state to local storage periodically.
 * It also provides a function to save the current game data immediately.
 */
export const useSaveGameStateToLocalStorage = () => {
  const updateTimeSavedAction = useGameStore((state) => state.updateTimeSaved);

  const saveCurrentGameData = () => {
    const onlyState = Object.fromEntries(
      Object.entries(useGameStore.getState()).filter(([_, value]) => typeof value !== 'function')
    )
    const timeSaved = Date.now();
    updateTimeSavedAction(timeSaved);
    saveGameState({ ...onlyState, timeSaved: timeSaved } as GameState);
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