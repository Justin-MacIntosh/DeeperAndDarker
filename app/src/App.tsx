import { useEffect, useState } from 'react';
import 'react-modern-drawer/dist/index.css'

import { useGameStore } from './game_state/GameStore';
import { useSaveStateToLocalStorage } from './hooks/useSaveStateToLocalStorage';
import BraxiosLayout from './components/Stages/BraxiosLayout';
import YanLayout from './components/Stages/YanLayout';
import GlobalDrawer from './components/shared/GlobalDrawer';
import OfflineEarningsDialog from './OfflineEarningsDialog';


/* Main App component that renders the game interface */
const App = () => {
  const tickAction = useGameStore((state) => state.tick);
  const { saveCurrentGameData } = useSaveStateToLocalStorage();

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
    case "stage_2":
      stageContent = <YanLayout saveCurrentGameData={saveCurrentGameData} />;
      break;
    default:
      stageContent = <div>Stage not implemented yet</div>;
      break;
  }

  return (
    <>
      <GlobalDrawer setCurrentStage={setCurrentStage} />
      <OfflineEarningsDialog/>
      { stageContent }
    </>
  );
}
export default App;
