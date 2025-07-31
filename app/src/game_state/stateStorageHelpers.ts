import { GameState } from './GameStateTypes';

const GAME_STATE_KEY = 'planet_cracker_game_state';

export const saveGameState = (state: GameState) => {
  const b64State = btoa(JSON.stringify(state));
  localStorage.setItem(GAME_STATE_KEY, b64State);
}

export const loadGameState = (): GameState | null => {
  const savedState = localStorage.getItem(GAME_STATE_KEY);
  if (!savedState) {
    return null;
  }

  // Decode base64 string and handle potential errors
  let decodedState: string;
  try {
    decodedState = atob(savedState);
  } catch (e) {
    return null;
  }

  // Parse the JSON and calculate offline data
  const parsedState = JSON.parse(decodedState) as GameState;
  const timeElapsed = Date.now() - parsedState.lastTimeSaved;
  const moneyEarned = parsedState.resourcesPerSecond * (timeElapsed / 1000);
  parsedState.currentResources += moneyEarned;
  parsedState.timeOfflineData = {
    moneyEarned: moneyEarned,
    timeElapsed: timeElapsed
  };

  return { ...parsedState };
}

export const resetGameState = () => {
  localStorage.removeItem(GAME_STATE_KEY);
}
