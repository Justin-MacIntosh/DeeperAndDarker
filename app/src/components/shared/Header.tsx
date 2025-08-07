import { memo } from 'react';

import ResourceIcon from '../../icons/ResourceIcon';
import { useGameStore } from '../../game_state/GameStore';
import { formatNumber } from '../../helpers/formatNumber';

/* Header component displays the planet title and current production statistics. */
const Header = memo(({ stageId }: { stageId: string }) => {
  console.log("Header render");
  return (
    <header
      id="header"
      className="
        sticky top-0 z-10 p-5 mb-7 bg-med
        border-gray-300 border-solid border-2 border-l-0 border-r-0
        flex flex-row shadow-[0_5px_10px_rgba(0,0,0,0.5)]"
    >
      <StageTitle stageId={stageId} />
      <div className="flex-grow"/>
      <div id="production-stats" className="min-w-[180px] text-right">
        <CurrentResourcesDisplay resource='silver' />
        <ResourcesPerSecondDisplay resource='silver' />
      </div>
      <div id="production-stats" className="min-w-[180px] text-right">
        <CurrentResourcesDisplay resource='copper' />
        <ResourcesPerSecondDisplay resource='copper' />
      </div>
    </header>
  )
});

/* PlanetTitle component displays the planet name and biome. */
const StageTitle = ({ stageId }: { stageId: string }) => {
  console.log("PlanetTitle render");
  const stageName = useGameStore((state) => state.stages[stageId].name);
  const stageDesc = useGameStore((state) => state.stages[stageId].description);
  return (
    <div id="stage-title" className="min-w-[400px]">
      <h1 className='uppercase text-3xl font-bold'>{stageName}</h1>
      <h3 className="uppercase text-lg">{stageDesc}</h3>
    </div>
  );
}

/*
 * CurrentResourcesDisplay and ResourcesPerSecondDisplay components display the
 * current resources and resources per second respectively.
 */
const CurrentResourcesDisplay = ({ resource }: { resource: string }) => {
  // console.log("CurrentResourcesDisplay render");
  const currentResources = useGameStore((state) => state.resources[resource].currentAmount);
  return (
    <h1 className="lowercase text-3xl font-bold">
      {formatNumber(currentResources)}<ResourceIcon resource={resource} size={30}/>
    </h1>
  );
};
const ResourcesPerSecondDisplay = ({ resource }: { resource: string }) => {
  // console.log("ResourcesPerSecondDisplay render");  

  const resourcesPerSecond = useGameStore((state) => state.resources[resource].amountPerSecond);
  return (
    <h3 className="lowercase text-lg">
      {formatNumber(resourcesPerSecond)}<ResourceIcon resource={resource} size={18}/>/sec
    </h3>
  );
};

// Export the Header component
export default Header;
