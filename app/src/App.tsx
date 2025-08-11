import { ReactNode, useEffect, useState } from 'react';
import 'react-modern-drawer/dist/index.css'

import { useGameStore } from './game_state/GameStore';
import { useSaveStateToLocalStorage } from './hooks/useSaveStateToLocalStorage';
import BraxiosLayout from './components/Stages/BraxiosLayout';
import YanLayout from './components/Stages/YanLayout';
import GlobalDrawer from './GlobalDrawer';
import OfflineEarningsDialog from './OfflineEarningsDialog';
import clsx from 'clsx';


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
        style={{ animation: `${show ? "fadeIn" : "fadeOut"} .5s` }}
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
  return (
    <div className="bg-neutral-900 absolute top-0 w-full h-full">
      <GlobalDrawer setCurrentStage={setCurrentStage} />
      <OfflineEarningsDialog/>
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
