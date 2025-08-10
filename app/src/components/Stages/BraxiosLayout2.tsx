import { ReactNode, useEffect } from 'react';

import { AnimatePresence, motion } from "motion/react"

import Footer from '../shared/Footer';
import Header, { CurrentResourcesDisplay } from '../shared/Header';
import UnlockList from '../shared/UnlockList';
import ResourceIcon from '../../icons/ResourceIcon';
import { SingleProducerDisplay } from '../shared/ProducerDisplay';
import { SingleUpgrade } from '../shared/StageContent';
import { useGameStore } from '../../game_state/GameStore';


const BraxiosLayout = (
  { saveCurrentGameData }:
  { saveCurrentGameData: () => void}
) => {
  // Set the data-theme attribute to "deep-space" for theming
  useEffect(() => {
    document.body.setAttribute("data-theme", "deep-space");
  }, []);

  return (
    <main id="braxios-main" className="mouse-affected-bg bg-background min-h-screen min-w-[1100px]">
      <Header stageId="stage_1"/>
      <div className="justify-items-center">
        <div
          id="main"
          className="
            p-5 mx-10 bg-primary
            border-gray-300 border-solid border-2 rounded-xl
            gap-6 test-grid"
        >
          <div
            id="content"
            className="flex-grow-[4] rounded-xl flex flex-col 2xl:flex-row gap-3"
          >
            <CopperDisplay/>
            <SilverDisplay/>
          </div>
          <div id="sidebar">
            <UnlockList stageId="stage_1"/>
          </div>
        </div>
      </div>
      <Footer saveCurrentGameData={saveCurrentGameData}/>
    </main>
  );
}

const CopperDisplay = () => {
  return (
    <div
      id="copper-container"
      className="min-w-[600px] flex flex-col rounded-xl gap-3 p-4 bg-secondary"
    >
      <div className="flex flex-row justify-between items-center">
      <h3 className="uppercase text-2xl">Copper <ResourceIcon resource="copper" size={24} /></h3>
        <CurrentResourcesDisplay resource="copper"/>
      </div>
      <SingleProducerDisplay producerId="mnr_n1" stageId="stage_1" numToPurchaseOption={1}/>
      <SingleUpgrade upgradeId="mnr_n1_control_center" stageId="stage_1"/>
      <SingleUpgrade upgradeId="mnr_n1_fabricator" stageId="stage_1"/>
    </div>
  );
};

const SilverDisplay = () => {
  const isSilverActive = useGameStore((state) => state.stages["stage_1"].producers["mnr_s1"].dynamic.isActive);

  let silverNotification: ReactNode = <p className="uppercase">MNR-S1 Mining Robots are needed to mine Silver.</p>;
  if (isSilverActive) {
    silverNotification = null;
  }

  return (
    <AnimatePresence initial={false}>
      {
      isSilverActive &&
        <motion.div
          transition={{ duration: .8 }}
          initial={{ opacity: 0, scale: 0, width: 0 }}
          animate={{ opacity: 1, scale: 1, width: "600px" }}
          exit={{ opacity: 0, scale: 0, width: 0 }}
          className='origin-top'
        >
          <div
            id="silver-container"
            className="min-w-[600px] flex-1 flex flex-col rounded-xl gap-3 p-4 bg-secondary"
          >
            <div className="flex flex-row justify-between items-center">
              <h3 className="uppercase text-2xl">Silver <ResourceIcon resource="silver" size={24} /></h3>
              <CurrentResourcesDisplay resource="silver"/>
            </div>
            {silverNotification}
            <SingleProducerDisplay producerId="mnr_s1" stageId="stage_1" numToPurchaseOption={1}/>
            <SingleUpgrade upgradeId="mnr_s1_control_center" stageId="stage_1"/>
            <SingleUpgrade upgradeId="mnr_s1_fabricator" stageId="stage_1"/>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
};

export default BraxiosLayout;
