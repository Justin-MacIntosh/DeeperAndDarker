import { useEffect, useReducer, useRef, useState } from 'react';

import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

import {
  INITIAL_GAME_STATE, gameStateReducer, GameStateContext,
} from './game_state/GameState';
import { saveGameState, loadGameState } from './game_state/gameStateStorage';
import RobotDisplay from './components/RobotDisplay';
import { formatNumber } from './helpers/formatNumber';

const LOADED_GAME_STATE = loadGameState() || INITIAL_GAME_STATE;

const App = () => {
  const [gameState, dispatch] = useReducer(gameStateReducer, LOADED_GAME_STATE);

  console.log("rerender");
  let [isOpen, setIsOpen] = useState(LOADED_GAME_STATE.timeOfflineData !== undefined);

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

  const lastDateTimeSaved = new Date(gameState.timeSaved).toLocaleString();

  let offlineDataElement = null;
  if (gameState.timeOfflineData) {
    const { moneyEarned, timeElapsed } = gameState.timeOfflineData;
    offlineDataElement = (
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            className="
              max-w-lg p-12
              bg-dark-purple
              border-gray-300 border-solid border-2 rounded-xl"
          >
            <DialogTitle className="text-2xl mb-3">Offline earnings</DialogTitle>
            <Description>
              You were offline for {Math.round(timeElapsed/ 1000)} second(s) and
              earned {formatNumber(moneyEarned)} resources!
            </Description>
          </DialogPanel>
        </div>
      </Dialog>
    );
  }

  return (
    <div className="p-7 bg-dark-purple">
      <GameStateContext value={{state: gameState, dispatch: dispatch}}>
        { offlineDataElement }
        <header
          className="
            min-w-[1100px] sticky top-2.5 z-10 p-5 mb-5
            bg-med-purple
            border-gray-300 border-solid border-2 rounded-xl
            flex flex-row
            shadow-[0_5px_10px_rgba(0,0,0,0.5)]"
        >
          <div
            id="planet-title"
            className="min-w-[400px]"
          >
            <h1 className='text-3xl font-bold'>PLANET BAJ</h1>
            <h3 className="text-lg">SWAMP BIOME</h3>
          </div>
          <div className="flex-grow"/>
          <div
            id="production-stats"
            className="min-w-[400px] text-right"
          >
            <h1 className="text-3xl font-bold">
              {formatNumber(gameState.currentMoney)}<i className="fa-regular fa-gem fa-xs"/>
            </h1>
            <h3 className="text-lg">
              {formatNumber(gameState.moneyPerSecond)}<i className="fa-regular fa-gem fa-xs"/>/sec
            </h3>
          </div>
        </header>
        <div
          className="
            min-w-[1100px] p-5
            bg-med-purple
            border-gray-300 border-solid border-2 rounded-xl
            flex flex-row gap-6"
        >
          <div
            id="content"
            className="
              min-w-[500px] flex-grow-[4]
              rounded-xl
              flex flex-col gap-3"
          >
            <div
              id="content-planetary-row"
              className="flex flex-col 2xl:flex-row rounded-xl gap-3"
            >
              <div
                id="planet-display"
                className="
                  min-h-[400px] bg-black
                  w-full rounded-xl
                  2xl:w-[500px] 2xl:rounded-l-xl 2xl:rounded-r-none"
              ></div>
              <div
                id="planetary-data-display"
                className="
                  p-4 min-h-[400px] bg-light-purple
                  flex-1 rounded-xl
                  2xl:rounded-l-none 2xl:rounded-r-xl"
              >
                <h3>PLANETARY DATA</h3>
              </div>
            </div>
            <div className="content-structures-row">
              <div
                id="structure-display"
                className="
                  p-4 min-h-[400px] bg-light-purple
                  flex-1 rounded-xl"
              >
                <h3>STRUCTURES</h3>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-[400px]">
            <h1 className="text-2xl font-bold">AUTOMATONS</h1>

            {Object.entries(gameState.robots).map(([_, robot]) => (
              robot.isBeingShown && <RobotDisplay robot={robot}/>
            ))}
          </div>
        </div>
        <footer className="h-5 mb-2 py-3 flex-display">
          <div className="flex-1"></div>
          <div className="min-w-[400px] text-right">
            { lastDateTimeSaved && <span className="mr-3">Last saved {lastDateTimeSaved}</span> }
            <button className="save-button" onClick={saveCurrentGameData}>Save</button>
          </div>
        </footer>
      </GameStateContext>
    </div>
  );
}
export default App;
