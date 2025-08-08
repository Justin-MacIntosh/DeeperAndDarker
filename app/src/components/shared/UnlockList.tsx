import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { AnimatePresence, motion } from "motion/react"

import ResourceIcon from '../../icons/ResourceIcon';
import SidebarCard from './SidebarCard';

import { Unlockable } from '../../game_state/types';
import { useGameStore } from '../../game_state/GameStore';
import { formatNumber } from '../../helpers/formatNumber';
import TablerIconDisplay from '../../icons/TablerIconDisplay';

const UnlockList = memo(({ stageId }: { stageId: string }) => {
  const unlockIds = useGameStore(
    useShallow((state) => Object.keys(state.stages[stageId].unlocks))
  );
  const anyUnlocksActive = useGameStore(
    useShallow((state) => Object.values(state.stages[stageId].unlocks).some(
      (unlock) => unlock.dynamic.isActive
    ))
  );

  if (!anyUnlocksActive) {
    return null; // If there are no unlocks, do not render anything
  }
  return (
    <>
      <div className="flex flex-row justify-between items-center mb-3">
        <h1 className="uppercase text-2xl font-bold">Research</h1>
      </div>
      <div className="flex flex-col">
        {unlockIds.map(
          (unlockId) => {
            return (
              <SingleUnlockDisplay
                key={unlockId}
                unlockId={unlockId}
                stageId={stageId}
              />
            )
          }
        )}
      </div>
    </>
  );
});

const SingleUnlockDisplay = memo(
  (props: { unlockId: string; stageId: string; }) => {
    // Actions and state from the game store
    const unlock: Unlockable = useGameStore(
      (state) => state.stages[props.stageId].unlocks[props.unlockId]
    );
    const unlockIsActive = useGameStore(
      (state) => state.stages[props.stageId].unlocks[props.unlockId].dynamic.isActive
    );
    const purchaseUnlockAction = useGameStore((state) => state.purchaseUnlock)

    // Get the current amount of the resource required to purchase this producer
    const relevantResource = unlock.static.purchaseResource;
    const currentRelevantResources: bigint = useGameStore(
      (state) => state.resources[relevantResource].currentAmount
    );

    console.log(unlockIsActive)

    // Calculate the cost and number of producers to purchase
    const currentCostStr: string = formatNumber(unlock.static.cost);
    return (
      <AnimatePresence initial={false}>
        {
          unlockIsActive &&
          <motion.div
            transition={{ duration: .8 }}
            initial={{ opacity: 0, scale: 0, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: "111px" }}
            exit={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
            className='mb-5 origin-top-left'
          >
            <div className="text-lg flex flex-row mb-2">
              <h2 className="uppercase flex-1">
                {unlock.static.name}
              </h2>
            </div>
            <SidebarCard
              color={unlock.static.color as any}
              icon={
                <TablerIconDisplay icon={unlock.static.iconOption} size={55} />
              }
              contentElement={<>{unlock.static.description}</>}
              suffixElement={
                <span>{currentCostStr}<ResourceIcon resource={unlock.static.purchaseResource} size={18} /></span>
              }
              onClick={() => {
                purchaseUnlockAction(props.stageId, props.unlockId)
              }}
              isClickDisabled={unlock.static.cost > currentRelevantResources}
            />
          </motion.div>
        }
      </AnimatePresence>
    );
  }
);

export default UnlockList;
