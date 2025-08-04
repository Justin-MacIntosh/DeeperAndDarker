import { useEffect } from 'react';

import { useGameStore } from './game_state/GameStore';
import { useSaveStateToLocalStorage } from './hooks/useSaveStateToLocalStorage';

import Footer from './components/Footer';
import Header from './components/Header';
import OfflineEarningsDialog from './components/OfflineEarningsDialog';
import StageContent from './components/StageContent';
import ProducerList from './components/ProducerDisplay';
import SidebarCard from './components/SidebarCard';
import { IconHome } from '@tabler/icons-react';
import TablerIconDisplay from './icons/TablerIconDisplay';
import GemIcon from './icons/GemIcon';

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
    <div className="bg-dark-purple min-w-[1100px]">
      <OfflineEarningsDialog/>
      <Header/>
      <div
        id="main"
        className="
          p-5 mx-7 bg-med-purple
          border-gray-300 border-solid border-2 rounded-xl
          flex flex-row gap-6"
      >
        <StageContent/>
        <div id="sidebar" className="flex-1 min-w-[400px]">
          <ProducerList/>
          <div className="flex flex-row justify-between items-center mb-3">
            <h1 className="uppercase text-2xl font-bold">Spacecraft</h1>
          </div>
          <div className="flex flex-col">
            <div className="text-lg flex flex-row mb-2">
              <h2 className="uppercase flex-1">Settlement ship</h2>
            </div>
            <SidebarCard
              color={"green"}
              icon={<TablerIconDisplay icon={"IconBuilding"} size={55}/>}
              contentElement={<>Settle Planet Baj</>}
              suffixElement={<>1000<GemIcon size={18}/></>}
              onClick={() => {}}
              isClickDisabled={false}
            />
          </div>
        </div>
      </div>
      <Footer saveCurrentGameData={saveCurrentGameData}/>
    </div>
  );
}
export default App;
