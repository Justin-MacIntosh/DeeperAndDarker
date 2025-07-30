import { useEffect, useReducer, useRef } from 'react';

import {
  INITIAL_GAME_STATE, gameStateReducer, GameStateContext,
} from './game_state/GameState';
import { saveGameState, loadGameState, resetGameState } from './game_state/gameStateStorage';
import RobotsList from './components/RobotDisplay';
import OfflineDataDialog from './components/OfflineDataDialog';
import PlanetContent from './components/PlanetContent';
import Header from './components/Header';

const LOADED_GAME_STATE = loadGameState() || INITIAL_GAME_STATE;

const App = () => {
  const [gameState, dispatch] = useReducer(gameStateReducer, LOADED_GAME_STATE);

  const saveCurrentGameData = () => {
    const timeSaved = Date.now();
    dispatch({ type: "updateTimeSaved", timeSaved: timeSaved });
    saveGameState({ ...gameStateRef.current, timeSaved: timeSaved });
  }

  // Effect to handle game ticks
  useEffect(() => {
    const tickIntervalId = setInterval(() => {
      dispatch({ type: "tick", milliseconds: 200 });
    }, 200);
    return () => clearInterval(tickIntervalId);
  }, []);

  // Ref to always have the latest gameState in the interval
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Effects to save game state periodically
  useEffect(() => {
    const saveStateIntervalId = setInterval(() => {
      saveCurrentGameData();
    }, 5000);
    return () => clearInterval(saveStateIntervalId);
  }, []);

  const resetGame = () => {
    resetGameState();
    dispatch({ type: "resetGame" });
  }

  const lastDateTimeSaved = new Date(gameState.timeSaved).toLocaleString();
  return (
    <div className="bg-dark-purple">
      <GameStateContext value={{state: gameState, dispatch: dispatch}}>
        <OfflineDataDialog />
        <Header />
        <div
          id="main"
          className="
            min-w-[1100px] p-5 mx-7 bg-med-purple
            border-gray-300 border-solid border-2 rounded-xl
            flex flex-row gap-6"
        >
          <PlanetContent />
          <div className="flex-1 min-w-[400px]">
            <h1 className="text-2xl font-bold">AUTOMATONS</h1>
            <RobotsList robots={gameState.robots}/>
          </div>
        </div>
        <footer className="h-full py-3 mx-7 flex content-center">
          <div className="flex-1"></div>
          <div className="min-w-[400px] text-right">
            {
              lastDateTimeSaved &&
              <span className="mr-3">Last saved {lastDateTimeSaved}</span>
            }
            <button
              className="
                bg-med-purple mr-3 px-4 py-2 rounded-lg shadow-md
                hover:brightness-125
                active:brightness-110 active:scale-95
              "
              onClick={saveCurrentGameData}
            >
              Save
            </button>
            <button
              className="
                bg-med-purple px-4 py-2 rounded-lg shadow-md
                hover:brightness-125
                active:brightness-110 active:scale-95
              "
              onClick={resetGame}
            >
              Reset
            </button>
          </div>
        </footer>
      </GameStateContext>
    </div>
  );
}
export default App;
