import { ReactNode, memo, useEffect, useState } from 'react';

import { AnimatePresence, motion } from "motion/react";
import { useShallow } from 'zustand/react/shallow';

import ResourceIcon from '../../icons/ResourceIcon';
import ProducerCard from '../shared/ProducerCard';
import UpgradeCard from '../shared/UpgradeCard';
import UnlockCard from '../shared/UnlockCard';
import Footer from '../shared/Footer';
import Header, { CurrentResourcesDisplay } from '../shared/Header';
import { useGameStore } from '../../game_state/GameStore';

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
      <Header stageId="stage_2" displayResources={true} />
      <div className="justify-items-center">
        <div
          id="main"
          className="
            p-5 mx-10 bg-primary
            border-gray-300 border-solid border-2 rounded-xl
            grid grid-cols-[min-content_min-content] transition-all duration-75"
        >
          <div
            id="yan-content"
            className="rounded-xl flex flex-col 2xl:flex-row gap-6 mr-6"
          >
            <ResearchDisplay />
            <MightDisplay />
          </div>
          <UnlockSidebar stageId="stage_2"/>
        </div>
      </div>
      <Footer saveCurrentGameData={saveCurrentGameData} />
    </main>
  );
}

const MightDisplay = () => {
  const isYanMightActive = useGameStore((state) => state.stages["stage_2"].producers["yan_soldier"].dynamic.isActive);

  return (
    <AnimatePresence initial={false}>
      {
      isYanMightActive &&
        <motion.div
          key={"yan_might"}
          variants={containerVariant}
          className='origin-top overflow-hidden text-nowrap'
          initial="initial"
          animate="animate"
        >
          <div
            id="yan-might-container"
            className="min-w-[600px] flex-1 flex flex-col rounded-xl gap-3 p-4 bg-secondary"
          >
            <div className="flex flex-row justify-between items-center">
              <h3 className="uppercase text-2xl">Military Presence <ResourceIcon resource="yan_might" size={24} /></h3>
              <CurrentResourcesDisplay resource="yan_might"/>
            </div>
            <ProducerCard producerId="yan_soldier" stageId="stage_2" numToPurchaseOption={1}/>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
};

const containerVariant = {
  initial: { opacity: 0, scale: 0, width: 0 },
  animate: { opacity: 1, scale: 1, width: "600px", transition: { when: "beforeChildren", duration: .6 } },
  exit: { opacity: 0, scale: 0, width: 0 }
};

const ResearchDisplay = () => {
  const isYanResearchActive = useGameStore((state) => state.stages["stage_2"].producers["yan_researcher"].dynamic.isActive);

  return (
    <AnimatePresence initial={false} mode="wait">
      {
      isYanResearchActive &&
        <motion.div
          key={"yan_research"}
          variants={containerVariant}
          className='origin-top overflow-hidden text-nowrap'
          initial="initial"
          animate="animate"
        >
          <div
            id="yan-research-container"
            className="min-w-[600px] flex-1 flex flex-col rounded-xl gap-3 p-4 bg-secondary"
          >
            <div className="flex flex-row justify-between items-center">
              <h3 className="uppercase text-2xl">Planet Yan Research <ResourceIcon resource="yan_research" size={24} /></h3>
              <CurrentResourcesDisplay resource="yan_research"/>
            </div>
            <ProducerCard producerId="yan_researcher" stageId="stage_2" numToPurchaseOption={1}/>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
};

const UnlockSidebar = memo(({ stageId }: { stageId: string }) => {
  const unlockIds = useGameStore(
    useShallow((state) => Object.keys(state.stages[stageId].unlocks))
  );
  const anyUnlocksActive = useGameStore(
    useShallow((state) => Object.values(state.stages[stageId].unlocks).some(
      (unlock) => unlock.dynamic.isActive
    ))
  );

  return (
    <AnimatePresence initial={false}>
      {
        anyUnlocksActive &&
        <motion.div
          transition={{ duration: .5 }}
          initial={{ opacity: 0, scale: 0, width: 0 }}
          animate={{ opacity: 1, scale: 1, width: "400px" }}
          exit={{ opacity: 0, scale: 0, width: 0, margin: 0 }}
          className='w-[400px] origin-top text-nowrap'
        >
          <div className="flex flex-row justify-between items-center mb-3">
            <h1 className="uppercase text-2xl font-bold">Research</h1>
          </div>
          <div className="flex flex-col">
            {unlockIds.map(
              (unlockId) => {
                return (
                  <UnlockCard
                    key={unlockId}
                    unlockId={unlockId}
                    stageId={stageId}
                  />
                )
              }
            )}
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
});

export default YanLayout;
