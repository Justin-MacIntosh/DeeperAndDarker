import Footer from '../shared/Footer';
import Header from '../shared/Header';
import OfflineEarningsDialog from '../../OfflineEarningsDialog';
import StageContent from '../shared/StageContent';
import ProducerList from '../shared/ProducerDisplay';
import 'react-modern-drawer/dist/index.css'
import UnlockList from '../shared/UnlockList';
import { useEffect } from 'react';


const YanLayout = (
  { saveCurrentGameData }:
  { saveCurrentGameData: () => void}
) => {
  // This effect is used to remove the preload class after the page has loaded.
  // This prevents animations from playing on initial load.
  useEffect(() => {
    setTimeout(() => {
      console.log("Removing preload class");
      const preloadElements = document.getElementsByClassName("preload");
      if (preloadElements.length > 0) {
        document.getElementsByClassName("preload")[0].className="";
      }
    },
    1000);
  }, []);

  return (
    <main data-theme="planet-yan" className="bg-dark min-h-screen min-w-[1100px]">
      <div className="preload">
        <Header stageId="stage_2"/>
        <div
          id="main"
          className="
            p-5 mx-7 bg-med
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
      </div>
    </main>
  );
}

export default YanLayout;
