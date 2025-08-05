import { useEffect } from 'react';

import { useGameStore } from './game_state/GameStore2';
import { useSaveStateToLocalStorage } from './hooks/useSaveStateToLocalStorage';

import Footer from './components/Footer';
import Header from './components/Header';
import OfflineEarningsDialog from './OfflineEarningsDialog';
import StageContent from './components/StageContent';
import ProducerList from './components/ProducerDisplay';

/* Main App component that renders the game interface */
const App = () => {
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
    <div className="bg-dark-purple min-w-[1100px]">
      <OfflineEarningsDialog/>
      <Header stageId="stage_1"/>
      <div
        id="main"
        className="
          p-5 mx-7 bg-med-purple
          border-gray-300 border-solid border-2 rounded-xl
          flex flex-row gap-6"
      >
        <StageContent stageId="stage_1"/>
        <div id="sidebar" className="flex-1 min-w-[400px]">
          <ProducerList stageId="stage_1"/>
        </div>
      </div>
      <Footer saveCurrentGameData={saveCurrentGameData}/>
    </div>
  );
}
export default App;
