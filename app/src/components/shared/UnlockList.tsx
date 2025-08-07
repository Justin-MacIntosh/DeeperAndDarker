import { memo } from 'react';
import { clsx } from 'clsx';
import { useShallow } from 'zustand/react/shallow'

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

    if (!unlockIsActive) {
      return null; // If the producer is not active, do not render anything
    }

    // Calculate the cost and number of producers to purchase
    const currentCostStr: string = formatNumber(unlock.static.cost);
    return (
      <div
        className={clsx("mb-5", unlock.static.animateAppearance && "fade-in")}
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
            <>{currentCostStr}<ResourceIcon resource={unlock.static.purchaseResource} size={18} /></>
          }
          onClick={() => {
            purchaseUnlockAction(props.stageId, props.unlockId)
          }}
          isClickDisabled={unlock.static.cost > currentRelevantResources}
        />
      </div>
    );
  }
);

export default UnlockList;
