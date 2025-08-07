import Footer from '../shared/Footer';
import Header from '../shared/Header';
import OfflineEarningsDialog from '../../OfflineEarningsDialog';
import StageContent from '../shared/StageContent';
import ProducerList from '../shared/ProducerDisplay';
import 'react-modern-drawer/dist/index.css'
import UnlockList from '../shared/UnlockList';
import { useEffect } from 'react';


const BraxiosLayout = (
  { saveCurrentGameData }:
  { saveCurrentGameData: () => void}
) => {

  // This effect is used to remove the preload class after the page has loaded.
  // This prevents animations from playing on initial load.
  useEffect(() => {
    setTimeout(function(){
      console.log("Removing preload class");
      const preloadElements = document.getElementsByClassName("preload");
      if (preloadElements.length > 0) {
        document.getElementsByClassName("preload")[0].className="";
      }
    }, 500);
  }, []);

  return (
    <div className="preload">
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
    </div>
  );
}

export default BraxiosLayout;
