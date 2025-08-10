import { ReactNode, memo, useEffect, useState } from 'react';

import { AnimatePresence, motion } from "motion/react";
import { useShallow } from 'zustand/react/shallow';

import Footer from '../shared/Footer';
import Header, { CurrentResourcesDisplay } from '../shared/Header';
import ResourceIcon from '../../icons/ResourceIcon';
import ProducerCard from '../shared/ProducerCard';
import UpgradeCard from '../shared/UpgradeCard';
import UnlockCard from '../shared/UnlockCard';
import { useGameStore } from '../../game_state/GameStore';
import { Joyride, TooltipRenderProps } from 'react-joyride';


const planetYanTutorialSteps = [
  {
    target: '#global-drawer-btn',
    title: "Stage Selection",
    content: (
      <>
        <p>You have gathered enough resources to begin settling Planet Yan!</p>
        <p>Dismiss this popup and hover here to open the stage selection drawer.</p>
      </>
    ),
    disableBeacon: true,
    placement: "right" as "right",
  },
];


function CustomTooltip(props: TooltipRenderProps) {
  const { step, tooltipProps } = props;

  return (
    <div className="bg-primary p-5 border-gray-300 border-solid border-2 rounded-xl" {...tooltipProps}>
      {step.title && <h4 className="underline text-2xl">{step.title}</h4>}
      <div className="text-lg">{step.content}</div>
    </div>
  );
}

const BraxiosLayout = ({
  saveCurrentGameData,
}: {
  saveCurrentGameData: () => void;
}) => {
  const [showStage2Tutorial, setShowStage2Tutorial] = useState(false);

  // Set the data-theme attribute to "deep-space" for theming
  useEffect(() => {
    document.body.setAttribute("data-theme", "deep-space");
  }, []);

  return (
    <main
      id="braxios-main"
      className="mouse-affected-bg bg-background min-h-screen min-w-[1100px]"
    >
      <Joyride
        run={showStage2Tutorial}
        steps={planetYanTutorialSteps}
        tooltipComponent={CustomTooltip}
        styles={{
          options: {
            arrowColor: 'rgb(209 213 219 / var(--tw-border-opacity, 1))',
          },
        }}
      />
      <Header stageId="stage_1" displayResources={false} />
      <div className="justify-items-center">
        <div
          id="main"
          className="
            p-5 mx-10 bg-primary
            border-gray-300 border-solid border-2 rounded-xl
            grid grid-cols-[min-content_min-content]"
        >
          <div
            id="content"
            className="rounded-xl flex flex-col 2xl:flex-row gap-6"
          >
            <CopperDisplay />
            <SilverDisplay />
          </div>
          <UnlockSidebar stageId="stage_1" showNextStageTutorial={() => { setShowStage2Tutorial(true); }} />
        </div>
      </div>
      <Footer saveCurrentGameData={saveCurrentGameData} />
    </main>
  );
};

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
      <ProducerCard producerId="mnr_n1" stageId="stage_1" numToPurchaseOption={1}/>
      <UpgradeCard upgradeId="mnr_n1_control_center" stageId="stage_1"/>
      <UpgradeCard upgradeId="mnr_n1_fabricator" stageId="stage_1"/>
    </div>
  );
};

const SilverDisplay = () => {
  const isSilverActive = useGameStore((state) => state.stages["stage_1"].producers["mnr_s1"].dynamic.isActive);

  let silverNotification: ReactNode = (
    <p className="uppercase">MNR-S1 Mining Robots are needed to mine Silver.</p>
  );
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
            <ProducerCard producerId="mnr_s1" stageId="stage_1" numToPurchaseOption={1}/>
            <UpgradeCard upgradeId="mnr_s1_control_center" stageId="stage_1"/>
            <UpgradeCard upgradeId="mnr_s1_fabricator" stageId="stage_1"/>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
};

const UnlockSidebar = memo(({ stageId, showNextStageTutorial }: { stageId: string; showNextStageTutorial: () => void }) => {
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
          className='w-[400px] ml-6 origin-top text-nowrap'
        >
          <div className="flex flex-row justify-between items-center mb-3">
            <h1 className="uppercase text-2xl font-bold">Research</h1>
          </div>
          <div className="flex flex-col">
            {unlockIds.map(
              (unlockId) => {
                let optionalCallback = undefined;
                if (unlockId === "settlement") {
                  optionalCallback = showNextStageTutorial;
                }

                return (
                  <UnlockCard
                    key={unlockId}
                    unlockId={unlockId}
                    stageId={stageId}
                    optionalCallback={optionalCallback}
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

export default BraxiosLayout;
