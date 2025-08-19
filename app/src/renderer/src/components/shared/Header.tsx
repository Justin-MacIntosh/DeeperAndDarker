import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow'

import ResourceIcon from '../icons/ResourceIcon';
import { useGameStore } from '../../game_state/GameStore';
import { formatNumber } from '../../number_helpers/formatNumber';

/* Header component displays the Stage's details title and current production statistics. */
const Header = memo(({ stageId, displayResources }: { stageId: string; displayResources: boolean }) => {
  const resourceIdsToDisplay = useGameStore(
    useShallow((state) => state.stages[stageId].resourcesToDisplay)
  );

  console.log("Header render");
  return (
    <header
      id="header"
      className="
        sticky top-0 z-10 p-5 mb-10 bg-primary
        border-gray-300 border-solid border-2 border-l-0 border-r-0
        flex flex-row shadow-[0_5px_10px_rgba(0,0,0,0.5)]"
    >
      <StageTitle stageId={stageId} />
      <div className="flex-grow"/>
      {displayResources && resourceIdsToDisplay.map(
        (resourceId) => {
          return <ResourceDisplay key={resourceId} resourceId={resourceId}/>;
        }
      )}
    </header>
  )
});

/* StageTitle component displays the stage's name and description. */
const StageTitle = ({ stageId }: { stageId: string }) => {
  console.log("StageTitle render");
  const stageName = useGameStore((state) => state.stages[stageId].name);
  const stageDesc = useGameStore((state) => state.stages[stageId].description);
  return (
    <div id="stage-title" className="min-w-[400px]">
      <h1 className='uppercase text-3xl font-bold'>{stageName}</h1>
      <h3 className="uppercase text-lg">{stageDesc}</h3>
    </div>
  );
}

/* Parent ResourceDisplay Component to wrap CurrentResourcesDisplay and ResourcesPerSecondDisplay */
export const ResourceDisplay = ({ resourceId }: { resourceId: string }) => {
    return (
      <div id={"production-stats-" + resourceId} className="min-w-[180px] text-right">
        <CurrentResourcesDisplay resourceId={resourceId} />
        <ResourcesPerSecondDisplay resourceId={resourceId} />
      </div>
    );
}

/*
 * CurrentResourcesDisplay and ResourcesPerSecondDisplay components display the
 * current resources and resources per second respectively.
 */
export const CurrentResourcesDisplay = ({ resourceId }: { resourceId: string }) => {
  // console.log("CurrentResourcesDisplay render");
  const currentResources = useGameStore((state) => state.resources[resourceId].currentAmount);
  return (
    <h1 id={"current-resources-" + resourceId} className="text-3xl font-bold">
      {formatNumber(currentResources)}<ResourceIcon resource={resourceId} size={30}/>
    </h1>
  );
};
const ResourcesPerSecondDisplay = ({ resourceId }: { resourceId: string }) => {
  // console.log("ResourcesPerSecondDisplay render");  
  const resourcesPerSecond = useGameStore((state) => state.resources[resourceId].amountPerSecond);

  if (resourcesPerSecond === BigInt(0)) {
    return null; // Don't display if there are no resources per second
  }

  return (
    <h3 className="text-lg">
      {formatNumber(resourcesPerSecond)}<ResourceIcon resource={resourceId} size={18}/>/sec
    </h3>
  );
};

// Export the Header component
export default Header;
