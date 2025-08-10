import { useEffect } from 'react';

import Footer from '../shared/Footer';
import Header from '../shared/Header';
import StageContent from '../shared/StageContent';
import ProducerList from '../shared/ProducerDisplay';
import UnlockList from '../shared/UnlockList';


const YanLayout = (
  { saveCurrentGameData }:
  { saveCurrentGameData: () => void}
) => {
  // Set the data-theme attribute to "planet-yan" for theming
  useEffect(() => {
    document.body.setAttribute("data-theme", "planet-yan");
  }, []);

  return (
    <main id="planet-yan-main" className="mouse-affected-bg bg-bg min-h-screen min-w-[1100px]">
      <Header stageId="stage_2"/>
      <div
        id="main"
        className="
          p-5 mx-10 bg-primary
          border-gray-300 border-solid border-2 rounded-xl
          flex flex-row gap-6"
      >
        <StageContent stageId="stage_2"/>
        <div id="sidebar" className="flex-1 min-w-[400px]">
          <ProducerList stageId="stage_2"/>
          <UnlockList stageId="stage_2"/>
        </div>
      </div>
      <Footer saveCurrentGameData={saveCurrentGameData}/>
    </main>
  );
}

export default YanLayout;
