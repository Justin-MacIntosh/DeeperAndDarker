import { memo, useState } from 'react';
import { clsx } from 'clsx';

import { Popover } from 'react-tiny-popover'
import { useGameStore } from '../game_state/GameStore';
import { Structure, StructureSlot } from '../types';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { formatNumber } from '../helpers/formatNumber';

const PlanetContent = memo(() => {
  // console.log("PlanetContent render");
  const planet = useGameStore((state) => state.planet);

  return (
    <div
      id="content"
      className="
        min-w-[500px] flex-grow-[4]
        rounded-xl
        flex flex-col gap-3"
    >
      <div
        id="content-planetary-row"
        className="flex flex-col 2xl:flex-row rounded-xl gap-3"
      >
        <div
          id="planet-display"
          className="
            min-h-[400px] bg-black
            w-full rounded-xl
            2xl:w-[500px] 2xl:rounded-l-xl 2xl:rounded-r-none"
        ></div>
        <div
          id="planetary-data-display"
          className="
            p-4 min-h-[400px] bg-light-purple
            flex-1 rounded-xl
            2xl:rounded-l-none 2xl:rounded-r-xl"
        >
          <h3 className="uppercase text-xl">Planetary Data</h3>
        </div>
      </div>
      <div className="content-structures-row">
        <div
          id="structure-display"
          className="p-4 bg-light-purple flex-1 rounded-xl"
        >
          <h3 className="uppercase text-xl mb-5">Structures</h3>
          <ul
            id="structures-container"
            className="
              grid grid-cols-[repeat(auto-fit,_minmax(140px,_max-content))]
              gap-9 justify-items-center justify-center pr-4 py-3 mb-5"
          >
            {planet.structureSlots.map((slot, index) => (
              <StructureCell key={index} slot={slot} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
});

const StructureCell = ({ slot }: { slot: StructureSlot }) => {
  // console.log("StructureCell render");

  const currentResources = useGameStore((state) => state.currentResources);
  const purchaseStructureAction = useGameStore((state) => state.purchaseStructure);

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
                  {useGameStore((state) => state.buildableStructures).map((structure) => {
                    const isOptionDisabled = (structure.cost * slot.costMultiplier) > currentResources;
                    const optionActiveClass = (
                      isOptionDisabled ?
                      "opacity-50 cursor-not-allowed" :
                      "hover:brightness-100 cursor-pointer"
                    );
                    return (
                      <tr
                        key={structure.id}
                        className= {clsx(
                          "bg-light-purple border-gray-300 border-solid",
                          "border-t-2 border-b-2 brightness-110",
                          optionActiveClass
                        )} 
                        onClick={() => {
                          purchaseStructureAction(slot.id, structure.id);
                          setIsOpen(false);
                        }}
                      >
                        <td className="px-6 py-4">{structure.name}</td>
                        <td className="px-6 py-4">{structure.description}</td>
                        <td className="px-6 py-4">
                          {formatNumber(structure.cost * slot.costMultiplier)}
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
        slot.structure ?
        <StructureDisplay structure={slot.structure} openStructureSelectModal={() => setIsOpen(true)} /> :
        <EmptyStructureSlotDisplay openStructureSelectModal={() => setIsOpen(true)}/>
      }
    </>
  )
}

const StructureDisplay = (
  { structure, openStructureSelectModal }:
  { structure: Structure, openStructureSelectModal: () => void }
) => {
  const [isShowingPopover, setIsShowingPopover] = useState(false);

  // If the slot already has a structure, render it
  return (
    <>
      <Popover
        isOpen={isShowingPopover}
        positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
        padding={10}
        content={
          <div
            className="
              bg-med-purple p-5 z-10
              border-gray-300 border-solid border-2 rounded-xl"
          >
            <h1 className="uppercase">{structure.name}</h1>
            <p>{structure.description}</p>
          </div>
        }
      >
        <li
          onMouseEnter={() => setIsShowingPopover(true)}
          onMouseLeave={() => setIsShowingPopover(false)}
          onClick={openStructureSelectModal}
          className="structure-display-box"
        >
          <i className={clsx("fa-solid fa-5x", structure.icon)}/>
        </li>
      </Popover>
    </>
  );
}

const EmptyStructureSlotDisplay = (
  {openStructureSelectModal}: { openStructureSelectModal: () => void }
) => {
  return <li className="structure-display-box" onClick={openStructureSelectModal}/>;
}

export default PlanetContent;
