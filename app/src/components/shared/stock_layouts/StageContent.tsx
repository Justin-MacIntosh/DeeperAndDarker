import { memo, useState } from 'react';

import { useShallow } from 'zustand/react/shallow'

import { Popover } from 'react-tiny-popover'
import { useGameStore } from '../../../game_state/GameStore';
import TablerIconDisplay from '../../../icons/TablerIconDisplay';
import UpgradeCard from '../UpgradeCard';

const StageContent = memo(({ stageId }: { stageId: string }) => {
  // console.log("PlanetContent render");

  return (
    <div
      id="content"
      className="min-w-[500px] flex-grow-[4] rounded-xl flex flex-col gap-3"
    >
      <div
        id="content-upgrade-row"
        className="flex flex-col 2xl:flex-row rounded-xl gap-3"
      >
        <div
          id="upgrade-data-display"
          className="
            p-4 bg-secondary flex-1
            rounded-xl"
        >
          <h3 className="uppercase text-xl">Upgrades</h3>
          <UpgradeDisplay stageId={stageId} />
        </div>
      </div>
      <div id="content-effects-row">
        <BuffsDisplay stageId={stageId} />
      </div>
    </div>
  );
});

const UpgradeDisplay = memo(({ stageId }: { stageId: string }) => {
  const ugradeIds = useGameStore(
    useShallow((state) => Object.keys(state.stages[stageId].upgrades))
  );
  return (
    <ul
      id="upgrade-container"
      className="p-4 w-full border-separate [border-spacing:0px_10px]"
    >
      {ugradeIds.map((upgradeId) => {
        return (
          <UpgradeCard
            key={upgradeId}
            stageId={stageId}
            upgradeId={upgradeId}
          />
        );
      })}
    </ul>
  );
});

const BuffsDisplay = memo(({ stageId }: { stageId: string }) => {
  const buffIds = useGameStore(
    useShallow((state) => Object.keys(state.stages[stageId].buffs))
  );

  return (
    <div
      id="buffs-display"
      className="p-4 bg-secondary flex-1 rounded-xl"
    >
      <h3 className="uppercase text-xl mb-5">Protocols</h3>
      <ul
        id="buffs-container"
        className="
          grid grid-cols-[repeat(auto-fit,_minmax(140px,_max-content))]
          gap-9 justify-items-center justify-center pr-4 py-3 mb-5"
      >
        {/* {buffIds.map((buffId) => (
          <SingleEffect
            key={buffId}
            buffId={buffId}
            stageId={stageId}
          />
        ))} */}
      </ul>
    </div>
  );
});

const SingleEffect = (
  { stageId, buffId }:
  { stageId: string, buffId: string }
) => {
  const [isShowingPopover, setIsShowingPopover] = useState(false);

  const buff = useGameStore((state) => state.stages[stageId].buffs[buffId]);
  if (!buff.dynamic.isActive) {
    return null; // If the buff is not active, do not render anything
  }

  // If the slot already has a upgrade, render it
  return (
    <>
      <Popover
        isOpen={isShowingPopover}
        positions={["top", "bottom", "left", "right"]} // preferred positions by priority
        padding={10}
        content={
          <div
            className="
              bg-primary z-10
              border-gray-300 border-solid border-2 rounded-xl"
          >
            <h1 className="uppercase">{buff.static.name}</h1>
            <p>{buff.static.description}</p>
          </div>
        }
      >
        <li
          onMouseEnter={() => setIsShowingPopover(true)}
          onMouseLeave={() => setIsShowingPopover(false)}
          className="structure-display-box"
        >
          <TablerIconDisplay icon={buff.static.iconOption} size={70} />
        </li>
      </Popover>
    </>
  );
}

export default StageContent;
