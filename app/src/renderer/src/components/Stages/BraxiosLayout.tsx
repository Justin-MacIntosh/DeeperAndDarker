import { memo, useState } from 'react';

import { AnimatePresence, motion } from "motion/react";
import { Joyride, TooltipRenderProps } from 'react-joyride';
import { useShallow } from 'zustand/react/shallow';
import clsx from 'clsx';

import { useGameStore } from '../../game_state/GameStore';
import Footer from '../shared/Footer';
import Header, { CurrentResourcesDisplay } from '../shared/Header';
import ResourceIcon from '../icons/ResourceIcon';
import ProducerCard from '../shared/ProducerCard';
import UpgradeCard from '../shared/UpgradeCard';
import UnlockCard from '../shared/UnlockCard';
import ResourceContainer from '../shared/ResourceContainer';


const stageSelectionTutorialSteps = [
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
  const { index, size, step, tooltipProps } = props;
  return (
    <div className="bg-gray-800 p-5 border-gray-300 border-solid border-2 rounded-xl" {...tooltipProps}>
      {step.title && <h4 className="underline text-2xl">{step.title} ({index + 1} of {size})</h4>}
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

  return (
    <main
      id="braxios-main"
      data-theme="deep-space"
      className="absolute top-0 w-full mouse-affected-bg bg-background min-h-screen min-w-[1100px]"
    >
      <Joyride
        run={showStage2Tutorial}
        steps={stageSelectionTutorialSteps}
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
          id="braxios-grid"
          className="
            p-5 mx-10 bg-primary
            border-gray-300 border-solid border-2 rounded-xl
            grid grid-cols-[max-content_min-content]"
        >
          <div
            id="braxios-resource-containers"
            className={clsx(
              "max-w-[1250px] rounded-xl",
              "flex flex-wrap flex-col 2xl:flex-row",
              "mt-[-1.5rem] mr-[-1.5rem] justify-center",
              "[&:has(>div)+div]:ml-6" // Apply margin to sidebar if it exists
            )}
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
    <ResourceContainer show={true} keyPrefix="deep_space_silver">
      <div className="flex flex-row justify-between items-center">
        <h3 className="uppercase text-2xl">Copper <ResourceIcon resource="copper" size={24} /></h3>
        <CurrentResourcesDisplay resourceId="copper"/>
      </div>
      <ProducerCard producerId="mnr_n1" stageId="stage_1" numToPurchaseOption={1}/>
      <UpgradeCard upgradeId="mnr_n1_control_center" stageId="stage_1"/>
      <UpgradeCard upgradeId="mnr_n1_fabricator" stageId="stage_1"/>
    </ResourceContainer>
  );
};

const SilverDisplay = () => {
  const isSilverActive = useGameStore((state) => state.stages["stage_1"].producers["mnr_s1"].dynamic.isActive);

  return (
    <ResourceContainer show={isSilverActive} keyPrefix="deep_space_silver">
      <div className="flex flex-row justify-between items-center">
        <h3 className="uppercase text-2xl">Silver <ResourceIcon resource="silver" size={24} /></h3>
        <CurrentResourcesDisplay resourceId="silver"/>
      </div>
      <ProducerCard producerId="mnr_s1" stageId="stage_1" numToPurchaseOption={1}/>
      <UpgradeCard upgradeId="mnr_s1_control_center" stageId="stage_1"/>
      <UpgradeCard upgradeId="mnr_s1_fabricator" stageId="stage_1"/>
    </ResourceContainer>
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
          initial={{ opacity: 0, scale: 0, width: 0, height: 0 }}
          animate={{ opacity: 1, scale: 1, width: "400px", height: "auto" }}
          exit={{ opacity: 0, scale: 0, width: 0, margin: 0, height: 0 }}
          className='w-[400px] origin-top text-nowrap'
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
