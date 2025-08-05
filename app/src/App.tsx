import { useEffect, useState } from 'react';

import { useGameStore } from './game_state/GameStore2';
import { useSaveStateToLocalStorage } from './hooks/useSaveStateToLocalStorage';

import Drawer from 'react-modern-drawer'

import Footer from './components/Footer';
import Header from './components/Header';
import OfflineEarningsDialog from './OfflineEarningsDialog';
import StageContent from './components/StageContent';
import ProducerList from './components/ProducerDisplay';
import 'react-modern-drawer/dist/index.css'


/* Main App component that renders the game interface */
const App = () => {
  const tickAction = useGameStore((state) => state.tick);
  const { saveCurrentGameData } = useSaveStateToLocalStorage();

  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer = () => {
      setIsOpen((prevState) => !prevState)
  }

  // Effect to handle game ticks
  useEffect(() => {
    const tickIntervalId = setInterval(() => {
      tickAction(200);
    }, 200);
    return () => clearInterval(tickIntervalId);
  }, []);

  return (
    <>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction='left'
        zIndex={1000}
        size={'200px'}
        duration={300}
        className="border-right border-gray-400 border-r-solid border-r-2 rounded-r-lg"
      >
        <div className="h-full bg-dark-purple text-gray-300 flex flex-col p-5 rounded-r-lg">
          <button className="btn-default mb-5">Deep Space</button>
          <button className="btn-default">Planet Yan</button>
        </div>
      </Drawer>
      <main className="bg-dark-purple min-w-[1100px]">
        <button className="fixed top-[120px] z-20 w-3 bg-gray-300 h-10 rounded-r-xl hover:w-5 transition-all" onClick={toggleDrawer}/>
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
      </main>
    </>
  );
}
export default App;
