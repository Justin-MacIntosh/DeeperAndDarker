import { GameState } from "./GameStateZustand";

const GAME_STATE_KEY = 'planet_cracker_game_state';

export const saveGameState = (state: GameState) => {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}

export const loadGameState = (): GameState | null => {
  const savedState = localStorage.getItem(GAME_STATE_KEY);
  if (!savedState) {
    return null;
  }

  const parsedState = JSON.parse(savedState) as GameState;
  const timeElapsed = Date.now() - parsedState.timeSaved;
  const moneyEarned = parsedState.moneyPerSecond * (timeElapsed / 1000);
  parsedState.currentMoney += moneyEarned;
  parsedState.timeOfflineData = {
    moneyEarned: moneyEarned,
    timeElapsed: timeElapsed
  };
  console.log(parsedState)

  return { ...parsedState };
}

export const resetGameState = () => {
  localStorage.removeItem(GAME_STATE_KEY);
}