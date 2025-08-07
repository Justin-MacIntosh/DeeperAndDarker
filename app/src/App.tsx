import { useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

import { useGameStore } from './game_state/GameStore';
import { useSaveStateToLocalStorage } from './hooks/useSaveStateToLocalStorage';
import BraxiosLayout from './components/Stages/BraxiosLayout';


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

  const [currentStage, setCurrentStage] = useState("stage_1");

  let stageContent = null;
  switch (currentStage) {
    case "stage_1":
      stageContent = <BraxiosLayout saveCurrentGameData={saveCurrentGameData} />;
      break;
    default:
      stageContent = <div>Stage not implemented yet</div>;
      break;
  }

  // https://stackoverflow.com/questions/69150928/how-to-create-multiple-themes-using-tailwind-css
  // https://stackoverflow.com/questions/77494641/use-data-theme-variable-value-in-css

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
      <button
        className="cursor-default fixed top-[120px] z-20 w-2 bg-gray-300 h-20 rounded-r-xl"
        onMouseOver={toggleDrawer}
      />
      <main className="bg-dark-purple min-h-screen min-w-[1100px]">
        { stageContent }
      </main>
    </>
  );
}
export default App;
