import { memo } from 'react';

import { StructureSlot, useGameStore } from '../game_state/GameStore';


const StructureCell = ({ slot }: { slot: StructureSlot }) => {
  console.log("StructureCell render");

  return (
    <li className="
      bg-med-purple h-32 w-32
      border-gray-300 border-solid border-2 rounded-xl
      hover:brightness-125 hover:-translate-y-1
      active:brightness-125 active:-translate-y-0.5
      cursor-pointer transition-all duration-75"
    ></li>
  )
}

const PlanetContent = memo(() => {
  console.log("PlanetContent render");
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

export default PlanetContent;
