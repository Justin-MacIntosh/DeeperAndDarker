import { ReactNode, useEffect, useState } from 'react';
import 'react-modern-drawer/dist/index.css'

import { AnimatePresence, motion } from "motion/react"

import { useGameStore } from './game_state/GameStore';
import { useSaveStateToLocalStorage } from './hooks/useSaveStateToLocalStorage';
import BraxiosLayout from './components/Stages/BraxiosLayout';
import YanLayout from './components/Stages/YanLayout';
import GlobalDrawer from './GlobalDrawer';
import OfflineEarningsDialog from './OfflineEarningsDialog';


const stageVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: .6 } },
  exit: { opacity: 0, transition: { duration: .6 } }
};


const StageFade = ({ children, key }: { children: ReactNode, key: string }) => {
  return (
    <motion.div
      key={key}
      variants={stageVariant}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      { children }
    </motion.div>
  );
}

/* Main App component that renders the game interface */
const App = () => {
  const tickAction = useGameStore((state) => state.tick);
  const { saveCurrentGameData } = useSaveStateToLocalStorage();

  useEffect(() => {
    document.addEventListener("mousemove", graphicManip);

    function graphicManip(e: MouseEvent) {
      const elems = document.getElementsByClassName("mouse-affected-bg");
      if (!elems.length) return;
      const elem = elems[0] as HTMLElement;

      let _w = window.innerWidth/2;
      let _h = window.innerHeight/2;
      let _mouseX = e.clientX;
      let _mouseY = e.clientY;
      let _depth3 = `${50 - (_mouseX - _w) * 0.002}% ${50 - (_mouseY - _h) * 0.002}%`;
      let x = `${_depth3}`;
      elem.style.backgroundPosition = x;
    }
  }, []);

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
      stageContent = <BraxiosLayout saveCurrentGameData={saveCurrentGameData} key="deep-space" />;
      break;
    case "stage_2":
      stageContent = <YanLayout saveCurrentGameData={saveCurrentGameData} key="planet-yan" />;
      break;
    default:
      stageContent = <div>Stage not implemented yet</div>;
      break;
  }

  return (
    <div className="bg-neutral-900">
      <GlobalDrawer setCurrentStage={setCurrentStage} />
      <OfflineEarningsDialog/>
      <AnimatePresence initial={false} mode="wait" propagate={false}>
        {
          currentStage === "stage_1" &&
          <StageFade key="deep-space">
            <BraxiosLayout saveCurrentGameData={saveCurrentGameData} />
          </StageFade>
        }
        {
          currentStage === "stage_2" &&
          <StageFade key="planet-yan">
            <YanLayout saveCurrentGameData={saveCurrentGameData} />
          </StageFade>
        }
      </AnimatePresence>
    </div>
  );
}
export default App;
