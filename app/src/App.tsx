import { useEffect } from 'react';

import { useGameStore } from './game_state/GameStateZustand';
import { resetGameState } from './game_state/gameStateStorage';
import { useSaveGameStateToLocalStorage } from './hooks/useGameStateLocalStorage';

import RobotsList from './components/RobotDisplay';
import OfflineDataDialog from './components/OfflineDataDialog';
import PlanetContent from './components/PlanetContent';
import Header from './components/Header';

const App = () => {
  const resetAction = useGameStore((state) => state.resetGame);
  const tickAction = useGameStore((state) => state.tick);
  const timeSaved = useGameStore((state) => state.timeSaved);
  const { saveCurrentGameData } = useSaveGameStateToLocalStorage();

  console.log("App render");

  // Effect to handle game ticks
  useEffect(() => {
    const tickIntervalId = setInterval(() => {
      tickAction(200);
    }, 200);
    return () => clearInterval(tickIntervalId);
  }, []);

  const resetGame = () => {
    resetGameState();
    resetAction();
  }

  const lastDateTimeSaved = new Date(timeSaved).toLocaleString();
  return (
    <div className="bg-dark-purple">
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
          <RobotsList/>
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
              active:brightness-110 active:scale-95"
            onClick={saveCurrentGameData}
          >
            Save
          </button>
          <button
            className="
              bg-med-purple px-4 py-2 rounded-lg shadow-md
              hover:brightness-125
              active:brightness-110 active:scale-95"
            onClick={resetGame}
          >
            Reset
          </button>
        </div>
      </footer>
    </div>
  );
}
export default App;
