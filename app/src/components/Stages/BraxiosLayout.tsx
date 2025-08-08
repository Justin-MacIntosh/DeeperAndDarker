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
  // Set the data-theme attribute to "deep-space" for theming
  useEffect(() => {
    document.body.setAttribute("data-theme", "deep-space");
  }, []);

  return (
    <main className="bg-dark min-h-screen min-w-[1100px]">
      <div className="preload">
        <Header stageId="stage_1"/>
        <div
          id="main"
          className="
            p-5 mx-7 bg-med
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
    </main>
  );
}

export default BraxiosLayout;
