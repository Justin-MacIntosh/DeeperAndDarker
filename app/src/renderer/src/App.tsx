import { ReactNode, useEffect, useState } from 'react';

import clsx from 'clsx';

import { useGameStore } from './game_state/GameStore';
import { useSaveStateToLocalStorage } from './hooks/useSaveStateToLocalStorage';
import BraxiosLayout from './components/Stages/BraxiosLayout';
import YanLayout from './components/Stages/YanLayout';
import CorporateLayout from './components/Stages/CorporateLayout';
import GlobalDrawer from './components/global/GlobalDrawer';
import OfflineEarningsDialog from './components/global/OfflineEarningsDialog';

import 'react-modern-drawer/dist/index.css'


const Fade = ({ children, show, onShowCallback }: {children: ReactNode, show: boolean, onShowCallback: () => void}) => {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) {
      setRender(true);
    }
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) {
      setRender(false);
    } else {
      onShowCallback();
    }
  };

  const opacityClasses = show ? "opacity-100" : "opacity-0";

  return (
    shouldRender ? (
      <div
        className={clsx(opacityClasses)}
        style={{ animation: `${show ? "stageFadeIn" : "stageFadeOut"} .5s` }}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </div>
    ): null
  );
};


/* Main App component that renders the game interface */
const App = () => {
  const tickAction = useGameStore((state) => state.tick);
  const currentStage = useGameStore((state) => state.currentStage);
  const { saveCurrentGameData } = useSaveStateToLocalStorage();

  useEffect(() => {
    document.addEventListener("mousemove", adjustMouseAffectedBgs);

    function adjustMouseAffectedBgs(e: MouseEvent) {
      const mouseAffectedBgs = document.getElementsByClassName("mouse-affected-bg");
      if (!mouseAffectedBgs.length) {
        return;
      }

      const windowHalfWidth = window.innerWidth / 2;
      const windowHalfheight = window.innerHeight/2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const finalXPercent = 50 - (mouseX - windowHalfWidth) * 0.001;
      const finalYPercent = 50 - (mouseY - windowHalfheight) * 0.001;
      let positionString = `${finalXPercent}% ${finalYPercent}%`;

      const background = mouseAffectedBgs[0] as HTMLElement;
      background.style.backgroundPosition = `${positionString}`;
    }
  }, []);

  // Effect to handle game ticks
  useEffect(() => {
    const tickIntervalId = setInterval(() => {
      tickAction(250);
    }, 250);
    return () => clearInterval(tickIntervalId);
  }, []);

  return (
    <div className="bg-neutral-900 absolute top-0 w-full h-full">
      <GlobalDrawer />
      {/* <OfflineEarningsDialog/> */}

      <Fade show={currentStage === "corporate_convo_1"} onShowCallback={() => {document.body.setAttribute("data-theme", "deep-space");}}>
        <CorporateLayout />
      </Fade>
      <Fade show={currentStage === "stage_1"} onShowCallback={() => {document.body.setAttribute("data-theme", "deep-space");}}>
        <BraxiosLayout saveCurrentGameData={saveCurrentGameData} key="deep-space" />
      </Fade>
      <Fade show={currentStage === "stage_2"} onShowCallback={() => {document.body.setAttribute("data-theme", "planet-yan");}}>
        <YanLayout saveCurrentGameData={saveCurrentGameData} key="planet-yan" />
      </Fade>
    </div>
  );
}
export default App;
