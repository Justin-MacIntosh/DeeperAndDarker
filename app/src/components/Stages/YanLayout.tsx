import { memo } from 'react';

import { AnimatePresence, motion } from "motion/react";
import { useShallow } from 'zustand/react/shallow';
import { CallBackProps, Joyride, TooltipRenderProps } from 'react-joyride';
import clsx from 'clsx';

import ResourceIcon from '../../icons/ResourceIcon';
import ProducerCard from '../shared/ProducerCard';
import UnlockCard from '../shared/UnlockCard';
import Footer from '../shared/Footer';
import Header, { CurrentResourcesDisplay } from '../shared/Header';
import { useGameStore } from '../../game_state/GameStore';
import ResourceContainer from '../shared/ResourceContainer';


const settlingYanTutorialSteps = [
  {
    target: '#planet-yan-unlocks',
    title: "Settling Planet Yan",
    content: (
      <>
        <p>It will take many tries to settle the planet.</p>
      </>
    ),
    disableBeacon: true,
    placement: "left" as "left",
  },
  {
    target: '#planet-yan-unlocks',
    title: "Settling Planet Yan",
    content: (
      <>
        <p>On each attempt, you'll need to choose between</p>
        <p>a Military or Research approach!</p>
      </>
    ),
    disableBeacon: true,
    placement: "left" as "left",
  },
  {
    target: '#planet-yan-unlocks',
    title: "Settling Planet Yan",
    content: (
      <>
        <p>Research will help you upgrade future attempts,</p>
        <p>and Military will capture specimens for future Research.</p>
      </>
    ),
    disableBeacon: true,
    placement: "left" as "left",
  },
  {
    target: '#current-resources-personnel',
    title: "Settling Planet Yan",
    content: (
      <>
        <p>You will only have so many personnel to spend when you arrive on the Planet.</p>
        <p>So choose wisely!</p>
      </>
    ),
    disableBeacon: true,
    placement: "bottom" as "bottom",
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

const YanLayout = (
  { saveCurrentGameData }:
  { saveCurrentGameData: () => void}
) => {
  const yanTutorialSeen = useGameStore((state) => state.tutorials["settling_yan"]);
  const setTutorialSeen = useGameStore((state) => state.setTutorialSeen);

  const handleJoyrideCallback = (data: CallBackProps, tutorialId: string) => {
    const { action, lifecycle, type } = data;
    if (type === 'tour:status' && action === 'reset' && lifecycle === 'complete') {
      setTutorialSeen(tutorialId);
    }
  };

  return (
    <main
      id="planet-yan-main"
      className="absolute top-0 w-full mouse-affected-bg bg-bg min-h-screen min-w-[1100px]"
      data-theme="planet-yan"
    >
      <Joyride
        run={!yanTutorialSeen}
        steps={settlingYanTutorialSteps}
        callback={(data) => {handleJoyrideCallback(data, "settling_yan")}}
        tooltipComponent={CustomTooltip}
        styles={{
          options: {
            arrowColor: 'rgb(209 213 219 / var(--tw-border-opacity, 1))',
          },
        }}
      />
      <Header stageId="stage_2" displayResources={true} />
      <div className="justify-items-center">
        <div
          id="yan-grid"
          className="
            p-5 mx-10 bg-primary
            border-gray-300 border-solid border-2 rounded-xl
            grid grid-cols-[max-content_min-content]"
        >
          <div
            id="yan-resource-containers"
            className={clsx(
              "max-w-[1250px] rounded-xl",
              "flex flex-wrap flex-col 2xl:flex-row",
              "mt-[-1.5rem] mr-[-1.5rem] justify-center",
              "[&:has(>div)+div]:ml-6" // Apply margin to sidebar if it exists
            )}
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
    <ResourceContainer show={isYanMightActive} keyPrefix="yan_mil_presence">
      <div className="flex flex-row justify-between items-center">
        <h3 className="uppercase text-2xl">Military Presence <ResourceIcon resource="yan_military_presence" size={24} /></h3>
        <CurrentResourcesDisplay resourceId="yan_military_presence"/>
      </div>
      <ProducerCard producerId="yan_soldier" stageId="stage_2" numToPurchaseOption={1}/>
    </ResourceContainer>
  );
};

const ResearchDisplay = () => {
  const isYanResearchActive = useGameStore((state) => state.stages["stage_2"].producers["yan_researcher"].dynamic.isActive);
  return (
    <ResourceContainer show={isYanResearchActive} keyPrefix="yan_research">
      <div className="flex flex-row justify-between items-center">
        <h3 className="uppercase text-2xl">Planet Yan Research <ResourceIcon resource="yan_research" size={24} /></h3>
        <CurrentResourcesDisplay resourceId="yan_research"/>
      </div>
      <ProducerCard producerId="yan_researcher" stageId="stage_2" numToPurchaseOption={1}/>
    </ResourceContainer>
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
          id="planet-yan-unlocks"
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
                return <UnlockCard key={unlockId} unlockId={unlockId} stageId={stageId}/>;
              }
            )}
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
});

export default YanLayout;
