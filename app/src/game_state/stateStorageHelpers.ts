import { GameState } from '../types';

const GAME_STATE_KEY = 'planet_cracker_game_state';

const bigIntReplacer = (key: string, value: any): any => {
  if (typeof value === "bigint") {
    return value.toString() + 'n';
  }
  return value;
}
const bigIntReviver = (key: string, value: any): any => {
  if (typeof value === 'string' && /^\d+n$/.test(value)) {
    return BigInt(value.slice(0, -1));
  }
  return value;
}

export const saveGameState = (state: GameState) => {
  // const b64State = btoa(JSON.stringify(state));
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state, bigIntReplacer));
}

export const loadGameState = (): GameState | null => {
  const savedState = localStorage.getItem(GAME_STATE_KEY);
  if (!savedState) {
    return null;
  }

  // // Decode base64 string and handle potential errors
  // let decodedState: string;
  // try {
  //   decodedState = atob(savedState);
  // } catch (e) {
  //   return null;
  // }

  console.log("Loaded game state from localStorage");

  // Parse the JSON and calculate offline data
  // const parsedState = JSON.parse(decodedState) as GameState;
  const parsedState = JSON.parse(savedState, bigIntReviver) as GameState;
  console.log("Parsed game state:", parsedState);

  const timeElapsed = Date.now() - parsedState.lastTimeSaved;
  const moneyEarned = (parsedState.resourcesPerSecond * BigInt(timeElapsed)) / BigInt(1000);
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
