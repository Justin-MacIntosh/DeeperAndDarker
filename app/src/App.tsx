import { useEffect } from 'react';

import { useGameStore } from './game_state/GameStore';
import { useSaveStateToLocalStorage } from './hooks/useSaveStateToLocalStorage';

import Footer from './components/Footer';
import Header from './components/Header';
import OfflineEarningsDialog from './components/OfflineEarningsDialog';
import PlanetContent from './components/PlanetContent';
import RobotsList from './components/RobotDisplay';

/* Main App component that renders the game interface */
const App = () => {
  // console.log("App render");

  const tickAction = useGameStore((state) => state.tick);
  const { saveCurrentGameData } = useSaveStateToLocalStorage();

  // Effect to handle game ticks
  useEffect(() => {
    const tickIntervalId = setInterval(() => {
      tickAction(200);
    }, 200);
    return () => clearInterval(tickIntervalId);
  }, []);

  return (
    <div className="bg-dark-purple">
      <OfflineEarningsDialog/>
      <Header/>
      <div
        id="main"
        className="
          min-w-[1100px] p-5 mx-7 bg-med-purple
          border-gray-300 border-solid border-2 rounded-xl
          flex flex-row gap-6"
      >
        <PlanetContent/>
        <div id="sidebar" className="flex-1 min-w-[400px]">
          <RobotsList/>
        </div>
      </div>
      <Footer saveCurrentGameData={saveCurrentGameData}/>
    </div>
  );
}
export default App;
