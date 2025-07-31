import { memo, useState } from 'react';

import { Popover } from 'react-tiny-popover'
import { Structure, StructureSlot, useGameStore } from '../game_state/GameStore';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

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
          className="
            p-4 bg-light-purple
            flex-1 rounded-xl"
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

  const purchaseStructureAction = useGameStore((state) => state.purchaseStructure);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50"/>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            className="
              max-w-lg p-12
              bg-dark-purple
              border-gray-300 border-solid border-2 rounded-xl"
          >
            <DialogTitle className="text-2xl mb-3">Build structure</DialogTitle>
            <Description>
              <table>
                <thead>
                  <tr>
                    <th className="text-left">Name</th>
                    <th className="text-left">Description</th>
                    <th className="text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {useGameStore((state) => state.buildableStructures).map((structure) => (
                    <tr
                      key={structure.id}
                      className="hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        purchaseStructureAction(slot.id, structure.id);
                        setIsOpen(false);
                      }}
                    >
                      <td>{structure.name}</td>
                      <td>{structure.description}</td>
                      <td className="text-right">{structure.cost}</td>
                    </tr>
                  ))}
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
          className="
            bg-med-purple h-32 w-32
            border-gray-300 border-solid border-2 rounded-xl
            hover:brightness-125 hover:-translate-y-1
            active:brightness-125 active:-translate-y-0.5
            cursor-pointer transition-all duration-75
            flex items-center justify-center"
        >
          <i className={`fa-solid fa-${structure.icon} fa-5x`}/>
        </li>
      </Popover>
    </>
  );
}

const EmptyStructureSlotDisplay = (
  {openStructureSelectModal}: { openStructureSelectModal: () => void }
) => {
  return (
    <li className="
      bg-med-purple h-32 w-32
      border-gray-300 border-solid border-2 rounded-xl
      hover:brightness-125 hover:-translate-y-1
      active:brightness-125 active:-translate-y-0.5
      cursor-pointer transition-all duration-75"
      onClick={openStructureSelectModal}
    ></li>
  )
}

export default PlanetContent;
