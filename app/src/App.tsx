import { useEffect, useState } from 'react';

import { useGameStore } from './game_state/GameStore';
import { useSaveStateToLocalStorage } from './hooks/useSaveStateToLocalStorage';

import Drawer from 'react-modern-drawer'

import Footer from './components/Footer';
import Header from './components/Header';
import OfflineEarningsDialog from './OfflineEarningsDialog';
import StageContent from './components/StageContent';
import ProducerList from './components/ProducerDisplay';
import 'react-modern-drawer/dist/index.css'
import UnlockList from './components/UnlockList';


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
      tickAction(250);
    }, 250);
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
        className="border-right border-gray-300 border-r-solid border-r-[3px]"
      >
        <div className="h-full bg-gray-800 text-gray-300 flex flex-col p-5">
          <button className="btn-default bg-gray-600 mb-5">Deep space</button>
          <button className="btn-default bg-gray-600">Planet Yan</button>
        </div>
        <button
          className="cursor-default fixed top-[120px] left-[200px] z-20 w-2 bg-gray-300 h-20 rounded-r-xl"
        />
      </Drawer>
      <main className="bg-dark-purple min-h-screen min-w-[1100px]">
        <button
          className="cursor-default fixed top-[120px] z-20 w-2 bg-gray-300 h-20 rounded-r-xl"
          onMouseOver={toggleDrawer}
        />
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
            <UnlockList stageId="stage_1"/>
          </div>
        </div>
        <Footer saveCurrentGameData={saveCurrentGameData}/>
      </main>
    </>
  );
}
export default App;
