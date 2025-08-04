import { memo, useState } from 'react';
import { clsx } from 'clsx';

import { Popover } from 'react-tiny-popover'
import { useGameStore } from '../game_state/GameStore';
import { Upgrade, UpgradeSlot } from '../types';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { formatNumber } from '../helpers/formatNumber';
import TablerIconDisplay from '../icons/TablerIconDisplay';

const StageContent = memo(() => {
  // console.log("PlanetContent render");
  const stage = useGameStore((state) => state.stage);

  return (
    <div
      id="content"
      className="
        min-w-[500px] flex-grow-[4]
        rounded-xl
        flex flex-col gap-3"
    >
      <div
        id="content-upgrade-row"
        className="flex flex-col 2xl:flex-row rounded-xl gap-3"
      >
        <div
          id="graphic-display"
          className="
            min-h-[400px] bg-black
            w-full rounded-xl
            2xl:w-[500px] 2xl:rounded-l-xl 2xl:rounded-r-none"
        ></div>
        <div
          id="upgrade-data-display"
          className="
            p-4 min-h-[400px] bg-light-purple
            flex-1 rounded-xl
            2xl:rounded-l-none 2xl:rounded-r-xl"
        >
          <h3 className="uppercase text-xl">Upgrade data</h3>
        </div>
      </div>
      <div className="content-structures-row">
        <div
          id="structure-display"
          className="p-4 bg-light-purple flex-1 rounded-xl"
        >
          <h3 className="uppercase text-xl mb-5">Effects</h3>
          <ul
            id="structures-container"
            className="
              grid grid-cols-[repeat(auto-fit,_minmax(140px,_max-content))]
              gap-9 justify-items-center justify-center pr-4 py-3 mb-5"
          >
            {stage.upgradeSlots.map((slot, index) => (
              <UpgradeCell key={index} slot={slot} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
});

const UpgradeCell = ({ slot }: { slot: UpgradeSlot }) => {
  // console.log("UpgradeCell render");

  const currentResources = useGameStore((state) => state.currentResources);
  const purchaseUpgradeAction = useGameStore((state) => state.purchaseUpgrade);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50"/>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            className="
              max-w-full p-10
              bg-dark-purple
              border-gray-300 border-solid border-2 rounded-xl"
          >
            <DialogTitle className="text-2xl mb-5">Build structure</DialogTitle>
            <Description>
              <table className="text-left rtl:text-right border-gray-300 border-solid border-2">
                <thead className="bg-med-purple uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-normal">Name</th>
                    <th scope="col" className="px-6 py-3 font-normal">Description</th>
                    <th scope="col" className="px-6 py-3 font-normal">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {useGameStore((state) => state.buildableUpgrades).map((upg) => {
                    const isOptionDisabled = (upg.cost * BigInt(slot.costMultiplier)) > currentResources;
                    const optionActiveClass = (
                      isOptionDisabled ?
                      "opacity-50 cursor-not-allowed" :
                      "hover:brightness-100 cursor-pointer"
                    );
                    return (
                      <tr
                        key={upg.id}
                        className= {clsx(
                          "bg-light-purple border-gray-300 border-solid",
                          "border-t-2 border-b-2 brightness-110",
                          optionActiveClass
                        )} 
                        onClick={() => {
                          purchaseUpgradeAction(slot.id, upg.id);
                          setIsOpen(false);
                        }}
                      >
                        <td className="px-6 py-4">{upg.name}</td>
                        <td className="px-6 py-4">{upg.description}</td>
                        <td className="px-6 py-4">
                          {formatNumber(upg.cost * BigInt(slot.costMultiplier))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Description>
          </DialogPanel>
        </div>
      </Dialog>
      {
        slot.upgrade ?
        <EffectDisplay upgrade={slot.upgrade} openUpgradeSelectModal={() => setIsOpen(true)} /> :
        <EmptyUpgradeSlotDisplay openUpgradeSelectModal={() => setIsOpen(true)}/>
      }
    </>
  )
}

const EffectDisplay = (
  { upgrade, openUpgradeSelectModal }:
  { upgrade: Upgrade, openUpgradeSelectModal: () => void }
) => {
  const [isShowingPopover, setIsShowingPopover] = useState(false);

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
              bg-med-purple p-5 z-10
              border-gray-300 border-solid border-2 rounded-xl"
          >
            <h1 className="uppercase">{upgrade.name}</h1>
            <p>{upgrade.description}</p>
          </div>
        }
      >
        <li
          onMouseEnter={() => setIsShowingPopover(true)}
          onMouseLeave={() => setIsShowingPopover(false)}
          onClick={openUpgradeSelectModal}
          className="structure-display-box"
        >
          <TablerIconDisplay icon={upgrade.icon} size={70} />
        </li>
      </Popover>
    </>
  );
}

const EmptyUpgradeSlotDisplay = (
  {openUpgradeSelectModal}: { openUpgradeSelectModal: () => void }
) => {
  return <li className="structure-display-box" onClick={openUpgradeSelectModal}/>;
}

export default StageContent;
